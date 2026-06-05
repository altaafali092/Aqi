<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['number', 'name', 'boundary'])]

class Ward extends Model
{
    use HasFactory;

    public function sensorTelemetries()
    {
        return $this->hasMany(SensorTelemetry::class);
    }
}
