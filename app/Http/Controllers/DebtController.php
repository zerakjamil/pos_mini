<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Models\Debtor;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DebtController extends Controller
{
    public function index()
    {
        $debts = Debt::with('debtor')
            ->withSum('payments', 'amount')
            ->orderBy('due_date')
            ->get();

        return Inertia::render('Debts/Index', [
            'debts' => $debts
        ]);
    }

    public function create()
    {
        return Inertia::render('Debts/Create', [
            'debtors' => \App\Models\Debtor::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'debtor_id' => 'required|exists:debtors,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'due_date' => 'required|date',
        ]);

        $validated['balance'] = $validated['amount'];

        $debt = Debt::create($validated);

        return redirect()->route('debts.show', $debt->id)
            ->with('success', 'Debt recorded successfully');
    }

    public function show(Debt $debt)
    {
        $debt->load(['debtor', 'payments']);

        return Inertia::render('Debts/Show', [
            'debt' => $debt
        ]);
    }

    public function edit(Debt $debt)
    {
        return Inertia::render('Debts/Edit', [
            'debt' => $debt,
            'debtors' => \App\Models\Debtor::all()
        ]);
    }

    public function update(Request $request, Debt $debt)
    {
        $validated = $request->validate([
            'debtor_id' => 'required|exists:debtors,id',
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string',
            'due_date' => 'required|date',
        ]);

        // Recalculate balance if amount is changed
        if ($validated['amount'] != $debt->amount) {
            $totalPaid = $debt->payments->sum('amount');
            $validated['balance'] = $validated['amount'] - $totalPaid;
        }

        $debt->update($validated);

        // Update status based on new values
        $debt->updateStatus();

        return redirect()->route('debts.show', $debt->id)
            ->with('success', 'Debt updated successfully');
    }

    public function destroy(Debt $debt)
    {
        $debt->delete();

        return redirect()->route('debts.index')
            ->with('success', 'Debt deleted successfully');
    }

    /**
     * Store a debt from management.
     */
    public function storeFromCashier(Request $request)
    {
        $validated = $request->validate([
            'debtor_id' => 'required|exists:debtors,id',
            'amount' => 'required|numeric|min:0',
            'balance' => 'required|numeric|min:0',
            'description' => 'required|string',
            'due_date' => 'required|date',
            'items' => 'required|array',
            'items.*.id' => 'required|string',
            'items.*.name' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.subtotal' => 'required|numeric|min:0',
        ]);

        // Start a transaction to ensure all operations succeed or fail together
        DB::beginTransaction();

        try {
            // Create the debt
            $debt = Debt::create([
                'debtor_id' => $validated['debtor_id'],
                'amount' => $validated['amount'],
                'balance' => $validated['balance'],
                'description' => $validated['description'],
                'due_date' => $validated['due_date'],
                'status' => 'unpaid',
            ]);

            // Process the items - reduce stock
            foreach ($validated['items'] as $item) {
                $product = Product::find($item['id']);
                if ($product) {
                    // Reduce stock
                    $product->stock -= $item['quantity'];
                    $product->save();
                }
            }

            // Get debtor name
            $debtorName = Debtor::find($validated['debtor_id'])->name;

            // Create a sale record with payment_status as 'debt'
            $sale = Sale::create([
                'user_id' => Auth::id(),
                'transaction_number' => 'DEBT-' . time(),
                'total_amount' => $validated['amount'],
                'amount_paid' => 0, // No payment made
                'change_amount' => 0,
                'payment_method' => 'debt',
                'payment_status' => 'debt',
                'customer_name' => $debtorName,
                'cashier_name' => Auth::user()->name,
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

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Debt created successfully',
                'debt_id' => $debt->id,
                'transaction_number' => $sale->transaction_number,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create debt from management', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'data' => $validated
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create debt: ' . $e->getMessage()
            ], 500);
        }
    }
}
