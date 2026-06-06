<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class IotReading extends Model
{
    use HasFactory;

    protected $fillable = [
        'ward_id', 'pm1_0', 'pm2_5', 'pm10', 'temperature', 'humidity', 'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'pm1_0' => 'float', 'pm2_5' => 'float', 'pm10' => 'float',
        'temperature' => 'float', 'humidity' => 'float',
    ];
}
