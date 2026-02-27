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
        <div className="min-h-screen bg-black text-gray-200 font-sans">
            {/* Top Bar / Navbar */}
            <header className="bg-gray-900 border-b border-gray-900 py-4" >
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="w-24">
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

            <div className="min-h-[calc(100vh-180px)] flex flex-col items-center justify-center p-4 relative bg-black overflow-hidden">
                <main className='flex items-center justify-center px-5 py-12'>
                    <Head title={title} />

                    <div className="mt-8 w-full">
                        {children}
                    </div>
                </main>
            </div>
            {/* Footer */}
            <footer className="bg-gray-900 border-t border-gray-900 py-4 text-center text-sm text-gray-600">
                <div className="container mx-auto px-6 flex flex-wrap items-center justify-between gap-8">

                    <div className="w-24">
                        <img src="/assets/logo/black-logo.png" alt="Logo" />
                    </div>
                    <p className="text-gray-400">all right reserved ©2026 Glossed</p>
                    <a href="/privacy" className="text-gray-400 hover:text-gray-300">
                        Privacy policies
                    </a>
                </div>
            </footer>
        </div>
    );
}