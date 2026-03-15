<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\VendorStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Models\Vendor;
use App\Models\VendorEarning;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function dashboard(): Response
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfMonth = $now->copy()->endOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth = $now->copy()->subMonth()->endOfMonth();

        $totalCustomers = User::query()->count();
        $customersThisMonth = User::query()
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->count();
        $customersLastMonth = User::query()
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        // Admin revenue = platform commission (e.g. 7% of $100 = $7), not order total
        $commissionQuery = VendorEarning::query();
        $totalRevenue = (clone $commissionQuery)->sum('commission');
        $revenueThisMonth = (clone $commissionQuery)
            ->whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->sum('commission');
        $revenueLastMonth = (clone $commissionQuery)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->sum('commission');

        $pendingOrders = Order::query()->where('status', OrderStatus::Pending)->count();
        $pendingOrdersLastMonth = Order::query()
            ->where('status', OrderStatus::Pending)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        $activeVendors = Vendor::query()->where('status', VendorStatus::Active)->count();
        $activeVendorsLastMonth = Vendor::query()
            ->where('status', VendorStatus::Active)
            ->where('created_at', '<=', $endOfLastMonth)
            ->count();

        $stats = [
            [
                'label' => 'Total Customers',
                'value' => (string) $totalCustomers,
                'change' => $this->percentChange($customersThisMonth, $customersLastMonth).' vs last month',
                'changePositive' => $customersThisMonth >= $customersLastMonth,
            ],
            [
                'label' => 'Admin Revenue',
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
            [
                'label' => 'Active Vendors',
                'value' => (string) $activeVendors,
                'change' => $this->percentChange($activeVendors, $activeVendorsLastMonth).' vs last month',
                'changePositive' => $activeVendors >= $activeVendorsLastMonth,
            ],
        ];

        $currentYear = $now->year;
        $monthlyRevenue = VendorEarning::query()
            ->whereYear('created_at', $currentYear)
            ->selectRaw('MONTH(created_at) as month')
            ->selectRaw('SUM(commission) as total')
            ->groupBy('month')
            ->pluck('total', 'month')
            ->all();

        $chartData = [];
        for ($m = 1; $m <= 12; $m++) {
            $chartData[] = [
                'month' => $m,
                'label' => Carbon::createFromDate($currentYear, $m, 1)->format('M'),
                'value' => (float) ($monthlyRevenue[$m] ?? 0),
            ];
        }

        $recentOrders = Order::query()
            ->with(['user', 'service.vendor', 'vendorEarning'])
            ->latest('orders.updated_at')
            ->limit(7)
            ->get()
            ->map(function (Order $order) {
                $earning = $order->vendorEarning->sortByDesc('id')->first();
                $total = (float) $order->total;
                $commission = $earning ? (float) $earning->commission : 0.0;
                $vendorEarning = $earning ? (float) $earning->net_amount : $total;

                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status->value,
                    'statusLabel' => $order->status->label(),
                    'created_at' => $order->created_at?->toIso8601String(),
                    'subtotal' => isset($order->subtotal) ? (float) $order->subtotal : null,
                    'total' => $total,
                    'service_name' => $order->service?->title ?? 'N/A',
                    'vendor_name' => $order->service?->vendor?->full_name ?? $order->service?->vendor?->shop_name ?? 'N/A',
                    'commission' => $commission,
                    'vendor_earning' => $vendorEarning,
                    'buyer' => optional($order->user)->full_name ?? 'Customer',
                    'delivery' => optional($order->scheduled_at)?->format('m/d/Y') ?? '—',
                ];
            })
            ->all();

        $recentOrdersTotal = Order::query()->count();

        return Inertia::render('admin/dashboard', [
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
