<?php

namespace App\Http\Controllers\Auth\Admin;

use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\AdminOtpMail;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ForgetPassword extends Controller
{
    public function forgotPassword()
    {
        return Inertia::render('admin/auth/forgot-password');
    }

    public function forgotPasswordOtpVerify(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $admin = Admin::where('email', $request->email)->first();

        if (! $admin) {
            return redirect()->back()->withErrors(['email' => 'Admin not found.']);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $admin->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::PASSWORD_RESET,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($admin->email)->send(new AdminOtpMail($admin, $otp));
        $request->session()->put('admin_email', $admin->email);

        return redirect()->route('admin.otp-verify', [
            'email' => $admin->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function forgotPasswordReset(Request $request)
    {
        $email = $request->session()->get('admin_email');

        if (! $email) {
            return redirect()->route('admin.forgot-password')
                ->with('error', 'Please start the password reset process again.');
        }

        return Inertia::render('admin/auth/reset-password', [
            'email' => $email,
        ]);
    }

    public function forgotPasswordResetStore(Request $request)
    {
        $sessionEmail = $request->session()->get('admin_email');

        if (! $sessionEmail) {
            return redirect()->route('admin.forgot-password')
                ->with('error', 'Please start the password reset process again.');
        }

        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        if ($request->email !== $sessionEmail) {
            return redirect()->back()->withErrors(['email' => 'Email mismatch. Please start the password reset process again.']);
        }

        $admin = Admin::where('email', $request->email)->first();

        if (! $admin) {
            return redirect()->back()->withErrors(['email' => 'Admin not found.']);
        }

        $admin->update([
            'password' => Hash::make($request->password),
            'otp_code' => null,
            'otp_purpose' => null,
            'otp_expires_at' => null,
        ]);

        $request->session()->forget('admin_email');

        return redirect()->route('admin.login')->with('success', 'Password reset successfully.');
    }
}
