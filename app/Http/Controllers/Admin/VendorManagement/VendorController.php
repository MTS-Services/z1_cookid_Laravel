<?php

namespace App\Http\Controllers\Admin\VendorManagement;

use App\Enums\VendorStatus;
use App\Http\Controllers\Controller;
use App\Models\Vendor;
use App\Services\DataTableService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'requested');
        $query = Vendor::query();

        if ($tab === 'requested') {
            $query->where('status', VendorStatus::Pending);
        } elseif ($tab === 'suspended') {
            $query->where('status', VendorStatus::Suspended);
        }

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['first_name', 'last_name', 'shop_name', 'email', 'phone', 'address'],
            'sortable' => ['id', 'first_name', 'last_name', 'created_at'],
        ]);

        return Inertia::render('admin/vendor-management/vendors/index', [
            'vendors' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
            'tab' => $tab,
        ]);
    }

    public function show(int $id): Response
    {
        $vendor = Vendor::findOrFail($id);

        return Inertia::render('admin/vendor-management/vendors/show', [
            'vendor' => $vendor,
        ]);
    }

    public function approve(int $id): RedirectResponse
    {
        $vendor = Vendor::findOrFail($id);
        $vendor->update(['status' => VendorStatus::Active]);

        return redirect()->route('admin.vm.vendors.index', ['tab' => 'requested'])
            ->with('success', 'Vendor approved successfully.');
    }

    public function reject(int $id): RedirectResponse
    {
        $vendor = Vendor::findOrFail($id);
        $vendor->update(['status' => VendorStatus::Suspended]);

        return redirect()->route('admin.vm.vendors.index', ['tab' => 'requested'])
            ->with('success', 'Vendor request declined.');
    }
}
