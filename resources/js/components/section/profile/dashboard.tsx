'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Heart, User, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const mockBookings = [
    {
        id: 'BK-2026-001',
        service: 'Full Car Service',
        status: 'Confirmed',
        store: 'Maktech Store',
        address: '2715 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120.0,
    },
    {
        id: 'BK-2026-002',
        service: 'Master Tint & Wrap',
        status: 'Pending',
        store: 'Maktech Store',
        address: '2715 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120.0,
    },
    {
        id: 'BK-2026-003',
        service: 'Full Car Service',
        status: 'Completed',
        store: 'Maktech Store',
        address: '2715 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120.0,
    },
    {
        id: 'BK-2026-004',
        service: 'Full Car Service',
        status: 'Cancelled',
        store: 'Maktech Store',
        address: '2715 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120.0,
    },
    {
        id: 'BK-2026-005',
        service: 'Full Car Service',
        status: 'Confirmed',
        store: 'Maktech Store',
        address: '2715 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120.0,
    },
    {
        id: 'BK-2026-006',
        service: 'Master Tint & Wrap',
        status: 'Pending',
        store: 'Maktech Store',
        address: '2715 Ash Dr, San Jose, South Dakota 83475',
        date: 'Wednesday, February 21, 2026',
        time: '10:00 AM - 12:00 PM',
        price: 120.0,
    },
]

const wishlistItems = [
    {
        id: 'WL-001',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: '🚗',
    },
    {
        id: 'WL-002',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: '📸',
    },
    {
        id: 'WL-003',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: '🚗',
    },
    {
        id: 'WL-004',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: '📸',
    },
    {
        id: 'WL-005',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: '🚗',
    },
    {
        id: 'WL-006',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: '📸',
    },
]

