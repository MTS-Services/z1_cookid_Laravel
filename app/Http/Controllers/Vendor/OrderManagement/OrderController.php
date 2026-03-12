<?php

namespace App\Http\Controllers\Vendor\OrderManagement;

use App\Http\Controllers\Controller;
use App\Enums\OrderStatus;
use App\Models\Order;
use App\Services\DataTableService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(protected DataTableService $dataTableService)
    {
    }

    public function index(Request $request): Response
    {
        $vendor = auth()->guard('vendor')->user();

        $status = $request->input('type', 'pending');

        $baseQuery = Order::query()
            ->whereHas('service', function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id);
            })
            ->with(['user', 'service'])
            // Preserve real PK for route model binding; aliases for sortable/display
            ->select('orders.*')
            ->selectRaw('orders.id as order_primary_id')
            ->selectRaw('order_number as id')
            ->selectRaw('total as amount')
            ->selectRaw('created_at as date');

        // Status-wise counts for tabs
        $statuses = ['pending', 'confirmed', 'inprogress', 'completed', 'cancelled'];
        $counts = [];

        foreach ($statuses as $state) {
            $counts[$state] = (clone $baseQuery)->where('status', $state)->count();
        }

        // Apply active tab (status) filter for the main list
        $listQuery = (clone $baseQuery)->when($status, function ($query, $state) {
            $query->where('status', $state);
        });

        // Use shared DataTableService for pagination, search, filters & sorting
        $result = $this->dataTableService->process($listQuery, $request, [
            'searchable' => ['order_number'],
            'filterable' => ['status'],
            // Match sortable keys used by the vendor data table component
            'sortable' => ['id', 'amount', 'date', 'status'],
        ]);

        // Transform orders to the shape expected by the frontend (reference = real id for URLs)
        $orders = collect($result['data'])->map(function (Order $order) {
            return [
                'id' => $order->order_number,
                'reference' => (string) $order->order_primary_id,
                'customerName' => optional($order->user)->name ?? 'N/A',
                'service' => optional($order->service)->title ?? 'N/A',
                'date' => optional($order->created_at)?->format('m/d/Y'),
                'status' => (string) $order->status->value,
                'amount' => (float) $order->total,
            ];
        })->all();

        return Inertia::render('vendor/orders', [
            'orders' => $orders,
            'counts' => $counts,
            'type' => $status,
            'pagination' => $result['pagination'],
            'offset' => $result['offset'],
            'filters' => $result['filters'],
            'search' => $result['search'],
            'sortBy' => $result['sort_by'],
            'sortOrder' => $result['sort_order'],
        ]);
    }
    public function orderDetails(Order $order): Response
    {
        $order = $this->loadVendorOrder($order);

        return Inertia::render('vendor/order-details', [
            'order' => $this->formatOrderForView($order),
            'variant' => 'regular',
        ]);
    }

    public function orderCancelledDetails(Order $order): Response
    {
        $order = $this->loadVendorOrder($order);

        return Inertia::render('vendor/order-candelled-details', [
            'order' => $this->formatOrderForView($order),
            'variant' => 'cancelled',
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $vendor = auth()->guard('vendor')->user();

        // Ensure this order belongs to the current vendor
        if (! $order->service || $order->service->vendor_id !== $vendor->id) {
            abort(403);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::enum(OrderStatus::class)],
        ]);

        $status = $validated['status'];
        
        $order->status = match ($status) {
            'pending' => OrderStatus::Pending,
            'confirmed' => OrderStatus::Confirmed,
            'inprogress' => OrderStatus::Inprogress,
            'completed' => OrderStatus::Completed,
            'cancelled' => OrderStatus::Cancelled,
        };

        $order->save();

        return redirect()->route('vendor.order.index', ['type' => $order->status->value]);
    }

    protected function loadVendorOrder(Order $order): Order
    {
        $vendor = auth()->guard('vendor')->user();

        $order->loadMissing([
            'service.vendor',
            'user',
            'address',
            'payments',
        ]);

        if (! $order->service || $order->service->vendor_id !== $vendor->id) {
            abort(403);
        }

        return $order;
    }

    protected function formatOrderForView(Order $order): array
    {
        $latestPayment = $order->payments->sortByDesc(function ($payment) {
            return $payment->paid_at?->timestamp ?? $payment->created_at?->timestamp ?? 0;
        })->first();

        return [
            'id' => $order->id,
            'reference' => (string) $order->id,
            'orderNumber' => $order->order_number,
            'status' => $order->status->value,
            'statusLabel' => $order->status->label(),
            'scheduledAt' => optional($order->scheduled_at)?->toIso8601String(),
            'completedAt' => optional($order->completed_at)?->toIso8601String(),
            'createdAt' => optional($order->created_at)?->toIso8601String(),
            'totals' => [
                'subtotal' => isset($order->subtotal) ? (float) $order->subtotal : null,
                'discount' => isset($order->discount) ? (float) $order->discount : null,
                'total' => isset($order->total) ? (float) $order->total : null,
            ],
            'customer' => [
                'name' => optional($order->user)->name,
                'email' => optional($order->user)->email,
                'phone' => optional($order->user)->phone,
            ],
            'service' => [
                'title' => optional($order->service)->title,
                'description' => optional($order->service)->description,
                'duration' => optional($order->service)->duration,
                'location' => optional($order->service)->location,
                'amount' => optional($order->service)->price ? (float) $order->service->price : null,
                'vendorName' => optional(optional($order->service)->vendor)->shop_name
                    ?? trim(collect([
                        optional(optional($order->service)->vendor)->first_name,
                        optional(optional($order->service)->vendor)->last_name,
                    ])->filter()->implode(' ')),
            ],
            'address' => optional($order->address) ? [
                'firstName' => $order->address->first_name,
                'lastName' => $order->address->last_name,
                'email' => $order->address->email,
                'phone' => $order->address->phone,
                'addressLine' => $order->address->address,
                'city' => $order->address->city,
                'state' => $order->address->state,
                'zipCode' => $order->address->zip_code,
            ] : null,
            'payment' => $latestPayment ? [
                'status' => $latestPayment->status->value,
                'statusLabel' => $latestPayment->status->label(),
                'method' => optional($latestPayment->method)?->value,
                'methodLabel' => optional($latestPayment->method)?->label(),
                'transactionId' => $latestPayment->transaction_id,
                'amount' => isset($latestPayment->amount) ? (float) $latestPayment->amount : null,
                'paidAt' => optional($latestPayment->paid_at)?->toIso8601String(),
            ] : null,
            'cancellation' => [
                'cancelledBy' => $order->cancelled_by,
                'reason' => $order->cancelled_reason,
            ],
        ];
    }
}
