import React from 'react';
import { Search, MapPin, Star, Heart, ChevronDown } from 'lucide-react';
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
const ServiceMarketplace = () => {
    return (
        <div className="min-h-screen bg-[#050505] text-white font-poppins p-8">
            {/* Header / Search Bar */}
            <div className="max-w-7xl mx-auto mb-12">
                <h1 className="text-3xl font-semibold text-center mb-8">Feature Services for You</h1>

                <div className="flex flex-wrap items-center justify-center gap-0 overflow-hidden rounded-lg border border-gray-700 bg-[#1A1A1A] max-w-4xl mx-auto">
                    <button className="flex items-center justify-between px-6 py-4 border-r border-gray-700 min-w-[180px] hover:bg-gray-800 transition">
                        <span className="text-gray-400">Select Service</span>
                        <ChevronDown size={18} />
                    </button>
                    <button className="flex items-center justify-between px-6 py-4 border-r border-gray-700 min-w-[160px] hover:bg-gray-800 transition">
                        <span className="text-gray-400">Vehicle Type</span>
                        <ChevronDown size={18} />
                    </button>
                    <div className="flex-1 flex items-center px-6 py-4 min-w-[250px]">
                        <MapPin size={18} className="text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Enter Your Location"
                            className="bg-transparent border-none focus:ring-0 text-gray-200 placeholder-gray-500 w-full"
                        />
                    </div>
                    <button className="bg-black px-8 py-4 flex items-center gap-2 hover:bg-gray-900 transition">
                        <Search size={18} />
                        <span>Search</span>
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex gap-10">
                {/* Sidebar Filters */}
                <aside className="w-64 flex-shrink-0 space-y-8">
                    <FilterSection title="Category" items={['Car Wash', 'Full Detailing', 'Paint & Protection', 'Interior Care', 'Specialty Services', 'Tinting']} active="Car Wash" />
                    <FilterSection title="Location" items={['Downtown', 'Westside', 'North Hills', 'San Francisco']} active="Downtown" />

                    <div>
                        <h3 className="text-lg font-medium mb-4">Price Range</h3>
                        <div className="relative h-1 bg-gray-700 rounded-full mb-6">
                            <div className="absolute h-1 bg-bg-nevy rounded-full left-0 right-1/4"></div>
                            <div className="absolute -top-1.5 left-0 w-4 h-4 bg-white rounded-full border-2 border-bg-nevy"></div>
                            <div className="absolute -top-1.5 right-1/4 w-4 h-4 bg-white rounded-full border-2 border-bg-nevy"></div>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <input type="text" placeholder="Min price" className="w-1/2 bg-[#292929] border-none rounded p-2 text-sm" />
                            <input type="text" placeholder="Max price" className="w-1/2 bg-[#292929] border-none rounded p-2 text-sm" />
                        </div>
                        <FilterSection title="" items={['All Price', 'Under $20', '$25 to $100', '$100 to $300', '$300 to $500', '$500 to $1,000', '$1,000 to $10,000']} active="$300 to $500" radio />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium mb-4">Ratings & Reviews</h3>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3 mb-2 group cursor-pointer">
                                <div className={`w-4 h-4 rounded-full border ${rating === 5 ? 'bg-bg-nevy border-bg-nevy' : 'border-gray-600'}`}></div>
                                <span className="text-sm w-4">{rating}</span>
                                <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-bg-nevy"
                                        style={{ width: `${rating === 5 ? 100 : rating === 4 ? 80 : rating === 3 ? 60 : rating === 2 ? 40 : 20}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Results Grid */}
                <main className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {service.map((item) => (
                            <ServiceCard key={item.id} {...item} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

const FilterSection = ({ title, items, active, radio = true }: any) => (
    <div className="mb-6">
        {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
        <ul className="space-y-3">
            {items.map((item: string) => (
                <li key={item} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border transition-colors ${item === active ? 'bg-bg-nevy border-bg-nevy' : 'border-gray-600 group-hover:border-gray-400'}`}></div>
                    <span className={`text-sm ${item === active ? 'text-blue-500 font-medium' : 'text-gray-400 group-hover:text-gray-200'}`}>
                        {item}
                    </span>
                </li>
            ))}
        </ul>
    </div>
);

export default ServiceMarketplace;