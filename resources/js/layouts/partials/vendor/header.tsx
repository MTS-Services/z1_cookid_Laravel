import { Button } from '@/components/ui/button';
import { Link, router, usePage } from '@inertiajs/react';
import { Bell, ChevronDown, ChevronsLeft, ChevronsRight } from 'lucide-react';
import React from 'react';
import type { SharedData } from '@/types';

interface VendorHeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

function VendorHeader({ isCollapsed, setIsCollapsed }: VendorHeaderProps) {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const { auth, vendorNotifications } = usePage<SharedData & {
    vendorNotifications?: {
      unreadCount: number;
    };
  }>().props;

  const vendor = auth.vendor;
  const unreadCount = vendorNotifications?.unreadCount ?? 0;
  const displayCount = unreadCount > 9 ? '9+' : unreadCount.toString();

  return (
    <header className="bg-black border-b border-text-border py-4 flex items-center px-6 justify-between">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
      </Button>

      <div className="flex items-center gap-6">
        <Link href={route('vendor.notification')} className="relative text-gray-300 hover:text-white">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {displayCount}
            </span>
          )}
        </Link>

        <div className="relative text-white">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-500 rounded-sm flex items-center justify-center text-black font-bold">
              {vendor?.image_url ? (
                <img src={vendor.image_url} alt="user" className="h-full w-full rounded-sm object-cover" />
              ) : (
                <span>{vendor?.first_name?.charAt(0).toUpperCase() ?? 'U'}</span>
              )}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">
                {vendor ? `${vendor.first_name} ${vendor.last_name}` : 'Vendor'}
              </p>
              <p className="text-xs text-gray-500">Seller</p>
            </div>
            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white border border-gray-700 rounded-lg shadow-xl py-2 z-50">
              {/* <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Profile</a> */}
              <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Settings</a>
              <button onClick={() => router.post(route('vendor.logout'))} className="block px-4 py-2 text-sm hover:bg-gray-800 w-full text-left text-white">Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default VendorHeader;