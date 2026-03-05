<?php

namespace App\Http\Controllers\Auth\User;

use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\UserOtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ForgetPassword extends Controller
{
    public function forgotPassword()
    {
        return Inertia::render('auth/forgot-password');
    }

    public function forgotPasswordOtpVerify(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return redirect()->back()->with('error', 'User not found');
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $user->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::PASSWORD_RESET,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($user->email)->send(new UserOtpMail($user, $otp));
        $request->session()->put('user_email', $user->email);

        return redirect()->route('user.auth.otp-verify', [
            'email' => $user->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function forgotPasswordReset()
    {
        $email = session('user_email');

        if (! $email) {
            return redirect()->route('user.auth.forgot-password')->with('error', 'Please start the password reset process again');
        }

        return Inertia::render('auth/confirm-password', [
            'email' => $email,
        ]);
    }

    public function forgotPasswordResetStore(Request $request)
    {
        $sessionEmail = session('user_email');

        if (! $sessionEmail) {
            return redirect()->route('user.auth.forgot-password')->with('error', 'Please start the password reset process again');
        }

        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        // Verify the email matches the session email (security check)
        if ($request->email !== $sessionEmail) {
            return redirect()->back()->with('error', 'Email mismatch. Please start the password reset process again');
        }

        $user = User::where('email', $request->email)->first();

        if (! $user) {
            return redirect()->back()->with('error', 'User not found');
        }
        
        $user->update([
            'password' => Hash::make($request->password),
            'otp_code' => null,
            'otp_purpose' => null,
            'otp_expires_at' => null,
        ]);

        session()->forget('user_email');

        return redirect()->route('user.auth.login')->with('success', 'Password reset successfully');
    }
}
