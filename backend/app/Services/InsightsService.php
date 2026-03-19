<?php

namespace App\Services;

class InsightsService
{
    public function generateInsights(array $weatherData, array $trends = []): array
    {
        $insights = [];
        $temp = $weatherData['temperature']['current'] ?? $weatherData['temp'] ?? 0;
        $humidity = $weatherData['humidity'] ?? 0;
        $windSpeed = $weatherData['wind_speed'] ?? 0;
        $description = strtolower($weatherData['weather']['description'] ?? $weatherData['weather_description'] ?? '');
        $uvIndex = $weatherData['uv_index'] ?? 0; // Assuming we pass this or fetch it

        // 1. Temperature insights
        if ($temp > 32) {
            $insights[] = [
                'type' => 'alert',
                'icon' => '🌡️',
                'message' => "Extreme heat detected ({$temp}°C). Outdoor activities are discouraged during midday.",
            ];
        } elseif ($temp > 30) {
            $insights[] = [
                'type' => 'alert',
                'icon' => '🌡️',
                'message' => "High temperature detected ({$temp}°C). Stay hydrated and seek shade.",
            ];
        } elseif ($temp < 15) {
            $insights[] = [
                'type' => 'info',
                'icon' => '🧥',
                'message' => "It's a bit chilly ({$temp}°C). Consider wearing a jacket.",
            ];
        }

        // 2. UV Index insights
        if ($uvIndex >= 8) {
            $insights[] = [
                'type' => 'alert',
                'icon' => '☀️',
                'message' => "Very high UV Index ({$uvIndex}). Seek shade, wear sunscreen and protective clothing.",
            ];
        } elseif ($uvIndex >= 6) {
            $insights[] = [
                'type' => 'warning',
                'icon' => '🧴',
                'message' => "High UV Index ({$uvIndex}). Sunscreen is highly recommended.",
            ];
        }

        // 3. Rain insights
        if (str_contains($description, 'rain') || str_contains($description, 'drizzle') || str_contains($description, 'thunderstorm')) {
            $insights[] = [
                'type' => 'warning',
                'icon' => '🌧️',
                'message' => 'Rain or storm detected. Carry an umbrella and expect potential delays.',
            ];
        }

        // 4. Wind insights
        if ($windSpeed > 25) {
            $insights[] = [
                'type' => 'alert',
                'icon' => '🌬️',
                'message' => "Very strong winds detected ({$windSpeed} km/h). Secure loose outdoor items.",
            ];
        } elseif ($windSpeed > 15) {
            $insights[] = [
                'type' => 'warning',
                'icon' => '🌬️',
                'message' => "Breezy conditions ({$windSpeed} km/h). Caution for high-profile vehicles.",
            ];
        }

        // 5. Forecast Insights (if available)
        if (isset($weatherData['forecast'])) {
            $rainyDays = collect($weatherData['forecast']['list'] ?? [])
                ->take(8) // Next 24 hours (3-hour intervals)
                ->filter(fn($item) => str_contains(strtolower($item['weather'][0]['description'] ?? ''), 'rain'))
                ->count();
            
            if ($rainyDays > 0) {
                $insights[] = [
                    'type' => 'info',
                    'icon' => '📅',
                    'message' => "Rain is expected within the next 24 hours. Plan accordingly.",
                ];
            }
        }

        // 4. Trend-based insights
        if (isset($trends['comparisons']['temp_vs_yesterday'])) {
            $diff = $trends['comparisons']['temp_vs_yesterday'];
            if (abs($diff) >= 2) {
                $status = $diff > 0 ? 'warmer' : 'cooler';
                $insights[] = [
                    'type' => 'trend',
                    'icon' => '📊',
                    'message' => "It's significantly {$status} today ({$diff}°C difference compared to yesterday).",
                ];
            }
        }

        return $insights;
    }
}
