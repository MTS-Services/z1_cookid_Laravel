import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import Pagination from '@/components/ui/pagination'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VendorLayout from '@/layouts/vendor-layout'
import { cn } from '@/lib/utils'
import { Link, router, usePage } from '@inertiajs/react'
import { CheckCircle2, Clock, Copy, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useDataTable } from '@/hooks/use-data-table'
import type { PaginationData, ColumnConfig, FilterConfig } from '@/types/data-table.types'

type OrderStatus = 'pending' | 'confirmed' | 'inprogress' | 'completed' | 'cancelled'

interface Order {
    id: string
    reference: string
    customerName: string
    service: string
    date: string
    status: OrderStatus
    amount: number
}

interface VendorOrdersPageProps {
    orders: Order[]
    counts: Record<OrderStatus, number>
    type: OrderStatus
    pagination: PaginationData
    offset: number
    filters: Record<string, string | number>
    search: string
    sortBy: string
    sortOrder: 'asc' | 'desc'
}

const statusConfig: Record<
    OrderStatus,
    { label: string; badgeClassName: string; cardBorderClassName: string }
> = {
    pending: {
        label: 'Pending',
        badgeClassName: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
        cardBorderClassName: 'border-t-2 border-emerald-500',
    },
    confirmed: {
        label: 'Confirmed',
        badgeClassName: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
        cardBorderClassName: 'border-t-2 border-emerald-500',
    },
    inprogress: {
        label: 'In Progress',
        badgeClassName: 'border-navy/50 bg-navy/10 text-blue-400',
        cardBorderClassName: 'border-t-2 border-navy',
    },
    completed: {
        label: 'Completed',
        badgeClassName: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
        cardBorderClassName: 'border-t-2 border-emerald-500',
    },
    cancelled: {
        label: 'Cancelled',
        badgeClassName: 'border-slate-500/50 bg-slate-500/10 text-slate-400',
        cardBorderClassName: 'border-t-2 border-slate-500',
    },
}

