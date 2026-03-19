<?php

namespace App\Services;

use App\Models\WeatherReading;
use Carbon\Carbon;

class ReportService
{
    private AnalyticsService $analytics;
    private InsightsService $insights;

    public function __construct(AnalyticsService $analytics, InsightsService $insights)
    {
        $this->analytics = $analytics;
        $this->insights = $insights;
    }

    public function generateDailyReport(string $cityCode): string
    {
        $trends = $this->analytics->getTrends($cityCode);
        
        if (empty($trends)) {
            return "No data available for city: {$cityCode}";
        }

        $current = $trends['current'];
        $yesterday = $trends['yesterday'];
        $weekly = $trends['weekly_avg'];
        
        $report = "# Daily Weather Report: {$current->city_name}\n";
        $report .= "Date: " . Carbon::now()->toFormattedDateString() . "\n\n";
        
        $report .= "## 📊 Current Snapshot\n";
        $report .= "- **Temperature:** {$current->temp}°C (Feels like {$current->feels_like}°C)\n";
        $report .= "- **Humidity:** {$current->humidity}%\n";
        $report .= "- **Wind Speed:** {$current->wind_speed} km/h\n";
        $report .= "- **Conditions:** {$current->weather_description}\n\n";
        
        $report .= "## 📈 Trend Analysis\n";
        if ($yesterday) {
            $diff = round($current->temp - $yesterday->temp, 1);
            $direction = $diff >= 0 ? "increased by {$diff}°C" : "decreased by " . abs($diff) . "°C";
            $report .= "- **Vs Yesterday:** Temperature has {$direction}.\n";
        }
        $report .= "- **Vs Weekly Average:** Today is " . ($current->temp > $weekly['temp'] ? "warmer" : "cooler") . " than the 7-day average ({$weekly['temp']}°C).\n\n";

        $report .= "## ✨ Smart Insights\n";
        // Convert current reading to format expected by insights service
        $weatherData = [
            'temp' => $current->temp,
            'humidity' => $current->humidity,
            'wind_speed' => $current->wind_speed,
            'weather_description' => $current->weather_description,
        ];
        $insightsList = $this->insights->generateInsights($weatherData, $trends);
        
        foreach ($insightsList as $insight) {
            $report .= "- {$insight['icon']} **{$insight['type']}:** {$insight['message']}\n";
        }

        return $report;
    }
}
