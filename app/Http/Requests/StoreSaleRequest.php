<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSaleRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'payment_method' => ['required', 'string'],
            'payment_type' => ['required', Rule::in(['cash', 'debt'])],
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'string'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.subtotal' => ['required', 'numeric', 'min:0'],
            'total_amount' => ['required', 'numeric', 'min:0'],
        ];

        // Add conditional validation rules based on payment type
        if ($this->input('payment_type') === 'cash') {
            $rules['amount_paid'] = ['required', 'numeric', 'min:0'];
            $rules['change'] = ['required', 'numeric', 'min:0'];
        } else if ($this->input('payment_type') === 'debt') {
            $rules['debtor_id'] = ['required', 'exists:debtors,id'];
            // For debt payments, amount_paid is typically 0
            $rules['amount_paid'] = ['nullable', 'numeric', 'min:0'];
            $rules['change'] = ['nullable', 'numeric', 'min:0'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'debtor_id.required' => 'A debtor must be selected for debt payments.',
            'debtor_id.exists' => 'The selected debtor does not exist.',
            'payment_type.required' => 'Payment type is required.',
            'payment_type.in' => 'Payment type must be either cash or debt.',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // If payment_type is not provided but we have a debtor_id, assume it's a debt
        if (!$this->has('payment_type') && $this->has('debtor_id')) {
            $this->merge([
                'payment_type' => 'debt',
            ]);
        }

        // If payment_type is not provided and no debtor_id, assume it's cash
        if (!$this->has('payment_type') && !$this->has('debtor_id')) {
            $this->merge([
                'payment_type' => 'cash',
            ]);
        }
    }
}
