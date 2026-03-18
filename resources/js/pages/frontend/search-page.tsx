import { useState } from 'react'
import { ArrowLeft, MapPin, Search, Star } from 'lucide-react'
import Pagination from '@/components/ui/pagination'
import FrontendLayout from '@/layouts/frontend-layout'
import PriceRange from '@/components/ui/price-range'
import { Link, router, usePage } from '@inertiajs/react'

type ServiceCard = {
    id: string
    name: string
    location: string
    category: string
    price: number
    rating: number
    image: string
}

type Paginated<T> = {
    data: T[]
    current_page: number
    last_page: number
    total: number
}

type PageProps = {
    services: Paginated<ServiceCard>
    filters: {
        location: string
        service: string
        vehicle_type: string
        min_price: number | null
        max_price: number | null
        min_rating: number | null
        sort: string
        per_page?: number
    }
}

const SORT_OPTIONS = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
] as const

export default function SearchPage() {
    const { services, filters } = usePage<PageProps>().props

    const totalResults = services?.total ?? 0
    const chips = Array.from(
        new Set((services?.data ?? []).map((service) => service.category))
    )

    const priceOptions = [
        { label: "All Price", min: 100, max: 10000 },
        { label: "$100 - $300", min: 100, max: 300 },
        { label: "$300 - $500", min: 300, max: 500 },
        { label: "$500 - $1,000", min: 500, max: 1000 },
        { label: "$1,000 - $10,000", min: 1000, max: 10000 },
    ];

    const [activePrice, setActivePrice] = useState("All Price");

    const applySearchFilters = (extra: Record<string, string | number | null | undefined>) => {
        router.get(route("frontend.search"), { ...filters, page: 1, ...extra }, { preserveState: true, replace: true });
    };

    return (
        <FrontendLayout>
            <section className="mx-auto mt-12 flex w-full container gap-8 px-6 pb-16 text-white">
                <aside className="hidden w-72 lg:block space-y-6">
                    <Link href={route("frontend.home")} className="mb-6 flex items-center gap-2 text-sm font-semibold text-blue-400">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                    <PriceRange
                        options={priceOptions}
                        active={activePrice}
                        onChange={(option) => {
                            setActivePrice(option.label);

                            applySearchFilters({
                                min_price: option.min,
                                max_price: option.max,
                            });
                        }}
                    />

                    {/* Ratings */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Ratings & Reviews</h3>
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const isActive = filters.min_rating === rating;
                            return (
                                <button
                                    key={rating}
                                    type="button"
                                    onClick={() => applySearchFilters({ min_rating: isActive ? 0 : rating })}
                                    className="flex w-full items-center gap-3 mb-2 group cursor-pointer text-left rounded px-1 py-0.5 -mx-1 hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className={`w-4 h-4 shrink-0 rounded-full border transition-all ${isActive ? 'bg-bg-nevy border-bg-nevy ring-2 ring-blue-900/30' : 'border-text-gray'}`} />
                                    <span className="text-sm w-4 text-text-gray-50">{rating}</span>
                                    <div className="flex-1 h-1.5 bg-bg-black-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-bg-nevy" style={{ width: `${rating * 20}%` }} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-end gap-2 text-md text-slate-400">
                        <span>Sort by:</span>
                        <select
                            value={filters.sort ?? 'relevance'}
                            onChange={(e) => applySearchFilters({ sort: e.target.value })}
                            className="rounded bg-bg-gray px-3 py-4 text-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-bg-nevy/50"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <header className="rounded-sm bg-bg-gray p-2 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap gap-3">
                                {chips.map((chip) => (
                                    <span
                                        key={chip}
                                        className="rounded-full border border-navy/40 bg-slate-900/80 px-4 py-1 text-xs font-semibold text-navy/50"
                                    >
                                        {chip}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-400">

                                <span className="ml-4 text-slate-300">
                                    {totalResults.toLocaleString()} results found
                                </span>
                            </div>
                        </div>
                    </header>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {services?.data.length > 0 ? services?.data.map((service) => (
                            <article
                                key={service.id}
                                className="flex flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/70 shadow-lg shadow-black/30"
                            >
                                <div className="h-40 w-full overflow-hidden">
                                    <img src={service.image} alt={service.name} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex flex-1 flex-col gap-3 px-5 py-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold">{service.name}</h3>
                                            <div className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                                                <MapPin className="h-4 w-4" /> {service.location}
                                            </div>
                                        </div>
                                        <span className="flex items-center gap-1 text-sm text-amber-400">
                                            <Star className="h-4 w-4 fill-amber-400" /> {service.rating.toFixed(1)}
                                        </span>
                                    </div>
                                    <span className="inline-flex w-fit rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-200">
                                        {service.category}
                                    </span>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-2xl font-semibold">${service.price}</span>
                                        <button className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-navy">
                                            See Details
                                        </button>
                                    </div>
                                </div>
                            </article>
                        )) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500 col-span-full">
                            <Search size={48} className="mb-4" />
                            <p className="text-xl">No services match your criteria.</p>
                            <button
                                onClick={() => {
                                    setActivePrice("All Price");
                                    applySearchFilters({
                                        location: '',
                                        service: '',
                                        vehicle_type: '',
                                        min_price: null,
                                        max_price: null,
                                        min_rating: null,
                                        sort: 'relevance',
                                    });
                                }}
                                className="mt-4 text-navy hover:underline"
                            >
                                Reset all filters
                            </button>
                        </div>
                        )}
                    </div>

                    {services?.last_page && services.last_page > 1 && (
                        <div className="flex justify-center pt-4">
                            <Pagination
                                currentPage={services.current_page}
                                totalPages={services.last_page}
                                onPageChange={(page) =>
                                    router.get(
                                        route("frontend.search"),
                                        {
                                            ...filters,
                                            page,
                                        },
                                        {
                                            preserveState: true,
                                            replace: true,
                                        }
                                    )
                                }
                            />
                        </div>
                    )}
                </div>
            </section>
        </FrontendLayout>
    )
}
