@php
    $sentAt = optional($contactMessage->created_at)->timezone('Europe/Warsaw')->format('d.m.Y H:i');
@endphp
<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Otrzymaliśmy Twoje zapytanie – Hotel Lux</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;margin:0;padding:24px 0;">
        <tr>
            <td align="center" style="padding:0 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:680px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4dacb;">
                    <tr>
                        <td style="background:#111827;padding:28px 32px;text-align:center;">
                            <div style="font-family:Georgia,'Times New Roman',serif;color:#f6d28b;font-size:28px;letter-spacing:3px;font-weight:bold;">HOTEL LUX</div>
                            <div style="color:#d1d5db;font-size:13px;margin-top:8px;letter-spacing:1px;text-transform:uppercase;">Dziękujemy za kontakt</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;color:#111827;">Otrzymaliśmy Twoje zapytanie</h1>
                            <p style="margin:0 0 18px;color:#374151;font-size:16px;line-height:1.7;">Dziękujemy za kontakt z Hotel Lux. Obsługa hotelu skontaktuje się z Tobą możliwie szybko.</p>
                            <p style="margin:0 0 24px;padding:16px;background:#faf7f0;border-left:4px solid #c9a45c;color:#374151;font-size:15px;line-height:1.7;">Otrzymaliśmy Twoje zapytanie. Wiadomość nie stanowi jeszcze potwierdzenia rezerwacji. Obsługa Hotel Lux skontaktuje się z Tobą w celu potwierdzenia dostępności oraz szczegółów pobytu.</p>

                            <h2 style="margin:0 0 12px;font-size:18px;color:#111827;">Podsumowanie wiadomości</h2>
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;width:34%;font-size:14px;">Imię i nazwisko</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-weight:bold;font-size:15px;">{{ $contactMessage->name }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">E-mail</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">{{ $contactMessage->email }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Telefon</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">{{ $contactMessage->phone }}</td>
                                </tr>
                                <tr>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;color:#6b7280;font-size:14px;">Data wysłania</td>
                                    <td style="padding:12px 0;border-top:1px solid #eee7dc;font-size:15px;">{{ $sentAt }}</td>
                                </tr>
                            </table>

                            <div style="margin-top:24px;padding:20px;background:#faf7f0;border:1px solid #eadfce;border-radius:10px;">
                                <div style="font-weight:bold;color:#111827;margin-bottom:10px;">Twoja wiadomość</div>
                                <div style="white-space:pre-line;color:#374151;font-size:15px;line-height:1.7;">{{ $contactMessage->message }}</div>
                            </div>

                            <p style="margin:24px 0 0;color:#374151;font-size:15px;line-height:1.7;">W razie potrzeby możesz odpisać na tę wiadomość lub skontaktować się z nami pod adresem <a href="mailto:kontakt@hotel-lux.pl" style="color:#0f766e;text-decoration:none;font-weight:bold;">kontakt@hotel-lux.pl</a> albo telefonicznie: <a href="tel:+48123456789" style="color:#0f766e;text-decoration:none;font-weight:bold;">+48 123 456 789</a>.</p>
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
