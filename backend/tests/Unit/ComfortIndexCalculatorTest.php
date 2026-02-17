<?php

namespace Tests\Unit;

use App\Services\ComfortIndexCalculator;
use PHPUnit\Framework\TestCase;

class ComfortIndexCalculatorTest extends TestCase
{
    private ComfortIndexCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new ComfortIndexCalculator();
    }

    public function test_perfect_conditions_yield_high_score(): void
    {
        // 22°C (295.15K), 50% humidity, light wind, full visibility
        $weatherData = [
            'main' => [
                'temp' => 295.15,
                'humidity' => 50,
            ],
            'wind' => ['speed' => 2.0],
            'visibility' => 10000,
        ];

        $score = $this->calculator->calculate($weatherData);

        $this->assertGreaterThan(90, $score);
        $this->assertLessThanOrEqual(100, $score);
    }

    public function test_extreme_heat_yields_low_score(): void
    {
        // 45°C (318.15K), high humidity, no wind, low visibility
        $weatherData = [
            'main' => [
                'temp' => 318.15,
                'humidity' => 95,
            ],
            'wind' => ['speed' => 0.5],
            'visibility' => 2000,
        ];

        $score = $this->calculator->calculate($weatherData);

        $this->assertLessThan(40, $score);
    }

    public function test_extreme_cold_yields_low_score(): void
    {
        // -10°C (263.15K), dry air, strong wind
        $weatherData = [
            'main' => [
                'temp' => 263.15,
                'humidity' => 20,
            ],
            'wind' => ['speed' => 15.0],
            'visibility' => 10000,
        ];

        $score = $this->calculator->calculate($weatherData);

        $this->assertLessThan(35, $score);
    }

    public function test_score_is_between_0_and_100(): void
    {
        $testCases = [
            ['main' => ['temp' => 200, 'humidity' => 0], 'wind' => ['speed' => 50], 'visibility' => 0],
            ['main' => ['temp' => 350, 'humidity' => 100], 'wind' => ['speed' => 0], 'visibility' => 20000],
            ['main' => ['temp' => 295, 'humidity' => 50], 'wind' => ['speed' => 3], 'visibility' => 10000],
        ];

        foreach ($testCases as $data) {
            $score = $this->calculator->calculate($data);
            $this->assertGreaterThanOrEqual(0, $score);
            $this->assertLessThanOrEqual(100, $score);
        }
    }

    public function test_moderate_humidity_scores_higher_than_extreme(): void
    {
        $moderate = [
            'main' => ['temp' => 295.15, 'humidity' => 50],
            'wind' => ['speed' => 2.0],
            'visibility' => 10000,
        ];

        $extreme = [
            'main' => ['temp' => 295.15, 'humidity' => 95],
            'wind' => ['speed' => 2.0],
            'visibility' => 10000,
        ];

        $moderateScore = $this->calculator->calculate($moderate);
        $extremeScore = $this->calculator->calculate($extreme);

        $this->assertGreaterThan($extremeScore, $moderateScore);
    }

    public function test_light_wind_scores_higher_than_strong_wind(): void
    {
        $lightWind = [
            'main' => ['temp' => 295.15, 'humidity' => 50],
            'wind' => ['speed' => 3.0],
            'visibility' => 10000,
        ];

        $strongWind = [
            'main' => ['temp' => 295.15, 'humidity' => 50],
            'wind' => ['speed' => 20.0],
            'visibility' => 10000,
        ];

        $lightScore = $this->calculator->calculate($lightWind);
        $strongScore = $this->calculator->calculate($strongWind);

        $this->assertGreaterThan($strongScore, $lightScore);
    }

    public function test_handles_missing_data_gracefully(): void
    {
        $incompleteData = [
            'main' => ['temp' => 295.15],
        ];

        $score = $this->calculator->calculate($incompleteData);

        $this->assertGreaterThanOrEqual(0, $score);
        $this->assertLessThanOrEqual(100, $score);
    }
}
