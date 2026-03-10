import React from 'react'

interface OrderTotals {
    subtotal?: number | null
    discount?: number | null
    total?: number | null
}

interface CustomerInfo {
    name?: string | null
    email?: string | null
    phone?: string | null
}

interface ServiceInfo {
    title?: string | null
    description?: string | null
    duration?: string | null
    location?: string | null
    amount?: number | null
    vendorName?: string | null
}

interface AddressInfo {
    firstName?: string | null
    lastName?: string | null
    email?: string | null
    phone?: string | null
    addressLine?: string | null
    city?: string | null
    state?: string | null
    zipCode?: string | null
}

interface PaymentInfo {
    status?: string | null
    statusLabel?: string | null
    method?: string | null
    methodLabel?: string | null
    transactionId?: string | null
    amount?: number | null
    paidAt?: string | null
}

interface CancellationInfo {
    cancelledBy?: string | null
    reason?: string | null
}

export interface VendorOrderDetails {
    id: number | string
    reference: string
    orderNumber?: string | null
    status: string
    statusLabel?: string | null
    scheduledAt?: string | null
    completedAt?: string | null
    createdAt?: string | null
    totals: OrderTotals
    customer: CustomerInfo
    service: ServiceInfo
    address?: AddressInfo | null
    payment?: PaymentInfo | null
    cancellation?: CancellationInfo | null
}

interface Props {
    order: VendorOrderDetails
    variant: 'regular' | 'cancelled'
}

const statusClassMap: Record<string, string> = {
    completed: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40',
    confirmed: 'bg-blue-600/10 text-blue-300 border border-blue-500/40',
    inprogress: 'bg-sky-500/10 text-sky-200 border border-sky-500/40',
    pending: 'bg-amber-500/10 text-amber-300 border border-amber-500/40',
    cancelled: 'bg-rose-500/10 text-rose-300 border border-rose-500/40',
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
})

const dateFormatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
})

const timeFormatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
})

const formatCurrency = (value?: number | null): string => {
    if (value === null || value === undefined) {
        return 'N/A'
    }

    return currencyFormatter.format(value)
}

const formatDate = (value?: string | null): string => {
    if (!value) {
        return 'N/A'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return 'N/A'
    }

    return dateFormatter.format(date)
}

const formatTime = (value?: string | null): string => {
    if (!value) {
        return 'N/A'
    }

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
        return 'N/A'
    }

    return timeFormatter.format(date)
}

const getStatusClass = (status: string): string => {
    return statusClassMap[status] ?? 'bg-slate-600/10 text-slate-300 border border-slate-500/40'
}

