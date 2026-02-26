<?php

namespace App\Http\Controllers\Auth\Admin;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\AdminOtpMail;
use App\Models\Admin;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminOtpController extends Controller
{
    public function showOtpVerify(Request $request): Response|RedirectResponse
    {
        $email = $request->query('email') ?? $request->session()->get('admin_email');
        $admin = $email ? Admin::where('email', $email)->first() : null;

        if (! $email || ! $admin) {
            return redirect()->route('admin.login')
                ->with('error', 'Please enter your email first.');
        }

        return Inertia::render('admin/auth/otp-verify', [
            'email' => $email,
            'expires_at' => $admin->otp_expires_at?->toIso8601String(),
        ]);
    }

    public function verify(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'otp' => ['required', 'digits:6'],
        ]);

        $admin = Admin::where('email', $validated['email'])->first();

        if (! $admin) {
            throw ValidationException::withMessages([
                'email' => 'Admin not found.',
            ]);
        }

        $isValid = $admin->otp_code && hash_equals((string) $admin->otp_code, (string) $validated['otp']);
        $isExpired = ! $admin->otp_expires_at || $admin->otp_expires_at->isPast();

        if (! $isValid || $isExpired) {
            throw ValidationException::withMessages([
                'otp' => 'The provided OTP is invalid or has expired.',
            ]);
        }

        $admin->update([
            'otp_code' => null,
            'otp_expires_at' => null,
            'otp_verified_at' => now(),
        ]);

        Auth::guard('admin')->login($admin);
        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function resend(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
        ]);

        $admin = Admin::where('email', $validated['email'])->first();

        if (! $admin || $admin->status !== ActiveInactiveStatus::ACTIVE) {
            throw ValidationException::withMessages([
                'email' => 'Account is inactive or not found.',
            ]);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $admin->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::LOGIN,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($admin->email)->send(new AdminOtpMail($admin, $otp));

        return redirect()->route('admin.otp-verify', [
            'email' => $admin->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ])->with('message', 'A new OTP has been sent.');
    }
}
