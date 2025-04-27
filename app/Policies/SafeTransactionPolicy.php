<?php

namespace App\Policies;

use App\Models\SafeTransaction;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SafeTransactionPolicy
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
    public function view(User $user, SafeTransaction $safeTransaction): bool
    {
        // Supervisors can view any transaction
        if ($user->isSupervisor()) {
            return true;
        }
        
        // Users can view transactions associated with their accounts
        $userAccounts = $user->safeAccounts->pluck('account_number')->toArray();
        
        return in_array($safeTransaction->sender_account, $userAccounts) || 
               in_array($safeTransaction->receiver_account, $userAccounts);
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Only supervisors can create transactions
        return $user->isSupervisor();
    }
}