export default function VendorOrderDetailsView({ order, variant }: Props) {
    const pageTitle = variant === 'cancelled' ? 'Order Cancel Details' : 'Order Details'
    const orderIdLabel = order.orderNumber ?? `#${order.id}`
    const serviceAmount = order.totals.total ?? order.totals.subtotal ?? order.service.amount ?? null
    const paymentDate = order.payment?.paidAt ?? order.completedAt ?? order.scheduledAt ?? order.createdAt
    const completionTime = order.completedAt ?? order.scheduledAt

    return (
        <section className="space-y-6 text-white">
            <div className="rounded-3xl border border-white/5 bg-bg-gray p-6 shadow-[0_30px_70px_rgba(0,0,0,0.45)]">
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-xl font-semibold">{pageTitle}</h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Order ID: <span className="font-medium text-slate-200">{orderIdLabel}</span>
                        </p>
                        <p className="text-sm text-slate-400">
                            Reference: <span className="font-medium text-slate-200">{order.reference}</span>
                        </p>
                    </div>
                    <div className={`inline-flex items-center rounded-full px-4 py-1 text-sm font-medium ${getStatusClass(order.status)}`}>
                        {order.statusLabel ?? order.status}
                    </div>
                </div>

                <div className="mt-6 rounded-t-md bg-dark-gray">
                    <div className="border-b border-slate-700 px-5 py-3">
                        <h2 className="text-sm font-semibold tracking-wide text-slate-200">Order Summary</h2>
                    </div>
                    <div className="grid gap-8 border-b border-slate-700 px-5 py-5 md:grid-cols-2">
                        <div className="space-y-2 text-sm text-slate-300">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Customer:</span>
                                <span className="font-medium text-slate-200">{order.customer.name ?? 'N/A'}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Service Provider:</span>
                                <span className="font-medium text-slate-200">{order.service.vendorName ?? 'N/A'}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Service Date:</span>
                                <span className="font-medium text-slate-200">{formatDate(order.scheduledAt ?? order.createdAt)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Completion Time:</span>
                                <span className="font-medium text-slate-200">{formatTime(completionTime)}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm text-slate-300">
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Service Amount:</span>
                                <span className="font-medium text-slate-200">{formatCurrency(serviceAmount)}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Payment Status:</span>
                                <span className="font-medium text-slate-200">{order.payment?.statusLabel ?? 'N/A'}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Payment Method:</span>
                                <span className="font-medium text-slate-200">{order.payment?.methodLabel ?? order.payment?.method ?? 'N/A'}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-slate-400">Transaction ID:</span>
                                <span className="font-medium text-slate-200">{order.payment?.transactionId ?? 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-slate-700">
                        <div className="border-b border-slate-700 px-5 py-3">
                            <h2 className="text-sm font-semibold tracking-wide text-slate-200">Service Details</h2>
                        </div>
                        <div className="space-y-3 px-5 py-4 text-sm text-slate-300">
                            <p className="font-semibold text-sky-400">{order.service.title ?? 'Untitled Service'}</p>
                            {order.service.description && <p>{order.service.description}</p>}
                            <div className="mt-2 space-y-1">
                                <p>
                                    <span className="text-slate-400">Duration: </span>
                                    <span className="font-medium text-slate-200">{order.service.duration ?? 'N/A'}</span>
                                </p>
                                <p>
                                    <span className="text-slate-400">Location: </span>
                                    <span className="font-medium text-slate-200">{order.service.location ?? 'N/A'}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-slate-700">
                        <div className="border-b border-slate-700 px-5 py-3">
                            <h2 className="text-sm font-semibold tracking-wide text-slate-200">Payment Information</h2>
                        </div>
                        <div className="flex flex-col gap-4 px-5 py-4 text-sm text-slate-300 md:flex-row">
                            <div className="flex-1">
                                <p className="text-slate-400">Payment Method:</p>
                                <p className="mt-1 font-medium text-slate-200">{order.payment?.methodLabel ?? order.payment?.method ?? 'N/A'}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-400">Payment Date:</p>
                                <p className="mt-1 font-medium text-slate-200">{formatDate(paymentDate)}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-400">Amount Paid:</p>
                                <p className="mt-1 font-medium text-slate-200">{formatCurrency(order.payment?.amount ?? serviceAmount)}</p>
                            </div>
                        </div>
                    </div>

                    {order.address && (
                        <div className="border-b border-slate-700">
                            <div className="border-b border-slate-700 px-5 py-3">
                                <h2 className="text-sm font-semibold tracking-wide text-slate-200">Customer Address</h2>
                            </div>
                            <div className="grid gap-4 px-5 py-4 text-sm text-slate-300 md:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-slate-400">Contact</p>
                                    <p className="font-medium text-slate-200">
                                        {[order.address.firstName, order.address.lastName].filter(Boolean).join(' ') || 'N/A'}
                                    </p>
                                    <p>{order.address.phone ?? 'N/A'}</p>
                                    <p>{order.address.email ?? 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-slate-400">Address</p>
                                    <p className="font-medium text-slate-200">{order.address.addressLine ?? 'N/A'}</p>
                                    <p>
                                        {[order.address.city, order.address.state, order.address.zipCode]
                                            .filter(Boolean)
                                            .join(', ') || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {variant === 'cancelled' && order.cancellation && (
                        <div>
                            <div className="border-b border-slate-700 px-5 py-3">
                                <h2 className="text-sm font-semibold tracking-wide text-slate-200">Cancel Information</h2>
                            </div>
                            <div className="px-5 py-4 text-sm text-slate-300">
                                <p>
                                    <span className="text-slate-400">Canceled by: </span>
                                    <span className="font-medium text-slate-200">{order.cancellation.cancelledBy ?? 'N/A'}</span>
                                </p>
                                {order.cancellation.reason && (
                                    <p className="mt-1 text-slate-300">
                                        <span className="text-slate-400">Reason: </span>
                                        <span className="font-medium text-slate-200">{order.cancellation.reason}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
