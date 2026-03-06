<?php

namespace App\Http\Controllers\Auth\Vendor;

use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\VendorOtpMail;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class ForgetPassword extends Controller
{
    public function forgotPassword()
    {
        return Inertia::render('vendor/auth/forgot-password');
    }

    public function forgotPasswordOtpVerify(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $vendor = Vendor::where('email', $request->email)->first();

        if (! $vendor) {
            return redirect()->back()->withErrors(['email' => 'Vendor not found.']);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $vendor->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::PASSWORD_RESET,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($vendor->email)->send(new VendorOtpMail($vendor, $otp));
        $request->session()->put('vendor_email', $vendor->email);

        return redirect()->route('vendor.auth.otp-verify', [
            'email' => $vendor->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function forgotPasswordReset(Request $request)
    {
        $email = $request->session()->get('vendor_email');

        if (! $email) {
            return redirect()->route('vendor.auth.forgot-password')
                ->with('error', 'Please start the password reset process again.');
        }

        return Inertia::render('vendor/auth/reset-password', [
            'email' => $email,
        ]);
    }

    public function forgotPasswordResetStore(Request $request)
    {
        $sessionEmail = $request->session()->get('vendor_email');

        if (! $sessionEmail) {
            return redirect()->route('vendor.auth.forgot-password')
                ->with('error', 'Please start the password reset process again.');
        }

        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        if ($request->email !== $sessionEmail) {
            return redirect()->back()->withErrors(['email' => 'Email mismatch. Please start the password reset process again.']);
        }

        $vendor = Vendor::where('email', $request->email)->first();

        if (! $vendor) {
            return redirect()->back()->withErrors(['email' => 'Vendor not found.']);
        }

        $vendor->update([
            'password' => Hash::make($request->password),
            'otp_code' => null,
            'otp_purpose' => null,
            'otp_expires_at' => null,
        ]);

        $request->session()->forget('vendor_email');

        return redirect()->route('vendor.auth.login')->with('success', 'Password reset successfully.');
    }
}
