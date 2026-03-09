import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, Filter, X } from 'lucide-react';
import ServiceCard from '@/components/ui/service-card';
import FilterSection from '@/components/ui/filter-section';
import PriceRange from '@/components/ui/price-range';
import Pagination from '@/components/ui/pagination';
import { router } from '@inertiajs/react';
import { Paginated, Service, ServiceFilters, ServiceOptions } from '@/types/model';

interface ServiceMarketplaceProps {
    services: Paginated<Service>;
    filters: ServiceFilters;
    options: ServiceOptions;
}

const ServiceMarketplace = ({ services, filters, options }: ServiceMarketplaceProps) => {
    const [isServiceOpen, setIsServiceOpen] = useState(false);
    const [isVehicleOpen, setIsVehicleOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [locationInput, setLocationInput] = useState(filters.location ?? '');

    const searchBarRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setLocationInput(filters.location ?? '');
    }, [filters.location]);

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

    const serviceData = services?.data ?? [];
    const pagination = services?.meta ?? {
        current_page: 1,
        last_page: 1,
        per_page: serviceData.length,
        total: serviceData.length,
        from: serviceData.length ? 1 : null,
        to: serviceData.length || null,
    };

    const sidebarCategoryOptions = useMemo(
        () => [{ label: 'All', value: null }, ...options.categories],
        [options.categories]
    );

    const sidebarLocationOptions = useMemo(
        () => [
            { label: 'All', value: null },
            ...options.locations.map((location) => ({ label: location, value: location })),
        ],
        [options.locations]
    );

    const priceOptions = useMemo(() => (
        options.priceRanges.length > 0
            ? options.priceRanges
            : [{ label: 'All Price', min: options.priceBounds.min, max: options.priceBounds.max }]
    ), [options.priceRanges, options.priceBounds]);

    const categoryDropdownLabel = filters.category
        ? options.categories.find((option) => option.value === filters.category)?.label ?? 'Select Service'
        : 'Select Service';

    const vehicleDropdownLabel = filters.vehicleType != null
        ? options.vehicleTypes.find((option) => Number(option.value) === Number(filters.vehicleType))?.label ?? 'Vehicle Type'
        : 'Vehicle Type';

    const activePriceLabel = useMemo(() => {
        const min = filters.minPrice ?? options.priceBounds.min;
        const max = filters.maxPrice ?? options.priceBounds.max;
        const match = priceOptions.find((option) => option.min === min && option.max === max);
        return match?.label ?? 'All Price';
    }, [filters.minPrice, filters.maxPrice, priceOptions, options.priceBounds.min, options.priceBounds.max]);

    const buildQuery = (overrideFilters: Partial<ServiceFilters>, page?: number) => {
        const merged: ServiceFilters = { ...filters, ...overrideFilters };
        const query: Record<string, string | number> = {};

        if (merged.search && merged.search.trim() !== '') {
            query.search = merged.search.trim();
        }
        if (merged.category) {
            query.category = merged.category;
        }
        if (merged.vehicleType != null) {
            query.vehicle_type = merged.vehicleType;
        }
        if (merged.location && merged.location.trim() !== '') {
            query.location = merged.location.trim();
        }
        if (merged.minPrice != null) {
            query.min_price = merged.minPrice;
        }
        if (merged.maxPrice != null) {
            query.max_price = merged.maxPrice;
        }
        if (page && page > 1) {
            query.page = page;
        }

        return query;
    };

    const navigateWithFilters = (overrideFilters: Partial<ServiceFilters> = {}, page?: number) => {
        router.get(route('frontend.services'), buildQuery(overrideFilters, page), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const handleLocationSearch = () => {
        navigateWithFilters({ location: locationInput || null }, 1);
    };

    const handleCategorySelect = (value: string | number | null) => {
        setIsServiceOpen(false);
        navigateWithFilters({ category: value ? String(value) : null }, 1);
    };

    const handleVehicleSelect = (value: string | number | null) => {
        setIsVehicleOpen(false);
        navigateWithFilters({ vehicleType: value ? Number(value) : null }, 1);
    };

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
                                <span className="text-gray-300 text-sm truncate">{categoryDropdownLabel}</span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isServiceOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isServiceOpen && (
                                <ul className="absolute left-0 top-full mt-1 w-full bg-[#1A1A1A] border border-gray-700 rounded-md shadow-2xl z-50 overflow-hidden">
                                    {[{ label: 'Select Service', value: null }, ...options.categories].map((option) => (
                                        <li
                                            key={`${option.label}-${option.value ?? 'all'}`}
                                            onClick={() => handleCategorySelect(option.value)}
                                            className="px-4 py-3 text-sm text-gray-300 hover:bg-navy cursor-pointer"
                                        >
                                            {option.label}
                                        </li>
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
                                <span className="text-gray-300 text-sm truncate">{vehicleDropdownLabel}</span>
                                <ChevronDown size={18} className={`text-gray-400 transition-transform ${isVehicleOpen ? "rotate-180" : ""}`} />
                            </button>
                            {isVehicleOpen && (
                                <ul className="absolute left-0 top-full mt-1 w-full bg-[#1A1A1A] border border-gray-700 rounded-md shadow-2xl z-50 overflow-hidden">
                                    {[{ label: 'Vehicle Type', value: null }, ...options.vehicleTypes].map((option) => (
                                        <li
                                            key={`${option.label}-${option.value ?? 'all'}`}
                                            onClick={() => handleVehicleSelect(option.value)}
                                            className="px-4 py-3 text-sm text-gray-300 hover:bg-navy cursor-pointer"
                                        >
                                            {option.label}
                                        </li>
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
                                    value={locationInput}
                                    onChange={(e) => setLocationInput(e.target.value)}
                                    className="bg-transparent text-gray-200 placeholder-gray-500 w-full py-4 outline-none text-sm"
                                />
                            </div>
                            <button
                                onClick={handleLocationSearch}
                                className="bg-black hover:bg-bg-gray text-white px-6 py-2.5 rounded-md m-1.5 transition flex items-center gap-2 text-sm font-bold cursor-pointer"
                            >
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
                            items={sidebarCategoryOptions}
                            active={filters.category ?? null}
                            onChange={(value) => {
                                navigateWithFilters({ category: value ? String(value) : null }, 1);
                                if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                        />

                        <FilterSection
                            title="Location"
                            items={sidebarLocationOptions}
                            active={filters.location ?? null}
                            onChange={(value) => {
                                navigateWithFilters({ location: value ? String(value) : null }, 1);
                                if (window.innerWidth < 768) setIsSidebarOpen(false);
                            }}
                        />

                        <PriceRange
                            options={priceOptions}
                            active={activePriceLabel}
                            onChange={(option) => {
                                navigateWithFilters({ minPrice: option.min, maxPrice: option.max }, 1);
                                if (window.innerWidth < 768) setIsSidebarOpen(false);
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
                <main className="flex-1 space-y-10">
                    {serviceData.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {serviceData.map((item) => (
                                <ServiceCard key={item.id} {...item} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                            <Search size={48} className="mb-4 opacity-20" />
                            <p className="text-xl">No services match your criteria.</p>
                            <button
                                onClick={() => navigateWithFilters({
                                    category: null,
                                    vehicleType: null,
                                    location: null,
                                    minPrice: options.priceBounds.min,
                                    maxPrice: options.priceBounds.max,
                                }, 1)}
                                className="mt-4 text-navy hover:underline"
                            >
                                Reset all filters
                            </button>
                        </div>
                    )}

                    {pagination.last_page > 1 && (
                        <Pagination
                            currentPage={pagination.current_page}
                            totalPages={pagination.last_page}
                            onPageChange={(page) => navigateWithFilters({}, page)}
                        />
                    )}
                </main>
            </div>
        </div>
    );
};

export default ServiceMarketplace;