import { Link } from '@inertiajs/react';
import React from 'react';

const FrontendFooter: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-bold">Cookid</h3>
                        <p className="text-gray-400">Your culinary journey starts here.</p>
                    </div>
                    <div className="flex space-x-6">
                        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        &copy; {new Date().getFullYear()} Cookid. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export { FrontendFooter };
