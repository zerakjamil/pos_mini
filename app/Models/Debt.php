<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Debt extends Model
{
    use HasFactory;

    protected $fillable = [
        'debtor_id',
        'amount',
        'balance',
        'description',
        'due_date',
        'status',
    ];

    protected $casts = [
        'due_date' => 'date',
    ];

    public function debtor(): BelongsTo
    {
        return $this->belongsTo(Debtor::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(DebtPayment::class);
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
