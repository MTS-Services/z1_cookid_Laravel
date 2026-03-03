<?php

namespace App\Http\Controllers\Admin\ServiceManagement;

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
        $tab = $request->string('tab', 'requested')->toString();

        $query = Service::query()
            ->with('vendor')
            ->when($tab === 'requested', fn ($q) => $q->where('status', 'requested'));

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['service_name', 'area', 'city', 'status'],
            'filterable' => ['status'],
            'sortable' => ['id', 'service_name', 'price', 'status', 'created_at'],
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
        $service->load('vendor');

        return Inertia::render('admin/service-management/services/show', [
            'service' => $service,
        ]);
    }

    public function approve(Service $service): RedirectResponse
    {
        $service->update([
            'status' => 'in_progress',
        ]);

        return back()->with('success', 'Service request approved.');
    }

    public function cancel(Service $service): RedirectResponse
    {
        $service->update([
            'status' => 'cancelled',
        ]);

        return back()->with('success', 'Service request cancelled.');
    }
}
