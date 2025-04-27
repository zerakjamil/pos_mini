<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SafeAuditLog extends Model
{
    use HasUuids;

    protected $fillable = [
        'account_number',
        'action_type',
        'details',
        'ip_address',
        'user_id',
    ];

    /**
     * Get the account associated with the audit log.
     */
    public function account(): BelongsTo
    {
        return $this->belongsTo(SafeAccount::class, 'account_number', 'account_number');
    }

    /**
     * Get the user associated with the audit log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}