<?php

namespace App\Http\Controllers\Vendor\ListingManagement;

use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\ListingManagement\CategoryRequest;
use App\Models\Category;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(private DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $result = $this->dataTableService->process(
            Category::query(),
            $request,
            [
                'searchable' => ['name', 'slug'],
                'filterable' => ['status'],
                'sortable' => ['id', 'name', 'status', 'created_at'],
            ],
        );

        return Inertia::render('vendor/listing-management/category/index', [
            'categories' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
            'statuses' => collect(ActiveInactiveStatus::cases())
                ->map(fn(ActiveInactiveStatus $status) => [
                    'label' => $status->label(),
                    'value' => $status->value,
                ])
                ->values(),
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = $this->generateSlug($validated['name']);

        if ($validated['image']) {

            if ($validated['image'] && Storage::disk('public')->exists('category_images/' . $validated['image'])) {
                Storage::disk('public')->delete('category_images/' . $validated['image']);
            }

            // Store new image
            $file = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->storeAs('category_images', $imageName, 'public');

            $validated['image'] = $imageName;
        } else {
            $validated['image'] = null;
        }


        Category::create($validated);

        return back()->with('success', 'Category created successfully.');
    }

    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = $this->generateSlug($validated['name'], $category->id);
        $validated['image'] = $this->syncImage($request, $category->image);
        unset($validated['remove_image']);

        $category->update($validated);

        return back()->with('success', 'Category updated successfully.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        $category->delete();

        return back()->with('success', 'Category deleted successfully.');
    }

    private function generateSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (
            Category::where('slug', $slug)
            ->when($ignoreId, fn($query) => $query->where('id', '!=', $ignoreId))
            ->exists()
        ) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function syncImage(CategoryRequest $request, ?string $existingPath = null): ?string
    {
        $disk = Storage::disk('public');

        if ($request->boolean('remove_image') && $existingPath) {
            $disk->delete($existingPath);
            $existingPath = null;
        }

        if ($request->hasFile('image')) {
            if ($existingPath) {
                $disk->delete($existingPath);
            }

            $existingPath = time() . '_' . uniqid() . '.' . $request->file('image')->getClientOriginalExtension();
            $request->file('image')->storeAs('category_images', $existingPath, 'public');
            return $existingPath;
        }

        return $existingPath;
    }
}
