<?php

namespace App\Http\Controllers;

use App\Models\Debt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
}
