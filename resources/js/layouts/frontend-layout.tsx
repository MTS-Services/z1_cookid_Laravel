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
            <FrontendHeader activePage={activePage} subPage={subPage}/>
            <main className="flex flex-1 flex-col">{children}</main>
            <FrontendFooter />
        </div>
    );
}
