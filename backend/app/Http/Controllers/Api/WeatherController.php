<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WeatherService;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    private WeatherService $weatherService;

    public function __construct(WeatherService $weatherService)
    {
        $this->weatherService = $weatherService;
    }

    public function index(): JsonResponse
    {
        $data = $this->weatherService->getWeatherWithScores();

        return response()->json([
            'success' => true,
            'data' => $data,
            'count' => count($data),
        ]);
    }

    public function show(string $cityCode): JsonResponse
    {
        $allData = $this->weatherService->getWeatherWithScores();

        $city = collect($allData)->firstWhere('city_code', $cityCode);

        if (!$city) {
            return response()->json([
                'success' => false,
                'message' => 'City not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $city,
        ]);
    }

    public function cacheStatus(): JsonResponse
    {
        $statuses = $this->weatherService->getCacheStatus();

        return response()->json([
            'success' => true,
            'cache_statuses' => $statuses,
        ]);
    }
}
