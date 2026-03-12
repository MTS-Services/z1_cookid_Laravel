import Details, {
    type RatingDistributionItem,
    type ReviewsPaginator,
    type ServiceDetailsPayload,
} from '@/components/section/services/details'
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

interface ServiceDetailsPageProps {
    service: ServiceDetailsPayload
    reviews: ReviewsPaginator
    ratingDistribution: RatingDistributionItem[]
}

export default function ServiceDetails({ service, reviews, ratingDistribution }: ServiceDetailsPageProps) {
    return (
        <FrontendLayout activePage="service-details">
            <Details
                service={service}
                reviews={reviews}
                ratingDistribution={ratingDistribution}
            />
        </FrontendLayout>
    )
}
