import CustomerFeedbackSection from '@/components/section/services/curstomer-feedback-section'
import type { RatingDistributionItem, ReviewsPaginator } from '@/components/section/services/details'
import FrontendLayout from '@/layouts/frontend-layout'
import { router } from '@inertiajs/react'
import React from 'react'

interface VendorReviewsPageProps {
    averageRating: number
    totalReviews: number
    ratingDistribution: RatingDistributionItem[]
    reviews: ReviewsPaginator
}

export default function VendorReviews({
    averageRating,
    totalReviews,
    ratingDistribution,
    reviews,
}: VendorReviewsPageProps) {
    const handlePageChange = (page: number) => {
        if (page === reviews.current_page || page < 1 || page > reviews.last_page) {
            return
        }

        router.get(route('frontend.vendor-reviews'), {
            page,
            per_page: reviews.per_page,
        }, {
            preserveScroll: true,
            preserveState: true,
        })
    }

    return (
        <FrontendLayout>
            <CustomerFeedbackSection
                averageRating={averageRating}
                totalReviews={totalReviews}
                ratingDistribution={ratingDistribution}
                reviews={reviews.data}
                currentPage={reviews.current_page}
                totalPages={reviews.last_page}
                onPageChange={handlePageChange}
            />
        </FrontendLayout>
    )
}
