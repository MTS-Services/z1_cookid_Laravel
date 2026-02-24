<?php

namespace App\Http\Controllers\Auth\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Enums\OtpPurpose;
use App\Enums\ActiveInactiveStatus;
use App\Mail\Otp\VendorOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VendorOtpController extends Controller
{
    /**
     * Show OTP Verify Page
     */
    public function showOtpVerify(Request $request)
    {
        $email = $request->query('email') ?? session('vendor_email');

        // Find the vendor to get the actual database expiration time
        $vendor = Vendor::where('email', $email)->first();

        if (!$email || !$vendor) {
            return redirect()->route('vendor.auth.login')
                ->with('error', 'Please enter your email first.');
        }

        return Inertia::render('vendor/auth/otp-verify', [
            'email' => $email,
            // Pass ISO 8601 string for reliable JS parsing
            'expires_at' => $vendor->otp_expires_at?->toIso8601String(),
        ]);
    }

    /**
     * Verify OTP
     */
    public function verify(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp'   => ['required', 'digits:6'],
        ]);

        $vendor = Vendor::where('email', $request->email)->first();

        if (!$vendor) {
            throw ValidationException::withMessages(['email' => 'Vendor not found.']);
        }

        $isValid = $vendor->otp_code && hash_equals((string)$vendor->otp_code, (string)$request->otp);
        $isExpired = !$vendor->otp_expires_at || $vendor->otp_expires_at->isPast();

        if (!$isValid || $isExpired) {
            throw ValidationException::withMessages([
                'otp' => 'The provided OTP is invalid or has expired.',
            ]);
        }

        $vendor->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'otp_verified_at' => now(),
        ]);

        Auth::guard('vendor')->login($vendor);
        // Regenerate the session to prevent fixation
        $request->session()->regenerate();

        // Use intended() to ensure Inertia handles the redirect smoothly
        return redirect()->intended(route('vendor.dashboard'));
    }

    /**
     * Resend OTP
     */
    public function resend(Request $request)
    {
        $request->validate(['email' => ['required', 'email']]);

        $vendor = Vendor::where('email', $request->email)->first();

        if (!$vendor || $vendor->status !== ActiveInactiveStatus::ACTIVE) {
            throw ValidationException::withMessages(['email' => 'Account is inactive or not found.']);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $vendor->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::LOGIN,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($vendor->email)->send(new VendorOtpMail($vendor, $otp));

        // Redirect back with the new expiry timestamp in the query params
        return redirect()->route('vendor.auth.otp-verify', [
            'email' => $vendor->email,
            'expires_at' => $expiresAt->toIso8601String()
        ])->with('message', 'A new OTP has been sent.');
    }
}
