<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'name' => $this->cleanText($this->input('name')),
            'email' => strtolower($this->cleanText($this->input('email')) ?? ''),
            'phone' => $this->cleanText($this->input('phone')),
            'message' => $this->cleanText($this->input('message')),
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'regex:/^[\pL\pM\s\'-]+$/u'],
            'email' => ['required', 'email:rfc,dns', 'max:255'],
            'phone' => ['required', 'string', 'max:30', 'regex:/^\+?[0-9\s-]{9,30}$/'],
            'message' => ['required', 'string', 'max:1000'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Podaj imię i nazwisko.',
            'name.regex' => 'Imię i nazwisko może zawierać litery, spacje, apostrof i myślnik.',
            'email.required' => 'Podaj adres e-mail.',
            'email.email' => 'Podaj poprawny adres e-mail.',
            'phone.required' => 'Podaj numer telefonu.',
            'phone.regex' => 'Podaj poprawny numer telefonu.',
            'message.required' => 'Wpisz treść wiadomości.',
            'message.max' => 'Wiadomość może mieć maksymalnie 1000 znaków.',
        ];
    }

    private function cleanText(mixed $value): ?string
    {
        if ($value === null) {
            return null;
        }

        return trim(strip_tags((string) $value));
    }
}
