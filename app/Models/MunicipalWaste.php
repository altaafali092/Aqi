<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['ward_id', 'waste_type', 'weight_kg', 'collection_date'])]

class MunicipalWaste extends Model
{
    use HasFactory;


    protected $casts = [
        'collection_date' => 'date',
        'weight_kg' => 'decimal:2',
    ];

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }
}
