<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
</head>
<body style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2>Hello {{ $user->first_name }},</h2>

    <p>Welcome to <strong>{{ config('app.name') }}</strong>! We're glad you're here.</p>

    <p>You have successfully logged in to your account. If you have any questions or need assistance, feel free to reach out to our support team.</p>

    <p>Thank you for being part of our community.</p>

    <br>
    <p>Best regards,<br>The {{ config('app.name') }} Team</p>
</body>
</html>
