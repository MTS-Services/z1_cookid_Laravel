<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function index()
    {
        return Inertia::render('user/profile/index');
    }
    public function profileUpdate(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone' => ['nullable', 'string', 'max:20'],
            'avatar' => ['nullable', 'file', 'mimes:jpeg,jpg,png', 'max:2048'],
        ]);
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->hasFile('image')) {

            // delete old image
            if ($user->avatar && Storage::disk('public')->exists('user_images/' . $user->avatar)) {
                Storage::disk('public')->delete('user_images/' . $user->avatar);
            }

            // store new image
            $file = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('user_images', $imageName);

            $data['image'] = $imageName;
        }

        $user->save();

        return back()->with('status', 'profile-updated');
    }
    public function orderDetails()
    {
        return Inertia::render('user/profile/order-details');
    }
    public function serviceReview()
    {
        return Inertia::render('user/profile/service-review');
    }
}
