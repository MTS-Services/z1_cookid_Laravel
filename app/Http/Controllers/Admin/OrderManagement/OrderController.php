<?php

namespace App\Http\Controllers\Admin\OrderManagement;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(protected DataTableService $dataTableService) {}

    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'requested');
        $query = Order::query();

        if ($tab === 'requested') {
            $query->where('status', 'pending');
        } elseif ($tab === 'active') {
            $query->where('status', 'in_progress');
        }

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['order_number', 'service_name', 'vendor_name', 'status'],
            'filterable' => ['status'],
            'sortable' => ['id', 'order_number', 'price', 'status', 'created_at'],
        ]);

        return Inertia::render('admin/order-management/orders/index', [
            'orders' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
            'tab' => $tab,
        ]);
    }
}
