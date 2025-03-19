<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Display a listing of the transactions.
     */
    public function index(): Response
    {
        // For now, we'll use dummy data
        // In a real application, you would fetch this from the database
        $transactions = [
            [
                'id' => 1,
                'transaction_number' => 'TRX-' . date('Ymd') . '-001',
                'total_amount' => 299.97,
                'amount_paid' => 300.00,
                'change_amount' => 0.03,
                'payment_method' => 'cash',
                'cashier_name' => 'John Doe',
                'created_at' => now()->subHours(1)->toISOString(),
                'updated_at' => now()->subHours(1)->toISOString(),
            ],
            [
                'id' => 2,
                'transaction_number' => 'TRX-' . date('Ymd') . '-002',
                'total_amount' => 149.99,
                'amount_paid' => 150.00,
                'change_amount' => 0.01,
                'payment_method' => 'card',
                'cashier_name' => 'Jane Smith',
                'created_at' => now()->subMinutes(30)->toISOString(),
                'updated_at' => now()->subMinutes(30)->toISOString(),
            ],
        ];

        return Inertia::render('Sales/Index', [
            'transactions' => $transactions,
        ]);
    }

    /**
     * Store a newly created transaction in storage.
     */
    public function store(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|string',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'amount_paid' => 'required|numeric|min:0',
            'change_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string',
        ]);

        // In a real application, you would save this to the database
        // For now, we'll just return a success response with a dummy transaction ID

        // Generate a transaction number
        $transactionNumber = 'TRX-' . date('Ymd') . '-' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);

        // Return the response
        return response()->json([
            'success' => true,
            'transaction_number' => $transactionNumber,
            'id' => rand(1, 1000), // Dummy ID
        ], 201);
    }

    /**
     * Display the specified transaction.
     */
    public function show($id): Response
    {
        // For now, we'll use dummy data
        // In a real application, you would fetch this from the database
        $sale = [
            'id' => $id,
            'transaction_number' => 'TRX-' . date('Ymd') . '-' . str_pad($id, 3, '0', STR_PAD_LEFT),
            'total_amount' => 299.97,
            'amount_paid' => 300.00,
            'change_amount' => 0.03,
            'payment_method' => 'cash',
            'cashier_name' => 'John Doe',
            'created_at' => now()->subHours(1)->toISOString(),
            'updated_at' => now()->subHours(1)->toISOString(),
            'items' => [
                [
                    'id' => 1,
                    'product_id' => '1',
                    'product_name' => 'Laptop Pro',
                    'quantity' => 1,
                    'unit_price' => 1299.99,
                    'subtotal' => 1299.99,
                ],
                [
                    'id' => 2,
                    'product_id' => '2',
                    'product_name' => 'Wireless Headphones',
                    'quantity' => 2,
                    'unit_price' => 199.99,
                    'subtotal' => 399.98,
                ],
            ],
        ];

        return Inertia::render('Sales/Show', [
            'sale' => $sale,
        ]);
    }
}
