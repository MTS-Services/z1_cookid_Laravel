import Banner from '@/components/section/home/banner'
import Category from '@/components/section/home/browse-by-category'
import GrowYourCarServiceBusiness from '@/components/section/home/grow-your-car-service-business';
import HowItWorks from '@/components/section/home/how-it-works';
import TopRelated from '@/components/section/home/top-related';
import WhyChoosePlatform from '@/components/section/home/why-choose-our-platform';
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

interface HomeCategory {
    id: number;
    name: string;
    image: string;
}

interface TopRelatedService {
    id: number
    image: string
    name: string
    rating: number
    location: string
    service: string
    price: number
}

interface HomePageProps {
    services: TopRelatedService[]
    categories: HomeCategory[]
}

export default function Home({ services, categories }: HomePageProps) {
    return (
        <FrontendLayout activePage="home">
            <Banner />
            <Category categories={categories} />
            <TopRelated services={services} />
            <HowItWorks />
            <WhyChoosePlatform />
        </FrontendLayout>
    )
}
