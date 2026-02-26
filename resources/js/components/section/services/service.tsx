import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MapPin, Star, Heart, ChevronDown } from 'lucide-react';
import ServiceCard from '@/components/ui/service-card';

// Mock Data (Apnar deya image array-ti base kore)
const INITIAL_SERVICES = [
    { id: 1, image: '/assets/images/service/EliteAutoSpa.png', name: 'Elite Auto Spa', rating: 4.9, category: 'Full Detailing', location: 'Downtown', vehicleType: 'SUV', price: 120, service: 'DETAILING' },
    { id: 2, image: '/assets/images/service/Frame 2147225286 (2).png', name: 'Quick Clean Pro', rating: 4.7, category: 'Car Wash', location: 'Westside', vehicleType: 'Sedan', price: 45, service: 'WASH' },
    { id: 3, image: '/assets/images/service/Frame 2147225286 (1).png', name: 'Glass Guard Tint', rating: 4.8, category: 'Tinting', location: 'San Francisco', vehicleType: 'Luxury', price: 180, service: 'TINTING' },
    { id: 4, image: '/assets/images/service/acf994a9fb4b2987dc25a22e5d14deef32175a6f.jpg', name: 'Interior Masters', rating: 4.6, category: 'Interior Care', location: 'North Hills', vehicleType: 'Hatchback', price: 350, service: 'INTERIOR' },
    { id: 5, image: '/assets/images/service/EliteAutoSpa.png', name: 'Detailing Hub', rating: 4.9, category: 'Full Detailing', location: 'Downtown', vehicleType: 'SUV', price: 200, service: 'DETAILING' },
    { id: 6, image: '/assets/images/service/Frame 2147225286 (2).png', name: 'Express Wash', rating: 4.4, category: 'Car Wash', location: 'Westside', vehicleType: 'Sedan', price: 25, service: 'WASH' },
];

