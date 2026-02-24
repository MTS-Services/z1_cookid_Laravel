import ServiceCard from '@/components/ui/service-card';

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
            className="relative bg-cover bg-center bg-no-repeat py-10"
            style={{
                backgroundImage: "url('/assets/images/bg.png')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 container flex h-full flex-col justify-center px-4">
                {/* Card 1 */}
                <h2 className="mb-5 text-3xl font-medium text-white">
                   Top Rated Near You
                </h2>
                <div className="grid  grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-9">
                    {service.map((item) => (
                        <ServiceCard key={item.id} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
}
