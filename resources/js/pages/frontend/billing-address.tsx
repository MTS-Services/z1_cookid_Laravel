import React from 'react';
import FrontendLayout from '@/layouts/frontend-layout';
import { Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// ─── Types ─────────────────────────────────────────────────────────────────────

type Address = {
    order_id:   string;
    first_name: string;
    last_name:  string;
    email:      string;
    phone:      string;
    address:    string;
    state:      string;
    city:       string;
    zip_code:   string;
};

type BillingAddressProps = {
    address?:     Address | null;
    summary: {
        id:      string;   // encrypted service id
        service: string;
        price:   number;
    };
    supportPhone: string;
};

// ─── Component ─────────────────────────────────────────────────────────────────

export default function BillingAddress({ address, summary, supportPhone }: BillingAddressProps) {
    const { data, setData, post, processing, errors } = useForm({
        order_id:       address?.order_id ?? '',
        service_id:     summary.id,
        first_name:     address?.first_name ?? '',
        last_name:      address?.last_name  ?? '',
        email:          address?.email      ?? '',
        phone:          address?.phone      ?? '',
        address:        address?.address    ?? '',
        state:          address?.state      ?? '',
        city:           address?.city       ?? '',
        zip_code:       address?.zip_code   ?? '',
        comments:       '',
        payment_method: 'stripe' as 'paypal' | 'stripe',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('user.order.billing-address.store'), {
            // ✅ CRITICAL: This tells Inertia NOT to treat the redirect as
            // an internal Inertia visit. When the server returns redirect()->away()
            // Inertia will do window.location.href = externalUrl (full page nav).
            // This completely avoids CORS because the browser itself navigates,
            // not an XHR request.
            preserveScroll: true,

            onError: () => {
                // Scroll to first error field
                const firstError = document.querySelector('[data-error]');
                firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            },
        });
    };

    return (
        <FrontendLayout>
            <section className="min-h-screen py-16 px-4 text-white">
                <div className="container px-4 space-y-12">
                    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[2fr_1fr]">

                        {/* ── Left: Shipping & Billing ────────────────────── */}
                        <div className="space-y-8">
                            <div className="rounded border border-white/10 bg-dark-gray p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                                <h2 className="text-2xl font-semibold">Shipping &amp; Billing</h2>
                                <p className="text-sm text-gray-400 mt-2">
                                    We use this information to confirm your booking and invoice.
                                </p>

                                <div className="mt-8 space-y-6">
                                    <input type="hidden" name="order_id" value={data.order_id} />

                                    {/* Name Row */}
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="grid gap-2" data-error={errors.first_name ? true : undefined}>
                                            <Label htmlFor="first_name">First name *</Label>
                                            <Input
                                                id="first_name"
                                                autoComplete="given-name"
                                                className="bg-bg-gray/50 border-white/10 text-white"
                                                value={data.first_name}
                                                onChange={e => setData('first_name', e.target.value)}
                                                placeholder="Enter first name"
                                            />
                                            {errors.first_name && (
                                                <p className="text-xs text-red-400">{errors.first_name}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2" data-error={errors.last_name ? true : undefined}>
                                            <Label htmlFor="last_name">Last name *</Label>
                                            <Input
                                                id="last_name"
                                                autoComplete="family-name"
                                                className="bg-bg-gray/50 border-white/10 text-white"
                                                value={data.last_name}
                                                onChange={e => setData('last_name', e.target.value)}
                                                placeholder="Enter last name"
                                            />
                                            {errors.last_name && (
                                                <p className="text-xs text-red-400">{errors.last_name}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Email + Phone */}
                                    <div className="grid gap-5 md:grid-cols-2">
                                        <div className="grid gap-2" data-error={errors.email ? true : undefined}>
                                            <Label htmlFor="email">Email *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                autoComplete="email"
                                                className="bg-bg-gray/50 border-white/10 text-white"
                                                value={data.email}
                                                onChange={e => setData('email', e.target.value)}
                                                placeholder="Enter email address"
                                            />
                                            {errors.email && (
                                                <p className="text-xs text-red-400">{errors.email}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2" data-error={errors.phone ? true : undefined}>
                                            <Label htmlFor="phone">Phone Number *</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                autoComplete="tel"
                                                className="bg-bg-gray/50 border-white/10 text-white"
                                                value={data.phone}
                                                onChange={e => setData('phone', e.target.value)}
                                                placeholder="(000) 000-0000"
                                            />
                                            {errors.phone && (
                                                <p className="text-xs text-red-400">{errors.phone}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div className="grid gap-2" data-error={errors.address ? true : undefined}>
                                        <Label htmlFor="address">Address *</Label>
                                        <Input
                                            id="address"
                                            autoComplete="street-address"
                                            className="bg-bg-gray/50 border-white/10 text-white"
                                            value={data.address}
                                            onChange={e => setData('address', e.target.value)}
                                            placeholder="Enter street address"
                                        />
                                        {errors.address && (
                                            <p className="text-xs text-red-400">{errors.address}</p>
                                        )}
                                    </div>

                                    {/* State / City / Zip */}
                                    <div className="grid gap-5 md:grid-cols-3">
                                        <div className="grid gap-2" data-error={errors.state ? true : undefined}>
                                            <Label htmlFor="state">Region / State *</Label>
                                            <Input
                                                id="state"
                                                autoComplete="address-level1"
                                                className="bg-bg-gray/50 border-white/10 text-white"
                                                value={data.state}
                                                onChange={e => setData('state', e.target.value)}
                                                placeholder="Enter state"
                                            />
                                            {errors.state && (
                                                <p className="text-xs text-red-400">{errors.state}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2" data-error={errors.city ? true : undefined}>
                                            <Label htmlFor="city">City *</Label>
                                            <Input
                                                id="city"
                                                autoComplete="address-level2"
                                                className="bg-bg-gray/50 border-white/10 text-white"
                                                value={data.city}
                                                onChange={e => setData('city', e.target.value)}
                                                placeholder="Enter city"
                                            />
                                            {errors.city && (
                                                <p className="text-xs text-red-400">{errors.city}</p>
                                            )}
                                        </div>
                                        <div className="grid gap-2" data-error={errors.zip_code ? true : undefined}>
                                            <Label htmlFor="zip_code">Zip Code *</Label>
                                            <Input
                                                id="zip_code"
                                                autoComplete="postal-code"
                                                className="bg-bg-gray/50 border-white/10 text-white"
                                                value={data.zip_code}
                                                onChange={e => setData('zip_code', e.target.value)}
                                                placeholder="00000"
                                            />
                                            {errors.zip_code && (
                                                <p className="text-xs text-red-400">{errors.zip_code}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Comments */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="comments">Any Comments</Label>
                                        <Textarea
                                            id="comments"
                                            rows={4}
                                            className="bg-bg-gray/50 border-white/10 text-white"
                                            value={data.comments}
                                            onChange={e => setData('comments', e.target.value)}
                                            placeholder="Any special requirement or instruction for us?"
                                        />
                                        {errors.comments && (
                                            <p className="text-xs text-red-400">{errors.comments}</p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>

                        {/* ── Right: Payment + Summary ─────────────────────── */}
                        <div className="space-y-8">

                            {/* Payment Method */}
                            <div className="rounded border border-white/10 bg-dark-gray p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                                <h2 className="text-2xl font-semibold">Payment Method</h2>
                                <p className="text-sm text-gray-400 mt-2">Select a payment method</p>

                                <div className="mt-6 space-y-4">
                                    {(['stripe', 'paypal'] as const).map(method => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setData('payment_method', method)}
                                            className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition ${
                                                data.payment_method === method
                                                    ? 'border-blue-500 bg-blue-500/10'
                                                    : 'border-white/10 bg-[#050811]'
                                            }`}
                                        >
                                            <div>
                                                <p className="text-lg font-medium capitalize">{method}</p>
                                                <p className="text-sm text-gray-500">
                                                    {method === 'stripe'
                                                        ? 'Pay with Credit / Debit Card'
                                                        : 'Pay with your PayPal account'}
                                                </p>
                                            </div>
                                            <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${
                                                data.payment_method === method
                                                    ? 'border-blue-500 bg-blue-500'
                                                    : 'border-white/20'
                                            }`}>
                                                <span className={`h-2 w-2 rounded-full ${
                                                    data.payment_method === method ? 'bg-white' : ''
                                                }`} />
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                {errors.payment_method && (
                                    <p className="mt-4 text-xs text-red-400">{errors.payment_method}</p>
                                )}
                            </div>

                            {/* Order Summary */}
                            <div className="rounded border border-white/10 bg-dark-gray p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                                <h2 className="text-2xl font-semibold">Order Summary</h2>

                                <div className="mt-6 rounded-xl bg-[#151b2b] p-5">
                                    <div className="flex items-center justify-between text-sm text-gray-400">
                                        <span>Service</span>
                                        <span>Price</span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-lg font-medium">
                                        <span>{summary.service}</span>
                                        <span>${summary.price.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex items-center justify-between text-lg font-semibold">
                                    <span>Total:</span>
                                    <span>${summary.price.toFixed(2)}</span>
                                </div>

                                <label className="mt-6 flex items-start gap-3 text-sm text-gray-400 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1 h-4 w-4 rounded border border-white/20 bg-transparent"
                                    />
                                    <span>
                                        I have read and agree to the Terms and Conditions,
                                        Privacy Policy and Refund Policy
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-8 w-full rounded bg-navy py-4 text-lg font-semibold transition hover:bg-navy/80 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing
                                        ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                </svg>
                                                Redirecting to {data.payment_method === 'stripe' ? 'Stripe' : 'PayPal'}…
                                            </span>
                                        ) : (
                                            `Pay $${summary.price.toFixed(2)} with ${data.payment_method === 'stripe' ? 'Stripe' : 'PayPal'} →`
                                        )
                                    }
                                </button>
                            </div>

                            {/* Support */}
                            <div className="rounded border border-white/10 bg-dark-gray p-6 text-sm text-gray-400">
                                <p>
                                    Need help? Call us at{' '}
                                    <span className="text-white font-semibold">{supportPhone}</span>{' '}
                                    or{' '}
                                    <Link href={route('frontend.contact')} className="text-blue-400 hover:text-blue-300">
                                        contact support
                                    </Link>.
                                </p>
                            </div>
                        </div>

                    </form>
                </div>
            </section>
        </FrontendLayout>
    );
}