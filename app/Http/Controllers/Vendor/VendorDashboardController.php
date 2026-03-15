<?php

namespace App\Http\Controllers\Vendor;

use App\Enums\ActiveInactiveStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Service;
use App\Models\VendorEarning;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VendorDashboardController extends Controller
{
    public function dashboard(Request $request): Response
    {
        $vendor = auth()->guard('vendor')->user();
        $now    = Carbon::now();
        $period = $request->input('period', 'year'); // 'year' | 'month' | 'week'

        // ── date ranges for stat cards ────────────────────────────────────
        $startOfMonth     = $now->copy()->startOfMonth();
        $endOfMonth       = $now->copy()->endOfMonth();
        $startOfLastMonth = $now->copy()->subMonth()->startOfMonth();
        $endOfLastMonth   = $now->copy()->subMonth()->endOfMonth();

        $ordersBaseQuery = Order::query()
            ->whereHas('service', fn ($q) => $q->where('vendor_id', $vendor->id));

        // ── active listings ───────────────────────────────────────────────
        $activeListings = Service::query()
            ->where('vendor_id', $vendor->id)
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->count();

        $activeListingsLastMonth = Service::query()
            ->where('vendor_id', $vendor->id)
            ->where('status', ActiveInactiveStatus::ACTIVE)
            ->where('created_at', '<=', $endOfLastMonth)
            ->count();

        // ── earnings ──────────────────────────────────────────────────────
        $earningsQuery    = VendorEarning::query()->where('vendor_id', $vendor->id)->whereNotNull('released_at');
        $totalRevenue     = (clone $earningsQuery)->sum('net_amount');
        $revenueThisMonth = (clone $earningsQuery)->whereBetween('created_at', [$startOfMonth, $endOfMonth])->sum('net_amount');
        $revenueLastMonth = (clone $earningsQuery)->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->sum('net_amount');

        // ── pending orders ────────────────────────────────────────────────
        $pendingOrders          = (clone $ordersBaseQuery)->where('status', OrderStatus::Pending)->count();
        $pendingOrdersLastMonth = (clone $ordersBaseQuery)
            ->where('status', OrderStatus::Pending)
            ->whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])
            ->count();

        $stats = [
            [
                'label'          => 'Active Listings',
                'value'          => (string) $activeListings,
                'change'         => $this->percentChange($activeListings, $activeListingsLastMonth) . ' vs last month',
                'changePositive' => $activeListings >= $activeListingsLastMonth,
            ],
            [
                'label'          => 'Total Revenue',
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
        ];

        // ── chart data based on period ────────────────────────────────────
        $chartData = match ($period) {
            'month' => $this->chartForMonth($now, $vendor->id),
            'week'  => $this->chartForWeek($now, $vendor->id),
            default => $this->chartForYear($now, $vendor->id),
        };

        // ── recent orders ─────────────────────────────────────────────────
        $recentOrders = $ordersBaseQuery
            ->with(['user', 'service'])
            ->latest('orders.updated_at')
            ->limit(7)
            ->get()
            ->map(function (Order $order) {
                return [
                    'id'          => $order->order_number,
                    'reference'   => (string) $order->id,
                    'buyer'       => optional($order->user)->full_name ?? 'Customer',
                    'amount'      => '$' . number_format((float) $order->total, 2),
                    'status'      => $order->status->label(),
                    'statusValue' => $order->status->value,
                    'delivery'    => optional($order->scheduled_at)?->format('m/d/Y') ?? '—',
                ];
            })
            ->all();

        $recentOrdersTotal = (clone $ordersBaseQuery)->count();

        return Inertia::render('vendor/dashboard', [
            'stats'             => $stats,
            'chartData'         => $chartData,
            'recentOrders'      => $recentOrders,
            'recentOrdersTotal' => $recentOrdersTotal,
            'period'            => $period,
        ]);
    }

    // ── This Year: 12 months ──────────────────────────────────────────────
    private function chartForYear(Carbon $now, int $vendorId): array
    {
        $year = $now->year;

        $monthly = VendorEarning::query()
            ->where('vendor_id', $vendorId)
            ->whereNotNull('released_at')
            ->whereYear('created_at', $year)
            ->selectRaw('MONTH(created_at) as month, SUM(net_amount) as total')
            ->groupBy('month')
            ->pluck('total', 'month')
            ->all();

        $data = [];
        for ($m = 1; $m <= 12; $m++) {
            $data[] = [
                'label' => Carbon::createFromDate($year, $m, 1)->format('M'),
                'value' => (float) ($monthly[$m] ?? 0),
            ];
        }
        return $data;
    }

    // ── This Month: each day ──────────────────────────────────────────────
    private function chartForMonth(Carbon $now, int $vendorId): array
    {
        $start = $now->copy()->startOfMonth();
        $end   = $now->copy()->endOfMonth();

        $daily = VendorEarning::query()
            ->where('vendor_id', $vendorId)
            ->whereNotNull('released_at')
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DAY(created_at) as day, SUM(net_amount) as total')
            ->groupBy('day')
            ->pluck('total', 'day')
            ->all();

        $data = [];
        for ($d = 1; $d <= $now->daysInMonth; $d++) {
            $data[] = [
                'label' => (string) $d,
                'value' => (float) ($daily[$d] ?? 0),
            ];
        }
        return $data;
    }

    // ── This Week: Mon–Sun ────────────────────────────────────────────────
    private function chartForWeek(Carbon $now, int $vendorId): array
    {
        $start = $now->copy()->startOfWeek(Carbon::MONDAY);
        $end   = $now->copy()->endOfWeek(Carbon::SUNDAY);

        $byDay = VendorEarning::query()
            ->where('vendor_id', $vendorId)
            ->whereNotNull('released_at')
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw('DAYOFWEEK(created_at) as dow, SUM(net_amount) as total')
            ->groupBy('dow')
            ->pluck('total', 'dow')
            ->all();

        // MySQL DAYOFWEEK: 1=Sun, 2=Mon, …, 7=Sat
        $dayMap = [
            ['label' => 'Mon', 'dow' => 2],
            ['label' => 'Tue', 'dow' => 3],
            ['label' => 'Wed', 'dow' => 4],
            ['label' => 'Thu', 'dow' => 5],
            ['label' => 'Fri', 'dow' => 6],
            ['label' => 'Sat', 'dow' => 7],
            ['label' => 'Sun', 'dow' => 1],
        ];

        return array_map(fn ($d) => [
            'label' => $d['label'],
            'value' => (float) ($byDay[$d['dow']] ?? 0),
        ], $dayMap);
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