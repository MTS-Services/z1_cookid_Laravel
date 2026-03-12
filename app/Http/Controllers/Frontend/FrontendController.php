<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Enums\ActiveInactiveStatus;
use App\Models\Category;
use App\Models\Order;
use App\Models\Review;
use App\Models\Service;
use App\Models\Vendor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Carbon;
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
        $categories = Category::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->select(['id', 'name', 'image'])
            ->orderBy('name')
            ->get()
            ->map(fn (Category $category) => [
                'id' => $category->id,
                'name' => $category->name,
                'image' => $category->image_url,
            ]);

        return Inertia::render('frontend/categories', [
            'categories' => $categories,
        ]);
    }
    public function howItWorks(): Response
    {
        return Inertia::render('frontend/how-it-work');
    }
    public function vendorReviews(Request $request, $id = null): Response
    {
        $vendorId = Crypt::decryptString($id);
        $vendor = Vendor::findOrFail($vendorId);

        $perPage = (int) $request->integer('per_page', 10);
        $perPage = max(5, min(50, $perPage));

        $reviewsQuery = Review::query()
            ->with('user')
            ->whereHas('service', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            });

        $reviewsPaginator = $reviewsQuery
            ->clone()
            ->latest('created_at')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function (Review $review) {
                $name = $review->user?->first_name && $review->user?->last_name
                    ? trim($review->user->first_name . ' ' . $review->user->last_name)
                    : ($review->user?->email ?? 'Guest');

                return [
                    'id' => $review->id,
                    'name' => $name,
                    'rating' => (int) $review->rating,
                    'comment' => $review->comment ?? '',
                    'timeAgo' => Carbon::parse($review->created_at)->diffForHumans(),
                ];
            });

        $averageRating = (float) round((float) ($reviewsQuery->clone()->avg('rating') ?? 0), 1);
        $totalReviews = (int) $reviewsQuery->clone()->count();

        return Inertia::render('frontend/vendor-reviews', [
            'vendor' => [
                'id' => $id,
                'name' => $vendor->shop_name ?? trim(($vendor->first_name ?? '') . ' ' . ($vendor->last_name ?? '')) ?: 'Vendor',
                'location' => $vendor->location ?? null,
                'avatar_url' => $vendor->avatar_url,
            ],
            'averageRating' => $averageRating,
            'totalReviews' => $totalReviews,
            'ratingDistribution' => $this->ratingDistribution(),
            'reviews' => $reviewsPaginator,
        ]);
    }

    private function ratingDistribution(): array
    {
        $total = Review::count();

        $counts = Review::query()
            ->selectRaw('rating, count(*) as count')
            ->groupBy('rating')
            ->pluck('count', 'rating');

        return collect([5, 4, 3, 2, 1])->map(function (int $stars) use ($counts, $total) {
            $count = (int) ($counts[$stars] ?? 0);

            return [
                'stars' => $stars,
                'count' => $count,
                'percentage' => $total > 0 ? (int) round(($count / $total) * 100) : 0,
            ];
        })->all();
    }
    public function servicesStore(Request $request, $id = null): Response
    {
        $vendorId = Crypt::decryptString($id);
        $vendor = Vendor::findOrFail($vendorId);
        $category = $request->query('category');

        $servicesQuery = Service::query()
            ->with('category')
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->where('vendor_id', $vendorId);

        if ($category) {
            $servicesQuery->whereHas('category', function ($q) use ($category) {
                $q->where('name', $category);
            });
        }

        $services = $servicesQuery
            ->orderByDesc('created_at')
            ->paginate(9)
            ->withQueryString()
            ->through(function (Service $service) {
                return [
                    'id' => Crypt::encryptString((string) $service->id),
                    'title' => $service->title,
                    'location' => $service->location ?? '—',
                    'price' => (float) $service->price,
                    'category' => $service->category?->name ?? 'Service',
                    'rating' => (float) ($service->average_rating ?? 0),
                    'reviews' => (int) ($service->total_reviews ?? 0),
                    'image' => $service->image_url,
                ];
            });

        $categories = Category::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->orderBy('name')
            ->pluck('name')
            ->all();

        $vendorReviewsQuery = Review::query()
            ->whereHas('service', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            });

        $vendorAverageRating = (float) round((float) ($vendorReviewsQuery->clone()->avg('rating') ?? 0), 1);
        $vendorTotalReviews = (int) $vendorReviewsQuery->clone()->count();

        return Inertia::render('frontend/store', [
            'services' => $services,
            'categories' => $categories,
            'vendor' => [
                'id' => $id,
                'name' => $vendor->shop_name ?? trim(($vendor->first_name ?? '') . ' ' . ($vendor->last_name ?? '')) ?: 'Vendor',
                'location' => $vendor->location ?? null,
                'avatar_url' => $vendor->avatar_url,
                'averageRating' => $vendorAverageRating,
                'totalReviews' => $vendorTotalReviews,
            ],
        ]);
    }
    public function aboutUs(): Response
    {
        return Inertia::render('frontend/about');
    }
}
