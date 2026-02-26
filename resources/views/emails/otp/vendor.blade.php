<!DOCTYPE html>
<html>
<head>
    <title>Verify Your Email</title>
</head>
<body>
    <h2>Hello {{ $vendor->first_name }},</h2>

    <p>We received a request to verify your email for <strong>{{ $vendor->shop_name }}</strong>.</p>

    <p>🔑 <strong>Your OTP Code: {{ $otpCode }}</strong></p>

    <p>This OTP is valid until: {{ $vendor->otp_expires_at->format('d-m-Y H:i') }}</p>

    <p>If you did not request this, please ignore this email.</p>

    <br>
    <p>Thank you,<br>The {{ $vendor->shop_name }} Team</p>
</body>
</html>