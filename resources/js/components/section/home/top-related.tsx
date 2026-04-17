import ServiceCard from '@/components/ui/service-card'
import Pagination from '@/components/ui/pagination'
import { Link, router } from '@inertiajs/react'

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
    services?: {
        data: TopRelatedService[]
        current_page: number
        from: number | null
        last_page: number
        per_page: number
        to: number | null
        total: number
    }
}

export default function TopRelated({ services }: TopRelatedProps) {
    const paginatedServices = services?.data ?? []
    const currentPage = services?.current_page ?? 1
    const lastPage = services?.last_page ?? 1
    const perPage = services?.per_page ?? 9

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
                {
                    paginatedServices.length > 0 ? (
                        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {paginatedServices.map((item) => (
                                <ServiceCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center backdrop-blur-sm">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-nevy/70 text-2xl">
                                !
                            </div>
                            <h3 className="text-lg font-semibold text-text-white">No services available right now</h3>
                            <p className="mt-2 max-w-md text-sm text-text-gray-100/80">
                                New services are added regularly. Explore all services to find nearby options.
                            </p>
                            <div className="mt-6 flex gap-3">
                                <Link
                                    href={route('frontend.services')}
                                    className="rounded-lg bg-bg-nevy px-5 py-2.5 text-sm font-medium text-text-gray-100 transition hover:opacity-90"
                                >
                                    Browse Services
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => router.reload({ only: ['services'] })}
                                    className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-text-gray-100 transition hover:bg-white/10 cursor-pointer"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>
                    )
                }
                {lastPage > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={lastPage}
                        onPageChange={(page) =>
                            router.get(
                                route('frontend.home'),
                                {
                                    page,
                                    per_page: perPage,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                }
                            )
                        }
                    />
                )}
            </div>
        </div>
    )
}
