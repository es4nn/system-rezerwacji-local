<?php

namespace App\Mail;

use App\Models\Newsletter;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterSubscribedMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Newsletter $newsletter)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address', config('mail.admin_address')), config('mail.from.name', 'Hotel Lux')),
            replyTo: [
                new Address($this->newsletter->email),
            ],
            subject: 'Nowy zapis do newslettera - Hotel Lux',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter-subscribed',
        );
    }
}
