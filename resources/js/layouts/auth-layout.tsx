import { Head, Link } from '@inertiajs/react';
import * as React from 'react';

import AppLogo from '@/components/app-logo';
import { login } from '@/routes';
import { Heart, User } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    description: string;
    showHeader?: boolean;
    showFooter?: boolean;
}

export default function AuthLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0f0f0f] text-gray-200 font-sans">
            {/* Top Bar / Navbar */}
            <header className="bg-black border-b border-gray-800 py-3" >
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <img src="/assets/logo/black-logo.png" alt="Logo" />
                    </div>

                    <nav className="hidden md:flex items-center gap-8">
                        <a href="/" className="text-gray-300 hover:text-white text-sm transition-colors">
                            Home
                        </a>
                        <a href="/service" className="text-gray-300 hover:text-white text-sm transition-colors">
                            Service
                        </a>
                        <a href="/categories" className="text-gray-300 hover:text-white text-sm transition-colors">
                            Categories
                        </a>
                        <a href="/how-it-works" className="text-gray-300 hover:text-white text-sm transition-colors">
                            How It Works
                        </a>
                    </nav>

                    <div className="flex items-center gap-5">
                        <button className="text-gray-300 hover:text-white">
                            <Heart size={20} />
                        </button>
                        <button className="text-gray-300 hover:text-white">
                            <User size={20} />
                        </button>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors">
                            Become a Provider
                        </button>
                    </div>
                </div>
            </header>

            <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center p-4 relative bg-background overflow-hidden">
                <main className='flex items-center justify-center px-5 py-12'>
                    <Head title={title} />

                    <div className="mt-8 w-full">
                        {children}
                    </div>
                </main>
            </div>
            {/* Footer */}
            <footer className="bg-black border-t border-gray-800 py-6 text-center text-sm text-gray-600">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8">

                    <div className="flex items-center gap-2">
                        <img src="/assets/logo/black-logo.png" alt="Logo" />
                        <p>all right reserved ©2026 Glossed</p>
                    </div>
                    <a href="/privacy" className="text-blue-500 hover:text-blue-400 hover:underline">
                        Privacy policies
                    </a>
                </div>
            </footer>
        </div>
    );
}