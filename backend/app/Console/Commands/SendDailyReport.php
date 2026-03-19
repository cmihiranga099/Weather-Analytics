<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SendDailyReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'weather:report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate and log daily weather reports for all cities';

    /**
     * Execute the console command.
     */
    public function handle(\App\Services\ReportService $reportService, \App\Services\WeatherService $weatherService)
    {
        $this->info('Generating daily weather reports...');

        $cities = $weatherService->getCities();
        
        foreach ($cities as $city) {
            $report = $reportService->generateDailyReport($city['CityCode']);
            
            // In a real app, you would email this to users.
            // For now, we'll log it and output to console.
            \Illuminate\Support\Facades\Log::info("Daily Report for {$city['CityName']}:\n{$report}");
            $this->line("--- Report for {$city['CityName']} ---");
            $this->line($report);
        }

        $this->info('Daily reports generated successfully.');
    }
}
