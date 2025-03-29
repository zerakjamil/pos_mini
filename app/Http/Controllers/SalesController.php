<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSaleRequest;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Log};
use Inertia\{Inertia, Response};
use Illuminate\Routing\Controller as Controller;

class SalesController extends Controller
{
    public function store(StoreSaleRequest $request): \Illuminate\Http\RedirectResponse
    {
        Log::info('SalesController store method called');
        Log::info('Request data:', $request->all());

        $validatedData = $request->validated();
        try {
            DB::beginTransaction();

            $sale = Sale::create([
                'user_id' => auth()->id(),
                'transaction_number' => 'TXN-' . now()->format('YmdHis') . '-' . rand(1000, 9999),
                'total_amount' => $validatedData['total_amount'],
                'payment_method' => $validatedData['payment_method'],
                'amount_paid' => $validatedData['amount_paid'],
                'change_amount' => $validatedData['change'],
                'cashier_name' => auth()->user()->name,
            ]);

            foreach ($validatedData['items'] as $item) {
                $product = Product::findOrFail($item['id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Not enough stock for product: {$product->name}");
                }

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['id'],
                    'product_name' => $product->name,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);

                $product->stock -= $item['quantity'];
                $product->save();
            }

            DB::commit();

            return redirect()->intended(route('cashier', absolute: false));
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error recording sale: ' . $e->getMessage());

            return redirect()->intended(route('cashier', absolute: false));
        }
    }
    /**
     * Display a listing of sales.
     */
    public function index(): Response
    {
        if (auth()->user()->isSupervisor()) {
            $sales = Sale::with(['items', 'user'])->latest()->get();
        } else {
            $sales = Sale::with('items')
                ->where('user_id', auth()->id())
                ->latest()
                ->get();
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


}
