<?php

use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

// Product routes
Route::get('/products', [ProductController::class, 'index'])->name('products.index');
Route::get('/cashier', [ProductController::class, 'cashier'])->name('cashier');

// Transaction routes
Route::get('/sales', [TransactionController::class, 'index'])->name('sales.index');
Route::get('/sales/{id}', [TransactionController::class, 'show'])->name('sales.show');

// API routes for transactions
Route::post('/api/transactions', [TransactionController::class, 'store']);
Route::get('/api/transactions/{id}', [TransactionController::class, 'show']);
