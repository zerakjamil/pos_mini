<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CardDebt extends Model
{
    use HasFactory;

    protected $fillable = [
        'debtor_id',
        'card_type',
        'card_value',
        'quantity',
        'amount',
        'balance',
        'description',
        'due_date',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
        'card_value' => 'decimal:2',
        'amount' => 'decimal:2',
        'balance' => 'decimal:2',
    ];

    public function debtor(): BelongsTo
    {
        return $this->belongsTo(Debtor::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CardDebtPayment::class);
    }

    public function updateStatus(): void
    {
        if ($this->balance <= 0) {
            $this->status = 'paid';
        } elseif ($this->balance < $this->amount) {
            $this->status = 'partial';
        } elseif ($this->due_date->isPast()) {
            $this->status = 'overdue';
        } else {
            $this->status = 'pending';
        }
        $this->save();
    }
}
