<?php

namespace App\Http\Controllers\Frontend;

use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Models\CarType;
use App\Models\Category;
use App\Models\Service;
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
    public function services(Request $request): Response
    {
        $search = trim((string) $request->input('search', ''));
        $categorySlug = $request->input('category');
        $vehicleTypeId = $request->input('vehicle_type');
        $location = $request->input('location');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');

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
            ->latest();

        $services = $servicesQuery
            ->paginate(12)
            ->withQueryString()
            ->through(fn (Service $service) => [
                'id' => $service->id,
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
            ['label' => 'Under $20', 'min' => 0, 'max' => 20],
            ['label' => '$25 to $100', 'min' => 25, 'max' => 100],
            ['label' => '$100 to $300', 'min' => 100, 'max' => 300],
            ['label' => '$300 to $500', 'min' => 300, 'max' => 500],
            ['label' => '$500 to $1,000', 'min' => 500, 'max' => 1000],
            ['label' => '$1,000 to $10,000', 'min' => 1000, 'max' => 10000],
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
    public function serviceDetails($id = null): Response
    {
        return Inertia::render('frontend/service-details');
    }
    public function bookingConfirm(): Response
    {
        return Inertia::render('frontend/booking-confirmation');
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
