<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'debtor_id',
        'transaction_number',
        'total_amount',
        'amount_paid',
        'change_amount',
        'payment_method',
        'payment_status',
        'customer_name',
        'customer_phone',
        'cashier_name',
    ];

    /**
     * Get the user that made the sale.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the debtor associated with this sale.
     */
    public function debtor(): BelongsTo
    {
        return $this->belongsTo(Debtor::class);
    }

    /**
     * Get the items for the sale.
     */
    public function items(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    /**
     * Get the debt record associated with this sale.
     */
    public function debt(): HasMany
    {
        return $this->hasMany(Debt::class);
    }
}
