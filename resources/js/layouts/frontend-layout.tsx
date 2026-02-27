import * as React from 'react';

import { FrontendFooter } from '@/layouts/partials/frontend/footer';
import FrontendHeader from './partials/frontend/header';

interface FrontendLayoutProps {
    children: React.ReactNode;
    activePage?: string;
    subPage?: string
}

export default function FrontendLayout({ children, activePage, subPage }: FrontendLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col">
            <FrontendHeader activePage={activePage} subPage={subPage} />
            <main className="flex flex-1 flex-col">
                <div className="relative bg-cover  bg-no-repeat bg-fixed min-h-screen pb-70"
                    style={{
                        backgroundImage: "url('/assets/images/background/A334DD02-42B6-43D8-923B-330051D8F166.png')",
                    }}>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/70"></div>
                    <div className="relative text-white">
                        {children}
                    </div>
                </div>
            </main>
            <FrontendFooter />
        </div>
    );
}
