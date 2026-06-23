<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class RoomImageOptimizer
{
    public const THUMB_WIDTH = 320;
    public const THUMB_HEIGHT = 240;
    public const CARD_WIDTH = 640;
    public const CARD_HEIGHT = 480;
    public const DETAIL_WIDTH = 1200;
    public const DETAIL_HEIGHT = 800;
    private const CARD_WEBP_QUALITY = 56;

    public function storeUploadedImage(UploadedFile $file): string
    {
        $baseName = Str::uuid()->toString();
        $extension = strtolower($file->getClientOriginalExtension() ?: $file->extension() ?: 'jpg');
        $originalPath = "rooms/originals/{$baseName}.{$extension}";

        Storage::disk('public')->putFileAs('rooms/originals', $file, "{$baseName}.{$extension}");

        try {
            $this->createVariants($originalPath);
        } catch (RuntimeException) {
            // Upload pokoju nie powinien przestac dzialac, jesli hosting nie ma GD/WebP.
        }

        return $originalPath;
    }

    public function createVariants(string $path): array
    {
        $this->assertGdSupport();

        $sourcePath = Storage::disk('public')->path($path);

        if (! is_file($sourcePath)) {
            throw new RuntimeException("Brak pliku: {$path}");
        }

        $thumbPath = $this->variantPath($path, 'thumb');
        $cardPath = $this->variantPath($path, 'card');
        $detailPath = $this->variantPath($path, 'detail');

        $this->resizeToWebp($sourcePath, Storage::disk('public')->path($thumbPath), self::THUMB_WIDTH, self::THUMB_HEIGHT, 76);
        $this->resizeToWebp(
            $sourcePath,
            Storage::disk('public')->path($cardPath),
            self::CARD_WIDTH,
            self::CARD_HEIGHT,
            self::CARD_WEBP_QUALITY
        );
        $this->resizeToWebp($sourcePath, Storage::disk('public')->path($detailPath), self::DETAIL_WIDTH, self::DETAIL_HEIGHT, 82);

        return [
            'thumb' => $thumbPath,
            'card' => $cardPath,
            'detail' => $detailPath,
        ];
    }

    public function variantPath(?string $path, string $variant): ?string
    {
        if (! $path || preg_match('/^https?:\/\//i', $path)) {
            return null;
        }

        $normalized = ltrim(preg_replace('#^/?storage/#', '', $path), '/');
        $directory = dirname($normalized);
        $baseName = pathinfo($normalized, PATHINFO_FILENAME);
        $baseName = preg_replace('/-(card|detail)$/', '', $baseName);

        if ($directory === '.' || $directory === 'rooms/originals') {
            $directory = 'rooms';
        }

        return "{$directory}/{$baseName}-{$variant}.webp";
    }

    private function resizeToWebp(string $sourcePath, string $targetPath, int $targetWidth, int $targetHeight, int $quality): void
    {
        [$sourceWidth, $sourceHeight, $imageType] = getimagesize($sourcePath) ?: [0, 0, 0];

        if ($sourceWidth <= 0 || $sourceHeight <= 0) {
            throw new RuntimeException("Nie mozna odczytac wymiarow obrazu: {$sourcePath}");
        }

        $source = match ($imageType) {
            IMAGETYPE_JPEG => imagecreatefromjpeg($sourcePath),
            IMAGETYPE_PNG => imagecreatefrompng($sourcePath),
            IMAGETYPE_WEBP => imagecreatefromwebp($sourcePath),
            default => throw new RuntimeException("Nieobslugiwany format obrazu: {$sourcePath}"),
        };

        if (! $source) {
            throw new RuntimeException("Nie mozna otworzyc obrazu: {$sourcePath}");
        }

        $targetRatio = $targetWidth / $targetHeight;
        $sourceRatio = $sourceWidth / $sourceHeight;

        if ($sourceRatio > $targetRatio) {
            $cropHeight = $sourceHeight;
            $cropWidth = (int) round($sourceHeight * $targetRatio);
        } else {
            $cropWidth = $sourceWidth;
            $cropHeight = (int) round($sourceWidth / $targetRatio);
        }

        $sourceX = max(0, (int) floor(($sourceWidth - $cropWidth) / 2));
        $sourceY = max(0, (int) floor(($sourceHeight - $cropHeight) / 2));

        $target = imagecreatetruecolor($targetWidth, $targetHeight);
        imagecopyresampled($target, $source, 0, 0, $sourceX, $sourceY, $targetWidth, $targetHeight, $cropWidth, $cropHeight);

        $targetDirectory = dirname($targetPath);
        if (! is_dir($targetDirectory)) {
            mkdir($targetDirectory, 0755, true);
        }

        imagewebp($target, $targetPath, $quality);

        imagedestroy($source);
        imagedestroy($target);
    }

    private function assertGdSupport(): void
    {
        if (! function_exists('imagewebp') || ! function_exists('imagecreatetruecolor')) {
            throw new RuntimeException('Na serwerze PHP musi byc wlaczone rozszerzenie GD z obsluga WebP.');
        }
    }
}
