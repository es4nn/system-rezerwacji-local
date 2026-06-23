<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Models\Room;
use App\Services\RoomImageOptimizer;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('rooms:optimize-images', function () {
    $optimizer = app(RoomImageOptimizer::class);
    $optimized = 0;
    $skipped = 0;
    $failed = 0;

    Room::query()
        ->whereNotNull('main_image')
        ->chunkById(50, function ($rooms) use ($optimizer, &$optimized, &$skipped, &$failed) {
            foreach ($rooms as $room) {
                $path = $room->getStoredMainImagePath();

                if (! $path) {
                    $skipped++;
                    continue;
                }

                try {
                    $optimizer->createVariants($path);
                    $optimized++;
                    $this->line("OK: room {$room->id} ({$path})");
                } catch (Throwable $exception) {
                    $failed++;
                    $this->warn("SKIP: room {$room->id} ({$path}) - {$exception->getMessage()}");
                }
            }
        });

    $this->info("Zakonczono. Zoptymalizowane: {$optimized}, pominiete: {$skipped}, bledy: {$failed}.");
})->purpose('Create WebP card/detail variants for existing room images');
