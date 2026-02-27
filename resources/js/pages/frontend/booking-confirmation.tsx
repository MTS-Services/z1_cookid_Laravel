// BookingConfirmation.tsx
import React from 'react';
import { Calendar, Clock, MapPin, Phone, CreditCard, CarFront } from 'lucide-react';
import FrontendLayout from '@/layouts/frontend-layout';
import { Link } from '@inertiajs/react';

interface BookingData {
  bookingId: string;
  service: string;
  provider: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  phone: string;
  amount: number;
}

const mockBooking: BookingData = {
  bookingId: 'ED-88291-X',
  service: 'Premium Car Detailing Service',
  provider: 'Precision Motors Elite',
  date: 'Friday, February 20, 2026',
  time: '09:30 AM',
  duration: 'Approx. 3.5 Hours',
  location: '122 Industrial Way, Suite 4B, San Francisco, CA',
  phone: '(219) 555-0114',
  amount: 485.00,
};

export default function BookingConfirmation() {
  return (
    <FrontendLayout>
      <div className="min-h-screen text-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl flex flex-col items-center text-center gap-6">
          {/* <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-emerald-600/20 rounded-full" />
            <div className="relative w-24 h-24 rounded-full border border-emerald-500/60 bg-linear-to-br from-emerald-600/30 to-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.35)]">
              <CheckCircle className="w-12 h-12 text-white" strokeWidth={1.5} />
            </div>
          </div> */}
          <div>
            <img src="/assets/images/booking/Confit.png" alt="" />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Booking Confirmed!</h1>
            <p className="text-gray-400 mt-3 text-lg">
              Your service is scheduled and ready for your arrival.
            </p>
          </div>

          <div className="w-full bg-[#070f1e] rounded-4xl border border-white/5 shadow-[0_20px_70px_rgba(0,0,0,0.65)] px-8 py-10 text-left space-y-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm tracking-wide text-gray-200 uppercase">
              Booking ID: {mockBooking.bookingId}
            </div>

            <div>
              <p className="text-sm text-gray-400 uppercase tracking-[0.3em]">Premium Car Detailing Service</p>
              <h2 className="text-2xl md:text-3xl font-semibold mt-2">{mockBooking.service}</h2>
              <p className="flex items-center gap-2 text-gray-400 mt-2">
                <span className="text-white"><CarFront className="w-5 h-5" /></span> {mockBooking.provider}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-lg font-medium">{mockBooking.date}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Time &amp; Duration</p>
                  <p className="text-lg font-medium">
                    {mockBooking.time} <span className="text-gray-500 text-base">({mockBooking.duration})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-lg font-medium leading-relaxed">{mockBooking.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-lg font-medium">{mockBooking.phone}</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-lg text-gray-200">
                  <CreditCard className="w-5 h-5 text-white" />
                  Payment Summary
                </span>
                <span className="text-3xl font-semibold">${mockBooking.amount.toFixed(2)}</span>
              </div>
              <div>
                <span className="w-auto inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-300" /> Paid via card
                </span>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row gap-4">
            <Link href={route('frontend.home')} className="flex-1 py-4 rounded-2xl bg-[#3f6bff] hover:bg-[#567aff] transition-colors text-lg font-medium shadow-[0_10px_30px_rgba(63,107,255,0.35)]">
              Go To Home
            </Link>
            <Link href="#" className="flex-1 py-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors text-lg font-medium border border-white/10">
              Cancel Bookings
            </Link>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
}