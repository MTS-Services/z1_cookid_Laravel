import * as React from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { useEffect } from 'react';
import { VendorSidebar } from './partials/vendor/sidebar';
import VendorHeader from './partials/vendor/header';

interface VendorLayoutProps {
  children: React.ReactNode;
  activeSlug?: string | null;
}

export default function VendorLayout({ children, activeSlug }: VendorLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(() => {
    // Persist sidebar state in localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vendor-sidebar-collapsed');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  const { appearance, updateAppearance } = useAppearance();
  useEffect(() => {
    if (appearance !== 'light') {
      updateAppearance('light');
    }
  }, [appearance, updateAppearance]);

  // Save sidebar state to localStorage
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('vendor-sidebar-collapsed', JSON.stringify(isCollapsed));
    }
  }, [isCollapsed]);

  return (
    <>
      <div className="relative flex h-full min-h-screen max-h-screen bg-bg-black">
        <VendorSidebar isCollapsed={isCollapsed} activeSlug={activeSlug} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <VendorHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 text-white bg-dark-gray">
            {children}
          </main>

        </div>
      </div>
    </>
  );
}