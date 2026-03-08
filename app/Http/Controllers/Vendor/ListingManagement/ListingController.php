<?php

namespace App\Http\Controllers\Vendor\ListingManagement;

use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\ListingManagement\ListingRequest;
use App\Models\CarType;
use App\Models\Category;
use App\Models\Service;
use App\Models\ServiceImage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ListingController extends Controller
{
    public function index(Request $request): Response
    {
        $vendorId = auth('vendor')->id();

        $query = Service::query()
            ->where('vendor_id', $vendorId)
            ->with('category')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $listings = $query->paginate(12)->withQueryString();

        $listings->getCollection()->transform(function (Service $service) {
            return [
                'id' => $service->id,
                'name' => $service->title,
                'location' => $service->location,
                'price' => (float) $service->price,
                'service' => $service->category?->name ?? '—',
                'rating' => $service->average_rating ? (float) $service->average_rating : null,
                'image' => $service->image_url,
            ];
        });

        return Inertia::render('vendor/listing-management/listing/index', [
            'listings' => $listings->items(),
            'pagination' => [
                'current_page' => $listings->currentPage(),
                'last_page' => $listings->lastPage(),
                'per_page' => $listings->perPage(),
                'total' => $listings->total(),
                'from' => $listings->firstItem(),
                'to' => $listings->lastItem(),
            ],
            'search' => $request->input('search', ''),
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('status', 'active')->orderBy('name')->get(['id', 'name']);
        $carTypes = CarType::where('status', 'active')->orderBy('name')->get(['id', 'name']);

        return Inertia::render('vendor/listing-management/listing/create', [
            'categories' => $categories,
            'carTypes' => $carTypes,
        ]);
    }

    public function store(ListingRequest $request): RedirectResponse
    {
        $validated = $this->mapValidatedToService($request);
        $validated['vendor_id'] = auth('vendor')->id();
        $validated['slug'] = $this->generateSlug($validated['title']);

        if ($request->hasFile('image')) {
            $validated['image'] = $this->storeImage($request->file('image'));
        } else {
            $validated['image'] = null;
        }

        $validated['average_rating'] = null;
        $validated['total_reviews'] = 0;

        $service = Service::create($validated);

        $this->storeGalleryImages($request, $service);

        return redirect()->route('vendor.lm.listing.index')->with('success', 'Listing created successfully.');
    }

    public function show(Service $listing): RedirectResponse
    {
        $this->authorizeVendorOwns($listing);

        return redirect()->route('vendor.lm.listing.edit', $listing);
    }

    public function edit(Service $listing): Response
    {
        $this->authorizeVendorOwns($listing);

        $listing->load('category', 'carType', 'images');
        $categories = Category::where('status', 'active')->orderBy('name')->get(['id', 'name']);
        $carTypes = CarType::where('status', 'active')->orderBy('name')->get(['id', 'name']);

        $gallery = $listing->images->sortBy('sort_order')->values()->map(function (ServiceImage $img) {
            return [
                'id' => $img->id,
                'image' => $img->image,
                'image_url' => asset('storage/service_images/'.$img->image),
                'sort_order' => $img->sort_order,
            ];
        })->all();

        return Inertia::render('vendor/listing-management/listing/edit', [
            'listing' => [
                'id' => $listing->id,
                'serviceTitle' => $listing->title,
                'description' => $listing->description,
                'duration' => $listing->duration,
                'carType' => (string) $listing->car_type_id,
                'category' => (string) $listing->category_id,
                'location' => $listing->location,
                'features' => $listing->features ?? '',
                'price' => $listing->price ? (string) $listing->price : '',
                'image' => $listing->image,
                'image_url' => $listing->image_url,
                'status' => $listing->status->value,
                'gallery' => $gallery,
            ],
            'categories' => $categories,
            'carTypes' => $carTypes,
        ]);
    }

    public function update(ListingRequest $request, Service $listing): RedirectResponse
    {
        $this->authorizeVendorOwns($listing);

        $validated = $this->mapValidatedToService($request);
        $validated['slug'] = $this->generateSlug($validated['title'], $listing->id);

        $validated['image'] = $this->syncImage($request, $listing->image);

        $listing->update($validated);

        $this->syncGalleryImages($request, $listing);

        return redirect()->route('vendor.lm.listing.index')->with('success', 'Listing updated successfully.');
    }

    public function destroy(Service $listing): RedirectResponse
    {
        $this->authorizeVendorOwns($listing);

        $disk = Storage::disk('public');
        if ($listing->image) {
            $disk->delete('service_images/'.$listing->image);
        }
        foreach ($listing->images as $serviceImage) {
            $disk->delete('service_images/'.$serviceImage->image);
        }

        $listing->delete();

        return redirect()->route('vendor.lm.listing.index')->with('success', 'Listing deleted successfully.');
    }

    private function authorizeVendorOwns(Service $listing): void
    {
        if ($listing->vendor_id !== auth('vendor')->id()) {
            abort(403);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function mapValidatedToService(ListingRequest $request): array
    {
        $v = $request->validated();

        return [
            'category_id' => (int) $v['category'],
            'car_type_id' => (int) $v['carType'],
            'title' => $v['serviceTitle'],
            'description' => $v['description'],
            'duration' => $v['duration'],
            'location' => $v['location'],
            'features' => $v['features'] ?? null,
            'price' => (float) $v['price'],
            'status' => $v['status'] ?? 'active',
        ];
    }

    private function generateSlug(string $title, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($title);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Service::where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }

    private function storeImage(\Illuminate\Http\UploadedFile $file): string
    {
        $name = time().'_'.uniqid().'.'.$file->getClientOriginalExtension();
        $file->storeAs('service_images', $name, 'public');

        return $name;
    }

    private function syncImage(ListingRequest $request, ?string $existingImage = null): ?string
    {
        $disk = Storage::disk('public');
        $path = $existingImage ? 'service_images/'.$existingImage : null;

        if ($request->boolean('remove_image') && $path) {
            $disk->delete($path);

            return null;
        }

        if ($request->hasFile('image')) {
            if ($path) {
                $disk->delete($path);
            }

            return $this->storeImage($request->file('image'));
        }

        return $existingImage;
    }

    private function storeGalleryImages(ListingRequest $request, Service $service): void
    {
        $files = $request->file('gallery_images');
        if (! is_array($files)) {
            return;
        }
        $sortOrder = 0;
        foreach ($files as $file) {
            if ($file && $file->isValid()) {
                $name = $this->storeImage($file);
                $service->images()->create([
                    'image' => $name,
                    'sort_order' => $sortOrder++,
                ]);
            }
        }
    }

    private function syncGalleryImages(ListingRequest $request, Service $listing): void
    {
        $disk = Storage::disk('public');

        $removeIds = $request->input('remove_gallery_ids', []);
        if (is_array($removeIds) && count($removeIds) > 0) {
            $toRemove = $listing->images()->whereIn('id', $removeIds)->get();
            foreach ($toRemove as $img) {
                $disk->delete('service_images/'.$img->image);
                $img->delete();
            }
        }

        $files = $request->file('gallery_images');
        if (is_array($files)) {
            $maxOrder = (int) $listing->images()->max('sort_order');
            $sortOrder = $maxOrder + 1;
            foreach ($files as $file) {
                if ($file && $file->isValid()) {
                    $name = $this->storeImage($file);
                    $listing->images()->create([
                        'image' => $name,
                        'sort_order' => $sortOrder++,
                    ]);
                }
            }
        }
    }
}
