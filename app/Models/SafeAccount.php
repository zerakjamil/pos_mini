<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

class SafeAccount extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'balance',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'balance' => 'decimal:2',
    ];

    /**
     * Get the outgoing transactions for this account.
     */
    public function outgoingTransactions(): HasMany
    {
        return $this->hasMany(SafeTransaction::class, 'sender_id');
    }

    /**
     * Get the incoming transactions for this account.
     */
    public function incomingTransactions(): HasMany
    {
        return $this->hasMany(SafeTransaction::class, 'receiver_id');
    }

    /**
     * Get all transactions (both incoming and outgoing) for this account.
     */
    public function allTransactions()
    {
        return SafeTransaction::where('sender_id', $this->id)
            ->orWhere('receiver_id', $this->id)
            ->orderBy('created_at', 'desc');
    }

    /**
     * Deposit funds into this account.
     *
     * @param float $amount
     * @param string|null $description
     * @param SafeAccount|null $fromAccount
     * @return SafeTransaction
     */
    public function deposit(float $amount, ?string $description = null, ?SafeAccount $fromAccount = null)
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Deposit amount must be positive');
        }

        $this->balance = $this->balance + $amount;
        $this->save();

        return SafeTransaction::create([
            'sender_id' => $fromAccount ? $fromAccount->id : null,
            'receiver_id' => $this->id,
            'amount' => $amount,
            'description' => $description ?? 'Deposit',
            'type' => 'deposit',
        ]);
    }

    /**
     * Withdraw funds from this account.
     *
     * @param float $amount
     * @param string|null $description
     * @param SafeAccount|null $toAccount
     * @return SafeTransaction
     */
    public function withdraw(float $amount, ?string $description = null, ?SafeAccount $toAccount = null)
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Withdrawal amount must be positive');
        }

        if ($this->balance < $amount) {
            throw new \InvalidArgumentException('Insufficient funds');
        }

        $this->balance = $this->balance - $amount;
        $this->save();

        return SafeTransaction::create([
            'sender_id' => $this->id,
            'receiver_id' => $toAccount ? $toAccount->id : null,
            'amount' => $amount,
            'description' => $description ?? 'Withdrawal',
            'type' => 'withdrawal',
        ]);
    }

    /**
     * Transfer funds to another account.
     *
     * @param SafeAccount $toAccount
     * @param float $amount
     * @param string|null $description
     * @return SafeTransaction
     */
    public function transferTo(SafeAccount $toAccount, float $amount, ?string $description = null)
    {
        if ($amount <= 0) {
            throw new \InvalidArgumentException('Transfer amount must be positive');
        }

        if ($this->balance < $amount) {
            throw new \InvalidArgumentException('Insufficient funds');
        }

        // Start a transaction to ensure both accounts are updated or none
        \DB::beginTransaction();
        
        try {
            $this->balance = $this->balance - $amount;
            $this->save();

            $toAccount->balance = $toAccount->balance + $amount;
            $toAccount->save();

            $transaction = SafeTransaction::create([
                'sender_id' => $this->id,
                'receiver_id' => $toAccount->id,
                'amount' => $amount,
                'description' => $description ?? 'Transfer',
                'type' => 'transfer',
            ]);

            \DB::commit();
            return $transaction;
        } catch (\Exception $e) {
            \DB::rollBack();
            throw $e;
        }
    }

    /**
     * Scope a query to only include accounts with positive balance.
     */
    public function scopeWithBalance(Builder $query)
    {
        return $query->where('balance', '>', 0);
    }

    /**
     * Scope a query to order accounts by balance (descending by default).
     */
    public function scopeOrderByBalance(Builder $query, $direction = 'desc')
    {
        return $query->orderBy('balance', $direction);
    }
}