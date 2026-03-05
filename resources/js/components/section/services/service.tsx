import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Filter, X } from 'lucide-react';
import ServiceCard from '@/components/ui/service-card';
import FilterSection from '@/components/ui/filter-section';
import PriceRange from '@/components/ui/price-range';
import { router } from '@inertiajs/react';

const INITIAL_SERVICES = [
    {
        id: 1,
        image: '/assets/images/service/EliteAutoSpa.png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        category: 'Full Detailing',
        location: 'Downtown',
        vehicleType: 'SUV',
        price: 120,
        service: 'DETAILING'
    },
    {
        id: 2,
        image: '/assets/images/service/Frame 2147225286 (1).png',
        name: 'Quick Clean Pro',
        rating: 4.9,
        category: 'Car Wash',
        location: 'Westside',
        vehicleType: 'Sedan',
        price: 45,
        service: 'WASH'
    },
    {
        id: 3,
        image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
        name: 'Elite Automotive Detailers',
        rating: 4.9,
        category: 'Tinting',
        location: 'San Francisco',
        vehicleType: 'Luxury',
        price: 180,
        service: 'TINT'
    },

    // Repeated rows (like your screenshot grid)
    {
        id: 4,
        image: '/assets/images/service/EliteAutoSpa.png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        category: 'Full Detailing',
        location: 'Downtown',
        vehicleType: 'SUV',
        price: 120,
        service: 'DETAILING'
    },
    {
        id: 5,
        image: '/assets/images/service/Frame 2147225286 (1).png',
        name: 'Quick Clean Pro',
        rating: 4.9,
        category: 'Car Wash',
        location: 'Westside',
        vehicleType: 'Sedan',
        price: 45,
        service: 'WASH'
    },
    {
        id: 6,
        image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
        name: 'Elite Automotive Detailers',
        rating: 4.9,
        category: 'Tinting',
        location: 'San Francisco',
        vehicleType: 'Luxury',
        price: 180,
        service: 'TINT'
    },

    {
        id: 7,
        image: '/assets/images/service/EliteAutoSpa.png',
        name: 'Elite Auto Spa',
        rating: 4.9,
        category: 'Full Detailing',
        location: 'Downtown',
        vehicleType: 'SUV',
        price: 120,
        service: 'DETAILING'
    },
    {
        id: 8,
        image: '/assets/images/service/Frame 2147225286 (1).png',
        name: 'Quick Clean Pro',
        rating: 4.9,
        category: 'Car Wash',
        location: 'Westside',
        vehicleType: 'Sedan',
        price: 45,
        service: 'WASH'
    },
    {
        id: 9,
        image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg',
        name: 'Elite Automotive Detailers',
        rating: 4.9,
        category: 'Tinting',
        location: 'San Francisco',
        vehicleType: 'Luxury',
        price: 180,
        service: 'TINT'
    }
];


