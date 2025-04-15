<?php

namespace App\Http\Controllers;

use App\Models\Debtor;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DebtorController extends Controller
{
   public function index()
{
    $debtors = Debtor::with('debts')
        ->withCount('debts')
        ->get()
        ->map(function ($debtor) {
            $totalAmount = $debtor->debts->sum('amount');
            $totalBalance = $debtor->debts->sum('balance');

            return [
                'id' => $debtor->id,
                'name' => $debtor->name,
                'email' => $debtor->email,
                'phone' => $debtor->phone,
                'address' => $debtor->address,
                'notes' => $debtor->notes,
                'created_at' => $debtor->created_at,
                'updated_at' => $debtor->updated_at,
                'debts_count' => $debtor->debts_count,
                'amount' => $totalAmount,
                'balance' => $totalBalance,
            ];
        });

    return Inertia::render('Debtors/Index', [
        'debtors' => $debtors
    ]);
}

    public function create()
    {
        return Inertia::render('Debtors/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $debtor = Debtor::create($validated);

        return redirect()->route('debtors.show', $debtor->id)
            ->with('success', 'Debtor created successfully');
    }

    public function show(Debtor $debtor)
    {
        $debtor->load([
            'debts' => function ($query) {
                $query->with('payments');
            }
        ]);

        return Inertia::render('Debtors/Show', [
            'debtor' => $debtor
        ]);
    }

    public function edit(Debtor $debtor)
    {
        return Inertia::render('Debtors/Edit', [
            'debtor' => $debtor
        ]);
    }

    public function update(Request $request, Debtor $debtor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $debtor->update($validated);

        return redirect()->route('debtors.show', $debtor->id)
            ->with('success', 'Debtor updated successfully');
    }

    public function destroy(Debtor $debtor)
    {
        $debtor->delete();

        return redirect()->route('debtors.index')
            ->with('success', 'Debtor deleted successfully');
    }
}
