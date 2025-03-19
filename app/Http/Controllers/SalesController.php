<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Log};
use Inertia\{Inertia, Response};
use Illuminate\Routing\Controller as Controller;

class SalesController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth');
    }
    /**
     * Store a newly created sale in storage.
     */
    /**
     * Store a newly created sale in storage.
     */
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'payment_method' => 'required|string|in:cash,card,mobile_payment',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        $transactionNumber = 'TXN-' . date('YmdHis') . '-' . rand(1000, 9999);

        try {
            DB::beginTransaction();

            // Create the sale record
            $sale = Sale::create([
                'transaction_number' => $transactionNumber,
                'customer_name' => $validated['customer_name'] ?? 'Walk-in Customer',
                'user_id' => $user->id,
                'cashier_name' => $user->name,
                'payment_method' => $validated['payment_method'],
                'total_amount' => $validated['total_amount'] * 100, // Store in cents
            ]);

            // Create sale items and update product stock
            foreach ($validated['items'] as $item) {
                // Update product stock
                $product = Product::findOrFail($item['id']);

                // Check if user has permission to sell products with low stock
                if ($product->stock < $item['quantity'] && !$user->isSupervisor()) {
                    throw new \Exception("Insufficient stock for product: {$product->name}. Available: {$product->stock}");
                }

                // Update the stock
                $product->decrement('stock', $item['quantity']);

                // Create the sale item
                $sale->items()->create([
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'] * 100, // Store in cents
                    'subtotal' => $item['subtotal'] * 100, // Store in cents
                ]);
            }

            DB::commit();

            return back()->with([
                'success' => true,
                'message' => 'Sale recorded successfully',
                'transaction_number' => $transactionNumber,
                'sale_id' => $sale->id,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error recording sale: ' . $e->getMessage());

            return back()->with([
                'success' => false,
                'message' => 'Error recording sale: ' . $e->getMessage(),
            ])->withInput();
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
