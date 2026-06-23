<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('reservations', function (Blueprint $table) {
        $table->id();
        // Klucze obce:
        $table->foreignId('user_id')->constrained()->onDelete('cascade');
        $table->foreignId('room_id')->constrained()->onDelete('cascade');
        
        $table->date('check_in_date'); // Data przyjazdu
        $table->date('check_out_date'); // Data wyjazdu
        $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending'); // Status
        $table->decimal('total_price', 8, 2); // Pełna kwota
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
