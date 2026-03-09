<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Wishlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_id' => ['required', 'integer', 'exists:services,id'],
        ]);

        $user = $request->user();
        $exists = $user->wishlists()
            ->where('service_id', $validated['service_id'])
            ->exists();

        if (! $exists) {
            $maxOrder = $user->wishlists()->max('sort_order') ?? 0;
            $user->wishlists()->create([
                'service_id' => $validated['service_id'],
                'sort_order' => $maxOrder + 1,
            ]);
        }

        return redirect()->back()->with('wishlist', 'added');
    }

    public function destroy(Request $request, Wishlist $wishlist): RedirectResponse
    {
        if ($wishlist->user_id !== $request->user()->id) {
            abort(403);
        }

        $wishlist->delete();

        return redirect()->back()->with('wishlist', 'removed');
    }
}
