<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('admin/auth/login');
    }

    public function login(Request $request)
    {

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();

            return redirect()->intended(route('admin.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('frontend.home');
    }

    public function register()
    {
        return Inertia::render('admin/auth/register');
    }

    public function registerStore(Request $request)
    {

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|string',
            'username' => 'required|string',
            'your_self' => 'nullable|string',
            'image' => 'nullable|string',
        ]);
        $data['password'] = bcrypt($request->password);

        $admin = Admin::create($data);

        session()->regenerateToken();
        Auth::guard('admin')->login($admin);

        return redirect()->route('admin.dashboard');
    }
}
