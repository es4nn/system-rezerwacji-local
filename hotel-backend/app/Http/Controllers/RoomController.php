<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Booking;
use App\Services\RoomImageOptimizer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class RoomController extends Controller
{
    public function index()
    {
        $rooms = Room::all();
        return response()->json($rooms);
    }

    public function show($id)
    {
        return response()->json(Room::findOrFail($id));
    }

    public function searchAvailableRooms(Request $request)
    {
        $validated = $request->validate([
            'check_in' => 'required|date',
            'check_out' => 'required|date|after:check_in',
        ], [
            'check_in.required' => 'Wybierz datę przyjazdu.',
            'check_out.required' => 'Wybierz datę wyjazdu.',
            'check_out.after' => 'Data wyjazdu musi być późniejsza niż data przyjazdu.',
        ]);

        $checkIn = $validated['check_in'];
        $checkOut = $validated['check_out'];

        $rooms = Room::whereDoesntHave('bookings', function ($query) use ($checkIn, $checkOut) {
            $query->whereIn('status', ['active', 'confirmed'])
                ->where('check_in', '<', $checkOut)
                ->where('check_out', '>', $checkIn);
        })->get();

        return response()->json($rooms);
    }

    // TWORZENIE NOWEGO POKOJU
    public function store(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Brak uprawnień'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'room_number' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'main_image' => 'nullable|image|max:2048', // max 2MB
            'image' => 'nullable|image|max:2048',
        ], $this->roomValidationMessages());
        unset($validated['image']);

        // Jeśli użytkownik wrzucił plik
        $imageFile = $request->file('main_image') ?: $request->file('image');
        if ($imageFile) {
            // Zapisz w folderze public/rooms i dopisz ścieżkę do bazy
            $path = app(RoomImageOptimizer::class)->storeUploadedImage($imageFile);
            $validated['main_image'] = $path;
        }

        try {
            $room = Room::create($validated);
            return response()->json(['message' => 'Pokój dodany!', 'room' => $room], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Błąd zapisu: ' . $e->getMessage()], 500);
        }
    }

    // AKTUALIZACJA POKOJU (EDYCJA)
    public function update(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Brak uprawnień'], 403);
        }

        $room = Room::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'room_number' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'price_per_night' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'main_image' => 'nullable|image|max:2048',
            'image' => 'nullable|image|max:2048',
        ], $this->roomValidationMessages());
        unset($validated['main_image'], $validated['image']);

        // Jeśli wgrano nowe zdjęcie, podmieniamy je
        $imageFile = $request->file('main_image') ?: $request->file('image');
        if ($imageFile) {
            if ($storedPath = $room->getStoredMainImagePath()) {
                Storage::disk('public')->delete($storedPath);
                $this->deleteRoomImageVariants($storedPath);
            }

            $path = app(RoomImageOptimizer::class)->storeUploadedImage($imageFile);
            $validated['main_image'] = $path;
        }

        $room->update($validated);

        return response()->json([
            'message' => 'Pokój został zaktualizowany!',
            'room' => $room
        ]);
    }

    // USUWANIE POKOJU
    public function destroy(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Brak uprawnień'], 403);
        }

        $room = Room::findOrFail($id);
        if ($storedPath = $room->getStoredMainImagePath()) {
            Storage::disk('public')->delete($storedPath);
            $this->deleteRoomImageVariants($storedPath);
        }
        $room->delete();

        return response()->json(['message' => 'Pokój został usunięty']);
    }

    // --- REZERWACJE ---

    public function storeBooking(Request $request)
    {
        \Log::info('Dane z Angulara:', $request->all());

        $validated = $request->validate([
            'room_id'       => 'required|exists:rooms,id',
            'customer_name' => 'required|string|max:255',
            'check_in'      => 'required|date',
            'check_out'     => 'required|date|after:check_in',
            'total_price'   => 'required|numeric'
        ], [
            'customer_name.required' => 'To pole jest wymagane.',
            'check_in.required' => 'Wybierz datę przyjazdu.',
            'check_out.required' => 'Wybierz datę wyjazdu.',
            'check_out.after' => 'Data wyjazdu musi być późniejsza niż data przyjazdu.',
        ]);

        $isRoomBooked = Booking::where('room_id', $validated['room_id'])
            ->where('status', '!=', 'cancelled')
            ->where(function ($query) use ($validated) {
                $query->where('check_in', '<', $validated['check_out'])
                    ->where('check_out', '>', $validated['check_in']);
            })
            ->exists();

        if ($isRoomBooked) {
            return response()->json([
                'message' => 'Ten pokój jest już zarezerwowany w wybranym terminie.'
            ], 422);
        }

        // Dodajemy ID zalogowanego użytkownika
        $validated['user_id'] = $request->user()->id;
        $validated['status'] = 'active';

        try {
            $booking = Booking::create($validated);
            return response()->json([
                'message' => 'Sukces!',
                'booking' => $booking
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Błąd bazy: ' . $e->getMessage()], 500);
        }
    }

    public function allBookings(Request $request)
    {
        $bookings = Booking::with('room')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($bookings);
    }

    public function adminBookings(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Brak uprawnień'], 403);
        }

        $bookings = Booking::with(['room', 'user'])
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function updateBookingStatus(Request $request, $id)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Brak uprawnień'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:active,confirmed,cancelled'
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Status rezerwacji został zaktualizowany',
            'booking' => $booking->load(['room', 'user'])
        ]);
    }

    public function getStats(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['message' => 'Brak uprawnień'], 403);
        }

        $year = (int) $request->query('year', now()->year);

        $monthlyRevenue = Booking::query()
            ->selectRaw('MONTH(check_in) as month')
            ->selectRaw('SUM(total_price) as revenue')
            ->whereIn('status', ['active', 'confirmed'])
            ->whereYear('check_in', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('revenue', 'month');

        $monthlyBookingCounts = Booking::query()
            ->selectRaw('MONTH(check_in) as month')
            ->selectRaw('COUNT(*) as bookings_count')
            ->whereIn('status', ['active', 'confirmed'])
            ->whereYear('check_in', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('bookings_count', 'month');

        $labels = [
            'Styczeń',
            'Luty',
            'Marzec',
            'Kwiecień',
            'Maj',
            'Czerwiec',
            'Lipiec',
            'Sierpień',
            'Wrzesień',
            'Październik',
            'Listopad',
            'Grudzień',
        ];

        $revenue = collect(range(1, 12))
            ->map(fn ($month) => (float) ($monthlyRevenue[$month] ?? 0))
            ->values();

        $bookingCounts = collect(range(1, 12))
            ->map(fn ($month) => (int) ($monthlyBookingCounts[$month] ?? 0))
            ->values();

        $years = Booking::query()
            ->selectRaw('YEAR(check_in) as year')
            ->whereIn('status', ['active', 'confirmed'])
            ->distinct()
            ->orderBy('year', 'desc')
            ->pluck('year')
            ->map(fn ($value) => (int) $value)
            ->values();

        return response()->json([
            'year' => $year,
            'years' => $years,
            'labels' => $labels,
            'revenue' => $revenue,
            'booking_counts' => $bookingCounts,
        ]);
    }

    public function getRoomAvailability($id)
    {
        // Pobieramy zajęte terminy, pomijając tylko anulowane rezerwacje.
        $bookings = Booking::where('room_id', $id)
            ->where('status', '!=', 'cancelled')
            ->where('check_out', '>=', now())
            ->get(['check_in', 'check_out']);

        return response()->json($bookings);
    }

    public function cancelBooking(Request $request, $id)
    {
        $booking = Booking::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$booking) {
            return response()->json(['message' => 'Nie znaleziono rezerwacji'], 404);
        }

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Rezerwacja została anulowana']);
    }

    private function deleteRoomImageVariants(string $storedPath): void
    {
        $optimizer = app(RoomImageOptimizer::class);

        foreach (['thumb', 'card', 'detail'] as $variant) {
            if ($variantPath = $optimizer->variantPath($storedPath, $variant)) {
                Storage::disk('public')->delete($variantPath);
            }
        }
    }

    private function roomValidationMessages(): array
    {
        return [
            'name.required' => 'Nazwa pokoju jest wymagana.',
            'room_number.required' => 'Numer pokoju jest wymagany.',
            'capacity.required' => 'Liczba miejsc jest wymagana.',
            'capacity.min' => 'Liczba miejsc musi być większa od zera.',
            'price_per_night.required' => 'Cena jest wymagana.',
            'price_per_night.numeric' => 'Podaj poprawną cenę.',
            'description.string' => 'Opis musi być tekstem.',
            'main_image.image' => 'Wybierz poprawny plik obrazu.',
            'main_image.max' => 'Zdjęcie może mieć maksymalnie 2 MB.',
        ];
    }
}
