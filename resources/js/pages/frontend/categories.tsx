import Banner from '@/components/section/home/banner'
import Category from '@/components/section/home/browse-by-category'
import GrowYourCarServiceBusiness from '@/components/section/home/grow-your-car-service-business';
import HowItWorks from '@/components/section/home/how-it-works';
import TopRelated from '@/components/section/home/top-related';
import WhyChoosePlatform from '@/components/section/home/why-choose-our-platform';
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

interface Category {
    id: number;
    name: string;
    image: string;
}
export default function Categories({ listings }: any) {
    const categories: Category[] = [
        {
            id: 1,
            name: 'Car Wash',
            image: '/assets/images/category/CarWash.png',
        },
        {
            id: 2,
            name: 'Full Detailing',
            image: '/assets/images/category/FullDetailing.png',
        },
        {
            id: 3,
            name: 'Paint & Protection',
            image: '/assets/images/category/PaintProtection.png',
        },
        {
            id: 4,
            name: 'Interior Care',
            image: '/assets/images/category/InteriorCare.png',
        },
        {
            id: 5,
            name: 'Specialty Services',
            image: '/assets/images/category/SpecialtyServices.png',
        },
        {
            id: 6,
            name: 'Tinting',
            image: '/assets/images/category/Tinting.png',
        },
        {
            id: 7,
            name: 'Mobile Services',
            image: '/assets/images/category/MobileServices.png',
        },
    ];
    return (
        <FrontendLayout activePage="categories">
            <div className="bg-bg-black text-text-white font-poppins p-8 pt-0 pb-70">
                <Category categories={categories} />
                <TopRelated />
            </div>
        </FrontendLayout>
    )
}
