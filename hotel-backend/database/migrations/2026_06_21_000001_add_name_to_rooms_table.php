<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->string('name')->nullable()->after('id');
        });

        DB::table('rooms')->orderBy('id')->each(function ($room): void {
            DB::table('rooms')
                ->where('id', $room->id)
                ->update(['name' => 'Pokój ' . $room->room_number]);
        });
    }

    public function down(): void
    {
        Schema::table('rooms', function (Blueprint $table) {
            $table->dropColumn('name');
        });
    }
};
