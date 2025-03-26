<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'barcode',
        'price',
        'batch_price',
        'category_id',
        'units_per_batch',
        'stock',
        'reorder_level',
        'brand',
        'image_path',
        'expiration_date',
    ];
    protected $casts = [
        'expiration_date' => 'date',
    ];

    protected $appends = [
        'days_until_expiration',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Check if the product is expiring soon (within 30 days).
     */
    public function isExpiringSoon(): bool
    {
        if (!$this->expiration_date) {
            return false;
        }

        $today = Carbon::today();
        $expirationDate = Carbon::parse($this->expiration_date);
        $daysUntilExpiration = $today->diffInDays($expirationDate, false);

        return $daysUntilExpiration >= 0 && $daysUntilExpiration <= 30;
    }

    /**
     * Check if the product is expired.
     */
    public function isExpired(): bool
    {
        if (!$this->expiration_date) {
            return false;
        }

        return Carbon::parse($this->expiration_date)->isPast();
    }

    /**
     * Get the number of days until expiration.
     */
    public function getDaysUntilExpirationAttribute(): ?int
    {
        if (!$this->expiration_date) {
            return null;
        }

        $today = Carbon::today();
        $expirationDate = Carbon::parse($this->expiration_date);
        return $today->diffInDays($expirationDate, false);
    }

    /**
     * Check if the product has low stock.
     */
    public function isLowStock(): bool
    {
        if ($this->stock <= 0) {
            return true;
        }

        if ($this->reorder_level && $this->stock <= $this->reorder_level) {
            return true;
        }

        return false;
    }
}
