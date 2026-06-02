<?php

namespace App\Http\Requests\Ward;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateWardRequest extends FormRequest
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
            'number' => ['required', 'integer', Rule::unique('wards')->ignore($this->route('ward'))],
            'name' => ['required', 'string', 'max:255'],
            'boundary' => ['nullable', 'string', 'json'],
        ];
    }
}
