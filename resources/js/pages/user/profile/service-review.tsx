import { useForm } from '@inertiajs/react'
import { Star } from 'lucide-react'
import { useMemo, useState } from 'react'
import FrontendLayout from '@/layouts/frontend-layout'
import type { UserOrderSummary } from './order-details'

function formatDate(iso: string | null): string {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('en-US', { dateStyle: 'long' })
}

function Section({
    title,
    children,
}: {
    title: string
    children: React.ReactNode
}) {
    return (
        <section className="border-b border-slate-900 px-8 py-6">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <div className="mt-4 text-slate-200">{children}</div>
        </section>
    )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-900/60 pb-2 text-slate-300">
            <span>{label}</span>
            <span className="font-semibold text-white">{value}</span>
        </div>
    )
}

interface ServiceReviewPageProps {
    order: UserOrderSummary
}

export default function ServiceReviewPage({ order }: ServiceReviewPageProps) {
    const [hoverRating, setHoverRating] = useState(0)
    const { data, setData, post, processing, errors } = useForm({
        rating: 0,
        comment: '',
    })

    const effectiveRating = hoverRating || data.rating
    const summaryLeft = useMemo(
        () => [
            { label: 'Customer', value: order.customer?.name ?? '—' },
            { label: 'Service Provider', value: order.service?.vendorName ?? '—' },
            { label: 'Service Date', value: formatDate(order.scheduledAt ?? order.createdAt) },
            {
                label: 'Service Amount',
                value:
                    order.totals?.total != null
                        ? `$${Number(order.totals.total).toFixed(2)}`
                        : '—',
            },
        ],
        [order]
    )
    const summaryRight = useMemo(
        () => [
            {
                label: 'Payment Status',
                value: order.payment?.statusLabel ?? '—',
            },
            {
                label: 'Payment Method',
                value: order.payment?.methodLabel ?? order.payment?.method ?? '—',
            },
            {
                label: 'Transaction ID',
                value: order.payment?.transactionId ?? '—',
            },
        ],
        [order]
    )
    const paymentRows = useMemo(
        () => [
            { label: 'Payment Method', value: order.payment?.methodLabel ?? '—' },
            {
                label: 'Payment Date',
                value: order.payment?.paidAt
                    ? formatDate(order.payment.paidAt)
                    : formatDate(order.createdAt),
            },
            {
                label: 'Amount Paid',
                value:
                    order.payment?.amount != null
                        ? `$${Number(order.payment.amount).toFixed(2)}`
                        : order.totals?.total != null
                          ? `$${Number(order.totals.total).toFixed(2)}`
                          : '—',
            },
        ],
        [order]
    )

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (data.rating < 1 || data.rating > 5) return
        post(route('user.service-review.store', order.id))
    }

    return (
        <FrontendLayout>
            <section className="mx-auto mt-16 w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/80 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <header className="border-b border-slate-800 px-8 py-6 text-center">
                    <p className="text-2xl font-semibold tracking-wide">Service Review</p>
                </header>

                <div className="space-y-0">
                    <Section title="Order Details">
                        <div className="text-sm text-slate-300">
                            Order ID:{' '}
                            <span className="font-mono text-white">#{order.orderNumber}</span>
                        </div>
                    </Section>

                    <Section title="Order Summary">
                        <div className="grid gap-8 text-sm md:grid-cols-2">
                            <div className="space-y-3">
                                {summaryLeft.map(({ label, value }) => (
                                    <SummaryRow key={label} label={label} value={value} />
                                ))}
                            </div>
                            <div className="space-y-3">
                                {summaryRight.map(({ label, value }) => (
                                    <SummaryRow key={label} label={label} value={value} />
                                ))}
                            </div>
                        </div>
                    </Section>

                    <Section title="Service Details">
                        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                            <p className="text-lg font-semibold text-navy/50">
                                {order.service?.title ?? '—'}
                            </p>
                            <p className="text-sm text-slate-300">
                                {order.service?.description ?? '—'}
                            </p>
                            <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:gap-8">
                                <span>
                                    <strong className="text-white">Duration:</strong>{' '}
                                    {order.service?.duration ?? '—'}
                                </span>
                                <span>
                                    <strong className="text-white">Location:</strong>{' '}
                                    {order.service?.location ?? '—'}
                                </span>
                            </div>
                        </div>
                    </Section>

                    <Section title="Payment Information">
                        <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm md:grid-cols-3">
                            {paymentRows.map(({ label, value }) => (
                                <div key={label} className="space-y-1">
                                    <p className="text-slate-400">{label}</p>
                                    <p className="font-semibold text-white">{value}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Rate Your Experience">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex items-center justify-center gap-1 text-amber-400">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setData('rating', star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none"
                                        aria-label={`${star} star${star > 1 ? 's' : ''}`}
                                    >
                                        <Star
                                            className={`h-7 w-7 transition ${
                                                star <= effectiveRating
                                                    ? 'fill-amber-400'
                                                    : 'fill-transparent text-slate-600'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            {errors.rating && (
                                <p className="text-center text-sm text-red-400">
                                    Please select a rating (1–5 stars).
                                </p>
                            )}
                            <textarea
                                name="comment"
                                placeholder="Write your review (optional)..."
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200 placeholder:text-slate-500"
                                rows={4}
                                maxLength={2000}
                            />
                            {errors.comment && (
                                <p className="text-sm text-red-400">{errors.comment}</p>
                            )}
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    disabled={processing || data.rating < 1 || data.rating > 5}
                                    className="mt-4 cursor-pointer rounded-sm bg-navy px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </Section>
                </div>
            </section>
        </FrontendLayout>
    )
}
