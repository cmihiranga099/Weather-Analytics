<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeatherReading extends Model
{
    /** @use HasFactory<\Database\Factories\WeatherReadingFactory> */
    use HasFactory;

    protected $fillable = [
        'city_code',
        'city_name',
        'temp',
        'feels_like',
        'temp_min',
        'temp_max',
        'humidity',
        'pressure',
        'wind_speed',
        'weather_main',
        'weather_description',
        'comfort_score',
    ];
}
