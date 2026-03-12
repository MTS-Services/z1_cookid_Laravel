import { Link } from '@inertiajs/react'
import OrderDetailsCard from '@/components/section/orders/order-details-card'
import FrontendLayout from '@/layouts/frontend-layout'
import type { UserOrderSummary } from './order-details'

function formatDate(iso: string | null): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'long' })
}

function formatTime(iso: string | null): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

interface OrderDetailPageProps {
    order: UserOrderSummary
}

export default function OrderDetailPage({ order }: OrderDetailPageProps) {
    const serviceDate = formatDate(order.scheduledAt ?? order.createdAt)
    const completionTime = formatTime(order.completedAt ?? order.scheduledAt)
    const serviceAmount =
        order.totals?.total != null
            ? `$${Number(order.totals.total).toFixed(2)}`
            : order.payment?.amount != null
              ? `$${Number(order.payment.amount).toFixed(2)}`
              : '—'
    const paymentStatus = order.payment?.statusLabel ?? '—'
    const paymentMethod = order.payment?.methodLabel ?? order.payment?.method ?? '—'
    const transactionId = order.payment?.transactionId ?? '—'

    return (
        <FrontendLayout>
            <div className="mx-auto max-w-2xl px-6 py-12">
                <Link
                    href={route('user.profile', { section: 'bookings' })}
                    className="mb-6 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
                >
                    ← Back to bookings
                </Link>
                <OrderDetailsCard
                    orderId={order.orderNumber}
                    customerName={order.customer?.name ?? '—'}
                    serviceProvider={order.service?.vendorName ?? '—'}
                    serviceDate={serviceDate}
                    completionTime={completionTime}
                    serviceAmount={serviceAmount}
                    paymentStatus={paymentStatus}
                    paymentMethod={paymentMethod}
                    transactionId={transactionId}
                    orderStatus={order.statusLabel}
                    serviceTitle={order.service?.title ?? undefined}
                    serviceDescription={order.service?.description ?? undefined}
                    duration={order.service?.duration ?? undefined}
                    location={order.service?.location ?? undefined}
                />
                {order.status === 'completed' && !order.review && (
                    <div className="mt-6 text-center">
                        <Link href={route('user.service-review.show', order.id)}>
                            <button
                                type="button"
                                className="rounded-lg border border-slate-700 bg-slate-800/50 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
                            >
                                Leave a review
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </FrontendLayout>
    )
}
