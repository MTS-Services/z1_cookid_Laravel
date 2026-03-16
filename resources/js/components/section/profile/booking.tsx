import { useEffect, useMemo, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CalendarClock, ChevronLeft, ChevronRight, LocateIcon, User2 } from 'lucide-react'
import type { UserOrderSummary } from '@/pages/user/profile/order-details'

type BookingStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'In Progress'

const tabs: BookingStatus[] = ['All', 'Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']

interface BookingItem {
    id: number | string
    title: string
    status: Exclude<BookingStatus, 'All'>
    store: string
    address: string
    date: string
    time: string
    price: number
    orderId?: number
    hasReview: boolean
}

function orderToBooking(order: UserOrderSummary): BookingItem {
    const statusMap: Record<string, Exclude<BookingStatus, 'All'>> = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        completed: 'Completed',
        cancelled: 'Cancelled',
        inprogress: 'In Progress',
    }
    const status = statusMap[order.status] ?? 'Pending'
    const addr = order.address
    const line = addr && ('addressLine' in addr ? addr.addressLine : (addr as { address?: string }).address)
    const zip = addr && ('zipCode' in addr ? addr.zipCode : (addr as { zip_code?: string }).zip_code)
    const addressStr = addr ? [line, addr.city, addr.state, zip].filter(Boolean).join(', ') || '—' : '—'
    const scheduled = order.scheduledAt ?? order.createdAt
    const d = scheduled ? new Date(scheduled) : null
    const date = d ? d.toLocaleDateString('en-US', { dateStyle: 'long' }) : '—'
    const time = d ? d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '—'
    const price = order.totals?.total != null ? Number(order.totals.total) : 0
    return {
        id: order.orderNumber,
        orderId: order.id,
        title: order.service?.title ?? 'Service',
        status,
        store: order.service?.vendorName ?? '—',
        address: addressStr,
        date,
        time,
        price,
        hasReview: !!order.review,
    }
}


const statusStyles: Record<Exclude<BookingStatus, 'All'>, { badge: string; button: string }> = {
    Confirmed: {
        badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
        button: 'border-slate-700 text-slate-200 hover:bg-[#292929]/80 hover:text-white',
    },
    Pending: {
        badge: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
        button: 'border-slate-700 text-slate-200 hover:bg-[#292929]/80 hover:text-white',
    },
    'In Progress': {
        badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
        button: 'border-slate-700 text-slate-200 hover:bg-[#292929]/80 hover:text-white',
    },
    Completed: {
        badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
        button: 'border-slate-700 text-slate-200 bg-[#292929] hover:bg-[#292929]/80 hover:text-white',
    },
    Cancelled: {
        badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
        button: 'border-slate-700 text-slate-200 hover:bg-[#292929]/80 hover:text-white',
    },
}

function usePaginatedBookings(activeTab: BookingStatus, items: BookingItem[], itemsPerPage = 9) {
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        if (activeTab === 'All') {
            return items
        }
        return items.filter((booking) => booking.status === activeTab)
    }, [activeTab, items])

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
    const currentPage = Math.min(page, totalPages)
    const offset = (currentPage - 1) * itemsPerPage
    const current = filtered.slice(offset, offset + itemsPerPage)

    useEffect(() => {
        setPage(1)
    }, [activeTab])

    return { current, totalPages, page: currentPage, setPage }
}

interface BookingsSectionProps {
    orders?: Array<{
        id: number
        orderNumber: string
        status: string
        statusLabel: string
        scheduledAt: string | null
        createdAt: string | null
        totals: { total: number | null }
        service?: { title: string | null; vendorName: string | null } | null
        address?: { addressLine?: string; city?: string; state?: string; zipCode?: string } | null
    }>
}

