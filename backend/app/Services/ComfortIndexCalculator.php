<?php

namespace App\Services;

class ComfortIndexCalculator
{
    private const WEIGHT_TEMPERATURE = 0.40;
    private const WEIGHT_HUMIDITY = 0.30;
    private const WEIGHT_WIND = 0.20;
    private const WEIGHT_VISIBILITY = 0.10;

    private const IDEAL_TEMP_CELSIUS = 22.0;
    private const TEMP_SIGMA = 10.0;

    private const IDEAL_HUMIDITY = 50.0;
    private const HUMIDITY_SIGMA = 30.0;

    private const MAX_COMFORTABLE_WIND = 5.0;
    private const MAX_VISIBILITY = 10000.0;

    // compute comfort score (0-100) from raw weather data
    public function calculate(array $weatherData): float
    {
        $tempCelsius = $this->kelvinToCelsius($weatherData['main']['temp'] ?? 273.15);
        $humidity = $weatherData['main']['humidity'] ?? 50;
        $windSpeed = $weatherData['wind']['speed'] ?? 0;
        $visibility = $weatherData['visibility'] ?? 10000;

        $tempScore = $this->gaussianScore($tempCelsius, self::IDEAL_TEMP_CELSIUS, self::TEMP_SIGMA);
        $humidityScore = $this->gaussianScore($humidity, self::IDEAL_HUMIDITY, self::HUMIDITY_SIGMA);
        $windScore = $this->windComfortScore($windSpeed);
        $visibilityScore = $this->visibilityComfortScore($visibility);

        $rawScore = ($tempScore * self::WEIGHT_TEMPERATURE)
            + ($humidityScore * self::WEIGHT_HUMIDITY)
            + ($windScore * self::WEIGHT_WIND)
            + ($visibilityScore * self::WEIGHT_VISIBILITY);

        return round(max(0, min(100, $rawScore * 100)), 1);
    }

    // gaussian decay — peaks at ideal, drops off symmetrically
    private function gaussianScore(float $value, float $ideal, float $sigma): float
    {
        return exp(-0.5 * pow(($value - $ideal) / $sigma, 2));
    }

    // full score up to 5 m/s, then exponential decay
    private function windComfortScore(float $windSpeed): float
    {
        if ($windSpeed <= self::MAX_COMFORTABLE_WIND) {
            return 1.0;
        }

        $excess = $windSpeed - self::MAX_COMFORTABLE_WIND;
        return exp(-0.15 * $excess);
    }

    // linear scale capped at 10km
    private function visibilityComfortScore(float $visibility): float
    {
        return min(1.0, max(0.0, $visibility / self::MAX_VISIBILITY));
    }

    private function kelvinToCelsius(float $kelvin): float
    {
        return $kelvin - 273.15;
    }
}
