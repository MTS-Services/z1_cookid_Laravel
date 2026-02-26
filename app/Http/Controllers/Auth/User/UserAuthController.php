<?php

namespace App\Http\Controllers\Auth\User;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OtpPurpose;
use App\Http\Controllers\Controller;
use App\Mail\Otp\UserOtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class UserAuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return redirect()->route('user.dashboard');
        }
        return Inertia::render('auth/login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], (string) $user->password)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        if ($user->status !== ActiveInactiveStatus::ACTIVE) {
            throw ValidationException::withMessages([
                'email' => 'Account is not active.',
            ]);
        }
        if ($user->otp_verified_at) {
            Auth::login($user);
            $request->session()->regenerate();
            return redirect()->intended(route('user.dashboard'));
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $user->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::LOGIN,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($user->email)->send(new UserOtpMail($user, $otp));
        $request->session()->put('user_email', $user->email);

        return redirect()->route('user.auth.otp-verify', [
            'email' => $user->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function register(): Response
    {
        return Inertia::render('auth/register');
    }

    public function registerStore(Request $request)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name'  => ['required', 'string', 'max:255'],
            'phone'      => ['nullable', 'string', 'max:20'],
            'email'      => [
                'required',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'avatar' => ['nullable', 'image', 'max:2048'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        // Upload avatar
        if ($request->hasFile('avatar')) {
            $avatarName = time() . '_' . uniqid() . '.' . $request->avatar->extension();
            $request->avatar->storeAs('user_avatars', $avatarName);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'phone'      => $request->phone,
            'email'      => $request->email,
            'avatar'     => $avatarName ?? null,
            'status'     => ActiveInactiveStatus::INACTIVE,
            'password'   => Hash::make($request->password),
        ]);
        
        if ($user->otp_verified_at) {
            Auth::login($user);
            $request->session()->regenerate();
            return redirect()->intended(route('user.dashboard'));
        }

        $otp = rand(100000, 999999);
        $expiresAt = now()->addMinutes(5);

        $user->update([
            'otp_code' => $otp,
            'otp_purpose' => OtpPurpose::LOGIN,
            'otp_expires_at' => $expiresAt,
        ]);

        Mail::to($user->email)->send(new UserOtpMail($user, $otp));
        $request->session()->put('user_email', $user->email);

        return redirect()->route('user.auth.otp-verify', [
            'email' => $user->email,
            'expires_at' => $expiresAt->toIso8601String(),
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('frontend.home');
    }
}
