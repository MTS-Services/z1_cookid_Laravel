<?php

namespace App\Http\Controllers\Auth\User;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\UserOtpMail;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class UserOtpController extends Controller
{
    public function showOtpVerify(Request $request): Response|RedirectResponse
    {
        $email = $request->query('email') ?? $request->session()->get('user_email');
        $user = $email ? User::where('email', $email)->first() : null;

        if (! $email || ! $user) {
            return redirect()->route('user.auth.login')
                ->with('error', 'Please enter your email first.');
        }

        return Inertia::render('auth/otp-verify', [
            'email' => $email,
            'expires_at' => $user->otp_expires_at?->toIso8601String(),
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => 'User not found.',
            ]);
        }

        $isValid = $user->otp_code && hash_equals((string) $user->otp_code, (string) $validated['otp']);
        $isExpired = ! $user->otp_expires_at || $user->otp_expires_at->isPast();

        if (! $isValid || $isExpired) {
            throw ValidationException::withMessages([
                'otp' => 'The provided OTP is invalid or has expired.',
            ]);
        }

        $user->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'otp_verified_at' => now(),
        ]);

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended(route('user.dashboard'));
    }

    public function resend(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || $user->status !== ActiveInactiveStatus::ACTIVE) {
            throw ValidationException::withMessages([
                'email' => 'Account is inactive or not found.',
            ]);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $user->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::LOGIN,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($user->email)->send(new UserOtpMail($user, $otp));

        return redirect()->route('user.auth.otp-verify', [
            'email' => $user->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ])->with('message', 'A new OTP has been sent.');
    }
}
