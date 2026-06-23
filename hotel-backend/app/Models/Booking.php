<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Dodano 'user_id'
    protected $fillable = [
        'room_id',
        'user_id', 
        'customer_name',
        'check_in',
        'check_out',
        'total_price',
        'status'
    ];

    // Relacja: Rezerwacja przypisana do konkretnego pokoju
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    // Relacja: Rezerwacja przypisana do konkretnego użytkownika
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}