<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('frontend/index');
    }
    public function search($id = null): Response
    {
        return Inertia::render('frontend/search-page');
    }
    public function privacyPolicy(): Response
    {
        return Inertia::render('frontend/privacy-policy');
    }

    public function bookingConfirm(Request $request): Response
    {
        $orderPayload = null;
        $orderId = $request->query('order');

        if ($orderId && is_numeric($orderId)) {
            $query = Order::with(['service.vendor', 'address'])
                ->where('id', (int) $orderId);

            if ($request->user()) {
                $query->where('user_id', $request->user()->id);
            }

            $order = $query->first();

            if ($order) {
                $orderPayload = [
                    'order_number'   => $order->order_number,
                    'service'        => $order->service ? [
                        'title' => $order->service->title,
                    ] : null,
                    'provider'       => $order->service && $order->service->vendor
                        ? ($order->service->vendor->shop_name ?? trim($order->service->vendor->first_name . ' ' . $order->service->vendor->last_name))
                        : null,
                    'address'        => $order->address ? [
                        'address'  => $order->address->address,
                        'city'     => $order->address->city,
                        'state'    => $order->address->state,
                        'zip_code' => $order->address->zip_code,
                        'phone'    => $order->address->phone,
                        'full'     => implode(', ', array_filter([
                            $order->address->address,
                            $order->address->city,
                            $order->address->state,
                            $order->address->zip_code,
                        ])),
                    ] : null,
                    'total'          => (float) $order->total,
                    'payment_method' => $order->payment_method?->value ?? $order->getRawOriginal('payment_method'),
                ];
            }
        }

        return Inertia::render('frontend/booking-confirmation', [
            'order'  => $orderPayload,
            'status' => $request->session()->get('status'),
        ]);
    }
    public function categories(): Response
    {
        return Inertia::render('frontend/categories');
    }
    public function howItWorks(): Response
    {
        return Inertia::render('frontend/how-it-work');
    }
    public function vendorReviews(): Response
    {
        return Inertia::render('frontend/vendor-reviews');
    }
    public function store(): Response
    {
        return Inertia::render('frontend/store');
    }
    public function aboutUs(): Response
    {
        return Inertia::render('frontend/about');
    }
}
