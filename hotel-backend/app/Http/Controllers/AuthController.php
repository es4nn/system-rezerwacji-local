<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required' => 'Podaj imię i nazwisko.',
            'email.required' => 'Podaj adres e-mail.',
            'email.email' => 'Podaj poprawny adres e-mail.',
            'email.unique' => 'Konto z tym adresem e-mail już istnieje.',
            'password.required' => 'Hasło jest wymagane.',
            'password.min' => 'Hasło musi mieć minimum 8 znaków.',
            'password.confirmed' => 'Hasła muszą być takie same.',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'client',
        ]);

        return response()->json([
            'message' => 'Konto zostało utworzone pomyślnie.',
            'user' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        // 1. Sprawdzamy, czy przysłano email i hasło
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // 2. Próbujemy zalogować
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'message' => 'Błędne dane logowania'
            ], 401); // 401 oznacza brak autoryzacji
        }

        // 3. Jeśli się udało, pobieramy usera i generujemy token (Sanctum)
        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Odsyłamy token i dane usera do Angulara
        return response()->json([
            'message' => 'Zalogowano pomyślnie',
            'token' => $token,
            'user' => $user
        ]);
    }

    public function logout(Request $request)
    {
        // Usuwamy obecny token użytkownika
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'message' => 'Wylogowano pomyślnie'
        ]);
    }
}
