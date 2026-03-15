import AdminLayout from '@/layouts/admin-layout'
import {
    Eye,
    DollarSign,
    ShoppingCart,
    Users,
    Store,
    Calendar,
} from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'
import { useMemo, useState } from 'react'

interface StatItem {
    label: string
    value: string
    change: string
    changePositive: boolean
}

interface ChartPoint {
    month: number
    label: string
    value: number
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
    [key: string]: unknown
}

const iconByLabel: Record<string, typeof Users> = {
    'Total Customers': Users,
    'Admin Revenue': DollarSign,
    'Pending Orders': ShoppingCart,
    'Active Vendors': Store,
}

const CHART_PADDING = { top: 8, right: 8, bottom: 24, left: 0 }
const Y_AXIS_WIDTH = 44

function niceMax(value: number): number {
    if (value <= 0) return 50000
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
    const normalized = value / magnitude
    const nice = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10) * magnitude
    return Math.max(50000, Math.ceil(nice / 10000) * 10000)
}

function formatYLabel(v: number): string {
    if (v >= 1000) return `${v / 1000}K`
    return String(v)
}

function buildChartPath(
    chartData: ChartPoint[],
    width: number,
    height: number,
    maxVal: number,
): string {
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1 || 1)) * width
        const y =
            maxVal > 0
                ? height - (d.value / maxVal) * (height - CHART_PADDING.top - CHART_PADDING.bottom)
                : height - CHART_PADDING.bottom
        return `${x},${y}`
    })
    const line = `M ${points.join(' L ')}`
    return `${line} L ${width},${height} L 0,${height} Z`
}

