// components/CustomerFeedbackSection.tsx
import { Card } from '@/components/ui/card';
import Pagination from '@/components/ui/pagination';
import { Star, StarHalf } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: string | number;
  name: string;
  avatarUrl?: string;        // optional — can show real image or fallback
  timeAgo: string;
  rating: number;            // 1–5
  comment: string;
}

interface RatingDistribution {
  stars: number;
  percentage: number;
  count: number;
}

interface CustomerFeedbackProps {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution[];
  reviews: Review[];
  currentPage?: number;      // for pagination control if needed
  totalPages?: number;
}

export default function CustomerFeedbackSection({
  averageRating = 4.7,
  totalReviews = 934516,
  ratingDistribution = [
    { stars: 5, percentage: 63, count: 589532 },
    { stars: 4, percentage: 24, count: 224717 },
    { stars: 3, percentage: 9, count: 84174 },
    { stars: 2, percentage: 1, count: 9352 },
    { stars: 1, percentage: 3, count: 28041 }, // example adjustment
  ],
  reviews = [
    {
      id: '1',
      name: 'Darrell Steward',
      timeAgo: 'Just now',
      rating: 5,
      comment: 'My car looks brand new again. The detailing was done perfectly inside and out.',
    },
    {
      id: '2',
      name: 'Brooklyn Simmons',
      timeAgo: '2 min ago',
      rating: 5,
      comment: 'Very professional team. They removed stains I thought would never go away.',
    },
    {
      id: '3',
      name: 'Kathryn Murphy',
      timeAgo: '21 min ago',
      rating: 5,
      comment: 'Amazing shine after the polish. Totally worth the price!',
    },
    {
      id: '4',
      name: 'Guy Hawkins',
      timeAgo: '1 hour ago',
      rating: 4,
      comment: 'Good service. Took a little longer than expected, but the result was excellent.',
    },
    {
      id: '5',
      name: 'Robert Fox',
      timeAgo: '1 day ago',
      rating: 5,
      comment: 'The interior cleaning was outstanding. My car smells fresh and clean.',
    },
    {
      id: '6',
      name: 'Esther Howard',
      timeAgo: '1 day ago',
      rating: 5,
      comment: 'Best detailing service in town. Highly recommended!',
    },
  ],
  totalPages = 6,
}: CustomerFeedbackProps) {
  const [activePage, setActivePage] = useState(1);

  return (
    <div className="container mx-auto text-white p-6 ">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
        Customer Feedback
      </h2>

      {/* Overall Rating + Distribution */}
      <div className="p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Left - Big Rating */}
          <Card className="rounded-xl border border-[#f4e6b5]/50 bg-[#fff6d3] px-12 py-10 text-gray-900 shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
            <div className="space-y-5 flex flex-col items-center">
              <div className="space-y-1">
                <p className="text-[72px] font-bold leading-none">{averageRating.toFixed(1)}</p>
              </div>

              <div className="flex items-center gap-1 text-[#f06f20]">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Star key={`full-${index}`} size={22} className="fill-current" />
                ))}
                <StarHalf size={22} className="fill-current" />
              </div>

              <div className="text-sm font-medium text-gray-600">
                Customer Rating <span className="text-gray-400">({totalReviews.toLocaleString()})</span>
              </div>
            </div>
          </Card>

          {/* Right - Bar Distribution */}
          <div className="flex-1 space-y-4">
            {ratingDistribution
              .sort((a, b) => b.stars - a.stars)
              .map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="w-28 flex items-center gap-1 text-sm text-gray-200">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={`${item.stars}-star-${index}`}
                        size={16}
                        className={index < item.stars ? 'text-[#f06f20] fill-[#f06f20]' : 'text-white'}
                      />
                    ))}
                  </div>

                  <div className="flex-1 h-1 rounded-full bg-white overflow-hidden">

                    <div
                      className="h-full bg-[#f06f20]"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>

                  <div className="w-32 text-right text-sm text-gray-200">
                    {item.percentage}%{' '}
                    <span className="text-gray-500">({item.count.toLocaleString()})</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6 mb-8 w-full lg:w-1/2">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-800 pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start gap-4">
              {/* Avatar placeholder */}
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-600 to-pink-500 shrink-0 flex items-center justify-center text-sm font-bold">
                {review.name.charAt(0)}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <div className="font-medium">{review.name}</div>
                  <div className="text-xs text-gray-500">{review.timeAgo}</div>
                </div>

                <div className="flex my-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < review.rating ? 'text-orange-400 fill-orange-400' : 'text-gray-700'}
                    />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <Pagination
        currentPage={activePage}
        totalPages={totalPages}
        onPageChange={setActivePage}
      />
    </div>
  );
}