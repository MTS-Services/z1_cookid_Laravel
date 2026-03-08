<?php

namespace App\Http\Controllers\Admin\ServiceManagement;

use App\Enums\ActiveInactiveStatus;
use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $tab = $request->string('tab', 'all')->toString();

        $query = Service::query()
            ->with(['vendor', 'category', 'carType'])
            ->when($tab === 'active', fn ($q) => $q->where('status', ActiveInactiveStatus::ACTIVE))
            ->when($tab === 'inactive', fn ($q) => $q->where('status', ActiveInactiveStatus::INACTIVE));

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['title', 'location', 'status'],
            'filterable' => ['status'],
            'sortable' => ['id', 'title', 'price', 'status', 'created_at'],
        ]);

        return Inertia::render('admin/service-management/services/index', [
            'services' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
            'tab' => $tab,
        ]);
    }

    public function show(Service $service): Response
    {
        $service->load(['vendor', 'category', 'carType', 'images', 'inclusions']);

        return Inertia::render('admin/service-management/services/show', [
            'service' => $service,
        ]);
    }

    public function approve(Service $service): RedirectResponse
    {
        $service->update([
            'status' => ActiveInactiveStatus::ACTIVE,
        ]);

        return back()->with('success', 'Service activated.');
    }

    public function cancel(Service $service): RedirectResponse
    {
        $service->update([
            'status' => ActiveInactiveStatus::INACTIVE,
        ]);

        return back()->with('success', 'Service deactivated.');
    }
}
