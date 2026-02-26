import ServiceCard from '@/components/ui/service-card';
import { Link } from '@inertiajs/react';

const service = [
    {
        id: 1,
        image: '/assets/images/service/EliteAutoSpa.png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (2).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (1).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/EliteAutoSpa.png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (2).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (1).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/EliteAutoSpa.png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (2).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (1).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/EliteAutoSpa.png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (2).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/Frame 2147225286 (1).png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
    {
        id: 1,
        image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
        name: 'Elite Auto Spa',
        rating: 4.9,
        location: 'DETAILING',
        service: 'See Details',
        price: 120,
    },
];

export default function TopRelated() {
    return (
        <div
            className="py-10"
        >
            <div className="relative z-10 container flex h-full flex-col justify-center px-4">
                {/* Card 1 */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-3xl font-medium text-text-white">
                        Top Rated Near You
                    </h2>
                    <Link className="rounded-lg bg-bg-nevy p-3 text-base font-medium text-text-gray-100">
                        View All Providers
                    </Link>
                </div>
                <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {service.map((item) => (
                        <ServiceCard key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
