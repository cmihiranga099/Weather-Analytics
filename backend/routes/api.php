<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WeatherController;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/weather', [WeatherController::class, 'index']);
    Route::get('/weather/{cityCode}', [WeatherController::class, 'show']);
    Route::get('/weather/{cityCode}/trends', [WeatherController::class, 'trends']);
    Route::get('/weather/{cityCode}/insights', [WeatherController::class, 'insights']);
    Route::get('/weather/{cityCode}/history', [WeatherController::class, 'history']);
    Route::get('/weather/{cityCode}/forecast', [WeatherController::class, 'forecast']);
    Route::get('/weather/{cityCode}/report', [WeatherController::class, 'report']);
});

// Public debug endpoint for cache status
Route::get('/cache-status', [WeatherController::class, 'cacheStatus']);
