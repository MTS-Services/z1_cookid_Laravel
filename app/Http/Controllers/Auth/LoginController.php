<?php

namespace App\Http\Controllers\Auth;

use App\Enums\UserType;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class LoginController extends Controller
{
    public function showLogin(Request $request)
    {
        $userType = $request->query('type');
        if ($userType) {
            return Inertia::render('auth/login', [
                'userType' => $userType,
            ]);
        } else {
            return redirect(route('user.choose'));
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
            // 'user_type' => ['required', Rule::in(UserType::cases())],
        ]);

        $credentials = $request->only('email', 'password');

        // Attempt login
        if (! Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        $user = Auth::user();

        // Check user type
        if ($user->user_type->value !== $request->user_type) {
            Auth::logout();

            throw ValidationException::withMessages([
                'email' => 'Invalid account type for this login.',
            ]);
        }

        $request->session()->regenerate();

        return redirect(route('user.dashboard'));
    }

    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
