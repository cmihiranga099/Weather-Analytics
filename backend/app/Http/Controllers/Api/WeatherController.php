<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WeatherService;
use App\Services\AnalyticsService;
use App\Services\InsightsService;
use Illuminate\Http\JsonResponse;

class WeatherController extends Controller
{
    private WeatherService $weatherService;
    private AnalyticsService $analyticsService;
    private InsightsService $insightsService;

    public function __construct(
        WeatherService $weatherService,
        AnalyticsService $analyticsService,
        InsightsService $insightsService
    ) {
        $this->weatherService = $weatherService;
        $this->analyticsService = $analyticsService;
        $this->insightsService = $insightsService;
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

    public function trends(string $cityCode): JsonResponse
    {
        $trends = $this->analyticsService->getTrends($cityCode);

        return response()->json([
            'success' => true,
            'data' => $trends,
        ]);
    }

    public function insights(string $cityCode): JsonResponse
    {
        $allWeather = $this->weatherService->getWeatherWithScores();
        $cityData = collect($allWeather)->firstWhere('city_code', $cityCode);
        
        if (!$cityData) {
            return response()->json(['success' => false, 'message' => 'City not found'], 404);
        }

        // Fetch additional data for insights
        $forecast = $this->weatherService->fetchForecastForCity($cityCode);
        
        // Find city coordinates from cities.json or weather data
        $cities = $this->weatherService->getCities();
        $cityInfo = collect($cities)->firstWhere('CityCode', $cityCode);
        
        $uvData = null;
        if ($cityInfo && isset($cityInfo['Latitude'], $cityInfo['Longitude'])) {
            $uvData = $this->weatherService->fetchUVForCity($cityInfo['Latitude'], $cityInfo['Longitude']);
        }

        // Merge additional data into cityData for the insights service
        $enrichedData = array_merge($cityData, [
            'forecast' => $forecast,
            'uv_index' => $uvData['value'] ?? 0,
        ]);

        $trends = $this->analyticsService->getTrends($cityCode);
        $insights = $this->insightsService->generateInsights($enrichedData, $trends);

        return response()->json([
            'success' => true,
            'data' => $insights,
        ]);
    }

    public function history(string $cityCode): JsonResponse
    {
        $history = $this->analyticsService->getHistory($cityCode);

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }

    public function forecast(string $cityCode): JsonResponse
    {
        $forecast = $this->weatherService->fetchForecastForCity($cityCode);

        return response()->json([
            'success' => true,
            'data' => $forecast,
        ]);
    }
}
