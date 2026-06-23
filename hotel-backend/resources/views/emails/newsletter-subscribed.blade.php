<!doctype html>
<html lang="pl">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Nowy zapis do newslettera Hotel Lux</title>
</head>
<body style="margin:0;padding:0;background:#f4f1ea;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;margin:0;padding:24px 0;">
        <tr>
            <td align="center" style="padding:0 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e4dacb;">
                    <tr>
                        <td style="background:#111827;padding:26px 30px;text-align:center;">
                            <div style="font-family:Georgia,'Times New Roman',serif;color:#f6d28b;font-size:26px;letter-spacing:3px;font-weight:bold;">HOTEL LUX</div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:30px;">
                            <h1 style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:26px;color:#111827;">Nowy zapis do newslettera</h1>
                            <p style="margin:0 0 18px;color:#374151;font-size:15px;line-height:1.7;">Do newslettera Hotel Lux zapisał się nowy adres e-mail.</p>
                            <p style="margin:0;padding:16px;background:#faf7f0;border:1px solid #eadfce;border-radius:10px;font-size:16px;">
                                <strong>E-mail:</strong>
                                <a href="mailto:{{ $newsletter->email }}" style="color:#0f766e;text-decoration:none;font-weight:bold;">{{ $newsletter->email }}</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
