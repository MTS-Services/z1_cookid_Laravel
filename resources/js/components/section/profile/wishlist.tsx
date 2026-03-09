import { Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LocateIcon, ShoppingCart, X } from 'lucide-react'

export interface WishlistItemProps {
    id: number
    serviceId: number
    name: string
    image: string
    address: string
    price: number
}

interface WishlistSectionProps {
    wishlist: WishlistItemProps[]
}

function removeFromWishlist(wishlistId: number) {
    router.delete(route('user.wishlist.destroy', wishlistId))
}

export function WishlistSection({ wishlist }: WishlistSectionProps) {
    return (
        <section className="space-y-6">
            <Card className="border border-[#292929]/80 bg-[#1c1c1c] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#292929] px-4 py-4 sm:px-6">
                    <h2 className="text-lg font-semibold text-white sm:text-xl">Wishlist</h2>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500">
                        {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                    </span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="px-4 py-12 text-center text-slate-400">
                        <p>Your wishlist is empty.</p>
                        <Link
                            href={route('frontend.services')}
                            className="mt-3 inline-block text-blue-400 hover:underline"
                        >
                            Browse services
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Mobile Cards */}
                        <div className="divide-y divide-[#292929] md:hidden">
                            {wishlist.map((item) => (
                                <div key={item.id} className="flex flex-col gap-4 px-4 py-5">
                                    <div className="flex gap-4">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-slate-700">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <p className="text-sm font-semibold text-white">{item.name}</p>
                                            <p className="flex items-center gap-2 text-xs text-slate-400">
                                                <LocateIcon className="h-3.5 w-3.5 text-blue-400" />
                                                {item.address}
                                            </p>
                                            <span className="text-sm font-semibold text-white">${item.price.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link href={route('frontend.service-details', { id: item.serviceId })} className="flex-1">
                                            <Button className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold">
                                                Book Now
                                                <ShoppingCart className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => removeFromWishlist(item.id)}
                                            className="h-10 w-10 rounded-full border border-slate-700 text-slate-400 transition hover:border-white hover:text-white"
                                            aria-label="Remove from wishlist"
                                        >
                                            <X className="mx-auto h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table */}
                        <div className="hidden overflow-x-auto md:block">
                            <table className="min-w-full text-left text-slate-200">
                                <thead>
                                    <tr className="text-xs uppercase tracking-[0.15em] text-slate-400">
                                        <th className="py-4 px-6 font-semibold">Products</th>
                                        <th className="py-4 px-6 font-semibold">Price</th>
                                        <th className="py-4 px-6 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {wishlist.map((item) => (
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
                                            <td className="px-6 py-5 font-semibold text-white">${item.price.toLocaleString()}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <Link href={route('frontend.service-details', { id: item.serviceId })} className="w-full">
                                                        <Button className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 font-semibold tracking-wide">
                                                            Book Now
                                                            <ShoppingCart className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromWishlist(item.id)}
                                                        className="h-10 w-10 rounded-full border border-slate-700 text-slate-400 transition hover:border-white hover:text-white"
                                                        aria-label="Remove from wishlist"
                                                    >
                                                        <X className="mx-auto h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </Card>
        </section>
    )
}
