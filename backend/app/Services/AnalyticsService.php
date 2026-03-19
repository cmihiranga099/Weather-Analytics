<?php

namespace App\Services;

use App\Models\WeatherReading;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    public function getTrends(string $cityCode): array
    {
        $now = Carbon::now();
        $todayLatest = WeatherReading::where('city_code', $cityCode)
            ->whereDate('created_at', $now->toDateString())
            ->latest()
            ->first();

        if (!$todayLatest) {
            return [];
        }

        // Yesterday's reading around the same time
        $yesterdaySameTime = WeatherReading::where('city_code', $cityCode)
            ->whereBetween('created_at', [
                $now->copy()->subDay()->subHour(),
                $now->copy()->subDay()->addHour()
            ])
            ->latest()
            ->first();

        // 7-day average
        $sevenDayAvg = WeatherReading::where('city_code', $cityCode)
            ->where('created_at', '>=', $now->copy()->subDays(7))
            ->select(
                DB::raw('AVG(temp) as avg_temp'),
                DB::raw('AVG(humidity) as avg_humidity'),
                DB::raw('AVG(wind_speed) as avg_wind_speed')
            )
            ->first();

        return [
            'current' => $todayLatest,
            'yesterday' => $yesterdaySameTime,
            'weekly_avg' => [
                'temp' => round($sevenDayAvg->avg_temp ?? 0, 1),
                'humidity' => round($sevenDayAvg->avg_humidity ?? 0),
                'wind_speed' => round($sevenDayAvg->avg_wind_speed ?? 0, 1),
            ],
            'comparisons' => [
                'temp_vs_yesterday' => $yesterdaySameTime ? round($todayLatest->temp - $yesterdaySameTime->temp, 1) : null,
                'temp_vs_weekly' => $sevenDayAvg->avg_temp ? round($todayLatest->temp - $sevenDayAvg->avg_temp, 1) : null,
            ]
        ];
    }

    public function getHistory(string $cityCode, int $days = 7): array
    {
        return WeatherReading::where('city_code', $cityCode)
            ->where('created_at', '>=', Carbon::now()->subDays($days))
            ->orderBy('created_at', 'asc')
            ->get()
            ->toArray();
    }
}
