<?php

namespace App\Http\Controllers\User;

use App\Concerns\PasswordValidationRules;
use App\Enums\ActiveInactive;
use App\Enums\UserType;
use App\Http\Controllers\Controller;
use App\Mail\FoundingAdminRegistrationMail;
use App\Mail\FoundingPartnerRegistrationMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserAuthController extends Controller
{
    use PasswordValidationRules;

    public function userChoose(): Response
    {
        return Inertia::render('frontend/user-choose', [
            'user_type' => collect(UserType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ]),
        ]);
    }

    public function register(): Response
    {
        return Inertia::render('auth/register');
    }

    public function registerStore(Request $request)
    {
        Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:20'],
            'your_self' => ['nullable', 'string', 'max:255'],
            'brokerage_name' => ['nullable', 'string', 'max:255'],
            'license_number' => ['nullable', 'string', 'max:255'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg,webp', 'max:2048'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        // File upload logic
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $imageName = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
            $file->storeAs('user_images', $imageName);
        }
        $user = User::create([
            'name' => $request['name'],
            'email' => $request['email'],
            'username' => $request['username'],
            'phone' => $request['phone'],
            'user_type' => $request['type'],
            'your_self' => $request['your_self'],
            'brokerage_name' => $request['brokerage_name'],
            'license_number' => $request['license_number'],
            'image' => isset($imageName) ? $imageName : null,
            'status' => ActiveInactive::INACTIVE->value,
            'password' => Hash::make($request['password']),
        ]);
        if (! $user) {
            return redirect()->back()->withErrors(['error' => 'Failed to register user.'])->withInput();
        }
        // Mail::to($user->email)->send(new FoundingPartnerRegistrationMail($user));
        if ($user->email) {
            Mail::to($user->email)->later(now()->addSeconds(5), new FoundingPartnerRegistrationMail($user));
        }
        Mail::to(config('mail.from.address'))->send(new FoundingAdminRegistrationMail($user));
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
