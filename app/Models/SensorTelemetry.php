<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['ward_id', 'PM1_0', 'PM2_5', 'PM10', 'temperature', 'humidity', 'pressure', 'gas_level'])]
class SensorTelemetry extends Model
{
    use HasFactory;
     protected $casts = [
        'PM1_0' => 'decimal:2',
        'PM2_5' => 'decimal:2',
        'PM10' => 'decimal:2',
        'temperature' => 'decimal:2',
        'humidity' => 'decimal:2',
        'pressure' => 'decimal:2',
        'gas_level' => 'decimal:2',
    ];

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }
}
