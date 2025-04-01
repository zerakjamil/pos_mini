<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the sale.
     */
    public function items()
    {
        return $this->hasMany(SaleItem::class);
    }
}
