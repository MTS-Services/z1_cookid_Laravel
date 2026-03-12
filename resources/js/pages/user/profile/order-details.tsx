import { Link } from '@inertiajs/react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import FrontendLayout from '@/layouts/frontend-layout'
import { ChevronRight } from 'lucide-react'

export interface UserOrderSummary {
    id: number
    orderNumber: string
    status: string
    statusLabel: string
    scheduledAt: string | null
    completedAt: string | null
    createdAt: string | null
    totals: { subtotal: number | null; discount: number | null; total: number | null }
    customer: { name: string; email: string | null; phone: string | null }
    service: {
        id: number | null
        title: string | null
        description: string | null
        duration: string | null
        location: string | null
        amount: number | null
        vendorName: string | null
    }
    address: Record<string, string> | null
    payment: {
        status: string
        statusLabel: string
        method: string | null
        methodLabel: string | null
        transactionId: string | null
        amount: number | null
        paidAt: string | null
    } | null
    review: { rating: number; comment: string | null } | null
}

function formatDate(iso: string | null): string {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { dateStyle: 'long' })
}

function formatTime(iso: string | null): string {
    if (!iso) return '—'
    const d = new Date(iso)
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const statusBadgeClass: Record<string, string> = {
    completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    cancelled: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    confirmed: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    inprogress: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

interface OrderDetailsPageProps {
    orders: {
        data: UserOrderSummary[]
        current_page: number
        last_page: number
        per_page: number
        total: number
        links: { url: string | null; label: string; active: boolean }[]
    }
}

export default function OrderDetailsPage({ orders }: OrderDetailsPageProps) {
    return (
        <FrontendLayout>
            <div className="mx-auto max-w-4xl px-6 py-12">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-white">Order Details</h1>
                    <p className="mt-1 text-slate-400">View and manage your orders.</p>
                </header>

                {orders.data.length === 0 ? (
                    <Card className="rounded-2xl border-slate-800 bg-slate-900/50 p-12 text-center text-slate-400">
                        <p>You have no orders yet.</p>
                        <Link href={route('frontend.home')}>
                            <Button className="mt-4">Browse services</Button>
                        </Link>
                    </Card>
                ) : (
                    <ul className="space-y-4">
                        {orders.data.map((order) => (
                            <li key={order.id}>
                                <Card className="rounded-xl border-slate-800 bg-slate-900/50 p-5 transition hover:border-slate-700">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                        <div className="min-w-0 flex-1">
                                            <p className="font-mono text-sm text-slate-400">
                                                #{order.orderNumber}
                                            </p>
                                            <p className="mt-1 truncate text-lg font-semibold text-white">
                                                {order.service?.title ?? 'Service'}
                                            </p>
                                            <p className="text-sm text-slate-400">
                                                {order.service?.vendorName ?? '—'} · {formatDate(order.scheduledAt)}
                                            </p>
                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        statusBadgeClass[order.status] ??
                                                        'border-slate-600 text-slate-300'
                                                    }
                                                >
                                                    {order.statusLabel}
                                                </Badge>
                                                {order.totals?.total != null && (
                                                    <span className="text-sm font-semibold text-white">
                                                        ${Number(order.totals.total).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 flex-wrap gap-2">
                                            <Link href={route('user.order-details.show', order.id)}>
                                                <Button variant="outline" size="sm" className="rounded-lg">
                                                    View Details
                                                </Button>
                                            </Link>
                                            {order.status === 'completed' && !order.review && (
                                                <Link href={route('user.service-review.show', order.id)}>
                                                    <Button size="sm" className="rounded-lg bg-navy">
                                                        Leave review
                                                    </Button>
                                                </Link>
                                            )}
                                            <Link href={route('user.order-details.show', order.id)}>
                                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                                    <ChevronRight className="h-5 w-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </li>
                        ))}
                    </ul>
                )}

                {orders.last_page > 1 && (
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {orders.links.map((link, i) => (
                            <span key={i}>
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        className={`inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium ${
                                            link.active
                                                ? 'bg-navy text-white'
                                                : 'border border-slate-700 text-slate-300 hover:bg-slate-800'
                                        }`}
                                    >
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </Link>
                                ) : (
                                    <span className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-800 px-3 text-slate-500">
                                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </FrontendLayout>
    )
}
