<?php

use App\Http\Controllers\{CardDebtController,
    CardDebtPaymentController,
    CardTypeController,
    DebtController,
    DebtorController,
    DebtPaymentController,
    ProfileController,
    DashboardController,
    ProductController,
    CategoryController,
    ReportsController,
    SalesController,
    UserController,
    SettingsController};
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/home', function () {
    return Inertia::render('Home');
})->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products (View Only)
    Route::get('/products', [ProductController::class, 'index'])->name('product.index');

    // Sales (View)
    Route::get('/sales', [SalesController::class, 'index'])->name('sales.index');
    Route::get('/sales/{sale}', [SalesController::class, 'show'])->name('sales.show');

    // Cashier - accessible by all authenticated users
    Route::get('/cashier', [ProductController::class, 'cashier'])->name('cashier');
    Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');

    /*
    |--------------------------------------------------------------------------
    | Supervisor Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware(['role:supervisor'])->group(function () {
        // Product Management
        Route::get('/products/create', [ProductController::class, 'create'])->name('product.create');
        Route::post('/products', [ProductController::class, 'store'])->name('product.store');
        Route::get('/products/{product}/edit', [ProductController::class, 'edit'])->name('product.edit');
        Route::put('/products/{product}', [ProductController::class, 'update'])->name('product.update');
        Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('product.destroy');
        Route::get('/products/{product}', [ProductController::class, 'show'])->name('product.show');

        // Category Management
        Route::resource('categories', CategoryController::class);

        // Reporting
        Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');

        // User Management
        Route::resource('users', UserController::class);

        // Settings
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

        // Debt Management System
        Route::resource('debtors', DebtorController::class);
        Route::resource('debts', DebtController::class);

        // Card Debts
        Route::resource('card-debts', CardDebtController::class);

        // Card Debt Payments
        Route::get('card-debts/{cardDebt}/payments/create', [CardDebtPaymentController::class, 'create'])->name('card-debts.payments.create');
        Route::post('card-debts/{cardDebt}/payments', [CardDebtPaymentController::class, 'store'])->name('card-debts.payments.store');
        Route::get('card-debts/payments/{payment}/edit', [CardDebtPaymentController::class, 'edit'])->name('card-debts.payments.edit');
        Route::put('card-debts/payments/{payment}', [CardDebtPaymentController::class, 'update'])->name('card-debts.payments.update');
        Route::delete('card-debts/payments/{payment}', [CardDebtPaymentController::class, 'destroy'])->name('card-debts.payments.destroy');

        // Card Types Management
        Route::resource('card-types', CardTypeController::class);

        // Debt Payments
        Route::resource('payments', DebtPaymentController::class)
            ->except(['index', 'create', 'store']);

        Route::get('debts/{debt}/payments', [DebtPaymentController::class, 'index'])
            ->name('debts.payments.index');
        Route::get('debts/{debt}/payments/create', [DebtPaymentController::class, 'create'])
            ->name('debts.payments.create');
        Route::post('debts/{debt}/payments', [DebtPaymentController::class, 'store'])
            ->name('debts.payments.store');
    });
});

/*
|--------------------------------------------------------------------------
| Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Include authentication routes
require __DIR__ . '/auth.php';
