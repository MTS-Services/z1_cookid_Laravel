import GrowYourCarServiceBusiness from '@/components/section/home/grow-your-car-service-business';
import { Link } from '@inertiajs/react';
import React from 'react';
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaYoutube,
} from 'react-icons/fa';

const FrontendFooter: React.FC = () => {
    return (
        <>

            <footer className="relative bg-bg-black-100 py-6 md:py-12 text-text-white z-10 pt-16 md:pt-20">
            <GrowYourCarServiceBusiness />
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                        {/* Logo and Social Media */}
                        <div className="flex flex-col items-start">
                            <Link href="/">
                                <div className="h-18 w-18">
                                    <img
                                        src="/assets/images/logo.png"
                                        alt="Cookid Logo"
                                        className="mb-4 h-full w-full object-cover"
                                    />
                                </div>
                            </Link>
                            <div className="mt-5 flex space-x-4">
                                <a
                                    href="https://www.facebook.com/share/p/1ArbKDvNrq/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                                >
                                    <FaFacebookF size={20}></FaFacebookF>
                                </a>
                                <a
                                    href="https://x.com/glossedbooking?s=21"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                                >
                                    <FaTwitter size={20}></FaTwitter>
                                </a>
                                <a
                                    href="https://www.instagram.com/glossedbooking?igsh=MXMwM20zbXNodGVzYw%3D%3D&utm_source=qr"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                                >
                                    <FaInstagram size={20}></FaInstagram>
                                </a>
                                <a
                                    href="https://www.youtube.com/channel/UCdsmPvh1P00ur9N7JgAACDw"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center rounded-sm bg-navy text-sm md:text-base-800 p-2"
                                >
                                    <FaYoutube size={20}></FaYoutube>
                                </a>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div className="">
                            <h3 className="relative mb-4 font-poppins text-xl inline-block">
                                Company
                                <span className="absolute bottom-0 left-0 h-[3px] w-1/2 rounded-full bg-gradient-to-r from-blue-500 via-blue-800 to-transparent" />
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/about"
                                        className="font-poppins font-normal text-text-white transition-colors"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("frontend.contact")}
                                        className="font-poppins font-normal text-text-white transition-colors"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Customers Links */}
                        <div className="">
                            <h3 className="relative mb-4 font-poppins text-xl inline-block">
                                Customers
                                <span className="absolute bottom-0 left-0 h-[3px] w-1/2 rounded-full bg-gradient-to-r from-blue-500 via-blue-800 to-transparent" />
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href="/find-services"
                                        className="font-poppins font-normal text-text-white transition-colors"
                                    >
                                        Find Services
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/categories"
                                        className="font-poppins font-normal text-text-white transition-colors"
                                    >
                                        Categories
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/how-it-works"
                                        className="font-poppins font-normal text-text-white transition-colors"
                                    >
                                        How it Works
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Providers Links */}
                        <div className="">
                            <h3 className="relative mb-4 font-poppins text-xl inline-block">
                                Providers
                                <span className="absolute bottom-0 left-0 h-[3px] w-1/2 rounded-full bg-gradient-to-r from-blue-500 via-blue-800 to-transparent" />
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <Link
                                        href={route("vendor.auth.register")}
                                        className="font-poppins font-normal text-text-white transition-colors"
                                    >
                                        Become a Provider
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href={route("vendor.auth.login")}
                                        className="font-poppins font-normal text-text-white transition-colors"
                                    >
                                        Provider Login
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="mt-12 border-t border-navy pt-4 md:pt-8">
                        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row">
                            <p className="font-poppins text-text-gray">
                                &copy; {new Date().getFullYear()} Cookid. All rights
                                reserved.
                            </p>
                            <div className="flex space-x-4 md:space-x-6">
                                <Link
                                    href={route("frontend.privacy-policy")}
                                    className="font-poppins font-normal text-navy text-sm md:text-base"
                                >
                                    Privacy Policy
                                </Link>
                                <Link
                                    href={route("frontend.privacy-policy")}
                                    className="font-poppins font-normal text-navy text-sm md:text-base"
                                >
                                    Terms & Condition
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </>

    );
};

export { FrontendFooter };
