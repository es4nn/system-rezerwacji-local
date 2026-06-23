<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactRequest;
use App\Mail\ContactConfirmationMail;
use App\Mail\NewContactRequestMail;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactMessageController extends Controller
{
    public function store(ContactRequest $request)
    {
        $contactMessage = ContactMessage::create($request->validated());
        $adminEmail = config('mail.admin_address');
        $clientEmail = $contactMessage->email;

        try {
            Log::info('Contact mail recipients', [
                'admin_to' => $adminEmail,
                'client_to' => $clientEmail,
            ]);

            Mail::to($adminEmail, 'Hotel Lux')->send(new NewContactRequestMail($contactMessage));
            Mail::to($clientEmail)->send(new ContactConfirmationMail($contactMessage));
        } catch (Throwable $exception) {
            Log::error('Contact form mail delivery failed.', [
                'contact_message_id' => $contactMessage->id,
                'exception' => $exception::class,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Nie udało się wysłać formularza. Spróbuj ponownie lub skontaktuj się z nami telefonicznie.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Wiadomość została wysłana.',
        ], 201);
    }
}
