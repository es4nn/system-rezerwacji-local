<?php

namespace Tests\Feature;

use App\Models\Room;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoomManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_room_name_is_required_and_returned_as_a_field_error(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $this->postJson('/api/rooms', [
            'room_number' => '101',
            'capacity' => 2,
            'price_per_night' => 350,
            'description' => 'Opis pokoju',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors(['name']);
    }

    public function test_admin_can_update_room_name_and_api_keeps_it(): void
    {
        Sanctum::actingAs(User::factory()->create(['role' => 'admin']));

        $room = Room::create([
            'name' => 'Stara nazwa',
            'room_number' => '202',
            'capacity' => 2,
            'price_per_night' => 400,
            'description' => 'Opis pokoju',
        ]);

        $this->postJson("/api/rooms/{$room->id}", [
            'name' => 'Apartament Premium z wanną',
            'room_number' => '202',
            'capacity' => 3,
            'price_per_night' => 525,
            'description' => 'Zmieniony opis',
        ])->assertOk()
            ->assertJsonPath('room.name', 'Apartament Premium z wanną');

        $this->assertDatabaseHas('rooms', [
            'id' => $room->id,
            'name' => 'Apartament Premium z wanną',
        ]);

        $this->getJson('/api/rooms')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Apartament Premium z wanną']);
    }
}
