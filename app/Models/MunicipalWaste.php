<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'ward_id',
    'waste_type',
    'weight_kg',
    'collection_date',
    'population_served',
    'reporting_period_days',
    'collection_status',
    'segregation_quality',
    'organic_weight_kg',
    'recyclable_weight_kg',
    'hazardous_weight_kg',
    'medical_weight_kg',
    'overflow_spots',
    'odor_level',
    'standing_water',
    'missed_collection_days',
    'notes',
])]

class MunicipalWaste extends Model
{
    use HasFactory;

    public const NEPAL_REFERENCE_KG_PER_PERSON_DAY = 0.30;

    public const GLOBAL_REFERENCE_KG_PER_PERSON_DAY = 0.74;


    protected $casts = [
        'collection_date' => 'date',
        'weight_kg' => 'decimal:2',
        'population_served' => 'integer',
        'reporting_period_days' => 'integer',
        'organic_weight_kg' => 'decimal:2',
        'recyclable_weight_kg' => 'decimal:2',
        'hazardous_weight_kg' => 'decimal:2',
        'medical_weight_kg' => 'decimal:2',
        'overflow_spots' => 'integer',
        'odor_level' => 'integer',
        'standing_water' => 'boolean',
        'missed_collection_days' => 'integer',
    ];

    protected $appends = [
        'kg_per_person_per_day',
        'health_risk_level',
        'health_warning',
        'nepal_reference_kg_per_person_day',
        'global_reference_kg_per_person_day',
    ];

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function getKgPerPersonPerDayAttribute(): ?float
    {
        if (! $this->population_served || $this->population_served <= 0) {
            return null;
        }

        $periodDays = max(1, $this->reporting_period_days ?: 1);

        return round(((float) $this->weight_kg / $this->population_served) / $periodDays, 3);
    }

    public function getHealthRiskLevelAttribute(): string
    {
        if (($this->medical_weight_kg ?? 0) > 0 || ($this->hazardous_weight_kg ?? 0) > 0) {
            return 'Critical';
        }

        if (($this->overflow_spots ?? 0) >= 3 || ($this->odor_level ?? 0) >= 4 || ($this->missed_collection_days ?? 0) >= 3) {
            return 'High';
        }

        if (($this->overflow_spots ?? 0) > 0 || ($this->odor_level ?? 0) >= 2 || $this->standing_water || ($this->missed_collection_days ?? 0) > 0) {
            return 'Medium';
        }

        $kgPerPersonPerDay = $this->kg_per_person_per_day;
        if ($kgPerPersonPerDay !== null && $kgPerPersonPerDay > self::NEPAL_REFERENCE_KG_PER_PERSON_DAY * 1.5) {
            return 'Medium';
        }

        return 'Low';
    }

    public function getHealthWarningAttribute(): string
    {
        if (($this->medical_weight_kg ?? 0) > 0) {
            return 'Medical waste mixed with municipal waste. Use protective handling and isolate this collection.';
        }

        if (($this->hazardous_weight_kg ?? 0) > 0) {
            return 'Hazardous waste detected. Keep it separate from household waste and schedule safe disposal.';
        }

        if ($this->standing_water) {
            return 'Standing water near waste can increase mosquito and water-borne disease risk. Clear drainage and remove containers.';
        }

        if (($this->overflow_spots ?? 0) > 0 || ($this->missed_collection_days ?? 0) >= 2) {
            return 'Waste overflow or delayed collection may increase odor, pests, and disease-vector risk. Prioritize pickup.';
        }

        if (($this->odor_level ?? 0) >= 3) {
            return 'Strong odor reported. Check organic waste buildup and collection delay.';
        }

        $kgPerPersonPerDay = $this->kg_per_person_per_day;
        if ($kgPerPersonPerDay !== null && $kgPerPersonPerDay > self::NEPAL_REFERENCE_KG_PER_PERSON_DAY * 1.5) {
            return 'Waste generation is above the Nepal reference level. Review segregation and collection frequency.';
        }

        return 'No immediate waste health warning for this ward record.';
    }

    public function getNepalReferenceKgPerPersonDayAttribute(): float
    {
        return self::NEPAL_REFERENCE_KG_PER_PERSON_DAY;
    }

    public function getGlobalReferenceKgPerPersonDayAttribute(): float
    {
        return self::GLOBAL_REFERENCE_KG_PER_PERSON_DAY;
    }
}
