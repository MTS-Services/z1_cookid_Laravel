import { Link } from '@inertiajs/react';

export default function HowItWorks() {
    return (
        <div
            className="py-5 lg:py-20"
        >
            <div className="relative z-10 mx-auto max-w-6xl px-4">
                <div className="lg:mb-16 text-center">
                    <h2 className="mb-4 font-poppins text-4xl font-bold text-white">
                        How It Works
                    </h2>
                    <p className="mx-auto max-w-2xl font-poppins text-lg text-gray-300">
                        Get started in three simple steps to book trusted local services or offer your own.
                    </p>
                </div>

                {/* Three Steps */}
                <div className="relative">
                    <div className="mx-auto max-w-5xl lg:space-y-28">
                        {/* STEP 01 */}
                        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-0">
                            {/* Left: Number + Card */}
                            <div className="relative flex flex-1 items-center justify-start">
                                <div className="absolute top-26 -left-8 h-44 w-[330px] lg:h-[209px] lg:w-[418px] rounded-full">
                                    <img
                                        src="/assets/images/home/Ellipse 1328.png"
                                        alt="Ellipse 1328"
                                        className="h-full w-full"
                                    />
                                </div>
                                <span className="absolute top-18 lg:top-14 -left-8 lg:-left-15 z-0 font-poppins text-7xl lg:text-8xl font-bold text-text-border">
                                    01
                                </span>
                                <div className="relative z-10 mt-12 ml-24 lg:ml-14 w-[200px] lg:w-[325px] border border-text-border bg-bg-black-100 p-6 lg:p-9 shadow-2xl backdrop-blur-sm">
                                    <h3 className="mb-4 text-center text-base lg:text-2xl font-medium text-text-white">
                                        Create Your Account
                                    </h3>
                                    <div className="mb-5 flex flex-col items-center space-y-2">
                                        <div className="h-2 w-full rounded-full bg-text-border" />
                                        <div className="h-2 w-[80%] rounded-full bg-text-border" />
                                        <div className="h-2 w-[80%] rounded-full bg-text-border" />
                                        <div className="h-2 w-[90%] rounded-full bg-text-border" />
                                    </div>
                                    <div className="flex justify-center">
                                        <Link href={route('user.auth.register')} className="rounded-md bg-bg-nevy px-6 py-3 text-xs font-normal text-text-white">
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Text */}
                            <div className="flex-1 md:pl-16">
                                <h2 className="mb-3 font-poppins text-2xl font-medium text-text-white">
                                    01 — Create Your Account
                                </h2>
                                <p className="max-w-md font-poppins text-base font-normal text-text-border">
                                    Sign up and set up your profile to start booking services or offering your own.
                                </p>
                            </div>
                        </div>

                        {/* STEP 02 */}
                        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-0">
                            {/* Left: Text */}
                            <div className="order-2 flex-1 md:order-1 md:pr-16 mt-16 lg:mt-0">
                                <h2 className="mb-3 font-poppins text-2xl font-medium text-text-white">
                                    02 — Find What You Need
                                </h2>
                                <p className="max-w-sm font-poppins text-base font-normal text-text-border">
                                    Search and explore local services available in your area.
                                </p>
                            </div>

                            {/* Right: Number + Card */}
                            <div className="relative order-1 flex flex-1 items-center justify-end md:order-2">
                                <div className="absolute top-26 -left-8 h-44 w-[330px] lg:h-[209px] lg:w-[418px] rounded-full">
                                    <img
                                        src="/assets/images/home/Ellipse 1328.png"
                                        alt="Ellipse 1328"
                                        className="h-full w-full"
                                    />
                                </div>
                                <span className="absolute top-18 lg:top-14 -left-8 lg:-left-15 z-0 font-poppins text-6xl lg:text-8xl font-bold text-text-border">
                                    02
                                </span>
                                <div className="relative z-10 mt-16 lg:mt-12 ml-14  lg:w-[380px] border border-text-border bg-bg-black-100 p-6 lg:p-9 shadow-2xl backdrop-blur-sm">
                                    <h3 className="mb-4 text-center text-base lg:text-2xl font-medium text-text-white">
                                        Find What You Need
                                    </h3>
                                    <div className="bg-black-50 flex items-center gap-3 border border-text-border px-4 py-2.5">
                                        <input
                                            type="text"
                                            placeholder="Search services"
                                            className="flex-1 bg-transparent text-sm text-text-gray-50 focus:outline-none"
                                        />
                                        <button type="button" className="text-text-gray-50 transition-colors hover:text-white">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STEP 03 */}
                        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-0">
                            {/* Left: Number + Card */}
                            <div className="relative flex flex-1 items-center justify-start">
                                <div className="relative flex flex-1 items-center justify-start">
                                    <div className="absolute top-10 -left-8 h-44 w-[330px] lg:h-[209px] lg:w-[418px]  rounded-full">
                                        <img
                                            src="/assets/images/home/Ellipse 1328.png"
                                            alt="Ellipse 1328"
                                            className="h-full w-full"
                                        />
                                    </div>
                                    <span className="absolute top-2 lg:top-18 lg:top-14 -left-8 lg:-left-15 z-0 font-poppins text-7xl lg:text-8xl font-bold text-text-border">
                                        03
                                    </span>
                                    <div className="relative z-10 mt-2 lg:mt-12 ml-20 lg:w-[300px] border border-text-border bg-bg-black-100 p-9 shadow-2xl backdrop-blur-sm">
                                        <h3 className="mb-3 text-center text-base lg:text-xl font-medium text-text-white">
                                            Booking
                                        </h3>
                                        <p className="text-center font-poppins text-sm font-normal text-text-border">
                                            Secure, verified booking in just a few taps.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Text */}
                           <div className="flex-1 md:pl-16 mt-20 md:mt-0">
                                <h2 className="mb-3 font-poppins text-2xl font-medium text-text-white">
                                    03 — Booking
                                </h2>
                                <p className="max-w-sm font-poppins text-base font-normal text-text-border">
                                    Schedule your service instantly with secure, verified booking.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
