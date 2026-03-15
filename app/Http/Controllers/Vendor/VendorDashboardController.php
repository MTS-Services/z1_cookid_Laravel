<?php

namespace App\Http\Controllers\Vendor;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use App\Models\VendorEarning;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class VendorDashboardController extends Controller
{
    public function dashboard(): Response
    {
        $vendor = auth()->guard('vendor')->user();

        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $ordersBaseQuery = Order::query()
            ->whereHas('service', fn ($q) => $q->where('vendor_id', $vendor->id));

        $activeListings = Service::query()
            ->where('vendor_id', $vendor->id)
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->count();

        $activeListingsLastMonth = Service::query()
            ->where('vendor_id', $vendor->id)
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->where('created_at', '<=', $endOfLastMonth)
            ->count();

        $earningsQuery = VendorEarning::query()->where('vendor_id', $vendor->id)->where('released_at', '!=', null);
        $totalRevenue = (clone $earningsQuery)->sum('net_amount');
        $revenueThisMonth = (clone $earningsQuery)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('net_amount');
        $revenueLastMonth = (clone $earningsQuery)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('net_amount');

        $pendingOrders = (clone $ordersBaseQuery)->where('status', OrderStatus::Pending)->count();
        $pendingOrdersLastMonth = (clone $ordersBaseQuery)
            ->where('status', OrderStatus::Pending)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        $stats = [
            [
                'label' => 'Active Listings',
                'value' => (string) $activeListings,
                'change' => $this->percentChange($activeListings, $activeListingsLastMonth).' vs last month',
                'changePositive' => $activeListings >= $activeListingsLastMonth,
            ],
            [
                'label' => 'Total Revenue',
                'value' => '$'.number_format((float) $totalRevenue, 2),
                'change' => $this->percentChange((float) $revenueThisMonth, (float) $revenueLastMonth).' vs last month',
                'changePositive' => $revenueThisMonth >= $revenueLastMonth,
            ],
            [
                'label' => 'Pending Orders',
                'value' => (string) $pendingOrders,
                'change' => $this->percentChange($pendingOrders, $pendingOrdersLastMonth).' vs last month',
                'changePositive' => $pendingOrders >= $pendingOrdersLastMonth,
            ],
        ];

        $currentYear = $now->year;
        $monthlyEarnings = VendorEarning::query()
            ->where('vendor_id', $vendor->id)
            ->where('released_at', '!=', null)
            ->whereYear('created_at', $currentYear)
            ->selectRaw('MONTH(created_at) as month')
            ->selectRaw('SUM(net_amount) as total')
            ->groupBy('month')
            ->pluck('total', 'month')
            ->all();

        $chartData = [];
        for ($m = 1; $m <= 12; $m++) {
            $chartData[] = [
                'month' => $m,
                'label' => Carbon::createFromDate($currentYear, $m, 1)->format('M'),
                'value' => (float) ($monthlyEarnings[$m] ?? 0),
            ];
        }

        $recentOrders = $ordersBaseQuery
            ->with(['user', 'service'])
            ->latest('orders.updated_at')
            ->limit(7)
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->order_number,
                    'reference' => (string) $order->id,
                    'buyer' => optional($order->user)->full_name ?? 'Customer',
                    'amount' => '$'.number_format((float) $order->total, 2),
                    'status' => $order->status->label(),
                    'statusValue' => $order->status->value,
                    'delivery' => optional($order->scheduled_at)?->format('m/d/Y') ?? '—',
                ];
            })
            ->all();

        $recentOrdersTotal = (clone $ordersBaseQuery)->count();

        return Inertia::render('vendor/dashboard', [
            'stats' => $stats,
            'chartData' => $chartData,
            'recentOrders' => $recentOrders,
            'recentOrdersTotal' => $recentOrdersTotal,
        ]);
    }

    private function percentChange(float|int $current, float|int $previous): string
    {
        if ($previous == 0) {
            return $current > 0 ? '+100%' : '0%';
        }
        $pct = round((($current - $previous) / $previous) * 100);

        return ($pct >= 0 ? '+' : '').$pct.'%';
    }
}
