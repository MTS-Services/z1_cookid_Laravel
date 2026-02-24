<?php

namespace App\Http\Controllers\Auth\User;

use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;

class UserAuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('auth/login');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $request->session()->regenerate();

        return redirect()->route('user.dashboard');
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
            $avatarName = time().'_'.uniqid().'.'.$request->avatar->extension();
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

        Auth::login($user);

        return redirect()->route('user.pending-verification');
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('frontend.home');
    }
}