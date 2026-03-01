import { useMemo, useState } from 'react'
import { ArrowLeft, MapPin, Star } from 'lucide-react'
import Pagination from '@/components/ui/pagination'
import FrontendLayout from '@/layouts/frontend-layout'
import PriceRange from '@/components/ui/price-range'
import { Link, router, usePage } from '@inertiajs/react'

type ServiceCard = {
    id: number
    name: string
    location: string
    category: string
    price: string
    rating: number
    image: string
}

const chips = ['WASH', 'TINT', 'TINT']
const sortOptions = ['Relevance', 'Price: Low to High', 'Price: High to Low']

const services: ServiceCard[] = Array.from({ length: 9 }).map((_, index) => {
    const base = index % 3
    return {
        id: index + 1,
        name: ['Quick Clean Pro', 'Master Tint & Wrap', 'Elite Automotive Detailers'][base],
        location: ['Westside', 'North Hills', 'San Francisco'][base],
        category: ['WASH', 'TINT', 'TINT'][base],
        price: base === 0 ? '$45' : '$180',
        rating: base === 1 ? 4.8 : 4.9,
        image: [
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=60',
            'https://images.unsplash.com/photo-1529429617124-aee711a70412?auto=format&fit=crop&w=800&q=60',
        ][base],
    }
})

export default function SearchPage() {
    const totalResults = 65897

    const priceOptions = [
        { label: "All Price", min: 0, max: 10000 },
        { label: "Under $20", min: 0, max: 20 },
        { label: "$25 to $100", min: 25, max: 100 },
        { label: "$100 to $300", min: 100, max: 300 },
        { label: "$300 to $500", min: 300, max: 500 },
        { label: "$500 to $1,000", min: 500, max: 1000 },
        { label: "$1,000 to $10,000", min: 1000, max: 10000 },
    ];

    const [activePrice, setActivePrice] = useState("All Price");



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

                            router.get(
                                route("frontend.search"),
                                {
                                    min_price: option.min,
                                    max_price: option.max,
                                },
                                {
                                    preserveState: true,
                                    replace: true,
                                }
                            );
                        }}
                    />

                    {/* Ratings */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Ratings & Reviews</h3>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3 mb-2 group cursor-pointer">
                                <div className={`w-4 h-4 rounded-full border transition-all ${rating === 5 ? 'bg-bg-nevy border-bg-nevy ring-2 ring-blue-900/30' : 'border-text-gray'}`}></div>
                                <span className="text-sm w-4 text-text-gray-50">{rating}</span>
                                <div className="flex-1 h-1.5 bg-bg-black-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-bg-nevy" style={{ width: `${rating * 20}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-end gap-2 text-md text-slate-400">
                        <span>Sort by:</span>
                        <select className="rounded bg-bg-gray px-3 py-4 text-lg">
                            {sortOptions.map((option) => (
                                <option key={option}>{option}</option>
                            ))}
                        </select>
                    </div>
                    <header className="rounded-sm bg-bg-gray p-2 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex flex-wrap gap-3">
                                {chips.map((chip) => (
                                    <span
                                        key={chip}
                                        className="rounded-full border border-blue-500/40 bg-slate-900/80 px-4 py-1 text-xs font-semibold text-blue-300"
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
                        {services.map((service) => (
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
                                        <span className="text-2xl font-semibold">{service.price}</span>
                                        <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                                            See Details
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="flex justify-center pt-4">
                        <Pagination currentPage={1} totalPages={6} onPageChange={(page) => console.log(page)} />
                    </div>
                </div>
            </section>
        </FrontendLayout>
    )
}
