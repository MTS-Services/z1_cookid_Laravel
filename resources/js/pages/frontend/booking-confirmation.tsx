// BookingConfirmation.tsx
import React from 'react';
import { MapPin, Phone, CreditCard, CarFront } from 'lucide-react';
import FrontendLayout from '@/layouts/frontend-layout';
import { Link, usePage } from '@inertiajs/react';

interface OrderAddress {
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone: string;
  full: string;
}

interface OrderPayload {
  order_number: string;
  service: { title: string } | null;
  provider: string | null;
  address: OrderAddress | null;
  total: number;
  payment_method: string;
}

interface BookingConfirmationProps {
  order: OrderPayload | null;
  status: string | null;
}

const paymentMethodLabel: Record<string, string> = {
  stripe: 'Card (Stripe)',
  paypal: 'PayPal',
};

export default function BookingConfirmation() {
  const { order, status } = usePage<BookingConfirmationProps>().props;

  return (
    <FrontendLayout>
      <div className="min-h-screen text-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6">
          <div>
            <img src="/assets/images/booking/Confit.png" alt="" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Booking Confirmed!</h1>
            <p className="text-gray-400 mt-3 text-lg">
              {order
                ? 'Your service is scheduled and ready for your arrival.'
                : 'Thank you for your booking.'}
            </p>
            {status && (
              <p className="mt-2 text-emerald-400 text-sm font-medium">{status}</p>
            )}
          </div>

          {order ? (
            <div className="w-full bg-[#070f1e] rounded-4xl border border-white/5 shadow-[0_20px_70px_rgba(0,0,0,0.65)] px-8 py-10 text-left space-y-8">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide text-gray-200 uppercase">
                Booking ID: {order.order_number}
              </div>

              <div>
                <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">
                  {order.service?.title ?? 'Service'}
                </p>
                <h2 className="text-2xl md:text-3xl font-semibold mt-2">{order.service?.title ?? '—'}</h2>
                {order.provider && (
                  <p className="flex items-center gap-2 text-gray-400 mt-2">
                    <span className="text-white"><CarFront className="w-5 h-5" /></span> {order.provider}
                  </p>
                )}
              </div>

              {order.address && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="text-lg font-medium leading-relaxed">{order.address.full}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-lg font-medium">{order.address.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-lg text-gray-200">
                    <CreditCard className="w-5 h-5 text-white" />
                    Payment Summary
                  </span>
                  <span className="text-3xl font-semibold">${order.total.toFixed(2)}</span>
                </div>
                <div>
                  <span className="w-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-300" />{' '}
                    Paid via {paymentMethodLabel[order.payment_method] ?? order.payment_method}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full bg-[#070f1e] rounded-4xl border border-white/5 px-8 py-10 text-center text-gray-400">
              <p>No order details available. You can view your orders from your account.</p>
            </div>
          )}

          <div className="w-full flex flex-col sm:flex-row gap-4">
            <Link href={route('frontend.home')} className="flex-1 py-4 rounded-2xl bg-[#3f6bff] hover:bg-[#567aff] transition-colors text-lg font-medium shadow-[0_10px_30px_rgba(63,107,255,0.35)]">
              Go To Home
            </Link>
            <Link href={route('user.order-details')} className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-lg font-medium border border-white/10">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}