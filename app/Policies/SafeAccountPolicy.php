<?php

namespace App\Policies;

use App\Models\SafeAccount;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SafeAccountPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->isSupervisor();
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SafeAccount $safeAccount): bool
    {
        // Supervisors can view any account
        if ($user->isSupervisor()) {
            return true;
        }
        
        // Users can view their own account
        return $user->id === $safeAccount->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->isSupervisor();
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SafeAccount $safeAccount): bool
    {
        return $user->isSupervisor();
    }
}