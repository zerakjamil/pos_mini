<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use App\Models\DebtPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DebtPaymentController extends Controller
{
    public function index(Debt $debt)
    {
        $payments = $debt->payments()->orderBy('payment_date', 'desc')->get();

        return Inertia::render('Payments/Index', [
            'debt' => $debt->load('debtor'),
            'payments' => $payments
        ]);
    }

    public function create(Debt $debt)
    {
        return Inertia::render('Payments/Create', [
            'debt' => $debt->load('debtor')
        ]);
    }

    public function store(Request $request, Debt $debt)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'nullable|string|max:255',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['debt_id'] = $debt->id;

        DB::transaction(function () use ($debt, $validated) {
            // Record the payment
            DebtPayment::create($validated);

            // Update the debt balance
            $debt->balance -= $validated['amount'];
            if ($debt->balance < 0) {
                $debt->balance = 0;
            }
            $debt->save();

            // Update the debt status
            $debt->updateStatus();
        });

        return redirect()->route('debts.payments.index', $debt->id)
            ->with('success', 'Payment recorded successfully');
    }

    public function show(DebtPayment $payment)
    {
        $payment->load('debt.debtor');

        return Inertia::render('Payments/Show', [
            'payment' => $payment
        ]);
    }

    public function edit(DebtPayment $payment)
    {
        $payment->load('debt.debtor');

        return Inertia::render('Payments/Edit', [
            'payment' => $payment
        ]);
    }

    public function update(Request $request, DebtPayment $payment)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'payment_method' => 'nullable|string|max:255',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($payment, $validated) {
            $debt = $payment->debt;
            $amountDifference = $validated['amount'] - $payment->amount;

            // Update the payment
            $payment->update($validated);

            // Update the debt balance
            $debt->balance -= $amountDifference;
            if ($debt->balance < 0) {
                $debt->balance = 0;
            }
            $debt->save();

            // Update the debt status
            $debt->updateStatus();
        });

        return redirect()->route('payments.show', $payment->id)
            ->with('success', 'Payment updated successfully');
    }

    public function destroy(DebtPayment $payment)
    {
        $debtId = $payment->debt_id;

        DB::transaction(function () use ($payment) {
            $debt = $payment->debt;

            // Restore the debt balance
            $debt->balance += $payment->amount;
            $debt->save();

            // Delete the payment
            $payment->delete();

            // Update the debt status
            $debt->updateStatus();
        });

        return redirect()->route('debts.payments.index', $debtId)
            ->with('success', 'Payment deleted successfully');
    }
}
