import * as React from 'react';
import VendorHeader from './partials/vendor/header';
import VendorSidebar from './partials/vendor/sidebar';


interface VendorLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  subPage?: string
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  return (
    <>
      <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex">
        {/* Left Sidebar */}
        <VendorSidebar/>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Top Bar */}
          <VendorHeader/>

          {/* Notifications List */}
          <main className="flex-1 overflow-y-auto p-6">
              {children}
          </main>
        </div>
      </div>
    </>
  );
}
