<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\VendorAccountUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AccountController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('vendor/account', [
            'vendor' => $request->user('vendor'),
        ]);
    }

    public function update(VendorAccountUpdateRequest $request): RedirectResponse
    {
        $vendor = $request->user('vendor');

        $validated = $request->validated();

        /*
    |--------------------------------------------------------------------------
    | Password Update
    |--------------------------------------------------------------------------
    */
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        unset($validated['current_password']);

        /*
    |--------------------------------------------------------------------------
    | Profile Photo Upload
    |--------------------------------------------------------------------------
    */
        if ($request->hasFile('profile_photo')) {

            if ($vendor->profile_photo_path) {
                Storage::disk('public')->delete($vendor->profile_photo_path);
            }

            $validated['profile_photo_path'] =
                $request->file('profile_photo')
                ->store('vendor_profile_photos', 'public');

            unset($validated['profile_photo']);
        }

        /*
    |--------------------------------------------------------------------------
    | Safe Update
    |--------------------------------------------------------------------------
    */
        $vendor->update($validated);

        return redirect()
            ->route('vendor.account')
            ->with('success', 'Account settings updated successfully.');
    }
}
