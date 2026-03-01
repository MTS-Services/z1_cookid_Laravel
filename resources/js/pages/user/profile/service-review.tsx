import { Star } from 'lucide-react'
import { useMemo } from 'react'
import FrontendLayout from '@/layouts/frontend-layout'

const orderDetails = {
    id: 'ORD-105114075922',
    summary: [
        { label: 'Customer', value: 'Guy Hawkins' },
        { label: 'Service Provider', value: 'Elite Auto Spa' },
        { label: 'Service Date', value: 'October 6, 2025' },
        { label: 'Completion Time', value: '2:45 PM' },
        { label: 'Service Amount', value: '$120' },
        { label: 'Payment Status', value: 'Paid' },
        { label: 'Payment Method', value: 'Credit Card' },
        { label: 'Transaction ID', value: 'TXN-78459321' },
    ],
    service: {
        title: 'Full Interior & Exterior Detailing',
        description:
            'Complete exterior hand wash, interior deep cleaning, tire shine, and surface polishing.',
        duration: '2.5 Hours',
        location: 'Customer Address (On-site Service)',
    },
    payment: [
        { label: 'Payment Method', value: 'Credit Card' },
        { label: 'Payment Date', value: 'October 6, 2025' },
        { label: 'Amount Paid', value: '$120' },
    ],
    rating: {
        score: 4,
        max: 5,
        comment: 'Excellent service, very professional and on time.',
    },
}

export default function ServiceReview() {
    const groupedSummary = useMemo(() => {
        const left = orderDetails.summary.slice(0, 4)
        const right = orderDetails.summary.slice(4)
        return { left, right }
    }, [])

    return (
        <FrontendLayout>
            <section className="mx-auto mt-16 w-full max-w-4xl rounded-3xl border border-slate-800 bg-slate-950/80 text-white shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                <header className="border-b border-slate-800 px-8 py-6 text-center">
                    <p className="text-2xl font-semibold tracking-wide">Service Review</p>
                </header>

                <div className="space-y-0">
                    <Section title="Order Details">
                        <div className="text-sm text-slate-300">
                            Order ID: <span className="font-mono text-white">#{orderDetails.id}</span>
                        </div>
                    </Section>

                    <Section title="Order Summary">
                        <div className="grid gap-8 text-sm md:grid-cols-2">
                            {[groupedSummary.left, groupedSummary.right].map((column, columnIndex) => (
                                <div key={columnIndex} className="space-y-3">
                                    {column.map(({ label, value }) => (
                                        <SummaryRow key={label} label={label} value={value} />
                                    ))}
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Service Details">
                        <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/60 p-5">
                            <p className="text-lg font-semibold text-blue-300">{orderDetails.service.title}</p>
                            <p className="text-sm text-slate-300">{orderDetails.service.description}</p>
                            <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:gap-8">
                                <span>
                                    <strong className="text-white">Duration:</strong> {orderDetails.service.duration}
                                </span>
                                <span>
                                    <strong className="text-white">Location:</strong> {orderDetails.service.location}
                                </span>
                            </div>
                        </div>
                    </Section>

                    <Section title="Payment Information">
                        <div className="grid gap-4 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm md:grid-cols-3">
                            {orderDetails.payment.map(({ label, value }) => (
                                <div key={label} className="space-y-1">
                                    <p className="text-slate-400">{label}</p>
                                    <p className="font-semibold text-white">{value}</p>
                                </div>
                            ))}
                        </div>
                    </Section>

                    <Section title="Rate Your Experience">
                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-1 text-amber-400">
                                {Array.from({ length: orderDetails.rating.max }).map((_, index) => (
                                    <Star
                                        key={index}
                                        className={`h-7 w-7 ${index < orderDetails.rating.score ? 'fill-amber-400' : 'fill-transparent text-slate-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            {/* <p className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-sm text-slate-200">
                                {orderDetails.rating.comment}
                            </p> */}
                            <form action="">
                                <textarea
                                    placeholder="Write your review..."
                                    className="w-full rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200"
                                />
                                <button type="submit" className="mx-auto block cursor-pointer rounded-sm bg-navy px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy/80 mt-4">
                                    Submit Review
                                </button>
                            </form>
                        </div>
                    </Section>
                </div>
            </section>
        </FrontendLayout>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
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
