<?php

namespace App\Http\Controllers\Admin\OrderManagement;

use App\Enums\OrderStatus;
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
        $query = Order::query()
            ->with(['user', 'service.vendor', 'address']);

        if ($tab === 'requested') {
            $query->where('status', OrderStatus::Pending->value);
        } elseif ($tab === 'active') {
            $query->where('status', OrderStatus::Inprogress->value);
        }
        // tab === 'all' → no status filter

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['order_number', 'notes', 'status'],
            'filterable' => ['status'],
            'sortable' => ['id', 'order_number', 'total', 'status', 'created_at'],
        ]);

        $orderStatuses = array_map(
            fn (OrderStatus $status) => ['value' => $status->value, 'label' => $status->label()],
            OrderStatus::cases()
        );

        return Inertia::render('admin/order-management/orders/index', [
            'orders' => $result['data'],
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
            'tab' => $tab,
            'orderStatuses' => $orderStatuses,
        ]);
    }
}
