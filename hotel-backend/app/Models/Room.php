<?php

namespace App\Models;

use App\Services\RoomImageOptimizer;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Room extends Model
{
    use HasFactory;

    protected $appends = [
        'main_image_url',
        'main_image_thumb_url',
        'main_image_card_url',
        'main_image_detail_url',
        'main_image_srcset',
    ];

    // Zezwalamy na zapisywanie tych kolumn z formularza
    protected $fillable = [
        'name',
        'room_number', 
        'capacity', 
        'price_per_night', 
        'description',
        'main_image'
    ];

    public function getMainImageUrlAttribute(): ?string
    {
        if ($detailUrl = $this->getMainImageDetailUrlAttribute()) {
            return $detailUrl;
        }

        if (! $this->main_image) {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $this->main_image)) {
            $path = parse_url($this->main_image, PHP_URL_PATH);

            if (is_string($path) && str_starts_with($path, '/storage/')) {
                return rtrim(config('filesystems.disks.public.url'), '/').'/'.ltrim(substr($path, strlen('/storage/')), '/');
            }

            return $this->main_image;
        }

        return rtrim(config('filesystems.disks.public.url'), '/').'/'.ltrim(preg_replace('#^/?storage/#', '', $this->main_image), '/');
    }

    public function getMainImageThumbUrlAttribute(): ?string
    {
        return $this->variantUrl('thumb') ?: $this->variantUrl('card');
    }

    public function getMainImageCardUrlAttribute(): ?string
    {
        return $this->variantUrl('card');
    }

    public function getMainImageDetailUrlAttribute(): ?string
    {
        return $this->variantUrl('detail');
    }

    public function getMainImageSrcsetAttribute(): ?string
    {
        $thumb = $this->getMainImageThumbUrlAttribute();
        $detail = $this->getMainImageDetailUrlAttribute();

        if (! $thumb || ! $detail) {
            return null;
        }

        $card = $this->getMainImageCardUrlAttribute() ?: $thumb;

        return "{$thumb} 320w, {$card} 640w, {$detail} 1200w";
    }

    public function getStoredMainImagePath(): ?string
    {
        if (! $this->main_image || preg_match('/^https?:\/\//i', $this->main_image)) {
            return null;
        }

        return ltrim(preg_replace('#^/?storage/#', '', $this->main_image), '/');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    private function variantUrl(string $variant): ?string
    {
        if (! $this->main_image || preg_match('/^https?:\/\//i', $this->main_image)) {
            return null;
        }

        $path = app(RoomImageOptimizer::class)->variantPath($this->main_image, $variant);

        if (! $path || ! Storage::disk('public')->exists($path)) {
            return null;
        }

        return rtrim(config('filesystems.disks.public.url'), '/').'/'.ltrim($path, '/');
    }
}
