import { Link } from '@inertiajs/react';

export default function WhyChoosePlatform() {
    return (
       <div
            className="relative bg-cover bg-center bg-no-repeat py-20"
            style={{
                backgroundImage: "url('/assets/images/bg.png')",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/70"></div>
            <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-between gap-12 lg:flex-row">
                    {/* Left Section: Text Content */}
                    <div className="w-full text-center lg:w-1/2 lg:text-left">
                        <h2 className="mb-8 font-poppins text-3xl font-medium text-text-white">
                            Why Choose Our Platform
                        </h2>
                        <div className="mb-8 space-y-4">
                            <div className="flex gap-2 font-poppins text-xl font-medium text-text-border">
                                <div>
                                    <img
                                        src="/assets/images/home/square-check-big.svg"
                                        alt="check "
                                    />
                                </div>
                                <div>
                                Verified service providers
                                </div>
                            </div>
                            <li className="flex gap-2 font-poppins text-xl font-medium text-text-border">
                                <div>
                                    <img
                                        src="/assets/images/home/square-check-big.svg"
                                        alt="check "
                                    />
                                </div>
                                <div>
                                Transparent pricing
                                </div>
                            </li>
                            <li className="flex gap-2 font-poppins text-xl font-medium text-text-border">
                                <div>
                                    <img
                                        src="/assets/images/home/square-check-big.svg"
                                        alt="check "
                                    />
                                </div>
                                <div>
                                Easy online booking
                                </div>
                            </li>
                            <li className="flex gap-2 font-poppins text-xl font-medium text-text-border">
                                <div>
                                    <img
                                        src="/assets/images/home/square-check-big.svg"
                                        alt="check "
                                    />
                                </div>
                                <div>
                                24/7 customer support
                                </div>
                            </li>
                            <li className="flex gap-2 font-poppins text-xl font-medium text-text-border">
                                <div>
                                    <img
                                        src="/assets/images/home/square-check-big.svg"
                                        alt="check "
                                    />
                                </div>
                                <div>
                                Quality guaranteed services
                                </div>
                            </li>
                        </div>
                        <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                            <Link
                                href="#"
                                className="inline-flex items-center justify-center rounded-md bg-bg-nevy px-6 py-3 text-base font-normal font-poppins text-text-white"
                            >
                               Become a Provider    
                            </Link>
                        </div>
                    </div>

                    {/* Right Section: Image */}
                    <div className="flex w-full justify-center lg:w-1/2 lg:justify-end">
                        <div className="">
                            <img
                                src="/assets/images/home/driver.jpg"
                                alt="Professional working on car service"
                                className="h-auto w-full rounded-lg object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
