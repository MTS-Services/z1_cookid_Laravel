import * as React from 'react';
import VendorHeader from './partials/vendor/header';
import VendorSidebar from './partials/vendor/sidebar';

interface VendorLayoutProps {
  children: React.ReactNode;
  activePage?: string;
  subPage?: string;
}

export default function VendorLayout({ children }: VendorLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
      <div className="min-h-screen bg-[#0f0f0f] text-gray-200 flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        <VendorSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0">
          <VendorHeader onMenuClick={() => setSidebarOpen((v) => !v)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}