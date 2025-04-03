<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CardDebtPayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_debt_id',
        'amount',
        'payment_date',
        'payment_method',
        'reference_number',
        'notes',
    ];

    protected $casts = [
        'payment_date' => 'date',
        'amount' => 'decimal:2',
    ];

    public function cardDebt(): BelongsTo
    {
        return $this->belongsTo(CardDebt::class);
    }
}
