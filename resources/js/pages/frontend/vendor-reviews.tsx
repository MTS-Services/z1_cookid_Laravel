import CustomerFeedbackSection from '@/components/section/services/curstomer-feedback-section'
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

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
export default function VendorReviews() {
    return (
        <FrontendLayout>
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
        </FrontendLayout>
    )
}