const statusColors: Record<string, { badge: string; button: string }> = {
    Confirmed: { badge: 'bg-green-500/10 text-green-400 border-green-500/20', button: 'text-green-400' },
    Pending: { badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20', button: 'text-orange-400' },
    Completed: { badge: 'bg-green-500/10 text-green-400 border-green-500/20', button: 'text-green-400' },
    Cancelled: { badge: 'bg-red-500/10 text-red-400 border-red-500/20', button: 'text-red-400' },
}

const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled']

function BookingsSection() {
    const [activeTab, setActiveTab] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)
    const scrollContainer = useRef<HTMLDivElement>(null)
    const tabsContainer = useRef<HTMLDivElement>(null)

    const filteredBookings = activeTab === 'All'
        ? mockBookings
        : mockBookings.filter(b => b.status === activeTab)

    const bookingsPerPage = 4
    const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)
    const startIdx = (currentPage - 1) * bookingsPerPage
    const currentBookings = filteredBookings.slice(startIdx, startIdx + bookingsPerPage)

    const checkScroll = () => {
        if (scrollContainer.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainer.current) {
            const scrollAmount = 300
            scrollContainer.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
        }
    }

    const checkTabsScroll = () => {
        if (tabsContainer.current) {
            const { scrollLeft, scrollWidth, clientWidth } = tabsContainer.current
            setCanScrollLeft(scrollLeft > 0)
        }
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [])

    useEffect(() => {
        const container = scrollContainer.current
        if (container) {
            container.addEventListener('scroll', checkScroll)
            return () => container.removeEventListener('scroll', checkScroll)
        }
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Tabs and Bookings */}
            {/* Tabs */}
            <div className="mb-8 overflow-x-auto scrollbar-hide">
                <div
                    ref={tabsContainer}
                    className="flex gap-2 pb-2 scroll-smooth"
                    onScroll={checkScroll}
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setActiveTab(tab)
                                setCurrentPage(1)
                            }}
                            className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 ${activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-slate-800/30 text-slate-300 hover:bg-slate-700/30 border border-slate-700/50'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings Container */}
            <div className="relative group">
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full bg-blue-600 hover:bg-blue-700 text-white p-2 shadow-lg hover:shadow-blue-500/30 transform hover:scale-110"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}

                <div
                    ref={scrollContainer}
                    className="overflow-x-auto scrollbar-hide"
                    onScroll={checkScroll}
                >
                    <div className="flex gap-6 pb-4 scroll-smooth min-w-max">
                        {currentBookings.length > 0 ? (
                            currentBookings.map((booking, index) => (
                                <Card
                                    key={index}
                                    className="flex-shrink-0 w-80 bg-slate-800/40 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/80 hover:bg-slate-800/60 transition-all duration-300 overflow-hidden group/card"
                                >
                                    <div className="p-6 h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-4">
                                            <h3 className="text-xl font-semibold text-white flex-1">{booking.service}</h3>
                                            <Badge className={`${statusColors[booking.status]?.badge} border`}>
                                                {booking.status}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-slate-400 mb-4">
                                            Booking ID: <span className="text-slate-300">{booking.id}</span>
                                        </p>

                                        <div className="space-y-3 mb-6 text-sm text-slate-400">
                                            <p className="font-semibold text-white">{booking.store}</p>
                                            <div className="flex items-start gap-2">
                                                <span className="text-slate-500">📍</span>
                                                <span>{booking.address}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500">📅</span>
                                                <span>{booking.date}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-slate-500">🕐</span>
                                                <span>{booking.time}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-slate-700/50 mb-4">
                                            <p className="text-2xl font-bold text-white">${booking.price.toFixed(2)}</p>
                                        </div>

                                        <div className="flex gap-3 mt-auto">
                                            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30">
                                                View Details
                                            </Button>
                                            {booking.status === 'Confirmed' && (
                                                <Button className="flex-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg font-semibold transition-all duration-300 border border-slate-600/50">
                                                    Cancel
                                                </Button>
                                            )}
                                            {booking.status === 'Completed' && (
                                                <Button className="flex-1 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-lg font-semibold transition-all duration-300 border border-slate-600/50">
                                                    Leave review
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))
                        ) : (
                            <div className="w-full py-12 text-center text-slate-400">
                                <p className="text-lg">No bookings found for this status</p>
                            </div>
                        )}
                    </div>
                </div>

                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full bg-blue-600 hover:bg-blue-700 text-white p-2 shadow-lg hover:shadow-blue-500/30 transform hover:scale-110"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-12">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-full border border-slate-700 hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-slate-700/20"
                >
                    <ChevronLeft className="w-5 h-5 text-slate-400" />
                </button>

                <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${currentPage === page
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                    : 'border border-slate-700 text-slate-400 hover:bg-slate-800/50'
                                }`}
                        >
                            {String(page).padStart(2, '0')}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-full border border-slate-700 hover:bg-slate-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-lg hover:shadow-slate-700/20"
                >
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
            </div>
        </div>
    )
}

function WishlistSection() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Wishlist</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700/50">
                            <th className="text-left py-4 px-4 text-slate-400 font-semibold">PRODUCTS</th>
                            <th className="text-left py-4 px-4 text-slate-400 font-semibold">PRICE</th>
                            <th className="text-left py-4 px-4 text-slate-400 font-semibold">ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wishlistItems.map((item) => (
                            <tr key={item.id} className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors">
                                <td className="py-6 px-4">
                                    <div className="flex items-center gap-4">
                                        <div className="text-4xl">{item.image}</div>
                                        <div>
                                            <p className="text-white font-semibold">{item.name}</p>
                                            <p className="text-sm text-slate-400 flex items-center gap-2 mt-2">
                                                <span>📍</span>
                                                {item.address}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-6 px-4 text-white font-bold">${item.price}</td>
                                <td className="py-6 px-4">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
                                        BOOK NOW
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function AccountSection() {
    const [formData, setFormData] = useState({
        firstName: 'Kevin',
        lastName: 'Display name',
        email: 'customer@gmail.com',
        phone: '+1 202-555-0118',
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">ACCOUNT SETTING</h2>
            <Card className="bg-slate-800/40 backdrop-blur-sm border-slate-700/50 p-8">
                <div className="flex items-start gap-8 mb-8">
                    <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-6xl">
                            😊
                        </div>
                        <button className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 rounded-full p-2 shadow-lg transition-all">
                            <span className="text-white">📷</span>
                        </button>
                    </div>
                    <div className="flex-1">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">First name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Last name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>
                        <Button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold">
                            SAVE CHANGES
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default function ProfileDashboard() {
    const [activeSection, setActiveSection] = useState<'bookings' | 'wishlist' | 'account'>('bookings')

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
            {/* Header */}
            <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Hello John{' '}
                        <span className="text-slate-400">
                            (not John?{' '}
                            <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                                Log out
                            </a>
                            )
                        </span>
                    </h1>
                    <p className="text-slate-400">
                        From your account dashboard you can view your{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                            recent orders
                        </a>{' '}
                        and manage your{' '}
                        <a href="#" className="text-blue-400 hover:text-blue-300 transition-colors">
                            Account
                        </a>
                        .
                    </p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Navigation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
                    <button
                        onClick={() => setActiveSection('bookings')}
                        className={`group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${activeSection === 'bookings'
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20'
                                : 'border border-slate-700 hover:border-slate-600 bg-slate-800/30 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-700/20'
                            }`}
                    >
                        <div className={`absolute inset-0 ${activeSection === 'bookings' ? 'bg-blue-400/10' : 'bg-slate-700/0 group-hover:bg-slate-700/10'} transition-colors duration-300`} />
                        <div className="relative flex flex-col items-center justify-center py-4">
                            <div className="text-5xl mb-3">📋</div>
                            <span className="font-semibold text-lg">Bookings</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSection('wishlist')}
                        className={`group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${activeSection === 'wishlist'
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20'
                                : 'border border-slate-700 hover:border-slate-600 bg-slate-800/30 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-700/20'
                            }`}
                    >
                        <div className={`absolute inset-0 ${activeSection === 'wishlist' ? 'bg-blue-400/10' : 'bg-slate-700/0 group-hover:bg-slate-700/10'} transition-colors duration-300`} />
                        <div className="relative flex flex-col items-center justify-center py-4">
                            <Heart className={`w-12 h-12 mb-3 ${activeSection === 'wishlist' ? 'text-white' : 'text-slate-300'}`} />
                            <span className="font-semibold text-lg">Wishlist</span>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveSection('account')}
                        className={`group relative overflow-hidden rounded-lg p-6 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 ${activeSection === 'account'
                                ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-500/20'
                                : 'border border-slate-700 hover:border-slate-600 bg-slate-800/30 backdrop-blur-sm hover:shadow-lg hover:shadow-slate-700/20'
                            }`}
                    >
                        <div className={`absolute inset-0 ${activeSection === 'account' ? 'bg-blue-400/10' : 'bg-slate-700/0 group-hover:bg-slate-700/10'} transition-colors duration-300`} />
                        <div className="relative flex flex-col items-center justify-center py-4">
                            <User className={`w-12 h-12 mb-3 ${activeSection === 'account' ? 'text-white' : 'text-slate-300'}`} />
                            <span className="font-semibold text-lg">Account</span>
                        </div>
                    </button>
                </div>

                {/* Content Sections */}
                {activeSection === 'bookings' && <BookingsSection />}
                {activeSection === 'wishlist' && <WishlistSection />}
                {activeSection === 'account' && <AccountSection />}
            </main>

            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </div>
    )
}