function buildChartLinePath(
    chartData: ChartPoint[],
    width: number,
    height: number,
    maxVal: number,
): string {
    const points = chartData.map((d, i) => {
        const x = (i / (chartData.length - 1 || 1)) * width
        const y =
            maxVal > 0
                ? height - (d.value / maxVal) * (height - CHART_PADDING.top - CHART_PADDING.bottom)
                : height - CHART_PADDING.bottom
        return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
}

function statusBadgeClass(statusValue: string): string {
    switch (statusValue) {
        case 'completed':
            return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
        case 'inprogress':
            return 'bg-navy/10 border-navy/50 text-navy'
        default:
            return 'bg-gray-500/10 border-gray-500/50 text-gray-300'
    }
}

const currentYear = new Date().getFullYear()

export default function Dashboard() {
    const { stats, chartData, recentOrders, recentOrdersTotal } =
        usePage<AdminDashboardProps>().props
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

    const chartHeight = 200
    const chartInnerWidth = 1000
    const chartInnerHeight = chartHeight - CHART_PADDING.top - CHART_PADDING.bottom

    const { maxVal, yTicks, areaPath, linePath } = useMemo(() => {
        const dataMax = Math.max(1, ...chartData.map((d) => d.value))
        const max = niceMax(dataMax)
        const ticks = [0, max / 5, (2 * max) / 5, (3 * max) / 5, (4 * max) / 5, max]
        return {
            maxVal: max,
            yTicks: ticks,
            areaPath: buildChartPath(chartData, chartInnerWidth, chartHeight, max),
            linePath: buildChartLinePath(chartData, chartInnerWidth, chartHeight, max),
        }
    }, [chartData])

    const hoveredPoint = hoveredIndex != null ? chartData[hoveredIndex] : null
    const hoveredX =
        hoveredIndex != null && chartData.length > 0
            ? (hoveredIndex / (chartData.length - 1 || 1)) * 100
            : 0

    return (
        <AdminLayout activeSlug="dashboard">
            <div className="space-y-6 text-white p-6 min-h-screen">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-semibold text-white">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500">
                            Platform performance and key metrics
                        </p>
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

                {/* Stats Grid - 4 columns for admin */}
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
                                    className={`text-[10px] mt-2 ${stat.changePositive ? 'text-blue-400' : 'text-red-400'}`}
                                >
                                    {stat.change}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Sales Performance Chart Section */}
                <div className="bg-bg-gray border border-gray-800/50 p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-medium text-white">Sales Performance</h2>
                        <select className="bg-transparent border border-gray-800 text-gray-400 text-xs px-3 py-1.5 rounded-md outline-none cursor-pointer">
                            <option>This year</option>
                        </select>
                    </div>

                    <div className="flex gap-3 min-h-[240px]">
                        <div
                            className="flex flex-col justify-between text-[10px] text-gray-500 shrink-0"
                            style={{ width: Y_AXIS_WIDTH }}
                        >
                            {[...yTicks].reverse().map((tick) => (
                                <span key={tick}>
                                    {tick === 0 ? '0' : formatYLabel(tick)}
                                </span>
                            ))}
                        </div>

                        <div className="flex-1 relative min-w-0">
                            <svg
                                className="w-full h-[200px] block"
                                viewBox={`0 0 ${chartInnerWidth} ${chartHeight}`}
                                preserveAspectRatio="none"
                                onMouseLeave={() => setHoveredIndex(null)}
                            >
                                <defs>
                                    <linearGradient
                                        id="adminChartGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#3b82f6"
                                            stopOpacity="0.4"
                                        />
                                        <stop
                                            offset="100%"
                                            stopColor="#3b82f6"
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>
                                {yTicks.map((tick) => {
                                    const y =
                                        chartHeight -
                                        CHART_PADDING.bottom -
                                        (tick / maxVal) * chartInnerHeight
                                    return (
                                        <line
                                            key={tick}
                                            x1={0}
                                            y1={y}
                                            x2={chartInnerWidth}
                                            y2={y}
                                            stroke="rgb(75 85 99 / 0.5)"
                                            strokeWidth="1"
                                            strokeDasharray="4 4"
                                        />
                                    )
                                })}
                                <path d={areaPath} fill="url(#adminChartGradient)" />
                                <path
                                    d={linePath}
                                    fill="none"
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                {chartData.map((_, i) => (
                                    <rect
                                        key={i}
                                        x={
                                            (i / (chartData.length - 1 || 1)) * chartInnerWidth -
                                            chartInnerWidth / (chartData.length * 2)
                                        }
                                        y={0}
                                        width={chartInnerWidth / chartData.length}
                                        height={chartHeight}
                                        fill="transparent"
                                        onMouseEnter={() => setHoveredIndex(i)}
                                    />
                                ))}
                            </svg>

                            <div className="flex justify-between mt-2 px-0.5 text-[10px] text-gray-500">
                                {chartData.map((d) => (
                                    <span key={d.month}>{d.label}</span>
                                ))}
                            </div>

                            {hoveredPoint != null && (
                                <>
                                    <div
                                        className="absolute top-0 bottom-6 w-px border-l border-dashed border-white/40 pointer-events-none"
                                        style={{ left: `${hoveredX}%` }}
                                    />
                                    <div
                                        className="absolute pointer-events-none z-10 flex flex-col items-center"
                                        style={{
                                            left: `${hoveredX}%`,
                                            transform: 'translateX(-50%)',
                                            top: 0,
                                        }}
                                    >
                                        <div className="bg-[#0F1012] border border-gray-800 rounded shadow-lg overflow-hidden text-center min-w-[72px]">
                                            <div className="bg-navy px-3 py-1 text-[10px] font-bold text-white">
                                                {hoveredPoint.label} {currentYear}
                                            </div>
                                            <div className="px-3 py-1.5 text-xs font-bold text-white border-t border-gray-800">
                                                $
                                                {hoveredPoint.value.toLocaleString('en-US', {
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0,
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Orders Table */}
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
                                    <td
                                        colSpan={10}
                                        className="px-6 py-8 text-center text-gray-500"
                                    >
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
