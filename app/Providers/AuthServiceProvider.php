<?php

namespace App\Providers;

use App\Models\SafeAccount;
use App\Models\SafeTransaction;
use App\Policies\SafeAccountPolicy;
use App\Policies\SafeTransactionPolicy;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Cashier::class => CashierPolicy::class,
        SafeAccount::class => SafeAccountPolicy::class,
        SafeTransaction::class => SafeTransactionPolicy::class,
    ];

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
