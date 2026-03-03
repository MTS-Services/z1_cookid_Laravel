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
        if (! empty($validated['password'])) {
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
        if ($validated['avatar']) {

            if ($vendor->avatar && Storage::disk('public')->exists('vendor_avatars/'.$vendor->avatar)) {
                Storage::disk('public')->delete('vendor_avatars/'.$vendor->avatar);
            }

            // Store new image
            $file = $request->file('avatar');
            $imageName = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
            $file->storeAs('vendor_avatars', $imageName, 'public');

            $validated['avatar'] = $imageName;
        } else {
            $validated['avatar'] = $vendor->avatar;
        }

        /*
    |--------------------------------------------------------------------------
    | Safe Update
    |--------------------------------------------------------------------------
    */
        $vendor->update($validated);

        return redirect()->route('vendor.account');
    }
}
