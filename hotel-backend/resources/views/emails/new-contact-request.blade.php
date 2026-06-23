@php
    $phoneHref = preg_replace('/[^0-9+]/', '', $contactMessage->phone ?? '');
    $sentAt = optional($contactMessage->created_at)->timezone('Europe/Warsaw')->format('d.m.Y H:i');
@endphp
<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nowe zapytanie ze strony Hotel Lux</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;margin:0;padding:24px 0;">
        <tr>
            <td align="center" style="padding:0 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4dacb;">
                    <tr>
                        <td style="background:#111827;padding:28px 32px;text-align:center;">
                            <div style="font-family:Georgia,'Times New Roman',serif;color:#f6d28b;font-size:28px;letter-spacing:3px;font-weight:bold;">HOTEL LUX</div>
                            <div style="color:#d1d5db;font-size:13px;margin-top:8px;letter-spacing:1px;text-transform:uppercase;">hotel-lux.pl</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="margin:0 0 10px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#111827;">Nowe zapytanie ze strony internetowej</h1>
                            <p style="margin:0 0 24px;color:#5f6b7a;font-size:15px;line-height:1.6;">Klient przesłał formularz kontaktowy Hotel Lux. Kliknięcie „Odpowiedz” utworzy wiadomość bezpośrednio do klienta.</p>

                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;width:34%;font-size:14px;">Imię i nazwisko</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-weight:bold;font-size:15px;">{{ $contactMessage->name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">E-mail</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;"><a href="mailto:{{ $contactMessage->email }}" style="color:#0f766e;text-decoration:none;font-weight:bold;">{{ $contactMessage->email }}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Telefon</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;"><a href="tel:{{ $phoneHref }}" style="color:#0f766e;text-decoration:none;font-weight:bold;">{{ $contactMessage->phone }}</a></td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Wybrany pokój</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">Nie podano w formularzu kontaktowym</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Termin pobytu</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">Nie podano w formularzu kontaktowym</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Liczba gości</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">Nie podano w formularzu kontaktowym</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Data wysłania</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">{{ $sentAt }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Źródło</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">hotel-lux.pl</td>
                                </tr>
                            </table>

                            <div style="margin-top:24px;padding:20px;background:#faf7f0;border:1px solid #eadfce;border-radius:10px;">
                                <div style="font-weight:bold;color:#111827;margin-bottom:10px;">Treść wiadomości</div>
                                <div style="white-space:pre-line;color:#374151;font-size:15px;line-height:1.7;">{{ $contactMessage->message }}</div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#111827;color:#d1d5db;padding:18px 32px;text-align:center;font-size:13px;">
                            Hotel Lux | ul. Morska 15, 80-001 Gdańsk | kontakt@hotel-lux.pl
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
