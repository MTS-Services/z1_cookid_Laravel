import ServiceCard from '@/components/ui/service-card'
import Pagination from '@/components/ui/pagination'
import { Link } from '@inertiajs/react'
import { useMemo, useState } from 'react'

interface TopRelatedService {
    id: number
    image: string
    name: string
    rating: number
    location: string
    service: string
    price: number
}

interface TopRelatedProps {
    services: TopRelatedService[]
}

export default function TopRelated({ services }: TopRelatedProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 8

    const { paginatedServices, totalPages } = useMemo(() => {
        const total = services.length || 1
        const pages = Math.max(1, Math.ceil(total / pageSize))
        const safePage = Math.min(Math.max(1, currentPage), pages)
        const start = (safePage - 1) * pageSize
        const end = start + pageSize

        return {
            paginatedServices: services.slice(start, end),
            totalPages: pages,
        }
    }, [services, currentPage])

    return (
        <div
            className="py-5 lg:py-10"
        >
            <div className="relative z-10 container flex h-full flex-col justify-center px-4">
                {/* Card 1 */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl lg:text-3xl font-medium text-text-white">
                        Top Rated Near You
                    </h2>
                    <Link href={route('frontend.services')} className="rounded-lg bg-bg-nevy p-3 text-base font-medium text-text-gray-100">
                        View All Service
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {paginatedServices.map((item) => (
                        <ServiceCard key={item.id} {...item} />
                    ))}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    )
}
