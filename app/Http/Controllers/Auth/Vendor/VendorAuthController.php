<?php

namespace App\Http\Controllers\Auth\Vendor;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\VendorOtpMail;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;
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
    // public function register(Request $request)
    // {
    //     $validated = $request->validate([
    //         'shop_name'  => ['required', 'string', 'max:255'],
    //         'first_name' => ['required', 'string', 'max:255'],
    //         'last_name'  => ['required', 'string', 'max:255'],
    //         'email'      => ['required', 'email', 'unique:vendors,email'],
    //         'phone'      => ['required', 'string', 'max:20'],
    //         'location'   => ['required', 'string', 'max:255'],
    //         'password'   => ['required', 'confirmed', 'min:8'],
    //     ]);

    //     $vendor = Vendor::create([
    //         ...$validated,
    //         'password' => Hash::make($validated['password']),
    //         'status'   => ActiveInactiveStatus::INACTIVE,
    //     ]);

    //     if ($vendor->otp_verified_at) {
    //         Auth::login($vendor);
    //         $request->session()->regenerate();
    //         return redirect()->intended(route('vendor.dashboard'));
    //     }

    //     $otp = rand(100000, 999999);
    //     $expiresAt = now()->addMinutes(5);

    //     $vendor->update([
    //         'otp_code' => $otp,
    //         'otp_purpose' => OtpPurpose::LOGIN,
    //         'otp_expires_at' => $expiresAt,
    //     ]);

    //     Mail::to($vendor->email)->send(new VendorOtpMail($vendor, $otp));
    //     $request->session()->put('vendor_email', $vendor->email);

    //     return redirect()->route('vendor.auth.otp-verify', [
    //         'email' => $vendor->email,
    //         'expires_at' => $expiresAt->toIso8601String(),
    //     ]);
    // }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:vendors,email'],
            'phone' => ['required', 'string', 'max:20'],
            'shop_name' => ['required', 'string', 'max:255'],
            'region_state' => ['nullable', 'string'],
            'city' => ['nullable', 'string'],
            'zip_code' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            // Design requires JPEG/PNG max 100MB
            'government_id' => ['nullable', 'file', 'mimes:jpeg,png', 'max:102400'],
            'password' => [
                'required',
                'string',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
            'terms' => ['accepted'], // For the checkbox in design
        ]);

        $governmentIdPath = null;

        if ($request->hasFile('government_id')) {
            $governmentIdPath = $request->file('government_id')->store('vendor_ids', 'public');
        }

        DB::beginTransaction();

        try {
            $vendor = Vendor::create([
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'shop_name' => $validated['shop_name'],
                'region_state' => $validated['region_state'],
                'city' => $validated['city'],
                'zip_code' => $validated['zip_code'],
                'address' => $validated['address'],
                'government_id_path' => $governmentIdPath,
                'password' => Hash::make($validated['password']),
                'status' => ActiveInactiveStatus::INACTIVE,
            ]);

            $otp = random_int(100000, 999999);
            $expiresAt = now()->addMinutes(5);

            $vendor->forceFill([
                'otp_code' => $otp,
                'otp_purpose' => OtpPurpose::REGISTER,
                'otp_expires_at' => $expiresAt,
            ])->save();

            DB::commit();
        } catch (\Throwable $exception) {
            DB::rollBack();

            if ($governmentIdPath) {
                Storage::disk('public')->delete($governmentIdPath);
            }

            throw $exception;
        }

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

        if ($vendor->status->value !== ActiveInactiveStatus::ACTIVE->value) {
            throw ValidationException::withMessages([
                'email' => 'Account is not active.',
            ]);
        }
        if ($vendor->otp_verified_at) {
            // Auth::login($vendor);
            auth()->guard('vendor')->login($vendor);
            $request->session()->regenerate();

            return redirect()->intended(route('vendor.dashboard'));
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
            'otp' => ['required'],
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

        return redirect()->route('frontend.home');
    }
}
