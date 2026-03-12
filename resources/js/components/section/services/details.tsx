'use client';

import type { JSX } from 'react';
import { useState } from 'react';
import { router } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import PremiumCarDetailingCard from './premium-car-details-card';
import CustomerFeedbackSection from './curstomer-feedback-section';

export interface ServiceDetailsPayload {
  id: number;
  encryptedId: string;
  title: string;
  slug: string;
  description: string;
  duration: string;
  location: string;
  /** Raw HTML or plain text from TipTap/editor (used when no structured inclusions) */
  features: string | null;
  price: number;
  rating: number;
  totalReviews: number;
  categoryName: string | null;
  vehicleTypeName: string | null;
  image: string;
  images: { id: number; src: string; alt: string }[];
  /** Structured "What's Included" sections from ServiceInclusion */
  inclusions?: { label: string; items: string[] }[];
  vendor: { name: string; location: string | null };
  inWishlist?: boolean;
  wishlistId?: number | null;
}

export interface FormattedReview {
  id: number;
  name: string;
  rating: number;
  comment: string;
  timeAgo: string;
}

export interface ReviewsPaginator {
  data: FormattedReview[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  links: { url: string | null; label: string; active: boolean }[];
}

export interface RatingDistributionItem {
  stars: number;
  percentage: number;
  count: number;
}

interface DetailsProps {
  service: ServiceDetailsPayload;
  reviews: ReviewsPaginator;
  ratingDistribution: RatingDistributionItem[];
}

export default function Details({ service, reviews, ratingDistribution }: DetailsProps): JSX.Element {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const images = service.images?.length ? service.images : [{ id: 0, src: service.image, alt: service.title }];

  const handleReviewsPageChange = (page: number) => {
    if (page < 1 || page > reviews.last_page) return;
    router.get(route('frontend.service-details', service.id), {
      reviews_page: page,
      reviews_per_page: reviews.per_page,
    }, { preserveState: false })
  };

  return (
    <main className="min-h-screen text-white">
      <section className="container mx-auto grid grid-cols-1 gap-10 px-5 lg:py-16 lg:grid-cols-[minmax(0,520px)_1fr]">
        <div className="space-y-5 h-full">
          <div className="relative overflow-hidden rounded bg-linear-to-br from-black via-zinc-900 to-black p-2 shadow-[0_25px_80px_rgba(0,0,0,0.65)]">
            <Swiper
              modules={[Navigation, Thumbs]}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              loop={images.length > 1}
              className="rounded"
            >
              {images.map((image) => (
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
            slidesPerView={Math.min(4, images.length) || 1}
            spaceBetween={16}
            watchSlidesProgress
            className="rounded! bg-black/40 p-4"
            breakpoints={{
              640: { slidesPerView: Math.min(5, images.length) || 1 },
            }}
          >
            {images.map((image) => (
              <SwiperSlide key={`thumb-${image.id}`} className="cursor-pointer">
                <div className="h-20 overflow-hidden rounded border border-text-border transition hover:border-text-border/40">
                  <img src={image.src} alt={image.alt} className="h-full w-full object-cover" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <PremiumCarDetailingCard service={service} />
      </section>
      <CustomerFeedbackSection
        averageRating={service.rating}
        totalReviews={service.totalReviews}
        ratingDistribution={ratingDistribution}
        reviews={reviews.data}
        currentPage={reviews.current_page}
        totalPages={reviews.last_page}
        onPageChange={handleReviewsPageChange}
      />
    </main>
  );
}
