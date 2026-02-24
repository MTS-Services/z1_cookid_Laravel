import { Link } from '@inertiajs/react';
import React from 'react';
import {
    FaFacebookF,
    FaInstagram,
    FaLinkedinIn,
    FaTwitter,
} from 'react-icons/fa';

const FrontendFooter: React.FC = () => {
    return (
        <footer className="bg-bg-black-100 py-12 text-text-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    {/* Logo and Social Media */}
                    <div className="flex flex-col items-center md:items-start">
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
                                href="#"
                                className="flex items-center justify-center rounded-sm bg-bg-nevy-800 p-2"
                            >
                                <FaFacebookF size={20}></FaFacebookF>
                            </a>
                            <a
                                href="#"
                                className="flex items-center justify-center rounded-sm bg-bg-nevy-800 p-2"
                            >
                                <FaTwitter size={20}></FaTwitter>
                            </a>
                            <a
                                href="#"
                                className="flex items-center justify-center rounded-sm bg-bg-nevy-800 p-2"
                            >
                                <FaInstagram size={20}></FaInstagram>
                            </a>
                            <a
                                href="#"
                                className="flex items-center justify-center rounded-sm bg-bg-nevy-800 p-2"
                            >
                                <FaLinkedinIn size={20}></FaLinkedinIn>
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="text-center md:text-left">
                        <h3 className="relative mb-4 font-poppins text-xl font-medium">
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
                                    href="/contact"
                                    className="font-poppins font-normal text-text-white transition-colors"
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customers Links */}
                    <div className="text-center md:text-left">
                        <h3 className="relative mb-4 font-poppins text-xl font-medium">
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
                    <div className="text-center md:text-left">
                        <h3 className="relative mb-4 font-poppins text-xl font-medium">
                            Providers
                            <span className="absolute bottom-0 left-0 h-[3px] w-1/2 rounded-full bg-gradient-to-r from-blue-500 via-blue-800 to-transparent" />
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/become-provider"
                                    className="font-poppins font-normal text-text-white transition-colors"
                                >
                                    Become a Provider
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/provider-login"
                                    className="font-poppins font-normal text-text-white transition-colors"
                                >
                                    Provider Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/provider-resources"
                                    className="font-poppins font-normal text-text-white transition-colors"
                                >
                                    Resources
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="mt-12 border-t border-bg-nevy-800 pt-8">
                    <div className="flex flex-col items-center justify-between space-y-4 md:flex-row">
                        <p className="font-poppins text-text-gray">
                            &copy; {new Date().getFullYear()} Cookid. All rights
                            reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link
                                href="/privacy-policy"
                                className="font-poppins font-normal text-bg-nevy-800"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                href="/terms-of-service"
                                className="font-poppins font-normal text-bg-nevy-800"
                            >
                                Terms & Condition
                            </Link>
                            <Link
                                href="/terms-of-service"
                                className="font-poppins font-normal text-bg-nevy-800"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export { FrontendFooter };
