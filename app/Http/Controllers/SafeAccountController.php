<?php

namespace App\Http\Controllers;

use App\Models\SafeAccount;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class SafeAccountController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $accounts = SafeAccount::all();

        return Inertia::render('SafeAccounts/Index', [
            'accounts' => $accounts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('SafeAccounts/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'balance' => 'required|numeric|min:0',
        ]);

        $account = SafeAccount::create($validated);

        return redirect()->route('safe-accounts.index')
            ->with('success', 'Account created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(SafeAccount $safeAccount)
    {
        $transactions = DB::table('safe_transactions as st')
            ->leftJoin('safe_accounts as sender', 'st.sender_id', '=', 'sender.id')
            ->leftJoin('safe_accounts as receiver', 'st.receiver_id', '=', 'receiver.id')
            ->select(
                'st.*',
                'sender.name as sender_name',
                'receiver.name as receiver_name'
            )
            ->where('st.sender_id', $safeAccount->id)
            ->orWhere('st.receiver_id', $safeAccount->id)
            ->orderBy('st.created_at', 'desc')
            ->get();

        return Inertia::render('SafeAccounts/Show', [
            'account' => $safeAccount,
            'transactions' => $transactions
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SafeAccount $safeAccount)
    {
        return Inertia::render('SafeAccounts/Edit', [
            'account' => $safeAccount,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SafeAccount $safeAccount)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'balance' => 'required|numeric|min:0',
        ]);

        $safeAccount->update($validated);

        return redirect()->route('safe-accounts.index')
            ->with('success', 'Account updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SafeAccount $safeAccount)
    {
        // Check if account has any associated transactions
        $hasTransactions = DB::table('safe_transactions')
            ->where('sender_id', $safeAccount->id)
            ->orWhere('receiver_id', $safeAccount->id)
            ->exists();

        if ($hasTransactions) {
            return redirect()->route('safe-accounts.index')
                ->with('error', 'Cannot delete account with associated transactions.');
        }

        $safeAccount->delete();

        return redirect()->route('safe-accounts.index')
            ->with('success', 'Account deleted successfully.');
    }
}