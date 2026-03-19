<?php

namespace App\Http\Controllers\Vendor\ListingManagement;

use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Vendor\ListingManagement\CarTypeRequest;
use App\Models\CarType;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CarTypeController extends Controller
{
    public function __construct(private DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $result = $this->dataTableService->process(
            CarType::query(),
            $request,
            [
                'searchable' => ['name', 'slug'],
                'filterable' => ['status'],
                'sortable' => ['id', 'name', 'price', 'status', 'created_at'],
            ],
        );

        return Inertia::render('vendor/listing-management/car-type/index', [
            'carTypes' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
            'statuses' => collect(ActiveInactiveStatus::cases())
                ->map(fn (ActiveInactiveStatus $status) => [
                    'label' => $status->label(),
                    'value' => $status->value,
                ])
                ->values(),
        ]);
    }

    public function store(CarTypeRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = $this->generateSlug($validated['name']);

        CarType::create($validated);

        return back()->with('success', 'Car type created successfully.');
    }

    public function update(CarTypeRequest $request, CarType $carType): RedirectResponse
    {
        $validated = $request->validated();
        $validated['slug'] = $this->generateSlug($validated['name'], $carType->id);

        $carType->update($validated);

        return back()->with('success', 'Car type updated successfully.');
    }

    public function destroy(CarType $carType): RedirectResponse
    {
        $carType->delete();

        return back()->with('success', 'Car type deleted successfully.');
    }

    private function generateSlug(string $name, ?int $ignoreId = null): string
    {
        $baseSlug = Str::slug($name);
        $slug = $baseSlug;
        $counter = 1;

        while (
            CarType::where('slug', $slug)
                ->when($ignoreId, fn ($query) => $query->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = $baseSlug.'-'.$counter;
            $counter++;
        }

        return $slug;
    }
}
