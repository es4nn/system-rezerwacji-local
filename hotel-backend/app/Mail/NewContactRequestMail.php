<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewContactRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $contactMessage)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address', config('mail.admin_address')), config('mail.from.name', 'Hotel Lux')),
            replyTo: [
                new Address($this->contactMessage->email, $this->contactMessage->name),
            ],
            subject: 'Nowe zapytanie ze strony Hotel Lux – '.$this->contactMessage->name,
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-contact-request',
        );
    }
}
