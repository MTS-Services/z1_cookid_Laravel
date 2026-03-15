import AdminLayout from '@/layouts/admin-layout'
import {
    Eye,
    DollarSign,
    ShoppingCart,
    Users,
    Store,
    Calendar,
} from 'lucide-react'
import { Link, router, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface StatItem {
    label: string
    value: string
    change: string
    changePositive: boolean
}

interface ChartPoint {
    label: string
    vendors: number
    orders: number
}

interface RecentOrder {
    id: number
    order_number: string
    status: string
    statusLabel: string
    created_at: string | null
    subtotal: number | null
    total: number
    service_name: string
    vendor_name: string
    commission: number
    vendor_earning: number
    buyer: string
    delivery: string
}

interface AdminDashboardProps {
    stats: StatItem[]
    chartData: ChartPoint[]
    recentOrders: RecentOrder[]
    recentOrdersTotal: number
    period: 'year' | 'month' | 'week'
    [key: string]: unknown
}

// ─── Constants ───────────────────────────────────────────────────────────────

const iconByLabel: Record<string, typeof Users> = {
    'Total Customers': Users,
    'Admin Revenue': DollarSign,
    'Pending Orders': ShoppingCart,
    'Active Vendors': Store,
}

const CHART_PADDING = { top: 10, right: 0, bottom: 24, left: 0 }
const Y_AXIS_WIDTH = 44
const CHART_H = 200
const INNER_W = 1000

const PERIOD_OPTIONS = [
    { value: 'year', label: 'This Year' },
    { value: 'month', label: 'This Month' },
    { value: 'week', label: 'This Week' },
] as const

// ─── Helpers ─────────────────────────────────────────────────────────────────

function niceMax(value: number): number {
    if (value <= 0) return 10
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
    const normalized = value / magnitude
    const nice =
        (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude
    return Math.ceil(nice / 5) * 5
}

function formatYLabel(v: number): string {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`
    if (v >= 1_000) return `${v / 1_000}K`
    return String(v)
}

function getXY(
    data: ChartPoint[],
    key: 'vendors' | 'orders',
    i: number,
    maxVal: number,
): [number, number] {
    const x = (i / Math.max(data.length - 1, 1)) * INNER_W
    const innerH = CHART_H - CHART_PADDING.top - CHART_PADDING.bottom
    const y =
        maxVal > 0
            ? CHART_H -
            CHART_PADDING.bottom -
            (data[i][key] / maxVal) * innerH
            : CHART_H - CHART_PADDING.bottom
    return [x, y]
}

function buildAreaPath(
    data: ChartPoint[],
    key: 'vendors' | 'orders',
    maxVal: number,
): string {
    if (data.length === 0) return ''
    const pts = data.map((_, i) => getXY(data, key, i, maxVal))
    const line = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x},${y}`).join(' ')
    return `${line} L ${INNER_W},${CHART_H} L 0,${CHART_H} Z`
}

function buildLinePath(
    data: ChartPoint[],
    key: 'vendors' | 'orders',
    maxVal: number,
): string {
    if (data.length === 0) return ''
    return data
        .map((_, i) => {
            const [x, y] = getXY(data, key, i, maxVal)
            return `${i === 0 ? 'M' : 'L'} ${x},${y}`
        })
        .join(' ')
}

function statusBadgeClass(statusValue: string): string {
    switch (statusValue) {
        case 'completed': return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
        case 'inprogress': return 'bg-navy/10 border-navy/50 text-navy'
        default: return 'bg-gray-500/10 border-gray-500/50 text-gray-300'
    }
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Dashboard() {
    const { stats, chartData, recentOrders, recentOrdersTotal, period } =
        usePage<AdminDashboardProps>().props

    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    // ── chart calculations ────────────────────────────────────────────────
    const { maxVal, yTicks, vendorArea, vendorLine, orderArea, orderLine } = useMemo(() => {
        const dataMax = Math.max(
            1,
            ...chartData.map((d) => Math.max(d.vendors, d.orders)),
        )
        const max = niceMax(dataMax)
        const ticks = Array.from({ length: 6 }, (_, i) => (i * max) / 5)

        return {
            maxVal: max,
            yTicks: ticks,
            vendorArea: buildAreaPath(chartData, 'vendors', max),
            vendorLine: buildLinePath(chartData, 'vendors', max),
            orderArea: buildAreaPath(chartData, 'orders', max),
            orderLine: buildLinePath(chartData, 'orders', max),
        }
    }, [chartData])

    const hoveredPoint = hoveredIndex != null ? chartData[hoveredIndex] : null
    const hoveredXPct =
        hoveredIndex != null && chartData.length > 0
            ? (hoveredIndex / Math.max(chartData.length - 1, 1)) * 100
            : 0

    // ── period filter change ──────────────────────────────────────────────
    function handlePeriodChange(value: string) {
        router.get(
            route('admin.dashboard'),
            { period: value },
            { preserveState: true, preserveScroll: true, replace: true },
        )
    }

    // ── label for tooltip ─────────────────────────────────────────────────
    const periodLabel =
        period === 'year' ? new Date().getFullYear().toString() :
            period === 'month' ? new Date().toLocaleString('default', { month: 'long', year: 'numeric' }) :
                'This Week'

    return (
        <AdminLayout activeSlug="dashboard">
            <div className="space-y-6 text-white p-6 min-h-screen">

                {/* ── Header ────────────────────────────────────────────── */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-semibold text-white">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500">Platform performance and key metrics</p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            Last 30 days overview
                        </span>
                        <button
                            type="button"
                            className="mt-1 flex items-center gap-2 bg-bg-gray border border-gray-800 px-3 py-1.5 rounded-lg text-xs"
                        >
                            <Calendar size={14} className="text-gray-400" />
                            Last 30 days
                            <span className="text-gray-500">▼</span>
                        </button>
                    </div>
                </div>

                {/* ── Stats Grid ────────────────────────────────────────── */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => {
                        const Icon = iconByLabel[stat.label] ?? Users
                        return (
                            <div
                                key={stat.label}
                                className="bg-bg-gray border border-gray-800/50 p-5 rounded-xl"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                                        <h3 className="text-2xl font-bold">{stat.value}</h3>
                                    </div>
                                    <div className="bg-[#26292B] p-2 rounded-lg">
                                        <Icon size={20} className="text-gray-300" />
                                    </div>
                                </div>
                                <p
                                    className={`text-[10px] mt-2 ${stat.changePositive ? 'text-blue-400' : 'text-red-400'
                                        }`}
                                >
                                    {stat.change}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* ── Chart Section ─────────────────────────────────────── */}
                <div className="bg-bg-gray border border-gray-800/50 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-lg font-medium text-white">Recent Performance</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Vendors vs Orders over time</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Legend */}
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="w-2.5 h-2.5 rounded-full bg-gray-500 inline-block" />
                                    Vendors
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                                    Orders
                                </span>
                            </div>

                            {/* Period Filter */}
                            <select
                                value={period}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                                className="bg-[#1a1c1e] border border-gray-700 text-gray-300 text-xs px-3 py-1.5 rounded-md outline-none cursor-pointer hover:border-gray-600 transition-colors"
                            >
                                {PERIOD_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-3 min-h-[240px]">
                        {/* Y-axis labels */}
                        <div
                            className="flex flex-col justify-between text-[10px] text-gray-500 shrink-0 pb-6"
                            style={{ width: Y_AXIS_WIDTH }}
                        >
                            {[...yTicks].reverse().map((tick) => (
                                <span key={tick}>
                                    {tick === 0 ? '0' : formatYLabel(tick)}
                                </span>
                            ))}
                        </div>

                        {/* Chart */}
                        <div className="flex-1 relative min-w-0">
                            <svg
                                className="w-full block"
                                style={{ height: CHART_H }}
                                viewBox={`0 0 ${INNER_W} ${CHART_H}`}
                                preserveAspectRatio="none"
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <defs>
                                    <linearGradient id="vendorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6b7280" stopOpacity="0.55" />
                                        <stop offset="100%" stopColor="#6b7280" stopOpacity="0.02" />
                                    </linearGradient>
                                    <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.50" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.02" />
                                    </linearGradient>
                                </defs>

                                {/* Grid lines */}
                                {yTicks.map((tick) => {
                                    const innerH = CHART_H - CHART_PADDING.top - CHART_PADDING.bottom
                                    const y =
                                        CHART_H -
                                        CHART_PADDING.bottom -
                                        (tick / maxVal) * innerH
                                    return (
                                        <line
                                            key={tick}
                                            x1={0}
                                            y1={y}
                                            x2={INNER_W}
                                            y2={y}
                                            stroke="rgb(75 85 99 / 0.35)"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                    )
                                })}

                                {/* Vendor area (gray, behind) */}
                                <path d={vendorArea} fill="url(#vendorGradient)" />
                                <path
                                    d={vendorLine}
                                    fill="none"
                                    stroke="#6b7280"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Order area (blue, front) */}
                                <path d={orderArea} fill="url(#orderGradient)" />
                                <path
                                    d={orderLine}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                                {/* Hover hit areas */}
                                {chartData.map((_, i) => {
                                    const slotW = INNER_W / chartData.length
                                    const cx = (i / Math.max(chartData.length - 1, 1)) * INNER_W
                                    return (
                                        <rect
                                            key={i}
                                            x={cx - slotW / 2}
                                            y={0}
                                            width={slotW}
                                            height={CHART_H}
                                            fill="transparent"
                                            onMouseEnter={() => setHoveredIndex(i)}
                                        />
                                    )
                                })}
                            </svg>

                            {/* X-axis labels */}
                            <div className="flex justify-between mt-1 px-0.5 text-[10px] text-gray-500">
                                {chartData.map((d, i) => (
                                    <span
                                        key={i}
                                        className={
                                            hoveredIndex === i ? 'text-gray-300' : ''
                                        }
                                    >
                                        {d.label}
                                    </span>
                                ))}
                            </div>

                            {/* Tooltip */}
                            {hoveredPoint != null && (
                                <>
                                    {/* vertical dashed line */}
                                    <div
                                        className="absolute top-0 pointer-events-none"
                                        style={{
                                            left: `${hoveredXPct}%`,
                                            height: CHART_H,
                                            borderLeft: '1px dashed rgba(255,255,255,0.3)',
                                        }}
                                    />

                                    {/* tooltip card */}
                                    <div
                                        className="absolute pointer-events-none z-10"
                                        style={{
                                            left: `${hoveredXPct}%`,
                                            top: 0,
                                            transform: 'translateX(-50%)',
                                        }}
                                    >
                                        <div className="bg-[#0F1012] border border-gray-700 rounded-lg shadow-xl overflow-hidden text-center min-w-[100px]">
                                            {/* header */}
                                            <div className="bg-navy px-3 py-1.5 text-[11px] font-semibold text-white">
                                                {hoveredPoint.label}{' '}
                                                {period === 'year' ? new Date().getFullYear() : periodLabel}
                                            </div>
                                            {/* rows */}
                                            <div className="divide-y divide-gray-800">
                                                <div className="px-3 py-1.5 flex items-center justify-between gap-3">
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                        <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
                                                        Vendors
                                                    </span>
                                                    <span className="text-xs font-bold text-white">
                                                        {hoveredPoint.vendors.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="px-3 py-1.5 flex items-center justify-between gap-3">
                                                    <span className="flex items-center gap-1 text-[10px] text-gray-400">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                                                        Orders
                                                    </span>
                                                    <span className="text-xs font-bold text-white">
                                                        {hoveredPoint.orders.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Recent Orders Table ───────────────────────────────── */}
                <div className="bg-bg-gray border border-gray-800/50 rounded-xl overflow-hidden">
                    <div className="p-6 flex justify-between items-center">
                        <h2 className="text-lg font-medium">Recent Orders</h2>
                        {recentOrdersTotal > recentOrders.length && (
                            <Link
                                href={route('admin.om.orders.index')}
                                className="text-xs text-navy hover:underline"
                            >
                                View all
                            </Link>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm min-w-[900px]">
                            <thead className="bg-[#141517] text-muted text-[11px] uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 font-normal">Order ID</th>
                                    <th className="px-6 py-4 font-normal">Service</th>
                                    <th className="px-6 py-4 font-normal">Vendor</th>
                                    <th className="px-6 py-4 font-normal">Total</th>
                                    <th className="px-6 py-4 font-normal">Commission</th>
                                    <th className="px-6 py-4 font-normal">Vendor Earning</th>
                                    <th className="px-6 py-4 font-normal">Status</th>
                                    <th className="px-6 py-4 font-normal">Delivery</th>
                                    <th className="px-6 py-4 font-normal">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                            No orders yet
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="hover:bg-white/[0.02] transition-colors"
                                        >
                                            <td className="px-6 py-4 text-gray-400">
                                                #{order.order_number}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {order.service_name}
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">
                                                {order.vendor_name}
                                            </td>
                                            <td className="px-6 py-4 font-semibold">
                                                $
                                                {order.total.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                $
                                                {order.commission.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                $
                                                {order.vendor_earning.toLocaleString('en-US', {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-[10px] border ${statusBadgeClass(order.status)}`}
                                                >
                                                    {order.statusLabel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-400">
                                                {order.delivery}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={route('admin.om.orders.index')}
                                                    className="text-gray-400 hover:text-white inline-flex"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {recentOrders.length > 0 && (
                        <div className="p-4 flex justify-between items-center border-t border-gray-800">
                            <span className="text-xs text-muted">
                                Showing 1 to {recentOrders.length} of {recentOrdersTotal} results
                            </span>
                            <Link
                                href={route('admin.om.orders.index')}
                                className="px-4 py-1.5 border border-gray-800 rounded-lg text-xs hover:bg-gray-800"
                            >
                                View all orders
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}