export function BookingsSection({ orders = [] }: BookingsSectionProps) {
    const [activeTab, setActiveTab] = useState<BookingStatus>('All')
    const bookingsList = useMemo(
        () => (orders.map(orderToBooking)),
        [orders]
    )
    const { current, page, setPage, totalPages } = usePaginatedBookings(activeTab, bookingsList)

    return (
        <section className="space-y-8">
            <div className="inline-flex flex-wrap gap-3 rounded-md bg-[#292929] px-3 py-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-md px-6 py-2 text-sm font-semibold transition-all duration-300 ${isActive
                                    ? 'bg-navy text-white shadow-lg shadow-navy/30'
                                    : 'border border-text-border bg-bg-gray/50 text-white/80 hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    )
                })}
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {current.length ? (
                    current.map((booking) => (
                        <Card key={booking.id} className="bg-[#292929] border-[#292929] text-white shadow-xl shadow-blue-900/20">
                            <div className="flex flex-col gap-5 px-6">
                                <header className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-slate-400">Booking ID: {booking.id}</p>
                                        <h3 className="text-xl font-semibold">{booking.title}</h3>
                                    </div>
                                    <Badge className={statusStyles[booking.status as Exclude<BookingStatus, 'All'>].badge}>
                                        {booking.status}
                                    </Badge>
                                </header>

                                <div className="space-y-3 text-sm text-slate-300">
                                    <div>
                                        <p className="font-semibold text-white">{booking.store}</p>
                                        <p className="flex items-center gap-2 text-slate-400">
                                            <LocateIcon className="h-4 w-4" />
                                            {booking.address}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CalendarClock className="h-4 w-4 text-slate-400" />
                                        <span>{booking.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <User2 className="h-4 w-4 text-slate-400" />
                                        <span>{booking.time}</span>
                                    </div>
                                </div>

                                <span className="text-2xl font-bold">${booking.price.toFixed(2)}</span>
                                <div className="border-t border-[#292929] pt-4">
                                    {['Confirmed', 'Completed', 'In Progress'].includes(booking.status) && !booking.hasReview ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link
                                                href={
                                                    booking.orderId != null
                                                        ? route('user.order-details.show', booking.orderId)
                                                        : route('user.order-details')
                                                }
                                            >
                                                <Button className="w-full rounded-lg bg-navy px-5 py-2 text-sm font-semibold cursor-pointer">
                                                    View Details
                                                </Button>
                                            </Link>
                                            {booking.status === 'Confirmed' && (
                                                <Link href="#">
                                                    <Button
                                                        className={`${statusStyles.Confirmed.button} w-full rounded-lg px-5 py-2 text-sm font-semibold bg-transparent cursor-pointer`}
                                                        variant="outline"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Link>
                                            )}
                                            {booking.status === 'Completed' && !booking.hasReview && (
                                                <Link
                                                    href={
                                                        booking.orderId != null
                                                            ? route('user.service-review.show', booking.orderId)
                                                            : route('user.order-details')
                                                    }
                                                >
                                                    <Button
                                                        className={`${statusStyles.Completed.button} w-full rounded-lg px-5 py-2 text-sm font-semibold cursor-pointer`}
                                                        variant="outline"
                                                    >
                                                        Leave review
                                                    </Button>
                                                </Link>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={
                                                booking.orderId != null
                                                    ? route('user.order-details.show', booking.orderId)
                                                    : route('user.order-details')
                                            }
                                        >
                                            <Button className="w-full rounded-lg bg-navy px-5 py-2 text-sm font-semibold">
                                                View Details
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-full bg-[#292929]/40 border border-dashed border-[#292929] py-12 text-center text-slate-400">
                        No bookings for this status yet.
                    </Card>
                )}
            </div>

            <div className="flex items-center justify-center gap-2">
                <button
                    aria-label="Previous Page"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="rounded-full border border-[#292929] p-2 text-slate-400 transition hover:bg-[#292929] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-10 w-10 rounded-full text-sm font-semibold transition ${p === page
                                ? 'bg-navy text-white shadow-lg shadow-navy/30'
                                : 'border border-[#292929] text-slate-400 hover:text-white'
                            }`}
                    >
                        {p.toString().padStart(2, '0')}
                    </button>
                ))}
                <button
                    aria-label="Next Page"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="rounded-full border border-[#292929] p-2 text-slate-400 transition hover:bg-[#292929] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
            </div>
        </section>
    )
}

export type { BookingStatus }