const ServiceMarketplace = () => {
    // Dropdown/Mobile Visibility States
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [isVehicleOpen, setIsVehicleOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile Filter Toggle

    // Filter Selection States
    const [selectedService, setSelectedService] = useState('Select Service');
    const [selectedVehicle, setSelectedVehicle] = useState('Vehicle Type');
    const [searchLocation, setSearchLocation] = useState('');
    const [sidebarCategory, setSidebarCategory] = useState('All');
    const [sidebarLocation, setSidebarLocation] = useState('All');
    const [activePrice, setActivePrice] = useState("All Price");

    const searchBarRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsServiceOpen(false);
                setIsVehicleOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredServices = useMemo(() => {
        return INITIAL_SERVICES.filter((item) => {
            const matchesServiceDrop = selectedService === 'Select Service' || item.category === selectedService;
            const matchesVehicleDrop = selectedVehicle === 'Vehicle Type' || item.vehicleType === selectedVehicle;
            const matchesSearchLoc = item.location.toLowerCase().includes(searchLocation.toLowerCase());
            const matchesSidebarCat = sidebarCategory === 'All' || item.category === sidebarCategory;
            const matchesSidebarLoc = sidebarLocation === 'All' || item.location === sidebarLocation;
            return matchesServiceDrop && matchesVehicleDrop && matchesSearchLoc && matchesSidebarCat && matchesSidebarLoc;
        });
    }, [selectedService, selectedVehicle, searchLocation, sidebarCategory, sidebarLocation]);

    const priceOptions = [
        { label: "All Price", min: 0, max: 10000 },
        { label: "Under $20", min: 0, max: 20 },
        { label: "$25 to $100", min: 25, max: 100 },
        { label: "$100 to $300", min: 100, max: 300 },
        { label: "$300 to $500", min: 300, max: 500 },
        { label: "$500 to $1,000", min: 500, max: 1000 },
        { label: "$1,000 to $10,000", min: 1000, max: 10000 },
    ];

    return (
        <div className="bg-[#0A0A0A] min-h-screen text-white font-poppins lg:pb-20">
            {/* Header Section */}
            <div className="container mx-auto pt-5 md:pt-24 px-4">
                <h1 className="text-2xl md:text-4xl font-semibold text-center mb-5 lg:mb-8 md:mb-12">
                    Feature Services for You
                </h1>

                {/* Search Bar Container */}
                <div ref={searchBarRef} className="max-w-5xl mx-auto space-y-2 md:space-y-0">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-0 rounded-lg p-4 md:p-0">

                        {/* Select Service Dropdown */}
                        <div className="relative md:col-span-3">
                            <button
                                onClick={() => { setIsServiceOpen(!isServiceOpen); setIsVehicleOpen(false); }}
                                className="w-full flex items-center justify-between px-4 py-4 bg-[#1A1A1A] md:bg-[#1A1A1A] border border-gray-700 md:rounded-l-lg hover:border-gray-500 transition"
                            >
                                <span className="text-gray-300 text-sm truncate">{selectedService}</span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isServiceOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isServiceOpen && (
                                <ul className="absolute left-0 top-full mt-1 w-full bg-[#1A1A1A] border border-gray-700 rounded-md shadow-2xl z-50 overflow-hidden">
                                    {["Select Service", "Car Wash", "Full Detailing", "Tinting"].map((s) => (
                                        <li key={s} onClick={() => { setSelectedService(s); setIsServiceOpen(false); }} className="px-4 py-3 text-sm text-gray-300 hover:bg-navy cursor-pointer">{s}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Vehicle Type Dropdown */}
                        <div className="relative md:col-span-3">
                            <button
                                onClick={() => { setIsVehicleOpen(!isVehicleOpen); setIsServiceOpen(false); }}
                                className="w-full flex items-center justify-between px-4 py-4 bg-[#1A1A1A] border border-gray-700 md:border-l-0 hover:border-gray-500 transition"
                            >
                                <span className="text-gray-300 text-sm truncate">{selectedVehicle}</span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isVehicleOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isVehicleOpen && (
                                <ul className="absolute left-0 top-full mt-1 w-full bg-[#1A1A1A] border border-gray-700 rounded-md shadow-2xl z-50 overflow-hidden">
                                    {["Vehicle Type", "Sedan", "SUV", "Luxury"].map((v) => (
                                        <li key={v} onClick={() => { setSelectedVehicle(v); setIsVehicleOpen(false); }} className="px-4 py-3 text-sm text-gray-300 hover:bg-navy cursor-pointer">{v}</li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Location & Search Button */}
                        <div className="md:col-span-6 flex items-center bg-[#1A1A1A] border border-gray-700 md:border-l-0 md:rounded-r-lg overflow-hidden">
                            <div className="flex-1 flex items-center px-4">
                                <MapPin size={18} className="text-gray-400 mr-2 shrink-0" />
                                <input
                                    type="text"
                                    placeholder="Enter Your Location"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    className="bg-transparent text-gray-200 placeholder-gray-500 w-full py-4 outline-none text-sm"
                                />
                            </div>
                            <button className="bg-black hover:bg-bg-gray text-white px-6 py-2.5 rounded-md m-1.5 transition flex items-center gap-2 text-sm font-bold cursor-pointer">
                                <Search size={18} />
                                <span className="hidden sm:inline">Search</span>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Filter Toggle Button (Matching Screenshot Funnel Icon) */}
                    <div className="md:hidden flex justify-start pt-2">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 border border-gray-700 rounded-md hover:bg-gray-800 transition"
                        >
                            <Filter size={24} className="text-white" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="container mx-auto flex flex-col md:flex-row gap-10 mt-12 px-4">

                {/* Sidebar - Desktop & Mobile Overlay */}
                <aside className={`
                    fixed inset-0 z-[60] bg-[#0A0A0A] p-6 transition-transform duration-300 md:relative md:inset-auto md:z-0 md:p-0 md:translate-x-0 md:block md:w-64 flex-shrink-0
                    ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="flex items-center justify-between mb-8 md:hidden">
                        <h2 className="text-xl font-bold">Filters</h2>
                        <button onClick={() => setIsSidebarOpen(false)}><X size={24} /></button>
                    </div>

                    <div className="space-y-8 h-full overflow-y-auto pb-20 md:pb-0">
                        <FilterSection
                            title="Category"
                            items={['All', 'Car Wash', 'Full Detailing', 'Paint & Protection', 'Interior Care', 'Tinting']}
                            active={sidebarCategory}
                            onChange={(val) => { setSidebarCategory(val); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                        />

                        <FilterSection
                            title="Location"
                            items={['All', 'Downtown', 'Westside', 'North Hills', 'San Francisco']}
                            active={sidebarLocation}
                            onChange={(val) => { setSidebarLocation(val); if (window.innerWidth < 768) setIsSidebarOpen(false); }}
                        />

                        <PriceRange
                            options={priceOptions}
                            active={activePrice}
                            onChange={(option) => {
                                setActivePrice(option.label);
                                // router logic here...
                            }}
                        />

                        {/* Ratings */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Ratings & Reviews</h3>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center gap-3 mb-3 group cursor-pointer">
                                    <div className={`w-4 h-4 rounded-full border ${rating === 5 ? 'bg-navy border-navy ring-2 ring-blue-900/30' : 'border-gray-600'}`}></div>
                                    <span className="text-sm w-4 text-gray-400">{rating}</span>
                                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-navy" style={{ width: `${rating * 20}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Results Grid */}
                <main className="flex-1">
                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((item) => (
                                <ServiceCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-xl">No services match your criteria.</p>
                            <button
                                onClick={() => { setSelectedService('Select Service'); setSelectedVehicle('Vehicle Type'); setSearchLocation(''); setSidebarCategory('All'); setSidebarLocation('All'); }}
                                className="mt-4 text-navy hover:underline"
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ServiceMarketplace;