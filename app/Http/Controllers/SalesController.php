<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Models\Debt;
use App\Models\Debtor;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Log};
use Illuminate\Support\Str;
use Inertia\{Inertia, Response};
use Illuminate\Routing\Controller as Controller;

class SalesController extends Controller
{
    public function store(StoreSaleRequest $request)
    {
        $validated = $request->validated();

        try {
            DB::beginTransaction();

            // Generate a unique transaction number
            $transactionNumber = 'TRX-' . strtoupper(Str::random(10));

            // Create the sale record
            $saleData = [
                'user_id' => auth()->id(),
                'transaction_number' => $transactionNumber,
                'total_amount' => $validated['total_amount'],
                'amount_paid' => $validated['payment_type'] === 'cash' ? $validated['amount_paid'] : 0,
                'change_amount' => $validated['payment_type'] === 'cash' ? $validated['change'] : 0,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_type'] === 'cash' ? 'paid' : 'debt',
                'cashier_name' => auth()->user()->name,
            ];

            // If it's a debt, add the debtor information
            if ($validated['payment_type'] === 'debt' && isset($validated['debtor_id'])) {
                $debtor = Debtor::findOrFail($validated['debtor_id']);
                $saleData['debtor_id'] = $debtor->id;
                $saleData['customer_name'] = $debtor->name;
                $saleData['customer_phone'] = $debtor->phone;
            }

            $sale = Sale::create($saleData);

            // Create sale items
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['id']);

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);

                // Update product stock
                $product->stock -= $item['quantity'];
                $product->save();
            }

            // If payment type is debt, create a debt record
            if ($validated['payment_type'] === 'debt') {
                // Create a description for the debt
                $itemCount = count($validated['items']);
                $description = "Sale transaction #{$transactionNumber} with {$itemCount} items";

                // Set due date to 30 days from now by default
                $dueDate = now()->addDays(30)->toDateString();

                // Create the debt record
                $debt = Debt::create([
                    'debtor_id' => $validated['debtor_id'],
                    'amount' => $validated['total_amount'],
                    'balance' => $validated['total_amount'], // Initially, balance equals the full amount
                    'description' => $description,
                    'due_date' => $dueDate,
                    'status' => 'pending',
                ]);
            }

            DB::commit();

            // Set flash data for the redirect
            return redirect()->route('cashier')
                ->with([
                    'success' => 'Transaction completed successfully!',
                    'transaction_number' => $transactionNumber,
                    'sale_id' => $sale->id,
                    'debt_id' => $debt->id ?? null
                ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Transaction failed: ' . $e->getMessage());

            // Redirect back with error message
            return redirect()->route('cashier')
                ->with('error', 'Transaction failed: ' . $e->getMessage());
        }
        }

    /**
     * Display a listing of sales.
     */
    public function index(): Response
    {
        if (auth()->user()->isSupervisor()) {
            $sales = Sale::with(['items', 'user', 'debtor'])
                ->latest()
                ->get()
                ->map(function ($sale) {
                    return [
                        'id' => $sale->id,
                        'transaction_number' => $sale->transaction_number,
                        'total_amount' => $sale->total_amount,
                        'amount_paid' => $sale->amount_paid,
                        'change_amount' => $sale->change_amount,
                        'payment_method' => $sale->payment_method,
                        'payment_status' => $sale->payment_status,
                        'cashier_name' => $sale->cashier_name,
                        'customer_name' => $sale->customer_name,
                        'created_at' => $sale->created_at,
                        'items_count' => $sale->items->count(),
                        'user' => $sale->user ? [
                            'id' => $sale->user->id,
                            'name' => $sale->user->name,
                        ] : null,
                        'debtor' => $sale->debtor ? [
                            'id' => $sale->debtor->id,
                            'name' => $sale->debtor->name,
                        ] : null
                    ];
                });
        } else {
            $sales = Sale::with(['items', 'debtor'])
                ->where('user_id', auth()->id())
                ->latest()
                ->get()
                ->map(function ($sale) {
                    return [
                        'id' => $sale->id,
                        'transaction_number' => $sale->transaction_number,
                        'total_amount' => $sale->total_amount,
                        'amount_paid' => $sale->amount_paid,
                        'change_amount' => $sale->change_amount,
                        'payment_method' => $sale->payment_method,
                        'payment_status' => $sale->payment_status,
                        'cashier_name' => $sale->cashier_name,
                        'customer_name' => $sale->customer_name,
                        'created_at' => $sale->created_at,
                        'items_count' => $sale->items->count(),
                        'debtor' => $sale->debtor ? [
                            'id' => $sale->debtor->id,
                            'name' => $sale->debtor->name,
                        ] : null
                    ];
                });
        }

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'userRole' => auth()->user()->role,
        ]);
    }

    public function show(Sale $sale): Response
    {
        if (!auth()->user()->isSupervisor() && $sale->user_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $sale->load(['items.product', 'user']);

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
            'userRole' => auth()->user()->role,
        ]);
    }

    /**
     * Show the form for creating a new sale.
     */
    public function create(): Response
    {
        return Inertia::render('Sales/Create');
    }
    /**
     * Get sale details by transaction number.
     *
     * @param string $transactionNumber
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByTransactionNumber($transactionNumber)
    {
        $sale = Sale::with('items')
            ->where('transaction_number', $transactionNumber)
            ->first();

        if (!$sale) {
            return response()->json(['error' => 'Sale not found'], 404);
        }

        return response()->json($sale);
    }

}
