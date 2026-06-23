<?php

namespace Database\Seeders;

use App\Models\Room;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class RoomSeeder extends Seeder
{
    public function run(): void
    {
        $rooms = [
            [
                'name' => 'Pokoj Standard',
                'room_number' => '101',
                'capacity' => 2,
                'price_per_night' => 190.00,
                'description' => 'Przytulny pokoj dwuosobowy z lazienka, biurkiem i widokiem na spokojna czesc hotelu.',
                'main_image' => $this->copyDemoImage('standard.svg'),
            ],
            [
                'name' => 'Pokoj Deluxe',
                'room_number' => '102',
                'capacity' => 2,
                'price_per_night' => 260.00,
                'description' => 'Jasny pokoj o podwyzszonym standardzie z wiekszym lozkiem, sofa i balkonem.',
                'main_image' => $this->copyDemoImage('deluxe.svg'),
            ],
            [
                'name' => 'Pokoj rodzinny',
                'room_number' => '201',
                'capacity' => 4,
                'price_per_night' => 340.00,
                'description' => 'Wygodny pokoj dla rodziny z dwiema strefami spania i miejscem do wspolnego odpoczynku.',
                'main_image' => $this->copyDemoImage('family.svg'),
            ],
            [
                'name' => 'Apartament z widokiem na jezioro',
                'room_number' => '301',
                'capacity' => 3,
                'price_per_night' => 520.00,
                'description' => 'Elegancki apartament z czescia wypoczynkowa, duzymi oknami i widokiem na jezioro.',
                'main_image' => $this->copyDemoImage('lake-apartment.svg'),
            ],
            [
                'name' => 'Apartament Premium z wanna',
                'room_number' => '401',
                'capacity' => 2,
                'price_per_night' => 680.00,
                'description' => 'Najbardziej komfortowy apartament z wanna wolnostojaca, salonem i zestawem powitalnym.',
                'main_image' => $this->copyDemoImage('premium-bath.svg'),
            ],
        ];

        foreach ($rooms as $room) {
            Room::updateOrCreate(
                ['room_number' => $room['room_number']],
                $room
            );
        }
    }

    private function copyDemoImage(string $fileName): string
    {
        $source = database_path("seeders/demo-images/{$fileName}");
        $target = "rooms/demo/{$fileName}";

        if (is_file($source)) {
            Storage::disk('public')->put($target, file_get_contents($source));
        }

        return $target;
    }
}
