<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherService
{
    private string $apiKey;
    private string $baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
    private ComfortIndexCalculator $calculator;

    public function __construct(ComfortIndexCalculator $calculator)
    {
        $this->apiKey = config('services.openweathermap.key');
        $this->calculator = $calculator;
    }

    public function getCities(): array
    {
        $citiesPath = base_path('../cities.json');
        $contents = file_get_contents($citiesPath);

        return json_decode($contents, true);
    }

    public function fetchWeatherForCity(string $cityCode): ?array
    {
        $cacheKey = "weather_raw_{$cityCode}";

        return Cache::remember($cacheKey, now()->addMinutes(5), function () use ($cityCode) {
            $response = Http::get($this->baseUrl, [
                'id' => $cityCode,
                'appid' => $this->apiKey,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning("Failed to fetch weather for city {$cityCode}: {$response->status()}");
            return null;
        });
    }

    public function getWeatherWithScores(): array
    {
        $processedCacheKey = 'weather_processed_all';

        return Cache::remember($processedCacheKey, now()->addMinutes(5), function () {
            $cities = $this->getCities();
            $results = [];

            foreach ($cities as $city) {
                $weatherData = $this->fetchWeatherForCity($city['CityCode']);

                if ($weatherData === null) {
                    continue;
                }

                $comfortScore = $this->calculator->calculate($weatherData);

                $results[] = [
                    'city_code' => $city['CityCode'],
                    'city_name' => $weatherData['name'] ?? $city['CityName'],
                    'country' => $weatherData['sys']['country'] ?? '',
                    'weather' => [
                        'main' => $weatherData['weather'][0]['main'] ?? '',
                        'description' => $weatherData['weather'][0]['description'] ?? '',
                        'icon' => $weatherData['weather'][0]['icon'] ?? '',
                    ],
                    'temperature' => [
                        'current' => round($weatherData['main']['temp'] - 273.15, 1),
                        'feels_like' => round($weatherData['main']['feels_like'] - 273.15, 1),
                        'min' => round($weatherData['main']['temp_min'] - 273.15, 1),
                        'max' => round($weatherData['main']['temp_max'] - 273.15, 1),
                    ],
                    'humidity' => $weatherData['main']['humidity'] ?? 0,
                    'pressure' => $weatherData['main']['pressure'] ?? 0,
                    'wind_speed' => $weatherData['wind']['speed'] ?? 0,
                    'visibility' => $weatherData['visibility'] ?? 0,
                    'clouds' => $weatherData['clouds']['all'] ?? 0,
                    'comfort_score' => $comfortScore,
                    'rank' => 0,
                ];
            }

            usort($results, fn($a, $b) => $b['comfort_score'] <=> $a['comfort_score']);

            foreach ($results as $index => &$result) {
                $result['rank'] = $index + 1;
            }

            return $results;
        });
    }

    public function getCacheStatus(): array
    {
        $cities = $this->getCities();
        $statuses = [];

        foreach ($cities as $city) {
            $cacheKey = "weather_raw_{$city['CityCode']}";
            $statuses[] = [
                'city_code' => $city['CityCode'],
                'city_name' => $city['CityName'],
                'raw_cache' => Cache::has($cacheKey) ? 'HIT' : 'MISS',
            ];
        }

        $statuses[] = [
            'key' => 'weather_processed_all',
            'processed_cache' => Cache::has('weather_processed_all') ? 'HIT' : 'MISS',
        ];

        return $statuses;
    }
}
