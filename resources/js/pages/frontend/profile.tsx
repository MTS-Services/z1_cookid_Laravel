import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import FrontendLayout from '@/layouts/frontend-layout'
import {
    Calendar,
    CalendarClock,
    ChevronLeft,
    ChevronRight,
    Heart,
    LocateIcon,
    RefreshCcw,
    ShoppingCart,
    Trash2,
    User2,
    X,
} from 'lucide-react'
import { Link } from '@inertiajs/react'

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

const wishlistItems = [
    {
        id: 'WL-001',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=300&q=60',
    },
    {
        id: 'WL-002',
        name: 'Ceramic Coating & Detail',
        address: '412 Redwood Ave, Denver, CO',
        price: 849,
        image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=300&q=60',
    },
    {
        id: 'WL-003',
        name: 'Interior Deep Clean Package',
        address: '8833 Ventura Blvd, Los Angeles, CA',
        price: 540,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=60',
    },
]

const accountDefaults = {
    firstName: 'Kevin',
    lastName: 'Display name',
    email: 'customer@gmail.com',
    phone: '+1 202-555-0118',
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

function BookingsSection() {
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
                                            <Link href="#">
                                                <Button className="w-full rounded-lg bg-navy px-5 py-2 text-sm font-semibold">
                                                    View Details
                                                </Button>
                                            </Link>
                                            {booking.status === 'Confirmed' && (
                                                <Link href="#">
                                                    <Button
                                                        className={`${statusStyles.Confirmed.button} w-full rounded-lg px-5 py-2 text-sm font-semibold bg-transparent`}
                                                        variant="outline"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Link>
                                            )}
                                            {booking.status === 'Completed' && (
                                                <Link href="#">
                                                    <Button
                                                        className={`${statusStyles.Completed.button} w-full rounded-lg px-5 py-2 text-sm font-semibold`}
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
                            p === page ? 'bg-navy text-white shadow-lg shadow-blue-500/30' : 'border border-[#292929] text-slate-400 hover:text-white'
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

function WishlistSection() {
    return (
        <section className="space-y-6">
            <Card className="border border-[#292929]/80 bg-[#1c1c1c] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#292929] px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Wishlist</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-slate-200">
                        <thead>
                            <tr className="text-xs uppercase tracking-[0.15em] text-slate-400">
                                <th className="py-4 px-6 font-semibold">Products</th>
                                <th className="py-4 px-6 font-semibold">Price</th>
                                <th className="py-4 px-6 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItems.map((item) => (
                                <tr key={item.id} className="border-t border-[#292929]/80">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-16 w-16 overflow-hidden rounded-md border border-slate-700">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{item.name}</p>
                                                <p className="flex items-center gap-2 text-sm text-slate-400">
                                                    <LocateIcon className="h-4 w-4 text-blue-400" />
                                                    {item.address}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-semibold text-white">${item.price}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <Link href="#" className="w-full">
                                                <Button className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 font-semibold tracking-wide">
                                                    Book Now
                                                    <ShoppingCart className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <div className="flex gap-2">
                                                <button className="h-10 w-10 rounded-full border border-slate-700 text-slate-400 transition hover:border-white hover:text-white">
                                                    <X className="mx-auto h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    )
}

function AccountSection() {
    const [formValues, setFormValues] = useState(accountDefaults)

    return (
        <section className="space-y-6">
            <h2 className="text-2xl font-semibold">Account Settings</h2>
            <Card className="bg-[#292929]/60 border-[#292929] text-white">
                <div className="flex flex-col gap-6 px-6 py-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                        {/* <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-navy text-5xl">
                            😊
                            <button className="absolute bottom-0 right-0 rounded-full bg-navy p-2 shadow-lg">📷</button>
                        </div> */}
                        <div className="flex items-center justify-center">
                            <img src="/user.png" alt="" />
                        </div>
                        <div className="grid flex-1 gap-6 md:grid-cols-2">
                            {Object.entries(formValues).map(([key, value]) => (
                                <label key={key} className="space-y-2 text-sm">
                                    <span className="capitalize text-slate-300 font-semibold">{key}</span>
                                    <input
                                        name={key}
                                        value={value}
                                        onChange={(event) =>
                                            setFormValues((prev) => ({ ...prev, [key]: event.target.value }))
                                        }
                                        className="w-full rounded-lg border border-[#292929] bg-slate-950/60 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                    <Button type='submit' className="self-start bg-navy hover:bg-navy px-8 cursor-pointer">Save Changes</Button>
                </div>
            </Card>
        </section>
    )
}

export default function Profile() {
    const [section, setSection] = useState<'bookings' | 'wishlist' | 'account'>('bookings')
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [section])

    return (
        <FrontendLayout activePage="frontend.profile">
            <div className="min-h-screen  text-white">
                <div className="mx-auto max-w-7xl space-y-10 px-6 py-12">
                    <header className="space-y-3">
                        <h1 className="text-4xl font-bold">
                            Hello John (not John? <span className="cursor-pointer text-blue-400">Log out</span>)
                        </h1>
                        <p className="text-slate-400">
                            From your account dashboard you can view your <span className="text-blue-400">recent orders</span> and manage your{' '}
                            <span className="text-blue-400">Account</span>.
                        </p>
                    </header>

                    <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
                        {[
                            { key: 'bookings', label: 'Bookings', icon: <Calendar className="h-10 w-10" /> },
                            { key: 'wishlist', label: 'Wishlist', icon: <Heart className="h-10 w-10" /> },
                            { key: 'account', label: 'Account', icon: <User2 className="h-10 w-10" /> },
                        ].map(({ key, label, icon }) => {
                            const isActive = section === key
                            return (
                                <button
                                    key={key}
                                    onClick={() => setSection(key as typeof section)}
                                    className={`rounded-lg border p-6 text-center shadow-lg transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? 'bg-linear-to-br from-navy to-navy border-transparent shadow-blue-500/25'
                                            : 'border-[#292929] bg-[#292929]/50 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="mb-3 flex justify-center text-4xl text-white">{icon}</div>
                                    <p className="text-lg font-semibold">{label}</p>
                                </button>
                            )
                        })}
                    </div>

                    <main ref={scrollRef} className="space-y-10">
                        {section === 'bookings' && <BookingsSection />}
                        {section === 'wishlist' && <WishlistSection />}
                        {section === 'account' && <AccountSection />}
                    </main>
                </div>
            </div>
        </FrontendLayout>
    )
}
