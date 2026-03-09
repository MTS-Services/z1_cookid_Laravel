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
    public function index(Request $request)
    {
        $user = $request->user();
        $wishlist = $user->wishlists()
            ->with(['service' => fn ($q) => $q->with('category')])
            ->orderBy('sort_order')
            ->get()
            ->map(function ($w) {
                $s = $w->service;
                if (! $s) {
                    return null;
                }

                return [
                    'id' => $w->id,
                    'serviceId' => $s->id,
                    'name' => $s->title,
                    'image' => $s->image_url,
                    'address' => $s->location ?? '—',
                    'price' => (float) $s->price,
                ];
            })
            ->filter()
            ->values()
            ->all();

        return Inertia::render('user/profile/index', [
            'wishlist' => $wishlist,
        ]);
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
        $validated['avatar'] = $request->file('avatar') ?? $user->avatar;
        $user->fill($validated);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // Handle uploaded avatar (frontend sends field name `avatar`)
        if ($request->hasFile('avatar')) {

            // delete old image if exists
            if ($user->avatar && Storage::disk('public')->exists('user_images/' . $user->avatar)) {
                Storage::disk('public')->delete('user_images/' . $user->avatar);
            }

            // store new image on the public disk
            $file = $request->file('avatar');
            $imageName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('user_images', $imageName, 'public');

            // assign filename to user's avatar attribute
            $user->avatar = $imageName;
        }

        $user->save();

        return redirect()->back()->with('status', 'profile-updated');
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