export default function Orders() {
    const { orders, counts, type, pagination, offset, filters, search, sortBy, sortOrder } =
        usePage<VendorOrdersPageProps>().props

    const [statusFilter, setStatusFilter] = useState<OrderStatus>(type ?? 'pending')
    const [currentPage, setCurrentPage] = useState(pagination.current_page ?? 1)
    const totalPages = pagination.last_page ?? 1

    // Keep tab and pagination in sync with URL / server props (e.g. ?type=confirmed)
    useEffect(() => {
        setStatusFilter(type ?? 'pending')
    }, [type])
    useEffect(() => {
        setCurrentPage(pagination.current_page ?? 1)
    }, [pagination.current_page])

    const {
        isLoading,
        handleSearch,
        handleFilterChange,
        handleSort,
        handlePerPageChange,
        handlePageChange,
    } = useDataTable({
        only: ['orders', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder', 'counts', 'type'],
    })

    const enrichedOrders = orders

    const columns: ColumnConfig<Order>[] = [
        {
            key: 'id',
            label: 'Order ID',
            sortable: true,
            render: (order) => (
                <span className="font-medium text-white">
                    {order.id}
                </span>
            ),
        },
        {
            key: 'customerName',
            label: 'Buyer',
            sortable: true,
            render: (order) => <span className="text-slate-300">{order.customerName}</span>,
        },
        {
            key: 'service',
            label: 'Service',
            sortable: true,
            render: (order) => <span className="text-slate-300">{order.service}</span>,
        },
        {
            key: 'amount',
            label: 'Amount',
            sortable: true,
            render: (order) => <span className="text-slate-400">${order.amount}</span>,
        },
        {
            key: 'date',
            label: 'Date',
            sortable: true,
            render: (order) => <span className="text-slate-400">{order.date}</span>,
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (order) => {
                const config = statusConfig[order.status]

                return (
                    <span
                        className={cn(
                            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                            config.badgeClassName,
                        )}
                    >
                        {config.label}
                    </span>
                )
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (order) => (
                <div className="flex justify-end gap-2">
                    {order.status === 'pending' && (
                        <>
                            <Button
                                size="sm"
                                className="h-9 rounded bg-navy px-4 text-sm font-medium text-white hover:bg-navy"
                                onClick={() =>
                                    router.patch(
                                        route('vendor.order.update-status', { order: order.reference }),
                                        { status: 'confirmed' },
                                        { preserveScroll: true, preserveState: true },
                                    )
                                }
                            >
                                Accept
                            </Button>
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-9 rounded bg-dark-gray px-4 text-sm font-medium text-white hover:bg-slate-800"
                                onClick={() =>
                                    router.patch(
                                        route('vendor.order.update-status', { order: order.reference }),
                                        { status: 'cancelled' },
                                        { preserveScroll: true, preserveState: true },
                                    )
                                }
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {order.status == 'inprogress' && (
                        <>
                            <Button
                                size="sm"
                                className="h-9 rounded bg-navy px-4 text-sm font-medium text-white hover:bg-navy"
                                onClick={() =>
                                    router.patch(
                                        route('vendor.order.update-status', { order: order.reference }),
                                        { status: 'completed' },
                                        { preserveScroll: true, preserveState: true },
                                    )
                                }
                            >
                                Completed
                            </Button>
                        </>
                    )}
                    {order.status == 'completed' && (
                        <>
                            <Button
                                size="sm"
                                className="h-9 rounded bg-navy px-4 text-sm font-medium text-white hover:bg-navy"
                            >
                                <Link href={route('vendor.order.details', { order: order.reference })}>
                                    See Details
                                </Link>
                            </Button>
                        </>
                    )}
                    {order.status == 'cancelled' && (
                        <>
                            <Button
                                size="sm"
                                className="h-9 rounded bg-navy px-4 text-sm font-medium text-white hover:bg-navy cursor-pointer"
                            >
                                <Link href={route('vendor.order.cancelled-details', { order: order.reference })}>
                                    See Details
                                </Link>
                            </Button>
                        </>
                    )}
                    {order.status == 'confirmed' && (
                        <>
                            <Button
                                size="sm"
                                className="h-9 rounded bg-navy px-4 text-sm font-medium text-white hover:bg-navy cursor-pointer"
                                onClick={() =>
                                    router.patch(
                                        route('vendor.order.update-status', { order: order.reference }),
                                        { status: 'inprogress' },
                                        { preserveScroll: true, preserveState: true },
                                    )
                                }
                            >
                                Next Step
                            </Button>
                        </>
                    )}
                </div>
            ),
            className: 'text-right',
        },
    ]

    const filterConfig: FilterConfig[] = [
        {
            key: 'status',
            label: 'Status',
            placeholder: 'Filter by status',
            options: [
                { label: 'Pending', value: 'pending' },
                { label: 'Confirmed', value: 'confirmed' },
                { label: 'In Progress', value: 'inprogress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
            ],
        },
    ]

    const filteredOrders = orders

    return (
        <VendorLayout activeSlug="orders">
            <section className="space-y-8">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Orders</h1>
                    </div>
                </header>

                <div className="p-4  md:p-6">
                    <div className="space-y-6">
                        <Tabs
                            value={statusFilter}
                            onValueChange={(value) => {
                                const next = value as OrderStatus
                                setStatusFilter(next)

                                router.get(
                                    route('vendor.order.index'),
                                    { type: next },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                        replace: true,
                                    },
                                )
                            }}
                            className="w-full"
                        >
                            <TabsList className="inline-flex h-11 rounded-lg border border-white/10 bg-dark-gray px-2 py-1 text-slate-300">
                                <TabsTrigger
                                    value="pending"
                                    className="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-none"
                                >
                                    <Clock className="h-4 w-4" />
                                    <span>Pending</span>
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-900">
                                        {counts.pending}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="confirmed"
                                    className="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-none"
                                >
                                    <Clock className="h-4 w-4" />
                                    <span>Confirmed</span>
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-900">
                                        {counts.confirmed}
                                    </span>
                                </TabsTrigger>

                                <TabsTrigger
                                    value="inprogress"
                                    className="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-none"
                                >
                                    <Clock className="h-4 w-4" />
                                    <span>In Progress</span>
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-900">
                                        {counts.inprogress}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="completed"
                                    className="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-none"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Completed</span>
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-900">
                                        {counts.completed}
                                    </span>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="cancelled"
                                    className="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-none"
                                >
                                    <XCircle className="h-4 w-4" />
                                    <span>Cancelled</span>
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-900">
                                        {counts.cancelled}
                                    </span>
                                </TabsTrigger>
                            </TabsList>
                            {(['pending', 'confirmed', 'inprogress', 'completed', 'cancelled'] as const).map((tabValue) => (
                                <TabsContent key={tabValue} value={tabValue} className="mt-4">
                                    <div
                                        className={cn(
                                            'overflow-hidden rounded-2xl border border-white/5 bg-dark-gray',
                                            statusConfig[statusFilter].cardBorderClassName,
                                        )}
                                    >
                                        <div className="border-b border-white/10 px-6 py-4">
                                            <h2 className="text-lg font-semibold text-white">
                                                {statusConfig[statusFilter].label} Orders
                                            </h2>
                                        </div>

                                        <CardContent>
                                            <DataTable<Order>
                                                data={enrichedOrders}
                                                columns={columns}
                                                pagination={pagination}
                                                offset={offset}
                                                filters={filterConfig}
                                                onSearch={handleSearch}
                                                onFilterChange={handleFilterChange}
                                                onSort={handleSort}
                                                onPerPageChange={handlePerPageChange}
                                                onPageChange={handlePageChange}
                                                searchValue={search}
                                                filterValues={filters}
                                                sortBy={sortBy}
                                                sortOrder={sortOrder}
                                                isLoading={isLoading}
                                                emptyMessage="No orders found"
                                                searchPlaceholder="Search by order ID, service, or vendor"
                                            />
                                        </CardContent>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>

                        {orders.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={(page) => {
                                    setCurrentPage(page)
                                    router.get(
                                        route('vendor.order.index'),
                                        { type: statusFilter, page },
                                        {
                                            preserveState: true,
                                            preserveScroll: true,
                                            replace: true,
                                        },
                                    )
                                }}
                            />
                        )}
                    </div>
                </div>
            </section>
        </VendorLayout>
    )
}
