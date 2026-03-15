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
            ->with(['user', 'service.vendor', 'address', 'vendorEarning']);

        if ($tab === 'requested') {
            $query->where('status', OrderStatus::Pending->value);
        } elseif ($tab === 'active') {
            $query->whereIn('status', [
                OrderStatus::Confirmed->value,
                OrderStatus::Inprogress->value,
            ]);
        }
        // tab === 'all' → no status filter

        $result = $this->dataTableService->process($query, $request, [
            'searchable' => ['order_number', 'notes', 'status'],
            'filterable' => ['status'],
            'sortable' => ['id', 'order_number', 'total', 'status', 'created_at'],
        ]);

        $orders = array_map(function (Order $order) {
            $earning = $order->vendorEarning->sortByDesc('id')->first();
            $total = (float) $order->total;
            $commission = $earning ? (float) $earning->commission : 0.0;
            $vendorEarning = $earning ? (float) $earning->net_amount : $total;

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status->value,
                'created_at' => $order->created_at?->toIso8601String(),
                'subtotal' => isset($order->subtotal) ? (float) $order->subtotal : null,
                'total' => $total,
                'service_name' => $order->service?->title ?? 'N/A',
                'vendor_name' => $order->service?->vendor
                    ? trim(($order->service->vendor->first_name ?? '').' '.($order->service->vendor->last_name ?? '')) ?: $order->service->vendor->shop_name ?? 'N/A'
                    : 'N/A',
                'price' => $total,
                'commission' => $commission,
                'vendor_earning' => $vendorEarning,
                'service' => $order->service ? [
                    'id' => $order->service->id,
                    'title' => $order->service->title,
                    'price' => $order->service->price ? (float) $order->service->price : null,
                    'vendor' => $order->service->vendor ? [
                        'first_name' => $order->service->vendor->first_name,
                        'last_name' => $order->service->vendor->last_name,
                    ] : null,
                ] : null,
            ];
        }, $result['data']);

        $orderStatuses = array_map(
            fn (OrderStatus $status) => ['value' => $status->value, 'label' => $status->label()],
            OrderStatus::cases()
        );

        return Inertia::render('admin/order-management/orders/index', [
            'orders' => $orders,
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
