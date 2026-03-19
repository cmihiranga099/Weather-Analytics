<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('weather_readings', function (Blueprint $table) {
            $table->id();
            $table->string('city_code');
            $table->string('city_name');
            $table->float('temp');
            $table->float('feels_like');
            $table->float('temp_min');
            $table->float('temp_max');
            $table->integer('humidity');
            $table->integer('pressure');
            $table->float('wind_speed');
            $table->string('weather_main');
            $table->string('weather_description');
            $table->float('comfort_score');
            $table->timestamps();

            $table->index('city_code');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather_readings');
    }
};
