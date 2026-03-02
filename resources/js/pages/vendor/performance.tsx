import Pagination from '@/components/ui/pagination';
import VendorLayout from '@/layouts/vendor-layout';
import { router } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';

type FeedbackFilter = 'all' | 'positive' | 'negative';

interface Review {
    id: number;
    name: string;
    rating: number;
    date: string;
    comment: string;
    sentiment: 'positive' | 'negative';
}

const reviewsData: Review[] = [
    {
        id: 1,
        name: 'Michael Chan',
        rating: 5,
        date: '10/5/2025',
        sentiment: 'positive',
        comment:
            'The prints sometimes warp at the edges, especially with larger models. I followed all instructions, but the issue still happens occasionally.',
    },
    {
        id: 2,
        name: 'Michael Chan',
        rating: 4,
        date: '10/5/2025',
        sentiment: 'positive',
        comment:
            'The prints sometimes warp at the edges, especially with larger models. I followed all instructions, but the issue still happens occasionally.',
    },
    {
        id: 3,
        name: 'Michael Chan',
        rating: 3,
        date: '10/5/2025',
        sentiment: 'negative',
        comment:
            'The prints sometimes warp at the edges, especially with larger models. I followed all instructions, but the issue still happens occasionally.',
    },
    {
        id: 4,
        name: 'Michael Chan',
        rating: 2,
        date: '10/5/2025',
        sentiment: 'negative',
        comment:
            'The prints sometimes warp at the edges, especially with larger models. I followed all instructions, but the issue still happens occasionally.',
    },
    {
        id: 5,
        name: 'Michael Chan',
        rating: 1,
        date: '10/5/2025',
        sentiment: 'negative',
        comment:
            'The prints sometimes warp at the edges, especially with larger models. I followed all instructions, but the issue still happens occasionally.',
    },
];

export default function Performance() {
    const getInitialFilter = (): FeedbackFilter => {
        if (typeof window === 'undefined') {
            return 'all';
        }

        const params = new URLSearchParams(window.location.search);
        const type = params.get('type') as FeedbackFilter | null;

        if (type && ['all', 'positive', 'negative'].includes(type)) {
            return type;
        }

        return 'all';
    };

    const [filter, setFilter] = useState<FeedbackFilter>(getInitialFilter);

    const filteredReviews = useMemo(() => {
        if (filter === 'all') {
            return reviewsData;
        }

        return reviewsData.filter((review) => review.sentiment === filter);
    }, [filter]);

    const handleFilterChange = (next: FeedbackFilter) => {
        setFilter(next);

        router.get(
            route('vendor.performance'),
            { type: next },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <VendorLayout activeSlug="vendor.performance">
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
                                        4.5
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
                                    {[
                                        { stars: 5, percent: 85 },
                                        { stars: 4, percent: 10 },
                                        { stars: 3, percent: 3 },
                                        { stars: 2, percent: 1 },
                                        { stars: 1, percent: 1 },
                                    ].map(({ stars, percent }) => (
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
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'all'
                                            ? 'bg-amber-400 text-black'
                                            : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                    }`}
                                >
                                    All
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('positive')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'positive'
                                            ? 'bg-amber-400 text-black'
                                            : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                    }`}
                                >
                                    Positive
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleFilterChange('negative')}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                        filter === 'negative'
                                            ? 'bg-amber-400 text-black'
                                            : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                                    }`}
                                >
                                    Negative
                                </button>
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="space-y-5">
                            {filteredReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-gray-950 border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-gray-200">{review.name}</span>
                                        <div className="flex text-amber-400 text-lg">
                                            {Array.from({ length: 5 }).map((_, idx) => (
                                                <span
                                                    key={idx}
                                                    className={
                                                        idx < review.rating ? '' : 'text-gray-600'
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

                                    <div className="text-xs text-gray-500">{review.date}</div>
                                </div>
                            ))}
                        </div>
                        
                        <Pagination
                            currentPage={1}
                            totalPages={10}
                            onPageChange={() => {}}
                        />
                    </div>

                </div>
            </div>
        </VendorLayout>
    );
}