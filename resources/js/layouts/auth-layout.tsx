import { Head, Link } from '@inertiajs/react';
import * as React from 'react';

import AuthHeader from './partials/auth/header';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    showHeader?: boolean;
    showFooter?: boolean;
}

export default function AuthLayout({
    children,
    title,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-black text-gray-200 font-sans">
            <AuthHeader />
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
                    <Link href={route("frontend.privacy-policy")} className="text-gray-400 hover:text-gray-300">
                        Privacy policies
                    </Link>
                </div>
            </footer>
        </div>
    );
}