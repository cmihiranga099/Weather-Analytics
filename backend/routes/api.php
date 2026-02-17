<?php

use App\Http\Controllers\Api\WeatherController;
use Illuminate\Support\Facades\Route;

// Protected routes - require valid Auth0 JWT
Route::middleware('auth0.authorize')->group(function () {
    Route::get('/weather', [WeatherController::class, 'index']);
    Route::get('/weather/{cityCode}', [WeatherController::class, 'show']);
});

// Public debug endpoint for cache status
Route::get('/cache-status', [WeatherController::class, 'cacheStatus']);
