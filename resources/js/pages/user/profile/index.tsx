import { useEffect, useRef } from 'react'
import FrontendLayout from '@/layouts/frontend-layout'
import { Calendar, Heart, User2 } from 'lucide-react'
import { AccountSection } from '@/components/section/profile/account'
import { BookingsSection } from '@/components/section/profile/booking'
import { WishlistSection } from '@/components/section/profile/wishlist'
import { router } from '@inertiajs/react'
import type { UserOrderSummary } from './order-details'

export interface WishlistItem {
    id: number
    serviceId: number
    name: string
    image: string
    address: string
    price: number
}

type ProfileSection = 'bookings' | 'wishlist' | 'account'

interface ProfilePageProps {
    section: ProfileSection
    wishlist: WishlistItem[]
    orders?: UserOrderSummary[]
}

export default function Index({ section = 'bookings', wishlist = [], orders = [] }: ProfilePageProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [section])

    const setSection = (key: ProfileSection) => {
        router.get(route('user.profile'), { section: key }, { preserveState: false })
    }

    return (
        <FrontendLayout activePage="user.profile">
            <div className="min-h-screen  text-white">
                <div className="mx-auto max-w-7xl space-y-10 px-6 py-12">
                    <header className="space-y-3">
                        <h1 className="text-2xl lg:text-4xl font-bold">
                            Hello John (not John? <span className="cursor-pointer text-blue-400" onClick={() => router.post(route('logout'))}>Log out</span>)
                        </h1>
                        <p className="text-slate-400">
                            From your account dashboard you can view your <span className="text-blue-400">recent orders</span> and manage your{' '}
                            <span className="text-blue-400">Account</span>.
                        </p>
                    </header>

                    <div className="grid grid-cols-2 max-w-2xl gap-4 sm:grid-cols-3">
                        {[
                            { key: 'bookings' as const, label: 'Bookings', icon: <Calendar className="h-10 w-10" /> },
                            { key: 'wishlist' as const, label: 'Wishlist', icon: <Heart className="h-10 w-10" /> },
                            { key: 'account' as const, label: 'Account', icon: <User2 className="h-10 w-10" /> },
                        ].map(({ key, label, icon }) => {
                            const isActive = section === key
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => setSection(key)}
                                    className={`rounded-lg border p-4 lg:p-6 text-center shadow-lg transition-all duration-300 cursor-pointer ${
                                        isActive
                                            ? 'bg-linear-to-br from-navy to-navy border-transparent shadow-navy/25'
                                            : 'border-[#292929] bg-bg-gray/50 hover:border-slate-700'
                                    }`}
                                >
                                    <div className="mb-3 flex justify-center text-4xl text-white">{icon}</div>
                                    <p className="text-base lg:text-lg font-semibold">{label}</p>
                                </button>
                            )
                        })}
                    </div>

                    <main ref={scrollRef} className="space-y-10">
                        {section === 'bookings' && <BookingsSection orders={orders} />}
                        {section === 'wishlist' && <WishlistSection wishlist={wishlist} />}
                        {section === 'account' && <AccountSection />}
                    </main>
                </div>
            </div>
        </FrontendLayout>
    )
}
