<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterConfirmationMail;
use App\Mail\NewsletterSubscribedMail;
use App\Models\Newsletter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class NewsletterController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255', 'unique:newsletters,email'],
        ]);

        $newsletter = Newsletter::create([
            'email' => strtolower(trim($validated['email'])),
        ]);
        $adminEmail = config('mail.admin_address');
        $subscriberEmail = $newsletter->email;

        try {
            Log::info('Newsletter mail recipients', [
                'admin_to' => $adminEmail,
                'subscriber_to' => $subscriberEmail,
            ]);

            Mail::to($adminEmail, 'Hotel Lux')->send(new NewsletterSubscribedMail($newsletter));
            Mail::to($subscriberEmail)->send(new NewsletterConfirmationMail($newsletter));
        } catch (Throwable $exception) {
            Log::error('Newsletter mail delivery failed.', [
                'newsletter_id' => $newsletter->id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Adres został zapisany, ale nie udało się wysłać wiadomości e-mail. Sprawdź konfigurację poczty.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Adres e-mail został zapisany do newslettera.',
            'newsletter' => $newsletter,
        ], 201);
    }
}
