import { index, create, edit, destroy } from '@/actions/App/Http/Controllers/Vendor/ListingManagement/ListingController'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import VendorLayout from '@/layouts/vendor-layout'
import { Link, router, usePage } from '@inertiajs/react'
import { MapPin, Pencil, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'

interface ListingItem {
    id: number
    name: string
    location: string
    price: number
    service: string
    rating: number | null
    image: string
}

interface PaginationData {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}

interface ListingIndexProps {
    listings: ListingItem[]
    pagination: PaginationData
    search: string
}

export default function ListingIndex() {
    const { listings, pagination, search } = usePage().props as unknown as ListingIndexProps
    const [searchInput, setSearchInput] = useState(search)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        router.get(index.url({ query: { search: searchInput || undefined } }), {}, { preserveState: true })
    }

    const handlePageChange = (page: number) => {
        router.get(index.url({ query: { page, search: search || undefined } }), {}, { preserveState: true })
    }

    const handleDelete = (listing: ListingItem) => {
        if (!window.confirm(`Delete "${listing.name}"? This cannot be undone.`)) return
        setDeletingId(listing.id)
        router.delete(destroy.url(listing.id), {
            preserveScroll: true,
            onFinish: () => setDeletingId(null),
        })
    }

    return (
        <VendorLayout activeSlug="listing">
            <section className="space-y-8">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Vendor tools</p>
                        <h1 className="text-2xl font-semibold text-white">Listings Management</h1>
                    </div>
                    <Button asChild className="flex items-center gap-2 bg-navy px-6 py-2 text-white">
                        <Link href={create.url()}>
                            New Listing
                            <span className="text-lg"> +</span>
                        </Link>
                    </Button>
                </header>

                <div className="rounded-3xl border border-white/5 bg-bg-gray p-4 shadow-[0_30px_70px_rgba(0,0,0,0.45)] md:p-6">
                    <form onSubmit={handleSearch} className="mb-6 flex gap-2">
                        <input
                            type="search"
                            placeholder="Search listings..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="flex-1 rounded-lg border border-white/10 bg-dark-gray px-4 py-2 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-navy"
                        />
                        <Button type="submit" variant="secondary" className="border border-white/10 bg-white/5 text-white">
                            Search
                        </Button>
                    </form>

                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {listings.length === 0 ? (
                            <p className="col-span-full py-12 text-center text-slate-400">
                                No listings yet. Create your first listing to get started.
                            </p>
                        ) : (
                            listings.map((listing) => (
                                <article
                                    key={listing.id}
                                    className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-dark-gray text-white shadow-lg"
                                >
                                    <div className="h-40 w-full overflow-hidden">
                                        <img
                                            src={listing.image}
                                            alt={listing.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-1 flex-col gap-4 p-4">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <h3 className="text-lg font-semibold">{listing.name}</h3>
                                                <p className="flex items-center gap-2 text-sm text-slate-400">
                                                    <MapPin className="h-4 w-4 text-navy" />
                                                    {listing.location}
                                                </p>
                                            </div>
                                            {listing.rating != null && (
                                                <span className="flex items-center gap-1 text-sm">
                                                    <Star className="h-4 w-4 text-amber-400" />
                                                    {listing.rating}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-200">
                                                {listing.service}
                                            </span>
                                            <span className="text-2xl font-semibold">${listing.price}</span>
                                        </div>
                                        <div className="mt-auto flex gap-3">
                                            <Button asChild className="flex-1 bg-navy text-white">
                                                <Link href={edit.url(listing.id)}>
                                                    <Pencil className="mr-1.5 h-4 w-4" />
                                                    Edit
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                className="flex-1 border border-white/10 bg-white/5 text-white"
                                                disabled={deletingId === listing.id}
                                                onClick={() => handleDelete(listing)}
                                            >
                                                <Trash2 className="mr-1.5 h-4 w-4" />
                                                {deletingId === listing.id ? 'Deleting…' : 'Delete'}
                                            </Button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </div>

                    {pagination.last_page > 1 && (
                        <Pagination
                            currentPage={pagination.current_page}
                            totalPages={pagination.last_page}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </section>
        </VendorLayout>
    )
}
