import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import VendorLayout from '@/layouts/vendor-layout'
import { cn } from '@/lib/utils'
import { Link, router } from '@inertiajs/react'
import { CheckCircle2, Clock, Copy, XCircle } from 'lucide-react'
import { useState } from 'react'

type OrderStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'

interface Order {
    id: string
    reference: string
    customerName: string
    service: string
    date: string
    status: OrderStatus
    amount: number
}

const mockOrders: Order[] = [
    {
        id: '#ORD-1',
        reference: '051114075922',
        customerName: 'Guy Hawkins',
        service: 'Elite Auto Spa',
        date: '10/6/2025',
        status: 'pending',
        amount: 120,
    },
    {
        id: '#ORD-2',
        reference: '051114075922',
        customerName: 'Jacob Jones',
        service: 'Quick Clean Pro',
        date: '10/6/2025',
        status: 'completed',
        amount: 45,
    },
    {
        id: '#ORD-3',
        reference: '051114075922',
        customerName: 'Devon Lane',
        service: 'Master Tint & Wrap',
        date: '10/6/2025',
        status: 'in_progress',
        amount: 180,
    },
    {
        id: '#ORD-4',
        reference: '051114075922',
        customerName: 'Albert Flores',
        service: 'Elite Automotive Detailers',
        date: '10/6/2025',
        status: 'pending',
        amount: 120,
    },
    {
        id: '#ORD-5',
        reference: '051114075922',
        customerName: 'Bessie Cooper',
        service: 'Quick Clean Pro',
        date: '10/6/2025',
        status: 'confirmed',
        amount: 45,
    },
    {
        id: '#ORD-6',
        reference: '051114075922',
        customerName: 'Leslie Alexander',
        service: 'Elite Auto Spa',
        date: '10/6/2025',
        status: 'cancelled',
        amount: 180,
    },
]

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
    in_progress: {
        label: 'In Progress',
        badgeClassName: 'border-blue-500/50 bg-blue-500/10 text-blue-400',
        cardBorderClassName: 'border-t-2 border-blue-500',
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

function OrdersTable({ orders }: { orders: Order[] }) {
    return (
        <Table>
            <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-slate-400 font-medium">Order ID</TableHead>
                    <TableHead className="text-slate-400 font-medium">Buyer</TableHead>
                    <TableHead className="text-slate-400 font-medium">Service</TableHead>
                    <TableHead className="text-slate-400 font-medium">Amount</TableHead>
                    <TableHead className="text-slate-400 font-medium">Date</TableHead>
                    <TableHead className="text-slate-400 font-medium text-right w-40">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {orders.map((order) => {
                    const config = statusConfig[order.status]
                    return (
                        <TableRow
                            key={order.id}
                            className="border-white/5 text-white hover:bg-white/5"
                        >
                            <TableCell className="font-medium text-white">
                                <div className="flex flex-col">
                                    <span>{order.id}</span>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                        <span>{order.reference}</span>
                                        <Copy className="h-3 w-3 cursor-pointer text-slate-500 hover:text-slate-300" />
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-slate-300">{order.customerName}</TableCell>
                            <TableCell className="text-slate-300">{order.service}</TableCell>
                            <TableCell className="text-slate-400">${order.amount}</TableCell>
                            <TableCell className="text-slate-400">{order.date}</TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    {order.status === 'pending' && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="h-9 rounded bg-navy px-4 text-sm font-medium text-white hover:bg-navy"
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-9 rounded bg-dark-gray px-4 text-sm font-medium text-white hover:bg-slate-800"
                                            >
                                                Reject
                                            </Button>
                                        </>
                                    )}
                                    {order.status == 'in_progress' && (
                                        <>
                                            <Button
                                                size="sm"
                                                className="h-9 rounded bg-navy px-4 text-sm font-medium text-white hover:bg-navy"
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
                                                <Link href={route('vendor.order-details')}>
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
                                                    <Link href={route('vendor.order-candelled-details')}>
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
                                            >
                                                Next Step
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default function Orders() {
    const getInitialStatus = (): OrderStatus => {
        if (typeof window === 'undefined') {
            return 'pending'
        }

        const params = new URLSearchParams(window.location.search)
        const type = params.get('type') as OrderStatus | null

        if (type && ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(type)) {
            return type
        }

        return 'pending'
    }

    const [statusFilter, setStatusFilter] = useState<OrderStatus>(getInitialStatus)
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 3

    const filteredOrders = mockOrders.filter((order) => order.status === statusFilter)

    const counts: Record<OrderStatus, number> = {
        pending: mockOrders.filter((order) => order.status === 'pending').length,
        confirmed: mockOrders.filter((order) => order.status === 'confirmed').length,
        in_progress: mockOrders.filter((order) => order.status === 'in_progress').length,
        completed: mockOrders.filter((order) => order.status === 'completed').length,
        cancelled: mockOrders.filter((order) => order.status === 'cancelled').length,
    }

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
                                    route('vendor.orders'),
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
                                    value="in_progress"
                                    className="flex items-center gap-2 rounded-md px-4 py-1.5 text-sm data-[state=active]:bg-navy data-[state=active]:text-white data-[state=active]:shadow-none"
                                >
                                    <Clock className="h-4 w-4" />
                                    <span>In Progress</span>
                                    <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-semibold text-slate-900">
                                        {counts.in_progress}
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
                            {(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'] as const).map((tabValue) => (
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

                                        {filteredOrders.length > 0 ? (
                                            <div className="px-4 pb-4 pt-2">
                                                <OrdersTable orders={filteredOrders} />
                                                <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                                                    <span>
                                                        Showing 1 to {filteredOrders.length} of {filteredOrders.length}{' '}
                                                        results
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="secondary"
                                                            className="h-8 rounded bg-slate-900 px-4 text-xs text-white hover:bg-slate-800"
                                                        >
                                                            Previous
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 rounded bg-navy px-4 text-xs text-white hover:bg-navy"
                                                        >
                                                            Next
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                                                <p className="text-slate-400">No orders in this state yet.</p>
                                                <p className="mt-1 text-sm text-slate-500">
                                                    New orders will appear here as customers book services.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>

                        {filteredOrders.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>
                </div>
            </section>
        </VendorLayout>
    )
}
