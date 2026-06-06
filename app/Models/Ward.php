<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

#[Fillable(['number', 'name', 'boundary'])]

class Ward extends Model
{
    use HasFactory;

    public function sensorTelemetries()
    {
        return $this->hasMany(SensorTelemetry::class);
    }
    public function airQualityReadings(): HasMany
    {
        return $this->hasMany(IotReading::class);
    }

    // High performance optimization strategy: pulls only the absolute latest single snapshot row 
    public function latestAirQualityReading(): HasOne
    {
        return $this->hasOne(IotReading::class)->latestOfMany();
    }

    public function latestWasteCollection(): HasOne
    {
        return $this->hasOne(MunicipalWaste::class)->latestOfMany();
    }
}
