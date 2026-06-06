<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class IotReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'ward_id',
        'pm1_0',
        'pm2_5',
        'pm10',
        'temperature',
        'humidity',
        'heat_index',
        'sensor_status',
        'recorded_at'
    ];

    protected $appends = [
        'aqi',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'pm1_0' => 'float',
        'pm2_5' => 'float',
        'pm10' => 'float',
        'temperature' => 'float',
        'humidity' => 'float',
    ];

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function getAqiAttribute(): ?int
    {
        $pm25Aqi = $this->pm2_5 !== null
            ? $this->calculateConcentrationAqi((float) $this->pm2_5, [
                [0.0, 12.0, 0, 50],
                [12.1, 35.4, 51, 100],
                [35.5, 55.4, 101, 150],
                [55.5, 150.4, 151, 200],
                [150.5, 250.4, 201, 300],
                [250.5, 350.4, 301, 400],
                [350.5, 500.4, 401, 500],
            ])
            : null;

        $pm10Aqi = $this->pm10 !== null
            ? $this->calculateConcentrationAqi((float) $this->pm10, [
                [0, 54, 0, 50],
                [55, 154, 51, 100],
                [155, 254, 101, 150],
                [255, 354, 151, 200],
                [355, 424, 201, 300],
                [425, 504, 301, 400],
                [505, 604, 401, 500],
            ])
            : null;

        $values = array_filter([$pm25Aqi, $pm10Aqi], fn ($value) => $value !== null);

        return $values === [] ? null : max($values);
    }

    private function calculateConcentrationAqi(float $concentration, array $breakpoints): int
    {
        foreach ($breakpoints as [$cLow, $cHigh, $iLow, $iHigh]) {
            if ($concentration >= $cLow && $concentration <= $cHigh) {
                return (int) round((($iHigh - $iLow) / ($cHigh - $cLow)) * ($concentration - $cLow) + $iLow);
            }
        }

        return 500;
    }
}
