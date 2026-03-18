<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $section = $request->query('section', 'bookings');
        $section = in_array($section, ['bookings', 'wishlist', 'account'], true) ? $section : 'bookings';

        $wishlist = [];
        $orders = [];

        if ($section === 'wishlist') {
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
        }

        if ($section === 'bookings') {
            $orders = $user->orders()
                ->with(['service.vendor', 'address', 'payments', 'review'])
                ->orderByDesc('created_at')
                ->paginate(9)
                ->through(fn (Order $order) => $this->formatOrderForUser($order))
                ->withQueryString();
        }

        return Inertia::render('user/profile/index', [
            'section' => $section,
            'wishlist' => $wishlist,
            'orders' => $orders,
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
    public function serviceReview(Request $request, Order $order): Response|RedirectResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }
        if ($order->status->value !== 'completed') {
            return redirect()->route('user.order-details')->with('error', 'You can only review completed orders.');
        }
        if ($order->review) {
            return redirect()->route('user.order-details.show', $order)->with('info', 'You have already reviewed this order.');
        }
        $order->loadMissing(['service.vendor', 'address', 'payments']);
        $orderData = $this->formatOrderForUser($order);

        return Inertia::render('user/profile/service-review', [
            'order' => $orderData,
        ]);
    }

    public function storeReview(Request $request, Order $order): RedirectResponse
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }
        if ($order->status->value !== 'completed') {
            return redirect()->route('user.order-details')->with('error', 'You can only review completed orders.');
        }
        if ($order->review) {
            return redirect()->route('user.order-details.show', $order)->with('info', 'You have already reviewed this order.');
        }

        $validated = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['required', 'string', 'max:2000'],
        ]);

        $service = $order->service;
        if (! $service) {
            return redirect()->back()->with('error', 'Service not found.');
        }

        DB::transaction(function () use ($order, $validated, $service) {
            Review::create([
                'order_id' => $order->id,
                'user_id' => $order->user_id,
                'service_id' => $service->id,
                'rating' => (int) $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]);
            $newTotal = $service->reviews()->count();
            $newAvg = $service->reviews()->avg('rating');
            $service->update([
                'total_reviews' => $newTotal,
                'average_rating' => round((float) $newAvg, 2),
            ]);
        });

        return redirect()->route('user.order-details.show', $order)->with('status', 'review-submitted');
    }

    public function formatOrderForUser(Order $order): array
    {
        $latestPayment = $order->payments->sortByDesc(fn ($p) => $p->paid_at?->timestamp ?? $p->created_at?->timestamp ?? 0)->first();

        return [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'status' => $order->status->value,
            'statusLabel' => $order->status->label(),
            'scheduledAt' => $order->scheduled_at?->toIso8601String(),
            'completedAt' => $order->completed_at?->toIso8601String(),
            'createdAt' => $order->created_at?->toIso8601String(),
            'totals' => [
                'subtotal' => $order->subtotal !== null ? (float) $order->subtotal : null,
                'discount' => $order->discount !== null ? (float) $order->discount : null,
                'total' => $order->total !== null ? (float) $order->total : null,
            ],
            'customer' => [
                'name' => $order->user?->full_name ?? $order->user?->email,
                'email' => $order->user?->email,
                'phone' => $order->user?->phone,
            ],
            'service' => [
                'id' => $order->service?->id,
                'title' => $order->service?->title,
                'description' => $order->service?->description,
                'duration' => $order->service?->duration,
                'location' => $order->service?->location,
                'amount' => $order->service && $order->service->price ? (float) $order->service->price : null,
                'vendorName' => $order->service?->vendor?->shop_name
                    ?? trim(collect([
                        $order->service?->vendor?->first_name,
                        $order->service?->vendor?->last_name,
                    ])->filter()->implode(' ')),
            ],
            'address' => $order->address ? [
                'firstName' => $order->address->first_name,
                'lastName' => $order->address->last_name,
                'email' => $order->address->email,
                'phone' => $order->address->phone,
                'addressLine' => $order->address->address,
                'city' => $order->address->city,
                'state' => $order->address->state,
                'zipCode' => $order->address->zip_code,
            ] : null,
            'payment' => $latestPayment ? [
                'status' => $latestPayment->status->value,
                'statusLabel' => $latestPayment->status->label(),
                'method' => $latestPayment->method?->value,
                'methodLabel' => $latestPayment->method?->label(),
                'transactionId' => $latestPayment->transaction_id,
                'amount' => $latestPayment->amount !== null ? (float) $latestPayment->amount : null,
                'paidAt' => $latestPayment->paid_at?->toIso8601String(),
            ] : null,
            'review' => $order->relationLoaded('review') && $order->review ? [
                'rating' => $order->review->rating,
                'comment' => $order->review->comment,
            ] : null,
        ];
    }
}
