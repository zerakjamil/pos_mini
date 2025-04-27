<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Check if the user is a supervisor.
     *
     * @return bool
     */
    public function isSupervisor(): bool
    {
        return $this->role === 'supervisor';
    }

    /**
     * Check if the user is a management.
     *
     * @return bool
     */
    public function isCashier(): bool
    {
        return $this->role === 'management';
    }

    /**
     * Get the sales associated with the user.
     */
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * Get the safe accounts associated with the user.
     */
    public function safeAccounts()
    {
        return $this->hasMany(SafeAccount::class);
    }
}
