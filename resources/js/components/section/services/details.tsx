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
import PremiumCarDetailingCard from './premium-car-details-card';
import CustomerFeedbackSection from './curstomer-feedback-section';

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
const reviews = [
  {
    id: "1",
    name: "Darrell Steward",
    timeAgo: "Just now",
    rating: 5,
    comment: "My car looks brand new again. The detailing was done perfectly inside and out."
  },
  {
    id: "2",
    name: "Brooklyn Simmons",
    timeAgo: "2 min ago",
    rating: 5,
    comment: "Very professional team. They removed stains I thought would never go away."
  },
  {
    id: "3",
    name: "Kathryn Murphy",
    timeAgo: "21 min ago",
    rating: 5,
    comment: "Amazing shine after the polish. Totally worth the price!"
  },
  {
    id: "4",
    name: "Guy Hawkins",
    timeAgo: "1 hour ago",
    rating: 4,  // assuming 4 stars (★★★☆☆) based on "Good service" + minor note about time
    comment: "Good service. Took a little longer than expected, but the result was excellent."
  },
  {
    id: "5",
    name: "Robert Fox",
    timeAgo: "1 day ago",
    rating: 5,
    comment: "The interior cleaning was outstanding. My car smells fresh and clean."
  },
  {
    id: "6",
    name: "Esther Howard",
    timeAgo: "1 day ago",
    rating: 5,
    comment: "Best detailing service in town. Highly recommended!"
  }
];

export default function Details(): JSX.Element {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <main className="min-h-screen text-white">
      <section className="container mx-auto grid gap-10 px-5 py-16 lg:grid-cols-[minmax(0,520px)_1fr]">
        <div className="space-y-5 h-full">
          <div className="relative overflow-hidden rounded bg-linear-to-br from-black via-zinc-900 to-black p-2 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
            <Swiper
              modules={[Navigation, Thumbs]}
              // navigation
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              loop
              className="rounded"
            >
              {SERVICE_IMAGES.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="relative h-150 w-full overflow-hidden rounded">
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
            className="rounded! bg-black/40 p-4"
            breakpoints={{
              640: { slidesPerView: 5 },
            }}
          >
            {SERVICE_IMAGES.map((image) => (
              <SwiperSlide key={`thumb-${image.id}`} className="cursor-pointer">
                <div className="h-20 overflow-hidden rounded border border-text-border transition hover:border-text-border/40">
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <PremiumCarDetailingCard />
      </section>
      <CustomerFeedbackSection
        averageRating={4.7}
        totalReviews={934516}
        ratingDistribution={[
          { stars: 5, percentage: 63, count: 589532 },
          { stars: 4, percentage: 24, count: 224717 },
          { stars: 3, percentage: 9, count: 84174 },
          { stars: 2, percentage: 1, count: 9352 },
          { stars: 1, percentage: 3, count: 28041 },
        ]}
        reviews={reviews}
        totalPages={6}
      />
    </main>
  );
}
