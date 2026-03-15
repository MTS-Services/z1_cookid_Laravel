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
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $now        = Carbon::now();
        $period     = $request->input('period', 'year'); // 'year' | 'month' | 'week'

        // ── date ranges for stats cards ──────────────────────────────────────
        $startOfMonth     = $now->copy()->startOfMonth();
        $endOfMonth       = $now->copy()->endOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth   = $now->copy()->subMonth()->endOfMonth();

        // ── stat cards ───────────────────────────────────────────────────────
        $totalCustomers      = User::query()->count();
        $customersThisMonth  = User::query()->whereBetween('created_at', [$startOfMonth, $endOfMonth])->count();
        $customersLastMonth  = User::query()->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $commissionQuery    = VendorEarning::query();
        $totalRevenue       = (clone $commissionQuery)->sum('commission');
        $revenueThisMonth   = (clone $commissionQuery)->whereBetween('created_at', [$startOfMonth, $endOfMonth])->sum('commission');
        $revenueLastMonth   = (clone $commissionQuery)->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->sum('commission');

        $pendingOrders          = Order::query()->where('status', OrderStatus::Pending)->count();
        $pendingOrdersLastMonth = Order::query()
            ->where('status', OrderStatus::Pending)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        $activeVendors          = Vendor::query()->where('status', VendorStatus::Active)->count();
        $activeVendorsLastMonth = Vendor::query()
            ->where('status', VendorStatus::Active)
            ->where('created_at', '<=', $endOfLastMonth)
            ->count();

        $stats = [
            [
                'label'          => 'Total Customers',
                'value'          => (string) $totalCustomers,
                'change'         => $this->percentChange($customersThisMonth, $customersLastMonth) . ' vs last month',
                'changePositive' => $customersThisMonth >= $customersLastMonth,
            ],
            [
                'label'          => 'Admin Revenue',
                'value'          => '$' . number_format((float) $totalRevenue, 2),
                'change'         => $this->percentChange((float) $revenueThisMonth, (float) $revenueLastMonth) . ' vs last month',
                'changePositive' => $revenueThisMonth >= $revenueLastMonth,
            ],
            [
                'label'          => 'Pending Orders',
                'value'          => (string) $pendingOrders,
                'change'         => $this->percentChange($pendingOrders, $pendingOrdersLastMonth) . ' vs last month',
                'changePositive' => $pendingOrders >= $pendingOrdersLastMonth,
            ],
            [
                'label'          => 'Active Vendors',
                'value'          => (string) $activeVendors,
                'change'         => $this->percentChange($activeVendors, $activeVendorsLastMonth) . ' vs last month',
                'changePositive' => $activeVendors >= $activeVendorsLastMonth,
            ],
        ];

        // ── chart data based on period ───────────────────────────────────────
        $chartData = match ($period) {
            'month' => $this->chartForMonth($now),
            'week'  => $this->chartForWeek($now),
            default => $this->chartForYear($now),      // 'year'
        };

        // ── recent orders ────────────────────────────────────────────────────
        $recentOrders = Order::query()
            ->with(['user', 'service.vendor', 'vendorEarning'])
            ->latest('orders.updated_at')
            ->limit(7)
            ->get()
            ->map(function (Order $order) {
                $earning      = $order->vendorEarning->sortByDesc('id')->first();
                $total        = (float) $order->total;
                $commission   = $earning ? (float) $earning->commission  : 0.0;
                $vendorEarning = $earning ? (float) $earning->net_amount : $total;

                return [
                    'id'             => $order->id,
                    'order_number'   => $order->order_number,
                    'status'         => $order->status->value,
                    'statusLabel'    => $order->status->label(),
                    'created_at'     => $order->created_at?->toIso8601String(),
                    'subtotal'       => isset($order->subtotal) ? (float) $order->subtotal : null,
                    'total'          => $total,
                    'service_name'   => $order->service?->title ?? 'N/A',
                    'vendor_name'    => $order->service?->vendor?->full_name ?? $order->service?->vendor?->shop_name ?? 'N/A',
                    'commission'     => $commission,
                    'vendor_earning' => $vendorEarning,
                    'buyer'          => optional($order->user)->full_name ?? 'Customer',
                    'delivery'       => optional($order->scheduled_at)?->format('m/d/Y') ?? '—',
                ];
            })
            ->all();

        $recentOrdersTotal = Order::query()->count();

        return Inertia::render('admin/dashboard', [
            'stats'             => $stats,
            'chartData'         => $chartData,
            'recentOrders'      => $recentOrders,
            'recentOrdersTotal' => $recentOrdersTotal,
            'period'            => $period,
        ]);
    }

    // ── This Year: 12 months ─────────────────────────────────────────────────
    private function chartForYear(Carbon $now): array
    {
        $year = $now->year;

        $monthlyVendors = Vendor::query()
            ->whereYear('created_at', $year)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->groupBy('month')
            ->pluck('total', 'month')
            ->all();

        $monthlyOrders = Order::query()
            ->whereYear('created_at', $year)
            ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->groupBy('month')
            ->pluck('total', 'month')
            ->all();

        $data = [];
        for ($m = 1; $m <= 12; $m++) {
            $data[] = [
                'label'   => Carbon::createFromDate($year, $m, 1)->format('M'),
                'vendors' => (int) ($monthlyVendors[$m] ?? 0),
                'orders'  => (int) ($monthlyOrders[$m] ?? 0),
            ];
        }
        return $data;
    }

    // ── This Month: each day ─────────────────────────────────────────────────
    private function chartForMonth(Carbon $now): array
    {
        $start = $now->copy()->startOfMonth();
        $end   = $now->copy()->endOfMonth();

        $dailyVendors = Vendor::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DAY(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->all();

        $dailyOrders = Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DAY(created_at) as day, COUNT(*) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->all();

        $data = [];
        $daysInMonth = $now->daysInMonth;
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $data[] = [
                'label'   => (string) $d,
                'vendors' => (int) ($dailyVendors[$d] ?? 0),
                'orders'  => (int) ($dailyOrders[$d] ?? 0),
            ];
        }
        return $data;
    }

    // ── This Week: Mon–Sun ───────────────────────────────────────────────────
    private function chartForWeek(Carbon $now): array
    {
        $start = $now->copy()->startOfWeek(Carbon::MONDAY);
        $end   = $now->copy()->endOfWeek(Carbon::SUNDAY);

        $vendorsByDay = Vendor::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DAYOFWEEK(created_at) as dow, COUNT(*) as total')
            ->groupBy('dow')
            ->pluck('total', 'dow')
            ->all();

        $ordersByDay = Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DAYOFWEEK(created_at) as dow, COUNT(*) as total')
            ->groupBy('dow')
            ->pluck('total', 'dow')
            ->all();

        // MySQL DAYOFWEEK: 1=Sun,2=Mon,...,7=Sat → map to Mon–Sun
        $dayMap = [
            ['label' => 'Mon', 'dow' => 2],
            ['label' => 'Tue', 'dow' => 3],
            ['label' => 'Wed', 'dow' => 4],
            ['label' => 'Thu', 'dow' => 5],
            ['label' => 'Fri', 'dow' => 6],
            ['label' => 'Sat', 'dow' => 7],
            ['label' => 'Sun', 'dow' => 1],
        ];

        $data = [];
        foreach ($dayMap as $day) {
            $data[] = [
                'label'   => $day['label'],
                'vendors' => (int) ($vendorsByDay[$day['dow']] ?? 0),
                'orders'  => (int) ($ordersByDay[$day['dow']] ?? 0),
            ];
        }
        return $data;
    }

    private function percentChange(float|int $current, float|int $previous): string
    {
        if ($previous == 0) {
            return $current > 0 ? '+100%' : '0%';
        }
        $pct = round((($current - $previous) / $previous) * 100);
        return ($pct >= 0 ? '+' : '') . $pct . '%';
    }
}