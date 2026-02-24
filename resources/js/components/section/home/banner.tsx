import React from "react";
export default function Banner() {
    return (
        <div
            className="relative h-screen bg-cover bg-center bg-no-repeat"
            style={{
                backgroundImage: "url('/assets/images/banner/banner.jpg')",
            }}
        >
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative z-10 container flex h-full flex-col justify-center px-4">
                {/* Title */}
                <h2 className="text-5xl leading-tight font-bold text-text-white drop-shadow-lg md:text-6xl">
                    Find Trusted
                </h2>
                <h2 className="mb-4 text-5xl leading-tight font-bold text-text-white drop-shadow-lg md:text-6xl">
                    Car Services Near You
                </h2>

                {/* Subtitle */}
                <p className="mb-8 text-base font-normal text-text-white">
                    Book professional car wash, detailing, and maintenance
                    services in your area.
                </p>

                {/* Search Bar */}
                <div className="flex max-w-3xl flex-col items-stretch gap-2 md:flex-row">
                    {/* Select Service */}
                    <div className="relative">
                        <select className="h-full cursor-pointer appearance-none border-r border-gray-200 bg-bg-white px-5 py-4 pr-10 text-sm font-medium text-text-gray focus:outline-none">
                            <option value="">Select Service</option>
                            <option value="carwash">Car Wash</option>
                            <option value="detailing">Detailing</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="polish">Polishing</option>
                        </select>
                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-blck">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </span>
                    </div>

                    {/* Vehicle Type */}
                    <div className="relative">
                        <select className="h-full cursor-pointer appearance-none border-r border-gray-200 bg-bg-white px-5 py-4 pr-10 text-sm font-medium text-text-gray focus:outline-none">
                            <option value="">Vehicle Type</option>
                            <option value="sedan">Sedan</option>
                            <option value="suv">SUV</option>
                            <option value="truck">Truck</option>
                            <option value="van">Van</option>
                            <option value="motorcycle">Motorcycle</option>
                        </select>
                        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-black">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                />
                            </svg>
                        </span>
                    </div>

                    {/* Location Input */}
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-3 -translate-y-1/2 text-black">
                            <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Enter Your Location"
                            className="h-full w-full bg-bg-white py-4 pr-16 pl-10 text-sm  text-text-gray focus:outline-none"
                        />
                        <button className="absolute top-1/2 right-2 -translate-y-1/2 bg-black px-3 py-2 text-xs font-semibold text-text-white flex items-center gap-1">
                            <svg
                                className="h-3 w-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
