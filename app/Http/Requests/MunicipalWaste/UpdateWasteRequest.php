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
        ];
    }
}
