<?php

namespace App\Http\Controllers\Auth\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use App\Mail\Otp\VendorOtpMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class VendorAuthController extends Controller
{

    /*
    |--------------------------------------------------------------------------
    | Show Login
    |--------------------------------------------------------------------------
    */
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('vendor.dashboard');
        }
        return Inertia::render('vendor/auth/login');
    }

    /*
    |--------------------------------------------------------------------------
    | Show Register
    |--------------------------------------------------------------------------
    */
    public function showRegister()
    {
        return Inertia::render('vendor/auth/register');
    }
    /*
    |--------------------------------------------------------------------------
    | Register
    |--------------------------------------------------------------------------
    */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'shop_name'  => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'unique:vendors,email'],
            'phone'      => ['required', 'string', 'max:20'],
            'location'   => ['required', 'string', 'max:255'],
            'password'   => ['required', 'confirmed', 'min:8'],
        ]);

        $vendor = Vendor::create([
            ...$validated,
            'password' => Hash::make($validated['password']),
            'status'   => ActiveInactiveStatus::INACTIVE,
        ]);

        if ($vendor->otp_verified_at) {
            Auth::login($vendor);
            $request->session()->regenerate();
            return redirect()->intended(route('vendor.dashboard'));
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $vendor->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::LOGIN,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($vendor->email)->send(new VendorOtpMail($vendor, $otp));
        $request->session()->put('vendor_email', $vendor->email);

        return redirect()->route('vendor.auth.otp-verify', [
            'email' => $vendor->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Login (Step 1 - Check credentials & Send OTP)
    |--------------------------------------------------------------------------
    */
    public function login(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $vendor = Vendor::where('email', $request->email)->first();

        if (! $vendor || ! Hash::check($request->password, $vendor->password)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid credentials.',
            ]);
        }

        if ($vendor->status !== ActiveInactiveStatus::ACTIVE) {
            throw ValidationException::withMessages([
                'email' => 'Account is not active.',
            ]);
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinute(5);

        $vendor->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::LOGIN,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($vendor->email)->send(new VendorOtpMail($vendor, $otp));

        // FIX: Pass the email in the redirect URL
        return redirect()->route('vendor.auth.otp-verify', [
            'email' => $vendor->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Login Verify (Step 2 - Verify OTP)
    |--------------------------------------------------------------------------
    */
    public function loginVerify(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'otp'   => ['required'],
        ]);

        $vendor = Vendor::where('email', $request->email)->first();

        if (
            ! $vendor ||
            $vendor->otp_code !== $request->otp ||
            $vendor->otp_expires_at < now()
        ) {
            throw ValidationException::withMessages([
                'otp' => 'Invalid or expired OTP.',
            ]);
        }

        $vendor->update([
            'otp_code' => null,
            'otp_verified_at' => now(),
        ]);

        Auth::guard('vendor')->login($vendor);

        return response()->json([
            'message' => 'Login successful.',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    */
    public function logout(Request $request)
    {
        Auth::guard('vendor')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
