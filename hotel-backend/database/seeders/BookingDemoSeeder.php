<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class BookingDemoSeeder extends Seeder
{
    public function run(): void
    {
        $client = User::where('email', 'klient@hotel-lux.local')->first();

        if (! $client) {
            return;
        }

        $rooms = Room::query()->orderBy('room_number')->get()->keyBy('room_number');

        $bookings = [
            [
                'room_number' => '101',
                'customer_name' => 'Klient Testowy',
                'check_in' => now()->addDays(7)->toDateString(),
                'check_out' => now()->addDays(10)->toDateString(),
                'status' => 'confirmed',
            ],
            [
                'room_number' => '201',
                'customer_name' => 'Klient Testowy',
                'check_in' => now()->addDays(14)->toDateString(),
                'check_out' => now()->addDays(16)->toDateString(),
                'status' => 'active',
            ],
            [
                'room_number' => '301',
                'customer_name' => 'Klient Testowy',
                'check_in' => now()->subDays(20)->toDateString(),
                'check_out' => now()->subDays(17)->toDateString(),
                'status' => 'confirmed',
            ],
        ];

        foreach ($bookings as $booking) {
            $room = $rooms->get($booking['room_number']);

            if (! $room) {
                continue;
            }

            $nights = Carbon::parse($booking['check_in'])->diffInDays(Carbon::parse($booking['check_out']));

            Booking::updateOrCreate(
                [
                    'room_id' => $room->id,
                    'check_in' => $booking['check_in'],
                    'customer_name' => $booking['customer_name'],
                ],
                [
                    'user_id' => $client->id,
                    'check_out' => $booking['check_out'],
                    'total_price' => $room->price_per_night * max(1, $nights),
                    'status' => $booking['status'],
                ]
            );
        }
    }
}
