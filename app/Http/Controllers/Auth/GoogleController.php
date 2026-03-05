<?php

namespace App\Http\Controllers\Auth;

use App\Enums\VendorStatus;
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

        $guard = Session::pull('google_guard', $defaultGuard);

        if (! in_array($guard, $availableGuards, true)) {
            $guard = $defaultGuard;
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return match ($guard) {
                'vendor' => redirect(route('vendor.auth.login'))->with('error', 'Google login failed. Please try again.'),
                default  => redirect('/login')->with('error', 'Google login failed. Please try again.'),
            };
        }

        $email = $googleUser->getEmail();

        switch ($guard) {
            case 'vendor':
                [$firstName, $lastName] = $this->extractName($googleUser->getName(), $email);

                $user = Vendor::where('email', $email)
                    ->orWhere('google_id', $googleUser->getId())
                    ->first();

                if ($user) {
                    // existing vendor — sync google info
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'provider'  => 'google',
                        'avatar'    => $user->avatar ?? $googleUser->getAvatar(),
                    ]);
                } else {
                    // new vendor — create with basic info, complete profile later
                    $user = Vendor::create([
                        'first_name' => $firstName,
                        'last_name'  => $lastName,
                        'email'      => $email,
                        'google_id'  => $googleUser->getId(),
                        'provider'   => 'google',
                        'avatar'     => $googleUser->getAvatar(),
                    ]);
                }

                break;

            default:
                [$firstName, $lastName] = $this->extractName($googleUser->getName(), $email);

                $user = User::updateOrCreate(
                    ['email' => $email],
                    [
                        'first_name' => $firstName,
                        'last_name'  => $lastName,
                        'google_id'  => $googleUser->getId(),
                        'provider'   => 'google',
                        'avatar'     => $googleUser->getAvatar(),
                    ]
                );
        }

        Auth::guard($guard)->login($user);

        return match ($guard) {
            'vendor' => $user->wasRecentlyCreated || $user->status->value == VendorStatus::Pending->value
                ? redirect(route('vendor.account'))
                : redirect('/vendor/dashboard'),
            default  => redirect(route('user.profile')),
        };
    }

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
