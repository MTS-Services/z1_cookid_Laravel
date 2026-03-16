<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Models\CarType;
use App\Models\Category;
use App\Models\Review;
use App\Models\Service;
use App\Models\ServiceImage;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $categorySlug = $request->input('category');
        $vehicleTypeId = $request->input('vehicle_type');
        $location = $request->input('location');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $minRating = $request->integer('min_rating', 0);

        $servicesQuery = Service::query()
            ->with(['category', 'carType'])
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($builder) use ($search) {
                    $builder->where('title', 'like', "%{$search}%")
                        ->orWhere('description', 'like', "%{$search}%")
                        ->orWhere('location', 'like', "%{$search}%");
                });
            })
            ->when($categorySlug, function ($query) use ($categorySlug) {
                $query->whereHas('category', fn ($catQuery) => $catQuery->where('slug', $categorySlug));
            })
            ->when($vehicleTypeId, fn ($query) => $query->where('car_type_id', $vehicleTypeId))
            ->when($location, fn ($query) => $query->where('location', $location))
            ->when($minPrice !== null, fn ($query) => $query->where('price', '>=', (float) $minPrice))
            ->when($maxPrice !== null, fn ($query) => $query->where('price', '<=', (float) $maxPrice))
            ->when($minRating >= 1 && $minRating <= 5, function ($query) use ($minRating) {
                if ($minRating === 5) {
                    $query->where('average_rating', '>=', 5.0);
                } else {
                    $query->where('average_rating', '>=', (float) $minRating)
                        ->where('average_rating', '<', (float) $minRating + 1);
                }
            })
            ->latest();

        $services = $servicesQuery
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Service $service) => [
                'id' => Crypt::encryptString((string) $service->id),
                'name' => $service->title,
                'image' => $service->image_url,
                'rating' => (float) ($service->average_rating ?? 0),
                'location' => $service->location ?? '—',
                'price' => (float) $service->price,
                'service' => $service->category?->name ?? 'Service',
                'category' => $service->category?->name,
                'vehicleType' => $service->carType?->name,
            ]);

        $priceBounds = Service::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->selectRaw('MIN(price) as min_price, MAX(price) as max_price')
            ->first();

        $minPriceBound = (float) ($priceBounds->min_price ?? 0);
        $maxPriceBound = (float) ($priceBounds->max_price ?? 0);

        $priceRanges = [
            ['label' => 'All Price', 'min' => $minPriceBound, 'max' => $maxPriceBound],
            ['label' => '$100 - $300', 'min' => 100, 'max' => 300],
            ['label' => '$300 - $500', 'min' => 300, 'max' => 500],
            ['label' => '$500 - $1,000', 'min' => 500, 'max' => 1000],
            ['label' => '$1,000 - $10,000', 'min' => 1000, 'max' => 10000],
        ];

        $categories = Category::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->orderBy('name')
            ->get(['name', 'slug'])
            ->map(fn ($category) => [
                'label' => $category->name,
                'value' => $category->slug,
            ]);

        $vehicleTypes = CarType::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->orderBy('name')
            ->get(['id', 'name'])
            ->map(fn ($carType) => [
                'label' => $carType->name,
                'value' => $carType->id,
            ]);

        $locations = Service::query()
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->whereNotNull('location')
            ->distinct()
            ->orderBy('location')
            ->pluck('location');

        return Inertia::render('frontend/services', [
            'services' => $services,
            'filters' => [
                'search' => $search,
                'category' => $categorySlug,
                'vehicleType' => $vehicleTypeId ? (int) $vehicleTypeId : null,
                'location' => $location,
                'minPrice' => $minPrice !== null ? (float) $minPrice : null,
                'maxPrice' => $maxPrice !== null ? (float) $maxPrice : null,
                'minRating' => $minRating >= 1 && $minRating <= 5 ? $minRating : null,
            ],
            'options' => [
                'categories' => $categories,
                'vehicleTypes' => $vehicleTypes,
                'locations' => $locations,
                'priceRanges' => $priceRanges,
                'priceBounds' => [
                    'min' => $minPriceBound,
                    'max' => $maxPriceBound,
                ],
            ],
        ]);
    }

    public function show(Request $request, $id): Response
    {
        $id = Crypt::decryptString($id);
        $service = Service::query()
            ->with(['category', 'carType', 'vendor', 'images'])
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->find($id);

        if (! $service) {
            abort(404);
        }

        $images = $service->images->isEmpty()
            ? [['id' => 0, 'src' => $service->image_url, 'alt' => $service->title]]
            : $service->images->map(fn (ServiceImage $img) => [
                'id' => $img->id,
                'src' => filter_var($img->image, FILTER_VALIDATE_URL) ? $img->image : asset('storage/service_images/'.$img->image),
                'alt' => $service->title,
            ])->values()->all();

        $wishlistEntry = $request->user()?->wishlists()
            ->where('service_id', $service->id)
            ->first();

        $serviceData = [
            'id' => $service->id,
            'encryptedId' => Crypt::encryptString((string) $service->id),
            'title' => $service->title,
            'slug' => $service->slug,
            'description' => $service->description,
            'duration' => $service->duration,
            'location' => $service->location ?? '—',
            'features' => $service->features,
            'price' => (float) $service->price,
            'rating' => (float) ($service->average_rating ?? 0),
            'totalReviews' => (int) ($service->total_reviews ?? 0),
            'categoryName' => $service->category?->name,
            'vehicleTypeName' => $service->carType?->name,
            'image' => $service->image_url,
            'images' => $images,
            'inclusions' => $this->formatInclusions($service),
            'vendor' => [
                'id' => Crypt::encryptString((string) $service->vendor?->id),
                'name' => $service->vendor?->shop_name ?? trim(($service->vendor?->first_name ?? '').' '.($service->vendor?->last_name ?? '')) ?: 'Vendor',
                'avatar_url' => $service->vendor?->avatar_url,
                'location' => $service->location ?? null,
            ],
            'inWishlist' => $wishlistEntry !== null,
            'wishlistId' => $wishlistEntry?->id,
        ];

        $reviewsPerPage = (int) $request->input('reviews_per_page', 10);
        $reviewsPerPage = max(5, min(50, $reviewsPerPage));
        $reviewsPage = (int) $request->input('reviews_page', 1);
        $reviewsPage = max(1, $reviewsPage);

        $reviewsPaginator = $service->reviews()
            ->with('user')
            ->latest()
            ->paginate($reviewsPerPage, ['*'], 'reviews_page')
            ->withQueryString()
            ->through(function ($review) {
                return [
                    'id' => $review->id,
                    'name' => $review->user?->first_name && $review->user?->last_name
                        ? $review->user->first_name.' '.$review->user->last_name
                        : ($review->user?->email ?? 'Guest'),
                    'rating' => (int) $review->rating,
                    'comment' => $review->comment ?? '',
                    'timeAgo' => Carbon::parse($review->created_at)->diffForHumans(),
                ];
            });

        $ratingDistribution = $this->ratingDistributionForService($service->id);

        return Inertia::render('frontend/service-details', [
            'service' => $serviceData,
            'reviews' => $reviewsPaginator,
            'ratingDistribution' => $ratingDistribution,
        ]);
    }

    /**
     * Rating distribution (count and percentage per star) for a service, from all reviews.
     */
    private function ratingDistributionForService(int $serviceId): array
    {
        $total = Review::where('service_id', $serviceId)->count();
        $counts = Review::where('service_id', $serviceId)
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

    /**
     * Format service inclusions for frontend. Returns empty array if no inclusions table/records.
     */
    private function formatInclusions(Service $service): array
    {
        try {
            if (! $service->relationLoaded('inclusions')) {
                $service->load('inclusions');
            }
            if ($service->inclusions->isEmpty()) {
                return [];
            }
            $grouped = $service->inclusions->groupBy('section_label');

            return $grouped->map(fn ($items, $label) => [
                'label' => $label ?: 'Included',
                'items' => $items->pluck('item')->filter()->values()->all(),
            ])->values()->all();
        } catch (\Throwable) {
            return [];
        }
    }
}
