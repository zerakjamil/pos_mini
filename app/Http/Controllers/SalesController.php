<?php

namespace App\Http\Controllers;

use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class SalesController extends Controller
{
    /**
     * Store a newly created sale in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'total' => 'required|numeric|min:0',
            'amountPaid' => 'required|numeric|min:0',
            'change' => 'required|numeric|min:0',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        try {
            // Start a database transaction
            DB::beginTransaction();

            // Generate a unique transaction number
            $transactionNumber = 'TXN-' . strtoupper(Str::random(8));

            // Create the sale record
            $sale = Sale::create([
                'total_amount' => $validated['total'],
                'amount_paid' => $validated['amountPaid'],
                'change_amount' => $validated['change'],
                'cashier_name' => 'John Doe', // This would come from auth user in a real app
                'payment_method' => 'cash', // Default to cash for now
                'transaction_number' => $transactionNumber,
            ]);

            // Create sale items
            foreach ($validated['items'] as $item) {
                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['id'],
                    'product_name' => $item['name'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);
            }

            // Commit the transaction
            DB::commit();

            // Return success response with Inertia
            return back()->with([
                'success' => true,
                'message' => 'Sale recorded successfully',
                'transaction_number' => $transactionNumber,
                'sale_id' => $sale->id,
            ]);
        } catch (\Exception $e) {
            // Rollback the transaction in case of error
            DB::rollBack();
            Log::error('Error recording sale: ' . $e->getMessage());

            return back()->with([
                'error' => 'Failed to record sale: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Display a listing of sales.
     */
    public function index(): Response
    {
        $sales = Sale::with('items')->latest()->get();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
        ]);
    }

    /**
     * Display the specified sale.
     */
    public function show(Sale $sale): Response
    {
        $sale->load('items');

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }
}
