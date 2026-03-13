import Pagination from '@/components/ui/pagination';
import VendorLayout from '@/layouts/vendor-layout';
import { router, usePage } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';

type FeedbackFilter = 'all' | 'positive' | 'negative';

interface ReviewItem {
    id: number;
    name: string;
    rating: number;
    date: string;
    comment: string;
    sentiment: 'positive' | 'negative';
}

interface RatingDistributionItem {
    stars: number;
    percent: number;
}

interface VendorPerformanceStats {
    averageRating: number;
    totalReviews: number;
    distribution: RatingDistributionItem[];
}

interface VendorPerformanceFilters {
    type: FeedbackFilter;
}

interface VendorPerformanceReviews {
    data: ReviewItem[];
    currentPage: number;
    lastPage: number;
    perPage: number;
}

interface VendorPerformancePageProps extends Record<string, unknown> {
    stats: VendorPerformanceStats;
    filters: VendorPerformanceFilters;
    reviews: VendorPerformanceReviews;
}

export default function Performance() {
    const { stats, filters, reviews } = usePage<VendorPerformancePageProps>().props;

    const [filter, setFilter] = useState<FeedbackFilter>(filters?.type ?? 'all');

    const filteredReviews = useMemo(() => {
        if (filter === 'all') {
            return reviews.data;
        }

        return reviews.data.filter((review) => review.sentiment === filter);
    }, [filter, reviews.data]);

    const handleFilterChange = (next: FeedbackFilter) => {
        setFilter(next);

        const params: Record<string, string> = {};

        if (next !== 'all') {
            params.type = next;
        }

        router.get(route('vendor.performance'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handlePageChange = (page: number) => {
        const params: Record<string, string | number> = {
            reviews_page: page,
        };

        if (filter !== 'all') {
            params.type = filter;
        }

        router.get(route('vendor.performance'), params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <VendorLayout activeSlug="performance">
            <div className="min-h-screen text-white p-6 md:p-8">
                {/* Main container */}
                <div className="w-full space-y-10">

                    {/* Header + Overall Rating */}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">Feedback</h2>

                        <div className="p-6 md:p-8">
                            <div className="flex flex-col md:flex-row md:items-start gap-8">

                                {/* Left – Big rating + stars */}
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="text-6xl md:text-7xl tracking-tight">
                                        {stats.averageRating.toFixed(1)}
                                        <span className="text-3xl md:text-4xl font-semibold text-gray-500">/5</span>
                                    </div>

                                    <div className="flex items-center gap-1 mt-3 text-4xl md:text-5xl text-amber-400">
                                        {'★★★★½'.split('').map((char, i) => (
                                            <span
                                                key={i}
                                                className={char === '½' ? 'relative' : ''}
                                            >
                                                {char === '½' ? (
                                                    <>
                                                        <span className="text-gray-600">★</span>
                                                        <span className="absolute inset-0 overflow-hidden w-1/2">★</span>
                                                    </>
                                                ) : (
                                                    char
                                                )}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Right – Rating distribution bars */}
                                <div className="flex-1 space-y-3 md:max-w-md">
                                    {stats.distribution.map(({ stars, percent }) => (
                                        <div key={stars} className="flex items-center gap-3 text-sm">
                                            <span className="w-6 text-right font-medium">
                                                {stars} ★
                                            </span>
                                            <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-amber-400 rounded-full"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            {/* <span className="w-8 text-xs text-gray-400">{percent}%</span> */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Customer Feedback Section */}
                    <div className="bg-gray-900/70 rounded-xl p-6 md:p-8 border border-gray-800">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                            <h3 className="text-xl font-semibold">Customer Feedback</h3>

                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('all')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                        ? 'bg-amber-400 text-black'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('positive')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'positive'
                                        ? 'bg-amber-400 text-black'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                        }`}
                                >
                                    Positive
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('negative')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === 'negative'
                                        ? 'bg-amber-400 text-black'
                                        : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                        }`}
                                >
                                    Negative
                                </button>
                            </div>
                        </div>

                        {/* Reviews */}
                        {filteredReviews.length > 0 ? (
                            <>
                                <div className="space-y-5">
                                    {filteredReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="bg-gray-950 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-medium text-gray-200">
                                                    {review.name}
                                                </span>
                                                <div className="flex text-amber-400 text-lg">
                                                    {Array.from({ length: 5 }).map((_, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={
                                                                idx < review.rating
                                                                    ? ''
                                                                    : 'text-gray-600'
                                                            }
                                                        >
                                                            ★
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <p className="text-gray-300 leading-relaxed mb-3">
                                                {review.comment}
                                            </p>

                                            <div className="text-xs text-gray-500">
                                                {review.date}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {reviews.lastPage > reviews.perPage && (
                                    <Pagination
                                        currentPage={reviews.currentPage}
                                        totalPages={reviews.lastPage}
                                        onPageChange={handlePageChange}
                                    />
                                )}
                            </>
                        ) : (
                            <div className="py-10 text-center text-sm text-gray-400">
                                No reviews found for this filter yet.
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </VendorLayout>
    );
}