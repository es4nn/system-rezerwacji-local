<?php

namespace Tests\Feature;

use App\Mail\ContactConfirmationMail;
use App\Mail\NewContactRequestMail;
use App\Mail\NewsletterConfirmationMail;
use App\Mail\NewsletterSubscribedMail;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class MailRecipientTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_form_sends_admin_and_customer_mails_to_correct_recipients(): void
    {
        Mail::fake();

        $customerEmail = 'hotel.lux.client@gmail.com';
        $this->assertNull(config('mail.to.address'));

        $this->postJson('/api/contact', [
            'name' => 'Jan Kowalski',
            'email' => $customerEmail,
            'phone' => '48123456789',
            'message' => 'Prosze o kontakt w sprawie rezerwacji.',
        ])->assertCreated();

        Mail::assertSent(NewContactRequestMail::class, function (NewContactRequestMail $mail) use ($customerEmail) {
            return $mail->hasTo(config('mail.admin_address'))
                && $mail->hasReplyTo($customerEmail);
        });

        Mail::assertSent(ContactConfirmationMail::class, function (ContactConfirmationMail $mail) use ($customerEmail) {
            return $mail->hasTo($customerEmail)
                && $mail->hasReplyTo(config('mail.admin_address'))
                && ! $mail->hasTo(config('mail.admin_address'));
        });
    }

    public function test_newsletter_sends_admin_and_subscriber_mails_to_correct_recipients(): void
    {
        Mail::fake();

        $subscriberEmail = 'hotel.lux.subscriber@gmail.com';
        $this->assertNull(config('mail.to.address'));

        $this->postJson('/api/newsletter', [
            'email' => $subscriberEmail,
        ])->assertCreated();

        Mail::assertSent(NewsletterSubscribedMail::class, function (NewsletterSubscribedMail $mail) use ($subscriberEmail) {
            return $mail->hasTo(config('mail.admin_address'))
                && $mail->hasReplyTo($subscriberEmail);
        });

        Mail::assertSent(NewsletterConfirmationMail::class, function (NewsletterConfirmationMail $mail) use ($subscriberEmail) {
            return $mail->hasTo($subscriberEmail)
                && $mail->hasReplyTo(config('mail.admin_address'))
                && ! $mail->hasTo(config('mail.admin_address'));
        });
    }
}
