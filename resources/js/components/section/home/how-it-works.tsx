import { Link } from '@inertiajs/react';

export default function HowItWorks() {
    return (
        <div
            className="relative bg-cover bg-center bg-no-repeat py-20"
            style={{
                backgroundImage: "url('/assets/images/bg.png')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 mx-auto max-w-6xl px-4">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 font-poppins text-4xl font-bold text-white">
                        How It Works
                    </h2>
                    <p className="mx-auto max-w-2xl font-poppins text-lg text-gray-300">
                        It's about you and your family, having a comfortable
                        payment, exceptional service and a lender.
                    </p>
                </div>

                {/* Three Steps */}
                <div className="relative">
                    <div className="mx-auto max-w-5xl space-y-28">
                        {/* STEP 01 */}
                        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-0">
                            {/* Left: Number + Card */}
                            <div className="relative flex flex-1 items-center justify-start">
                                <div className="absolute top-26 -left-8 h-[209px] w-[418px] rounded-full">
                                    <img
                                        src="/assets/images/home/Ellipse 1328.png"
                                        alt="Ellipse 1328"
                                        className="h-full w-full"
                                    />
                                </div>
                                <span className="absolute top-14 -left-15 z-0 font-poppins text-8xl font-bold text-text-border">
                                    01
                                </span>
                                <div className="relative z-10 mt-12 ml-14 w-[325px] border border-text-border bg-bg-black-100 p-9 shadow-2xl backdrop-blur-sm">
                                    <h3 className="mb-4 text-center text-2xl font-medium text-text-white">
                                        Create Account
                                    </h3>
                                    <div className="mb-5 flex flex-col items-center space-y-2">
                                        <div className="h-2 w-full rounded-full bg-text-border" />
                                        <div className="h-2 w-[80%] rounded-full bg-text-border" />
                                        <div className="h-2 w-[80%] rounded-full bg-text-border" />
                                        <div className="h-2 w-[90%] rounded-full bg-text-border" />
                                    </div>
                                    <div className="flex justify-center">
                                        <Link className="rounded-md bg-bg-nevy px-6 py-3 text-xs font-normal text-text-white">
                                            Sign up
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Text */}
                            <div className="flex-1 md:pl-16">
                                <h2 className="mb-3 font-poppins text-2xl font-medium text-text-white">
                                    Create Account
                                </h2>
                                <p className="max-w-md font-poppins text-base font-normal text-text-border">
                                    We know your home is more than just a place
                                    to live, that's why we're committed to
                                    providing the best home loan experience.
                                </p>
                            </div>
                        </div>

                        {/* STEP 02 */}
                        <div className="flex flex-col items-center gap-10 md:flex-row md:gap-0">
                            {/* Left: Text */}
                            <div className="order-2 flex-1 md:order-1 md:pr-16">
                                <h2 className="mb-3 font-poppins text-2xl font-medium text-text-white">
                                    Search for Services
                                </h2>
                                <p className="max-w-sm font-poppins text-base font-normal text-text-border">
                                    It’s the fast, easy way to apply for your
                                    mortgage and access your application
                                    anytime, anywhere. With our mortgage access
                                    center
                                </p>
                            </div>

                            {/* Right: Number + Card */}
                            <div className="relative order-1 flex flex-1 items-center justify-end md:order-2">
                                <div className="absolute top-26 -left-8 h-[209px] w-[418px] rounded-full">
                                    <img
                                        src="/assets/images/home/Ellipse 1328.png"
                                        alt="Ellipse 1328"
                                        className="h-full w-full"
                                    />
                                </div>
                                <span className="absolute top-14 -left-15 z-0 font-poppins text-8xl font-bold text-text-border">
                                    02
                                </span>
                                <div className="relative z-10 mt-12 ml-14 w-[380px] border border-text-border bg-bg-black-100 p-9 shadow-2xl backdrop-blur-sm">
                                    <h3 className="mb-4 text-center text-2xl font-medium text-text-white">
                                        Search
                                    </h3>
                                    <div className="bg-black-50 flex items-center gap-3 border border-text-border px-4 py-2.5">
                                        <input
                                            type="text"
                                            placeholder="Search services"
                                            className="flex-1 bg-transparent text-sm text-text-gray-50 focus:outline-none"
                                        />
                                        <button className="text-text-gray-50 transition-colors hover:text-white">
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
                                    <div className="absolute top-10 -left-8 h-[209px] w-[418px] rounded-full">
                                        <img
                                            src="/assets/images/home/Ellipse 1328.png"
                                            alt="Ellipse 1328"
                                            className="h-full w-full"
                                        />
                                    </div>
                                    <span className="absolute top-0 -left-15 z-0 font-poppins text-8xl font-bold text-text-border">
                                        03
                                    </span>
                                    <div className="relative z-10 mt-12 ml-20 w-[300px] border border-text-border bg-bg-black-100 p-9 shadow-2xl backdrop-blur-sm">
                                        <span className="cursor-pointer text-4xl transition-transform hover:scale-110">
                                            😮
                                        </span>
                                        <span className="cursor-pointer text-4xl transition-transform hover:scale-110">
                                            😎
                                        </span>
                                        <span className="cursor-pointer text-4xl transition-transform hover:scale-110">
                                            ❤️
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Text */}
                           <div className="flex-1 md:pl-16">
                                <h2 className="mb-3 font-poppins text-2xl font-medium text-text-white">
                                    Sit back and Enjoy
                                </h2>
                                <p className="max-w-sm font-poppins text-base font-normal text-text-border">
                                    It’s about you and your family, having a comfortable payment, exceptional service and a lender.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
