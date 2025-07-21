<?php

use App\Http\Controllers\SalesController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/sales/{transactionNumber}', [SalesController::class, 'getByTransactionNumber']);

 Route::post('/api/safe-transactions', [SafeTransactionController::class, 'store']);
    Route::get('/api/safe-transactions/{id}', [SafeTransactionController::class, 'show']);
