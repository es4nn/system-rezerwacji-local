<?php

namespace App\Mail;

use App\Models\Newsletter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Newsletter $newsletter)
    {
    }

    public function envelope(): Envelope
    {
        $receptionEmail = config('mail.admin_address');

        return new Envelope(
            from: new Address(config('mail.from.address', $receptionEmail), config('mail.from.name', 'Hotel Lux')),
            replyTo: [
                new Address($receptionEmail, 'Hotel Lux'),
            ],
            subject: 'Witaj w newsletterze Hotel Lux',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-confirmation',
        );
    }
}
