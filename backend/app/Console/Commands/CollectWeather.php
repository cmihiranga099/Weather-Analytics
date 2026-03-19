<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CollectWeather extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'weather:collect';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetch and store weather data for all cities';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\WeatherService $weatherService)
    {
        $this->info('Starting weather data collection...');

        $cities = $weatherService->getCities();
        $count = 0;

        foreach ($cities as $city) {
            $this->comment("Fetching weather for {$city['CityName']}...");
            
            $weatherData = $weatherService->fetchWeatherForCity($city['CityCode']);
            
            if ($weatherData) {
                $comfortScore = app(\App\Services\ComfortIndexCalculator::class)->calculate($weatherData);
                
                \App\Models\WeatherReading::create([
                    'city_code' => $city['CityCode'],
                    'city_name' => $weatherData['name'] ?? $city['CityName'],
                    'temp' => round($weatherData['main']['temp'] - 273.15, 1),
                    'feels_like' => round($weatherData['main']['feels_like'] - 273.15, 1),
                    'temp_min' => round($weatherData['main']['temp_min'] - 273.15, 1),
                    'temp_max' => round($weatherData['main']['temp_max'] - 273.15, 1),
                    'humidity' => $weatherData['main']['humidity'] ?? 0,
                    'pressure' => $weatherData['main']['pressure'] ?? 0,
                    'wind_speed' => $weatherData['wind']['speed'] ?? 0,
                    'weather_main' => $weatherData['weather'][0]['main'] ?? '',
                    'weather_description' => $weatherData['weather'][0]['description'] ?? '',
                    'comfort_score' => $comfortScore,
                ]);
                
                $count++;
            }
        }

        $this->info("Successfully collected weather data for {$count} cities.");
    }
}
