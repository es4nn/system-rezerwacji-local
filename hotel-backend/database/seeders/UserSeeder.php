<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@hotel-lux.local'],
            [
                'name' => 'Administrator Hotel Lux',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['email' => 'klient@hotel-lux.local'],
            [
                'name' => 'Klient Testowy',
                'password' => Hash::make('password'),
                'role' => 'client',
            ]
        );
    }
}
