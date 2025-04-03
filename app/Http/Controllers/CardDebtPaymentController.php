<?php

namespace App\Http\Controllers;

use App\Models\{CardDebt, CardDebtPayment};
use Illuminate\Http\Request;
use Inertia\Inertia;

class CardDebtPaymentController extends Controller
{
    public function create(CardDebt $cardDebt)
    {
        $cardDebt->load('debtor');

        return Inertia::render('CardDebts/Payments/Create', [
            'cardDebt' => $cardDebt,
            'paymentMethods' => [
                'cash' => 'Cash',
                'card' => 'Card',
                'bank_transfer' => 'Bank Transfer',
                'other' => 'Other',
            ],
        ]);
    }

    public function store(Request $request, CardDebt $cardDebt)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0|max:' . $cardDebt->balance,
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $validated['card_debt_id'] = $cardDebt->id;

        $payment = CardDebtPayment::create($validated);

        // Update card debt balance
        $cardDebt->balance -= $payment->amount;
        $cardDebt->save();

        // Update status
        $cardDebt->updateStatus();

        return redirect()->route('card-debts.show', $cardDebt->id)
            ->with('success', 'Payment recorded successfully');
    }

    public function edit(CardDebtPayment $payment)
    {
        $payment->load('cardDebt.debtor');

        return Inertia::render('CardDebts/Payments/Edit', [
            'payment' => $payment,
            'cardDebt' => $payment->cardDebt,
            'paymentMethods' => [
                'cash' => 'Cash',
                'card' => 'Card',
                'bank_transfer' => 'Bank Transfer',
                'other' => 'Other',
            ],
        ]);
    }

    public function update(Request $request, CardDebtPayment $payment)
    {
        $cardDebt = $payment->cardDebt;

        // Adjust max amount validation to allow the current payment amount
        $maxAmount = $cardDebt->balance + $payment->amount;

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0|max:' . $maxAmount,
            'payment_date' => 'required|date',
            'payment_method' => 'required|string',
            'reference_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Update card debt balance
        $cardDebt->balance = $cardDebt->balance + $payment->amount - $validated['amount'];
        $cardDebt->save();

        $payment->update($validated);

        // Update status
        $cardDebt->updateStatus();

        return redirect()->route('card-debts.show', $cardDebt->id)
            ->with('success', 'Payment updated successfully');
    }

    public function destroy(CardDebtPayment $payment)
    {
        $cardDebt = $payment->cardDebt;

        // Update card debt balance
        $cardDebt->balance += $payment->amount;
        $cardDebt->save();

        $payment->delete();

        // Update status
        $cardDebt->updateStatus();

        return redirect()->route('card-debts.show', $cardDebt->id)
            ->with('success', 'Payment deleted successfully');
    }
}
