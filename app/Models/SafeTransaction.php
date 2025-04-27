<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SafeTransaction extends Model
{
    use HasFactory, HasUuids;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaction_number',
        'transaction_type',
        'sender_id',
        'receiver_id',
        'amount',
        'description',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Generate transaction number when creating a new transaction
        static::creating(function ($transaction) {
            $transaction->transaction_number = 'TRX-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), 7, 6));
        });
    }

    /**
     * Get the sender account for this transaction.
     */
    public function sender(): BelongsTo
    {
        return $this->belongsTo(SafeAccount::class, 'sender_id');
    }

    /**
     * Get the receiver account for this transaction.
     */
    public function receiver(): BelongsTo
    {
        return $this->belongsTo(SafeAccount::class, 'receiver_id');
    }
}