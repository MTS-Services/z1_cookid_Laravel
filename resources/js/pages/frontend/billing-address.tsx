import React from 'react';
import FrontendLayout from '@/layouts/frontend-layout';
import { Link, useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type Address = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  zip_code: string;
};

type BillingAddressProps = {
  address?: Address | null;
  summary: {
    service: string;
    price: number;
  };
  supportPhone: string;
};

export default function BillingAddress({ address, summary, supportPhone }: BillingAddressProps) {
  const { data, setData, post, processing, errors } = useForm({
    first_name: address?.first_name ?? '',
    last_name: address?.last_name ?? '',
    email: address?.email ?? '',
    phone: address?.phone ?? '',
    address: address?.address ?? '',
    state: address?.state ?? '',
    city: address?.city ?? '',
    zip_code: address?.zip_code ?? '',
    comments: '',
    payment_method: 'paypal' as 'paypal' | 'stripe',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post(route('user.order.billing-address.store'));
  };

  return (
    <FrontendLayout>
      <section className="min-h-screen py-16 px-4 text-white">
        <div className="container px-4 space-y-12">
          <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-8">
              <div className="rounded border border-white/10 bg-dark-gray p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                <h2 className="text-2xl font-semibold">Shipping & Billing</h2>
                <p className="text-sm text-gray-400 mt-2">We use this information to confirm your booking and invoice.</p>

                <div className="mt-8 space-y-6">
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="first_name">First name*</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        className="bg-bg-gray/50 border-white/10 text-white"
                        value={data.first_name}
                        onChange={event => setData('first_name', event.target.value)}
                        placeholder="Enter first name"
                      />
                      {errors.first_name && <p className="text-xs text-red-400">{errors.first_name}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="last_name">Last name* </Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        className="bg-bg-gray/50 border-white/10 text-white"
                        value={data.last_name}
                        onChange={event => setData('last_name', event.target.value)}
                        placeholder="Enter last name"
                      />
                      {errors.last_name && <p className="text-xs text-red-400">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email*</Label>
                      <Input
                        id="email"
                        type="email"
                        name="email"
                        className="bg-bg-gray/50 border-white/10 text-white"
                        value={data.email}
                        onChange={event => setData('email', event.target.value)}
                        placeholder="Enter email address"
                      />
                      {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number*</Label>
                      <Input
                        id="phone"
                        type="tel"
                        name="phone"
                        className="bg-bg-gray/50 border-white/10 text-white"
                        value={data.phone}
                        onChange={event => setData('phone', event.target.value)}
                        placeholder="(000) 000-0000"
                      />
                      {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Address*</Label>
                    <Input
                      id="address"
                      name="address"
                      className="bg-bg-gray/50 border-white/10 text-white"
                      value={data.address}
                      onChange={event => setData('address', event.target.value)}
                      placeholder="Enter street address"
                    />
                    {errors.address && <p className="text-xs text-red-400">{errors.address}</p>}
                  </div>

                  <div className="grid gap-5 md:grid-cols-3">
                    <div className="grid gap-2">
                      <Label htmlFor="region">Region/State*</Label>
                      <Input
                        id="region"
                        name="state"
                        className="bg-bg-gray/50 border-white/10 text-white"
                        value={data.state}
                        onChange={event => setData('state', event.target.value)}
                        placeholder="Enter state"
                      />
                      {errors.state && <p className="text-xs text-red-400">{errors.state}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="city">City*</Label>
                      <Input
                        id="city"
                        name="city"
                        className="bg-bg-gray/50 border-white/10 text-white"
                        value={data.city}
                        onChange={event => setData('city', event.target.value)}
                        placeholder="Enter city"
                      />
                      {errors.city && <p className="text-xs text-red-400">{errors.city}</p>}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="zip">Zip Code*</Label>
                      <Input
                        id="zip"
                        name="zip_code"
                        className="bg-bg-gray/50 border-white/10 text-white"
                        value={data.zip_code}
                        onChange={event => setData('zip_code', event.target.value)}
                        placeholder="00000"
                      />
                      {errors.zip_code && <p className="text-xs text-red-400">{errors.zip_code}</p>}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="comments">Any Comments</Label>
                    <Textarea
                      id="comments"
                      rows={8}
                      name="comments"
                      className="bg-bg-gray/50 border-white/10 text-white h-12"
                      value={data.comments}
                      onChange={event => setData('comments', event.target.value)}
                      placeholder="Any special requirement/instruction for us?"
                    />
                    {errors.comments && <p className="text-xs text-red-400">{errors.comments}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded border border-white/10 bg-dark-gray p-8 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                <h2 className="text-2xl font-semibold">Payment Method</h2>
                <p className="text-sm text-gray-400 mt-2">Select a payment method</p>

                <div className="mt-6 space-y-4">
                  {(['paypal', 'stripe'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setData('payment_method', method)}
                      className={`flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left transition ${data.payment_method === method ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-[#050811]'}`}
                    >
                      <div>
                        <p className="text-lg font-medium capitalize">{method}</p>
                        <p className="text-sm text-gray-500">Pay securely with {method}</p>
                      </div>
                      <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full border ${data.payment_method === method ? 'border-blue-500 bg-blue-500' : 'border-white/20'}`}>
                        <span className={`h-2 w-2 rounded-full ${data.payment_method === method ? 'bg-white' : ''}`} />
                      </span>
                    </button>
                  ))}
                </div>
                {errors.payment_method && <p className="mt-4 text-xs text-red-400">{errors.payment_method}</p>}
              </div>
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

                <label className="mt-6 flex items-start gap-3 text-sm text-gray-400">
                  <input type="checkbox" className="mt-1 h-4 w-4 rounded border border-white/20 bg-transparent" defaultChecked />
                  <span>
                    I have read and agree to the Terms and Conditions, Privacy Policy and Refund and Return Policy
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-8 w-full rounded bg-navy py-4 text-lg font-semibold transition hover:bg-navy/80 disabled:opacity-50"
                  disabled={processing}
                >
                  {processing ? 'Processing…' : 'Confirm Order'}
                </button>
              </div>

              <div className="rounded border border-white/10 bg-dark-gray p-6 text-sm text-gray-400">
                <p>
                  Need help? Call us at <span className="text-white font-semibold">{supportPhone}</span> or{' '}
                  <Link href={route('frontend.contact')} className="text-blue-400 hover:text-blue-300">contact support</Link>.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </FrontendLayout>
  );
}