<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProfileUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(): Response
    {
        $admin = auth('admin')->user();

        return Inertia::render('admin/profile/index', [
            'admin' => [
                'first_name' => $admin->first_name,
                'last_name' => $admin->last_name,
                'email' => $admin->email,
                'phone' => $admin->phone,
            ],
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $admin = $request->user();
        $validated = $request->validated();

        $admin->first_name = $validated['first_name'];
        $admin->last_name = $validated['last_name'] ?? '';
        $admin->email = $validated['email'];
        $admin->phone = $validated['phone'] ?? null;

        if (! empty($validated['password'])) {
            $admin->password = $validated['password'];
        }

        $admin->save();

        return redirect()->route('admin.profile.index')
            ->with('success', 'Profile updated successfully.');
    }
}
