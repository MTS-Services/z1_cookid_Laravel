import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LocateIcon, ShoppingCart, X } from 'lucide-react'

const wishlistItems = [
    {
        id: 'WL-001',
        name: 'Bring Back That Showroom Shine!',
        address: '122 Industrial Way, Suite 4B, San Francisco, CA',
        price: 999,
        image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=300&q=60',
    },
    {
        id: 'WL-002',
        name: 'Ceramic Coating & Detail',
        address: '412 Redwood Ave, Denver, CO',
        price: 849,
        image: 'https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=300&q=60',
    },
    {
        id: 'WL-003',
        name: 'Interior Deep Clean Package',
        address: '8833 Ventura Blvd, Los Angeles, CA',
        price: 540,
        image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=300&q=60',
    },
]

export function WishlistSection() {
    return (
        <section className="space-y-6">
            <Card className="border border-[#292929]/80 bg-[#1c1c1c] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#292929] px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">Wishlist</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-slate-200">
                        <thead>
                            <tr className="text-xs uppercase tracking-[0.15em] text-slate-400">
                                <th className="py-4 px-6 font-semibold">Products</th>
                                <th className="py-4 px-6 font-semibold">Price</th>
                                <th className="py-4 px-6 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItems.map((item) => (
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
                                    <td className="px-6 py-5 font-semibold text-white">${item.price}</td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <Link href="#" className="w-full">
                                                <Button className="flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-6 font-semibold tracking-wide">
                                                    Book Now
                                                    <ShoppingCart className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <div className="flex gap-2">
                                                <button className="h-10 w-10 rounded-full border border-slate-700 text-slate-400 transition hover:border-white hover:text-white">
                                                    <X className="mx-auto h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    )
}
