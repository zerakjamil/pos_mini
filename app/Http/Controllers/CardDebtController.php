<?php

namespace App\Http\Controllers;

use App\Models\{
    CardDebt,
    Debtor,
    CardType,
};
use Illuminate\Http\Request;
use Inertia\Inertia;

class CardDebtController extends Controller
{
    public function index()
    {
        $cardDebts = CardDebt::with('debtor')
            ->withSum('payments', 'amount')
            ->orderBy('due_date')
            ->get();

        return Inertia::render('CardDebts/Index', [
            'cardDebts' => $cardDebts
        ]);
    }

    public function create()
    {
        return Inertia::render('CardDebts/Create', [
            'debtors' => Debtor::all(),
            'cardTypes' => CardType::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'debtor_id' => 'required|exists:debtors,id',
            'card_type' => 'required|string',
            'card_value' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
        ]);

        // Calculate total amount
        $amount = $validated['card_value'] * $validated['quantity'];
        $validated['amount'] = $amount;
        $validated['balance'] = $amount;

        $cardDebt = CardDebt::create($validated);

        return redirect()->route('card-debts.show', $cardDebt->id)
            ->with('success', 'Card debt recorded successfully');
    }

    public function show(CardDebt $cardDebt)
    {
        $cardDebt->load(['debtor', 'payments']);

        return Inertia::render('CardDebts/Show', [
            'cardDebt' => $cardDebt
        ]);
    }

    public function edit(CardDebt $cardDebt)
    {
        return Inertia::render('CardDebts/Edit', [
            'cardDebt' => $cardDebt,
            'debtors' => Debtor::all(),
            'cardTypes' => CardType::all(),
        ]);
    }

    public function update(Request $request, CardDebt $cardDebt)
    {
        $validated = $request->validate([
            'debtor_id' => 'required|exists:debtors,id',
            'card_type' => 'required|string',
            'card_value' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
        ]);

        // Calculate total amount
        $newAmount = $validated['card_value'] * $validated['quantity'];
        $validated['amount'] = $newAmount;

        // Recalculate balance if amount is changed
        if ($newAmount != $cardDebt->amount) {
            $totalPaid = $cardDebt->payments->sum('amount');
            $validated['balance'] = $newAmount - $totalPaid;
        }

        $cardDebt->update($validated);

        // Update status based on new values
        $cardDebt->updateStatus();

        return redirect()->route('card-debts.show', $cardDebt->id)
            ->with('success', 'Card debt updated successfully');
    }

    public function destroy(CardDebt $cardDebt)
    {
        $cardDebt->delete();

        return redirect()->route('card-debts.index')
            ->with('success', 'Card debt deleted successfully');
    }
}
