<?php

namespace App\Http\Controllers\Vendor\OrderManagement;

use App\Http\Controllers\Controller;
use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $vendor = auth()->guard('vendor')->user();

        $status = $request->input('type', 'pending');

        $baseQuery = Order::query()
            ->whereHas('service', function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id);
            })
            ->with(['user', 'service'])
            ->orderByDesc('created_at');

        // Status-wise counts for tabs
        $statuses = ['pending', 'confirmed', 'inprogress', 'completed', 'cancelled'];
        $counts = [];

        foreach ($statuses as $state) {
            $counts[$state] = (clone $baseQuery)->where('status', $state)->count();
        }

        // Paginated orders for the active tab
        $ordersPaginator = (clone $baseQuery)
            ->when($status, function ($query, $state) {
                $query->where('status', $state);
            })
            ->paginate(10)
            ->withQueryString();

        // Transform paginator items for the table, then extract as a plain array
        $ordersPaginator->through(function (Order $order) {
            return [
                'id' => $order->order_number,
                'reference' => (string) $order->id,
                'customerName' => optional($order->user)->name ?? 'N/A',
                'service' => optional($order->service)->title ?? 'N/A',
                'date' => optional($order->created_at)?->format('m/d/Y'),
                'status' => (string) $order->status->value,
                'amount' => (float) $order->total,
            ];
        });

        $orders = $ordersPaginator->items();

        $paginationData = [
            'current_page' => $ordersPaginator->currentPage(),
            'last_page' => $ordersPaginator->lastPage(),
            'per_page' => $ordersPaginator->perPage(),
            'total' => $ordersPaginator->total(),
            'from' => $ordersPaginator->firstItem(),
            'to' => $ordersPaginator->lastItem(),
        ];

        $offset = ($ordersPaginator->currentPage() - 1) * $ordersPaginator->perPage();

        return Inertia::render('vendor/orders', [
            'orders' => $orders,
            'counts' => $counts,
            'type' => $status,
            'pagination' => $paginationData,
            'offset' => $offset,
            'filters' => $request->input('filters', []),
            'search' => (string) $request->input('search', ''),
            'sortBy' => (string) $request->input('sort_by', 'created_at'),
            'sortOrder' => (string) $request->input('sort_order', 'desc'),
        ]);
    }
    public function orderDetails(): Response
    {
        // Use existing vendor order details TSX page
        return Inertia::render('vendor/order-details');
    }
    public function orderCandelledDetails(): Response
    {
        return Inertia::render('vendor/order-candelled-details');
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

        return back();
    }
}
