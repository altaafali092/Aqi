<?php

namespace App\Http\Requests\MunicipalWaste;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateWasteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'ward_id' => ['required', 'exists:wards,id'],
            'waste_type' => ['required', 'string', 'max:255'],
            'weight_kg' => ['required', 'numeric'],
            'collection_date' => ['required', 'date'],
            'population_served' => ['nullable', 'integer', 'min:1'],
            'reporting_period_days' => ['nullable', 'integer', 'min:1', 'max:31'],
            'collection_status' => ['nullable', 'string', 'in:collected,partial,missed,overflowing'],
            'segregation_quality' => ['nullable', 'string', 'in:segregated,partially_segregated,mixed'],
            'organic_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'recyclable_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'hazardous_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'medical_weight_kg' => ['nullable', 'numeric', 'min:0'],
            'overflow_spots' => ['nullable', 'integer', 'min:0', 'max:255'],
            'odor_level' => ['nullable', 'integer', 'min:0', 'max:5'],
            'standing_water' => ['nullable', 'boolean'],
            'missed_collection_days' => ['nullable', 'integer', 'min:0', 'max:365'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
