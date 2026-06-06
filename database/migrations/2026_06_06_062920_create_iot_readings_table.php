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
        Schema::create('iot_readings', function (Blueprint $table) {
            $table->id();
            // Foreign Key: Link to wards table (Nepalgunj Sub-Metropolitan)
            $table->foreignId('ward_id')
                ->constrained('wards')
                ->cascadeOnDelete()
                ->comment('Ward number 1-23, Nepalgunj');

            // PMS5003 Sensor Data (Particulate Matter in µg/m³)
            $table->decimal('pm1_0', 8, 2)->nullable()->comment('PM1.0 concentration from PMS5003');
            $table->decimal('pm2_5', 8, 2)->nullable()->index()->comment('PM2.5 concentration - primary AQI indicator');
            $table->decimal('pm10', 8, 2)->nullable()->index()->comment('PM10 concentration');

            // DHT22 Sensor Data
            $table->decimal('temperature', 5, 2)->nullable()->comment('Temperature in °C from DHT22');
            $table->decimal('humidity', 5, 2)->nullable()->comment('Relative humidity % from DHT22');

            // Metadata for Terai region calibration & correlation
            $table->decimal('heat_index', 5, 2)->nullable()->comment('Calculated heat index for Terai climate');
            $table->string('sensor_status', 20)->default('ok')->comment('ok, warning, error');

            // Timestamps
            $table->timestamp('recorded_at')->useCurrent()->index()->comment('Sensor reading timestamp');
            $table->timestamps(); // created_at, updated_at

            // Composite index for ward-wise time-series queries (dashboard optimization)
            $table->index(['ward_id', 'recorded_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iot_readings');
    }
};
