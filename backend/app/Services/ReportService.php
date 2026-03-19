<?php

namespace App\Services;

use App\Models\WeatherReading;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportService
{
    private AnalyticsService $analytics;
    private InsightsService $insights;

    public function __construct(AnalyticsService $analytics, InsightsService $insights)
    {
        $this->analytics = $analytics;
        $this->insights = $insights;
    }

    public function generateReport(string $cityCode, string $period = 'daily'): string
    {
        return match ($period) {
            'weekly' => $this->generateWeeklyReport($cityCode),
            'monthly' => $this->generateMonthlyReport($cityCode),
            'yearly' => $this->generateYearlyReport($cityCode),
            default => $this->generateDailyReport($cityCode),
        };
    }

    public function generateDailyReport(string $cityCode): string
    {
        $trends = $this->analytics->getTrends($cityCode);
        
        if (empty($trends) || !$trends['current']) {
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

    /**
     * Generate report for a specific period of days.
     */
    protected function generateSummaryReport(string $cityCode, string $title, int $days): string
    {
        $now = Carbon::now();
        $startDate = $now->copy()->subDays($days);
        
        $data = WeatherReading::where('city_code', $cityCode)
            ->where('created_at', '>=', $startDate)
            ->select(
                DB::raw('AVG(temp) as avg_temp'),
                DB::raw('MAX(temp) as max_temp'),
                DB::raw('MIN(temp) as min_temp'),
                DB::raw('AVG(humidity) as avg_humidity'),
                DB::raw('AVG(wind_speed) as avg_wind_speed')
            )
            ->first();

        if (!$data || is_null($data->avg_temp)) {
            return "No data available for city: {$cityCode} in the last {$days} days.";
        }

        $cityName = WeatherReading::where('city_code', $cityCode)->value('city_name') ?? $cityCode;

        $report = "# {$title} Report: {$cityName}\n";
        $report .= "Period: {$startDate->toFormattedDateString()} to {$now->toFormattedDateString()}\n\n";

        $report .= "## 🌡️ Temperature Summary\n";
        $report .= "- **Average:** " . round($data->avg_temp, 1) . "°C\n";
        $report .= "- **Maximum:** " . round($data->max_temp, 1) . "°C\n";
        $report .= "- **Minimum:** " . round($data->min_temp, 1) . "°C\n\n";

        $report .= "## 💧 Atmosphere & Wind\n";
        $report .= "- **Average Humidity:** " . round($data->avg_humidity) . "%\n";
        $report .= "- **Average Wind Speed:** " . round($data->avg_wind_speed, 1) . " km/h\n\n";

        $report .= "## 📑 Observations\n";
        $topCondition = WeatherReading::where('city_code', $cityCode)
            ->where('created_at', '>=', $startDate)
            ->select('weather_main', DB::raw('count(*) as count'))
            ->groupBy('weather_main')
            ->orderBy('count', 'desc')
            ->first();

        if ($topCondition) {
            $report .= "- Most frequent weather condition: **{$topCondition->weather_main}**\n";
        }

        return $report;
    }

    public function generateWeeklyReport(string $cityCode): string
    {
        return $this->generateSummaryReport($cityCode, 'Weekly Weather Summary', 7);
    }

    public function generateMonthlyReport(string $cityCode): string
    {
        return $this->generateSummaryReport($cityCode, 'Monthly Weather Analytics', 30);
    }

    public function generateYearlyReport(string $cityCode): string
    {
        return $this->generateSummaryReport($cityCode, 'Annual Weather Retrospective', 365);
    }
}
