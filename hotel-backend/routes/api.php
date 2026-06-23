<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\NewsletterController;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// 1. TRASY PUBLICZNE

// POKOJE
Route::get('/rooms', [RoomController::class, 'index']);
Route::get('/rooms/search/available', [RoomController::class, 'searchAvailableRooms']);
Route::get('/rooms/{id}/availability', [RoomController::class, 'getRoomAvailability']);
Route::get('/rooms/{id}', [RoomController::class, 'show']);

// LOGOWANIE
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ], [
        'email.required' => 'To pole jest wymagane.',
        'email.email' => 'Podaj poprawny adres e-mail.',
        'password.required' => 'Hasło jest wymagane.',
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user) {
        return response()->json(['message' => 'Nieprawidłowy adres e-mail lub hasło.'], 401);
    }

    if (! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Nieprawidłowy adres e-mail lub hasło.'], 401);
    }

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user
    ]);
});

// REJESTRACJA
Route::post('/register', [AuthController::class, 'register']);

// KONTAKT
Route::post('/contact', [ContactMessageController::class, 'store'])->middleware('throttle:5,1');
Route::post('/newsletter', [NewsletterController::class, 'store'])->middleware('throttle:5,1');

// 2. TRASY CHRONIONE
Route::middleware('auth:sanctum')->group(function () {

    // Pobieranie danych zalogowanego użytkownika
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Wylogowanie
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Wylogowano']);
    });

    // REZERWACJE
    Route::post('/rooms', [RoomController::class, 'store']);
    Route::post('/rooms/{id}', [RoomController::class, 'update']);
    Route::delete('/rooms/{id}', [RoomController::class, 'destroy']);
    Route::post('/bookings', [RoomController::class, 'storeBooking']);
    Route::get('/bookings', [RoomController::class, 'allBookings']);
    Route::delete('/bookings/{id}', [RoomController::class, 'cancelBooking']);
    Route::get('/admin/bookings', [RoomController::class, 'adminBookings']);
    Route::patch('/admin/bookings/{id}/status', [RoomController::class, 'updateBookingStatus']);
    Route::get('/admin/stats', [RoomController::class, 'getStats']);
});
