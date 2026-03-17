<?php

use App\Http\Controllers\Api\AmilCommissionController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BranchController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\ReceiptController;
use App\Http\Controllers\Api\ZakatCalculationController;
use App\Http\Controllers\Api\ZakatTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/ping', function () {
    return ['status' => 'ok', 'message' => 'API is working'];
});

// Temporary Test Token Endpoint
Route::get('/test-token', function () {
    $user = \App\Models\User::first();
    if (!$user) {
        return response()->json(['error' => 'No users found'], 404);
    }
    return [
        'user' => $user->email,
        'token' => $user->createToken('TestToken')->plainTextToken
    ];
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::apiResource('payments', PaymentController::class);
    Route::apiResource('branches', BranchController::class);
    Route::apiResource('zakat-types', ZakatTypeController::class);
    Route::apiResource('zakat-calculations', ZakatCalculationController::class);
    Route::apiResource('receipts', ReceiptController::class);
    Route::apiResource('amil-commissions', AmilCommissionController::class);
    Route::apiResource('notifications', NotificationController::class);
});
