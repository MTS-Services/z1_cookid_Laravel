import { Link } from '@inertiajs/react';

export default function GrowYourCarServiceBusiness() {
    return (
       <div className="py-20 -mt-20 absolute w-full -top-52  z-20">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

            <div className="relative z-10 mx-auto max-w-7xl rounded-lg bg-[#0F172A] p-8 text-center shadow-lg lg:p-12">
                <h2 className="mb-4 font-poppins text-3xl font-medium text-text-white">
                    Grow Your Car Service Business
                </h2>
                <p className="mb-8 font-poppins text-base font-normal text-text-border">
                    Join our platform and get more customers in your area.
                </p>
                <Link
                    href="#"
                    className="inline-flex items-center justify-center rounded-md bg-bg-nevy px-8 py-3 font-poppins text-base font-normal text-text-white"
                >
                    Become a Provider
                </Link>
            </div>
        </div>
        </div>
    );
}