const ServiceMarketplace = () => {
    // Dropdown Visibility States
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [isVehicleOpen, setIsVehicleOpen] = useState(false);

    // Filter Selection States
    const [selectedService, setSelectedService] = useState('Select Service');
    const [selectedVehicle, setSelectedVehicle] = useState('Vehicle Type');
    const [searchLocation, setSearchLocation] = useState('');
    const [sidebarCategory, setSidebarCategory] = useState('All');
    const [sidebarLocation, setSidebarLocation] = useState('All');

    // Outside Click Ref
    const searchBarRef = useRef<HTMLDivElement>(null);

    // Outside Click Logic
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setIsServiceOpen(false);
                setIsVehicleOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Core Filtering Logic
    const filteredServices = useMemo(() => {
        return INITIAL_SERVICES.filter((item) => {
            // Dropdown filters
            const matchesServiceDrop = selectedService === 'Select Service' || item.category === selectedService;
            const matchesVehicleDrop = selectedVehicle === 'Vehicle Type' || item.vehicleType === selectedVehicle;

            // Search Input filter
            const matchesSearchLoc = item.location.toLowerCase().includes(searchLocation.toLowerCase());

            // Sidebar filters
            const matchesSidebarCat = sidebarCategory === 'All' || item.category === sidebarCategory;
            const matchesSidebarLoc = sidebarLocation === 'All' || item.location === sidebarLocation;

            return matchesServiceDrop && matchesVehicleDrop && matchesSearchLoc && matchesSidebarCat && matchesSidebarLoc;
        });
    }, [selectedService, selectedVehicle, searchLocation, sidebarCategory, sidebarLocation]);

    return (
        <div className="min-h-screen bg-bg-black text-text-white font-poppins p-8 pb-70">

            {/* Header / Search Bar Section */}
            <div className="max-w-7xl mx-auto mb-16">
                <h1 className="text-3xl font-semibold text-center mb-10 text-white">
                    Feature Services for You
                </h1>

                <div
                    ref={searchBarRef}
                    className="flex flex-wrap items-stretch justify-center gap-4 max-w-5xl mx-auto"
                >
                    {/* Select Service */}
                    <div className="relative min-w-[200px]">
                        <button
                            onClick={() => {
                                setIsServiceOpen(!isServiceOpen);
                                setIsVehicleOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-6 py-4 
                           bg-bg-gray border border-gray-600 rounded-md
                           hover:border-gray-400 transition"
                        >
                            <span className="text-gray-300 text-sm">
                                {selectedService}
                            </span>
                            <ChevronDown
                                size={18}
                                className={`text-gray-400 transition-transform ${isServiceOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {isServiceOpen && (
                            <ul className="absolute left-0 top-full mt-2 w-full 
                               bg-[#1f1f1f] border border-text-border
                               rounded-md shadow-2xl z-50 overflow-hidden">
                                {[
                                    "Select Service",
                                    "Car Wash",
                                    "Full Detailing",
                                    "Tinting",
                                    "Interior Care",
                                ].map((s) => (
                                    <li
                                        key={s}
                                        onClick={() => {
                                            setSelectedService(s);
                                            setIsServiceOpen(false);
                                        }}
                                        className="px-6 py-3 text-sm text-gray-300 
                                       hover:bg-navy hover:text-white 
                                       cursor-pointer transition"
                                    >
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Vehicle Type */}
                    <div className="relative min-w-[180px]">
                        <button
                            onClick={() => {
                                setIsVehicleOpen(!isVehicleOpen);
                                setIsServiceOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-6 py-4 
                           bg-bg-gray border border-gray-600 rounded-md
                           hover:border-gray-400 transition"
                        >
                            <span className="text-gray-300 text-sm">
                                {selectedVehicle}
                            </span>
                            <ChevronDown
                                size={18}
                                className={`text-gray-400 transition-transform ${isVehicleOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {isVehicleOpen && (
                            <ul className="absolute left-0 top-full mt-2 w-full 
                               bg-[#1f1f1f] border border-text-border
                               rounded-md shadow-2xl z-50 overflow-hidden">
                                {[
                                    "Vehicle Type",
                                    "Sedan",
                                    "SUV",
                                    "Hatchback",
                                    "Luxury",
                                ].map((v) => (
                                    <li
                                        key={v}
                                        onClick={() => {
                                            setSelectedVehicle(v);
                                            setIsVehicleOpen(false);
                                        }}
                                        className="px-6 py-3 text-sm text-gray-300 
                                       hover:bg-navy hover:text-white 
                                       cursor-pointer transition"
                                    >
                                        {v}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="flex items-center border border-text-border rounded-md bg-bg-gray overflow-hidden">
                        {/* Location Input */}
                        <div className="flex items-center min-w-[300px] flex-1 px-6">
                            <MapPin size={18} className="text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Enter Your Location"
                                value={searchLocation}
                                onChange={(e) => setSearchLocation(e.target.value)}
                                className="bg-transparent text-gray-200 placeholder-gray-400 
                           w-full py-4 outline-none text-sm"
                            />
                        </div>

                        {/* Search Button */}
                        <button className="px-5 py-3
                           bg-black hover:bg-navy rounded-sm m-1 transition flex items-center gap-2 text-white text-sm font-medium">
                            <Search size={18} />
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
                {/* Sidebar Filters */}
                <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
                    <FilterSection
                        title="Category"
                        items={['All', 'Car Wash', 'Full Detailing', 'Paint & Protection', 'Interior Care', 'Tinting']}
                        active={sidebarCategory}
                        onChange={setSidebarCategory}
                    />

                    <FilterSection
                        title="Location"
                        items={['All', 'Downtown', 'Westside', 'North Hills', 'San Francisco']}
                        active={sidebarLocation}
                        onChange={setSidebarLocation}
                    />

                    {/* Price Range (UI only) */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Price Range</h3>
                        <div className="relative h-1 bg-bg-black-50 rounded-full mb-6">
                            <div className="absolute h-1 bg-bg-nevy rounded-full left-0 right-1/4"></div>
                            <div className="absolute -top-1.5 left-0 w-4 h-4 bg-white rounded-full border-2 border-bg-nevy shadow-md"></div>
                            <div className="absolute -top-1.5 right-1/4 w-4 h-4 bg-white rounded-full border-2 border-bg-nevy shadow-md"></div>
                        </div>
                        <div className="flex gap-2 mb-4">
                            <input type="text" placeholder="Min price" className="w-1/2 bg-bg-black-50 border-none rounded p-2 text-sm text-text-white" />
                            <input type="text" placeholder="Max price" className="w-1/2 bg-bg-black-50 border-none rounded p-2 text-sm text-text-white" />
                        </div>
                    </div>

                    {/* Ratings */}
                    <div>
                        <h3 className="text-lg font-medium mb-4">Ratings & Reviews</h3>
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <div key={rating} className="flex items-center gap-3 mb-2 group cursor-pointer">
                                <div className={`w-4 h-4 rounded-full border transition-all ${rating === 5 ? 'bg-bg-nevy border-bg-nevy ring-2 ring-blue-900/30' : 'border-text-gray'}`}></div>
                                <span className="text-sm w-4 text-text-gray-50">{rating}</span>
                                <div className="flex-1 h-1.5 bg-bg-black-50 rounded-full overflow-hidden">
                                    <div className="h-full bg-bg-nevy" style={{ width: `${rating * 20}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Main Content: Results Grid */}
                <main className="flex-1">
                    {filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredServices.map((item) => (
                                <ServiceCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-text-gray">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-xl">No services match your criteria.</p>
                            <button
                                onClick={() => { setSidebarCategory('All'); setSidebarLocation('All'); setSelectedService('Select Service'); setSelectedVehicle('Vehicle Type'); setSearchLocation(''); }}
                                className="mt-4 text-bg-nevy hover:underline"
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

const FilterSection = ({ title, items, active, onChange }: any) => (
    <div className="mb-8">
        {title && (
            <h3 className="text-2xl font-medium mb-4">{title}</h3>
        )}

        <ul className="space-y-3">
            {items.map((item: string) => {
                const isActive = item === active;

                return (
                    <li
                        key={item}
                        onClick={() => onChange(item)}
                        className="flex items-center gap-4 cursor-pointer"
                    >
                        {/* Outer Circle */}
                        <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200
                            ${isActive
                                    ? 'bg-navy'
                                    : 'bg-gray-300'
                                }`}
                        >
                            {/* Inner Dot */}
                            <div
                                className={`w-2.5 h-2.5 rounded-full
                                ${isActive
                                        ? 'bg-white'
                                        : 'bg-gray-300'
                                    }`}
                            />
                        </div>

                        {/* Text */}
                        <span
                            className={`text-xl font-medium transition-colors
                            ${isActive
                                    ? 'text-navy'
                                    : 'text-gray-400'
                                }`}
                        >
                            {item}
                        </span>
                    </li>
                );
            })}
        </ul>
    </div>
);

// // Reusable Filter Section
// const FilterSection = ({ title, items, active, onChange }: any) => (
//     <div className="mb-6">
//         <h3 className="text-lg font-medium mb-4">{title}</h3>
//         <ul className="space-y-3">
//             {items.map((item: string) => (
//                 <li
//                     key={item}
//                     onClick={() => onChange(item)}
//                     className="flex items-center gap-3 cursor-pointer group"
//                 >
//                     <div className={`w-4 h-4 rounded-full border transition-all ${item === active ? 'bg-bg-nevy border-bg-nevy ring-2 ring-blue-900/30' : 'border-text-gray group-hover:border-text-gray-100'}`}></div>
//                     <span className={`text-sm transition-colors ${item === active ? 'text-text-white font-medium' : 'text-text-gray group-hover:text-text-gray-100'}`}>
//                         {item}
//                     </span>
//                 </li>
//             ))}
//         </ul>
//     </div>
// );

export default ServiceMarketplace;