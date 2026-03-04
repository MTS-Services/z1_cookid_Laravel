<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\User;
use App\Models\Vendor;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class GoogleController extends Controller
{
    public function redirect($guard = null)
    {
        // determine and validate guard, then store temporarily
        $defaultGuard = config('auth.defaults.guard', 'web');
        $availableGuards = array_keys(config('auth.guards', []));

        if (! $guard) {
            $guard = $defaultGuard;
        }

        if (! in_array($guard, $availableGuards, true)) {
            $guard = $defaultGuard;
        }

        Session::put('google_guard', $guard);

        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        $defaultGuard = config('auth.defaults.guard', 'web');
        $availableGuards = array_keys(config('auth.guards', []));

        // get and forget guard from session to avoid reuse on future logins
        $guard = Session::pull('google_guard', $defaultGuard);

        if (! in_array($guard, $availableGuards, true)) {
            $guard = $defaultGuard;
        }

        $googleUser = Socialite::driver('google')->user();
        $email = $googleUser->getEmail();

        // guard-specific handling so we respect each model's schema
        switch ($guard) {
            case 'admin':
                // Only allow login for existing admins with matching email
                $user = Admin::where('email', $email)->first();

                if (! $user) {
                    return redirect('/admin/login')
                        ->with('error', 'No admin account is linked to this Google email.');
                }

                break;

            case 'vendor':
                // Only allow login for existing vendors with matching email
                $user = Vendor::where('email', $email)->first();

                if (! $user) {
                    return redirect('/vendor/login')
                        ->with('error', 'No vendor account is linked to this Google email.');
                }

                break;

            default:
                // Default: web/user guard - create or update local user
                [$firstName, $lastName] = $this->extractName($googleUser->getName(), $email);

                $user = User::updateOrCreate(
                    ['email' => $email],
                    [
                        'first_name' => $firstName,
                        'last_name' => $lastName,
                        'google_id' => $googleUser->getId(),
                        'provider' => 'google',
                        'avatar' => $googleUser->getAvatar(),
                    ]
                );
        }

        Auth::guard($guard)->login($user);

        return match ($guard) {
            'admin' => redirect('/admin/dashboard'),
            'vendor' => redirect('/vendor/dashboard'),
            default => redirect('/profile'),
        };
    }

    /**
     * Extract first and last name from Google payload with safe fallbacks.
     */
    private function extractName(?string $fullName, ?string $email): array
    {
        $fullName = trim((string) $fullName);

        if ($fullName !== '') {
            $parts = preg_split('/\s+/', $fullName, 2);

            return [
                $parts[0] ?? 'Google User',
                $parts[1] ?? '',
            ];
        }

        $email = trim((string) $email);

        if ($email !== '' && str_contains($email, '@')) {
            [$local] = explode('@', $email, 2);

            return [$local ?: 'Google User', ''];
        }

        return ['Google User', ''];
    }
}
