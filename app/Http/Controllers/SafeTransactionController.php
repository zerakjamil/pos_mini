<?php

namespace App\Http\Controllers;

use App\Models\SafeAccount;
use App\Models\SafeTransaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SafeTransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = DB::table('safe_transactions as st')
            ->leftJoin('safe_accounts as sender', 'st.sender_id', '=', 'sender.id')
            ->leftJoin('safe_accounts as receiver', 'st.receiver_id', '=', 'receiver.id')
            ->select(
                'st.*',
                'sender.name as sender_name',
                'receiver.name as receiver_name'
            )
            ->orderBy('st.created_at', 'desc')
            ->get();

        $safeAccounts = SafeAccount::all();

        return Inertia::render('SafeTransactions/Index', [
            'transactions' => $transactions,
            'safeAccounts' => $safeAccounts,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'transaction_type' => 'required|string|in:betweenAccounts',
            'sender_id' => 'required|string|exists:safe_accounts,id',
            'receiver_id' => 'required|string|exists:safe_accounts,id|different:sender_id',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
        ]);

        try {
            DB::beginTransaction();

            // Get accounts
            $sender = SafeAccount::findOrFail($validated['sender_id']);
            $receiver = SafeAccount::findOrFail($validated['receiver_id']);

            // Check if sender has enough balance
            if ($sender->balance < $validated['amount']) {
                throw ValidationException::withMessages([
                    'amount' => ['Insufficient funds in sender account.'],
                ]);
            }

            // Create transaction
            $transaction = SafeTransaction::create($validated);

            // Update account balances
            $sender->balance -= $validated['amount'];
            $receiver->balance += $validated['amount'];

            $sender->save();
            $receiver->save();

            DB::commit();

            // Fetch the sender and receiver names for the response
            $transaction = DB::table('safe_transactions as st')
                ->leftJoin('safe_accounts as sender', 'st.sender_id', '=', 'sender.id')
                ->leftJoin('safe_accounts as receiver', 'st.receiver_id', '=', 'receiver.id')
                ->select(
                    'st.*',
                    'sender.name as sender_name',
                    'receiver.name as receiver_name'
                )
                ->where('st.id', $transaction->id)
                ->first();

            return response()->json($transaction);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Transaction failed: ' . $e->getMessage());
            
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = DB::table('safe_transactions as st')
            ->leftJoin('safe_accounts as sender', 'st.sender_id', '=', 'sender.id')
            ->leftJoin('safe_accounts as receiver', 'st.receiver_id', '=', 'receiver.id')
            ->select(
                'st.*',
                'sender.name as sender_name',
                'receiver.name as receiver_name'
            )
            ->where('st.id', $id)
            ->first();

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        return response()->json($transaction);
    }
}