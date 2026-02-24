<?php

namespace App\Http\Controllers\Auth\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Enums\ActiveInactiveStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
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
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::guard('admin')->attempt([
            'email' => $request->email,
            'password' => $request->password,
            'status' => ActiveInactiveStatus::ACTIVE->value,
        ])) {
            throw ValidationException::withMessages([
                'email' => 'Invalid credentials or account inactive.',
            ]);
        }

        $request->session()->regenerate();

        return redirect()->route('admin.dashboard');
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
