'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { MapPin, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const SERVICE_IMAGES = [
  {
    id: 1,
    src: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
    alt: 'Polishing headlight area',
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1529429617124-aee711a70412?w=900&auto=format&fit=crop&q=80',
    alt: 'Wheel detailing',
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?w=900&auto=format&fit=crop&q=80',
    alt: 'Interior detailing',
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?w=900&auto=format&fit=crop&q=80',
    alt: 'Foam wash',
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1551735964-1b42af4c910a?w=900&auto=format&fit=crop&q=80',
    alt: 'Dashboard cleaning',
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?w=900&auto=format&fit=crop&q=80',
    alt: 'Leather conditioning',
  },
];

const INCLUDED_ITEMS = {
  exterior: [
    'Hand wash & foam cleaning',
    'Wheel & tire deep cleaning',
    'Wax polish & paint protection',
    'Window cleaning (inside & outside)',
  ],
  interior: [
    'Full vacuum cleaning',
    'Seat shampoo & leather conditioning',
    'Dashboard & console cleaning',
    'Odor elimination treatment',
  ],
};

const REVIEWS = [
  {
    id: 1,
    name: 'Darrell Steward',
    time: 'Just now',
    rating: 5,
    text: 'My car looks brand new again! The detailing was done perfectly, inside and out.',
  },
  {
    id: 2,
    name: 'Brooklyn Simmons',
    time: '23 mins ago',
    rating: 5,
    text: 'Very professional team. They removed stains I thought would never go away.',
  },
  {
    id: 3,
    name: 'Kathryn Murphy',
    time: '27 mins ago',
    rating: 5,
    text: 'Amazing shine after the polish. Totally worth the price!',
  },
  {
    id: 4,
    name: 'Guy Hawkins',
    time: '1 hour ago',
    rating: 4,
    text: 'Good service overall. Took a little longer than expected, but the result was excellent.',
  },
  {
    id: 5,
    name: 'Robert Fox',
    time: '1 day ago',
    rating: 5,
    text: 'The interior cleaning was outstanding. My car smells fresh and clean.',
  },
  {
    id: 6,
    name: 'Esther Howard',
    time: '1 day ago',
    rating: 5,
    text: 'Best detailing service in town. Highly recommended!',
  },
];

const RATING_STATS = [
  { stars: 5, percentage: 63, count: '(94,532)' },
  { stars: 4, percentage: 24, count: '(8,177)' },
  { stars: 3, percentage: 9, count: '(716)' },
  { stars: 2, percentage: 1, count: '(152)' },
  { stars: 1, percentage: 7, count: '(643)' },
];

export default function Details(): JSX.Element {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <main className="min-h-screen text-white">
      <section className="max-w-6xl mx-auto grid gap-10 px-5 py-16 lg:grid-cols-[minmax(0,520px)_1fr]">
        <div className="space-y-5">
          <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-black via-zinc-900 to-black p-2 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
            <Swiper
              modules={[Navigation, Thumbs]}
              navigation
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              loop
              className="rounded-[28px]"
            >
              {SERVICE_IMAGES.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="relative h-105 w-full overflow-hidden rounded-[28px]">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-tr from-black/60 via-transparent to-transparent" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Thumbs]}
            slidesPerView={4}
            spaceBetween={16}
            watchSlidesProgress
            className="rounded-2xl bg-black/40 p-4"
            breakpoints={{
              640: { slidesPerView: 5 },
            }}
          >
            {SERVICE_IMAGES.map((image) => (
              <SwiperSlide key={`thumb-${image.id}`} className="cursor-pointer">
                <div className="h-20 overflow-hidden rounded-2xl border border-white/10 transition hover:border-white/40">
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-between rounded-2xl bg-black/40 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Service Duration</p>
              <p className="text-lg font-semibold">3 - 4 Hours</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Category</p>
              <p className="text-lg font-semibold">Car Wash</p>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">Car Type</p>
              <p className="text-lg font-semibold">Luxury Sedan</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <div className="flex items-center gap-1 text-orange-400">
                <Star size={16} fill="currentColor" />
                <span className="font-semibold">4.7/5</span>
              </div>
              <span>2561 reviews</span>
              <span className="text-blue-400">Verified Service</span>
            </div>
            <h1 className="text-4xl font-semibold leading-tight text-white md:text-5xl">
              Premium Car Detailing Service
            </h1>
            <p className="mt-5 text-base leading-relaxed text-white/70">
              Give your car a showroom-fresh look with our complete interior and exterior detailing service. We use
              high-quality products and advanced techniques to restore shine, remove dirt, and protect your vehicle's
              finish from future damage.
            </p>
            <ul className="mt-6 space-y-1 text-sm text-white/60">
              <li>• Available Monday to Friday (booking required)</li>
              <li>• Complimentary pick-up and drop-off within city limits</li>
              <li>• Contactless payment & service updates via SMS</li>
            </ul>
          </div>

          <div className="grid gap-6 rounded-3xl bg-black/40 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.35)] lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/40">Exterior Detailing</p>
              <ul className="mt-4 space-y-2 text-white/80">
                {INCLUDED_ITEMS.exterior.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-1 w-6 rounded-full bg-orange-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/40">Interior Detailing</p>
              <ul className="mt-4 space-y-2 text-white/80">
                {INCLUDED_ITEMS.interior.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span className="h-1 w-6 rounded-full bg-blue-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <p className="text-4xl font-semibold text-white">$1699</p>
            <div className="flex flex-1 gap-3">
              <Button className="flex-1 rounded-full bg-[#1f4eff] py-6 text-base font-semibold hover:bg-[#1437c7]">
                Book Now
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full border-white/20 bg-transparent py-6 text-base text-white hover:border-white/60"
              >
                Add To Wishlist
              </Button>
            </div>
          </div>

          <Card className="flex items-center gap-4 rounded-3xl border border-white/10 bg-black/40 p-5 shadow-inner">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 text-xl">
              M
            </div>
            <div>
              <p className="text-lg font-semibold text-white">Maxtech Store</p>
              <p className="flex items-center gap-2 text-sm text-white/60">
                <MapPin size={14} /> 2718 Ash Dr, San Jose, South Dakota 83475
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <h2 className="text-3xl font-semibold text-white">Customer Feedback</h2>
        <p className="text-white/60">See why over 2500 customers love our detailing service.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-[320px_1fr]">
          <Card className="rounded-4xl border-0 bg-linear-to-br from-yellow-50 to-amber-100 p-10 text-gray-900">
            <div className="text-center">
              <p className="text-[64px] font-bold leading-none">4.7</p>
              <div className="mt-2 flex items-center justify-center gap-1 text-yellow-500">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={18} fill="currentColor" />
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            {REVIEWS.map((review) => (
              <Card key={review.id} className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-inner">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-lg">
                    {review.rating}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{review.name}</p>
                    <p className="text-sm text-white/60">{review.time}</p>
                  </div>
                </div>
                <p className="mt-4 text-base leading-relaxed text-white/80">{review.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
