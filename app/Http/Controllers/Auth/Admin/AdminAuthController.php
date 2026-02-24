<?php

namespace App\Http\Controllers\Auth\Admin;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\AdminOtpMail;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AdminAuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('admin/auth/login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $admin = Admin::where('email', $credentials['email'])->first();

        if (! $admin || ! Hash::check($credentials['password'], (string) $admin->password)) {
            throw ValidationException::withMessages([
                'email' => 'Invalid credentials.',
            ]);
        }

        if ($admin->status !== ActiveInactiveStatus::ACTIVE) {
            throw ValidationException::withMessages([
                'email' => 'Account is not active.',
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
        $request->session()->put('admin_email', $admin->email);

        return redirect()->route('admin.otp-verify', [
            'email' => $admin->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('frontend.home');
    }

    public function register(): Response
    {
        return Inertia::render('admin/auth/register');
    }

    public function registerStore(Request $request)
    {
        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'email'      => ['required', 'email', 'unique:admins,email'],
            'phone'      => ['required', 'string', 'max:20'],
            'password'   => ['required', 'confirmed', 'min:8'],
        ]);

        $admin = Admin::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'email'      => $validated['email'],
            'phone'      => $validated['phone'],
            'password'   => Hash::make($validated['password']),
            'status'     => ActiveInactiveStatus::ACTIVE,
        ]);

        Auth::guard('admin')->login($admin);

        $request->session()->regenerate();

        return redirect()->route('admin.dashboard');
    }
}
