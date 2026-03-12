import Pagination from '@/components/ui/pagination'
import FrontendLayout from '@/layouts/frontend-layout'
import { Link, router } from '@inertiajs/react'
import { MapPin, Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { Paginated } from '@/types/model'

interface StoreService {
    id: number
    title: string
    location: string
    price: number
    category: string
    rating: number
    reviews: number
    image: string
}

interface StorePageProps {
    services: Paginated<StoreService>
    categories: string[]
    vendor: {
        id: string
        name: string
        location: string | null
        avatar_url: string
        averageRating: number
        totalReviews: number
    }
}

export default function Store({ services, categories, vendor }: StorePageProps) {
    const [activeCategory, setActiveCategory] = useState<string | null>(categories[0] ?? null)

    const filteredServices = useMemo(() => {
        const data = services?.data ?? []
        return activeCategory ? data.filter((service) => service.category === activeCategory) : data
    }, [activeCategory, services])

    const currentPage = services?.meta?.current_page ?? 1
    const totalPages = services?.meta?.last_page ?? 1

    const onPageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return
        router.get(
            route('frontend.services-store', vendor.id),
            { page, category: activeCategory ?? undefined },
            { preserveScroll: true },
        )
    }

    return (
        <FrontendLayout activePage="frontend.store">
            <section className="container mx-auto px-6 py-16">
                <div className="mx-auto max-w-4xl text-center text-white">
                    <div className='flex justify-center mb-4'>
                        <img src={vendor.avatar_url} alt={vendor.name} className="h-24 w-24 rounded-full" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.6rem] text-gray-400">{vendor.name}</p>
                    <div className="mt-4 flex flex-col items-center justify-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {vendor.averageRating.toFixed(1)}{' '}
                            <Link
                                href={route('frontend.vendor-reviews', vendor.id)}
                                className="text-white/70 hover:text-white/90 hover:underline"
                            >
                                ({vendor.totalReviews.toLocaleString()} reviews)
                            </Link>
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {vendor.location ?? '—'}
                        </span>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-white">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full px-6 py-2 text-sm font-medium transition duration-200 ${activeCategory === category
                                    ? 'bg-white text-gray-900'
                                    : 'border border-white/20 text-white hover:bg-white/10'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {filteredServices.map((service) => (
                        <article
                            key={service.id}
                            className="rounded-3xl bg-linear-to-b from-white/10 to-white/5 p-px shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                        >
                            <div className="h-full rounded-3xl bg-gray-950/90 p-4">
                                <div className="relative overflow-hidden rounded-2xl">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="h-44 w-full object-cover"
                                    />
                                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        {service.rating.toFixed(1)}
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-col gap-4 text-white">
                                    <div>
                                        <p className="text-lg font-semibold">{service.title}</p>
                                        <p className="mt-1 text-sm text-gray-400">{service.location}</p>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-widest text-gray-300">
                                            {service.category}
                                        </span>
                                        <span className="text-2xl font-semibold">
                                            ${service.price}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>{service.reviews} reviews</span>
                                        <Link href={route('frontend.service-details', { id: service.id })} className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy">
                                            See Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            </section>
        </FrontendLayout>
    )
}
