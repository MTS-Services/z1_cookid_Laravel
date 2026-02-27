import Pagination from '@/components/ui/pagination'
import FrontendLayout from '@/layouts/frontend-layout'
import { MapPin, Star } from 'lucide-react'
import { useMemo, useState } from 'react'

const categories = ['Wash', 'Detailing', 'Tint', 'Mechanical Services']

const services = [
    {
        id: 1,
        title: 'Quick Clean Pro',
        location: 'Westside',
        price: 45,
        category: 'Wash',
        rating: 4.9,
        reviews: 62,
        image:
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 2,
        title: 'Master Tint & Wrap',
        location: 'North Hills',
        price: 180,
        category: 'Tint',
        rating: 4.8,
        reviews: 58,
        image:
            'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 3,
        title: 'Elite Automotive Detailers',
        location: 'San Francisco',
        price: 180,
        category: 'Detailing',
        rating: 4.6,
        reviews: 43,
        image:
            'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 4,
        title: 'Ceramic Shield Studio',
        location: 'Brooklyn',
        price: 210,
        category: 'Detailing',
        rating: 4.7,
        reviews: 37,
        image:
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 5,
        title: 'Premium Wash & Go',
        location: 'Uptown',
        price: 55,
        category: 'Wash',
        rating: 4.8,
        reviews: 51,
        image:
            'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 6,
        title: 'Hydra Spa Wash',
        location: 'Midtown',
        price: 65,
        category: 'Wash',
        rating: 4.5,
        reviews: 40,
        image:
            'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 7,
        title: 'Precision Mechanics',
        location: 'Soho',
        price: 320,
        category: 'Mechanical Services',
        rating: 4.4,
        reviews: 29,
        image:
            'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 8,
        title: 'Supreme Detail Care',
        location: 'Harlem',
        price: 195,
        category: 'Detailing',
        rating: 4.7,
        reviews: 49,
        image:
            'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    },
    {
        id: 9,
        title: 'Rapid Express Wash',
        location: 'Burbank',
        price: 60,
        category: 'Wash',
        rating: 4.6,
        reviews: 42,
        image:
            'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?auto=format&fit=crop&w=600&q=80',
    },
]

export default function Store() {
    const [activeCategory, setActiveCategory] = useState('Wash')

    const filteredServices = useMemo(() => {
        return services.filter((service) =>
            activeCategory ? service.category === activeCategory : true,
        )
    }, [activeCategory])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(5)
    const onPageChange = (page: number) => {
        setCurrentPage(page)
    }

    return (
        <FrontendLayout activePage="frontend.store">
            <section className="container mx-auto px-6 py-16">
                <div className="mx-auto max-w-4xl text-center text-white">
                    {/* <div className="mx-auto mb-6 h-28 w-28 rounded-full bg-linear-to-br from-blue-500 via-purple-500 to-pink-500 p-0.75">
                        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-950">
                            <span className="text-4xl font-semibold">M</span>
                        </div>
                    </div> */}
                    <div className='flex justify-center mb-4'>
                        <img src="/maktech.png" alt="Maktech Store" className="h-24 w-24" />
                    </div>
                    <p className="text-sm uppercase tracking-[0.6rem] text-gray-400">Maktech Store</p>
                    <div className="mt-4 flex flex-col items-center justify-center gap-4 text-sm text-gray-300">
                        <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            4.8 (321 reviews)
                        </span>
                        <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            921 4th Avenue North, Birmingham, AL 35203, USA
                        </span>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-3 text-white">
                    {categories.map((category) => (
                        <button
                            key={category}
                            type="button"
                            onClick={() => setActiveCategory(category)}
                            className={`rounded-full px-6 py-2 text-sm font-medium transition duration-200 ${
                                activeCategory === category
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
                                        <button className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500">
                                            See Details
                                        </button>
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
