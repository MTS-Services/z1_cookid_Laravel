import { useEffect, useMemo, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CalendarClock, ChevronLeft, ChevronRight, LocateIcon, User2 } from 'lucide-react'

type BookingStatus = 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'

const tabs: BookingStatus[] = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

const bookings = [
    {
        id: 'BK-2026-001',
        title: 'Full Car Service',
        status: 'Confirmed' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-002',
        title: 'Master Tint & Wrap',
        status: 'Pending' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-003',
        title: 'Full Car Service',
        status: 'Completed' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-004',
        title: 'Full Car Service',
        status: 'Cancelled' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-005',
        title: 'Full Car Service',
        status: 'Confirmed' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-006',
        title: 'Master Tint & Wrap',
        status: 'Pending' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-007',
        title: 'Full Car Service',
        status: 'Completed' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-008',
        title: 'Full Car Service',
        status: 'Confirmed' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
    {
        id: 'BK-2026-009',
        title: 'Full Car Service',
        status: 'Cancelled' as BookingStatus,
        store: 'Maktech Store',
        address: '2769 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120,
    },
]

const statusStyles: Record<Exclude<BookingStatus, 'All'>, { badge: string; button: string }> = {
    Confirmed: {
        badge: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
        button: 'border-slate-700 text-slate-200 hover:bg-[#292929]/80 hover:text-white',
    },
    Pending: {
        badge: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
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

function usePaginatedBookings(activeTab: BookingStatus, itemsPerPage = 9) {
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        if (activeTab === 'All') {
            return bookings
        }

        return bookings.filter((booking) => booking.status === activeTab)
    }, [activeTab])

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage))
    const currentPage = Math.min(page, totalPages)
    const offset = (currentPage - 1) * itemsPerPage
    const current = filtered.slice(offset, offset + itemsPerPage)

    useEffect(() => {
        setPage(1)
    }, [activeTab])

    return { current, totalPages, page: currentPage, setPage }
}

export function BookingsSection() {
    const [activeTab, setActiveTab] = useState<BookingStatus>('All')
    const { current, page, setPage, totalPages } = usePaginatedBookings(activeTab)

    return (
        <section className="space-y-8">
            <div className="inline-flex flex-wrap gap-3 rounded-md bg-[#292929] px-3 py-2">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab
                    return (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-md px-6 py-2 text-sm font-semibold transition-all duration-300 ${
                                isActive
                                    ? 'bg-navy text-white shadow-lg shadow-blue-500/30'
                                    : 'border border-[#292929] bg-[#292929]/70 text-slate-400 hover:text-white'
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
                                    {['Confirmed', 'Completed'].includes(booking.status) ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href={route('user.order-details')}>
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
                                            {booking.status === 'Completed' && (
                                                <Link href={route('user.service-review')}>
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
                                        <Link href="#">
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
                        className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                            p === page
                                ? 'bg-navy text-white shadow-lg shadow-blue-500/30'
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
