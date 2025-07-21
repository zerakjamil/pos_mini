<?php

use App\Http\Controllers\{CashierController,
    DebtController,
    DebtorController,
    DebtPaymentController,
    ProfileController,
    DashboardController,
    ProductController,
    CategoryController,
    ReportsController,
    SafeAccountController,
    SafeTransactionController,
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

    // Cashiers - accessible by all authenticated users
    Route::get('/cashier', [ProductController::class, 'cashier'])->name('cashier');
    Route::post('/sales', [SalesController::class, 'store'])->name('sales.store');

    Route::post('/debts', [App\Http\Controllers\DebtController::class, 'store'])->name('debts.store');
    // Debt Management System
    Route::resource('debtors', DebtorController::class);
    Route::resource('debts', DebtController::class);

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

        // Cashiers
        Route::resource('cashiers-management', CashierController::class);

        //Reportig
        Route::get('/reports', [ReportsController::class, 'index'])->name('reports.index');

        // Category Management
        Route::resource('categories', CategoryController::class);

        // User Management
        Route::resource('users', UserController::class);

        Route::resource('safe-accounts', SafeAccountController::class);
        Route::resource('safe-transactions', SafeTransactionController::class);

        Route::get('/my-account/{accountNumber}', [SafeAccountController::class, 'myAccount'])
        ->name('my-account');
    Route::post('/transfer-funds', [SafeTransactionController::class, 'transferFunds'])
        ->name('transfer-funds');

    Route::get('/safe-transactions', [SafeTransactionController::class, 'index'])
        ->name('safe-transactions');
});


require __DIR__ . '/auth.php';
require __DIR__ . '/settings.php';
