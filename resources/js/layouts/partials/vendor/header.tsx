import { Link } from '@inertiajs/react';
import { Bell, ChevronDown } from 'lucide-react';
import React from 'react';

interface Props {
  activePage?: string;
  subPage?: string
}

function VendorHeader({ activePage, subPage }: Props) {
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);

  return (
    <header className="bg-black border-b border-gray-800 h-16 flex items-center px-6 justify-between">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Notifications</h1>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-300 hover:text-white">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            0
          </span>
        </button>

        <div className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
          >
            <div className="w-9 h-9 bg-yellow-500 rounded-full flex items-center justify-center text-black font-bold">
              B {/* Placeholder for Brayden avatar */}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">Brayden</p>
              <p className="text-xs text-gray-500">Seller</p>
            </div>
            <ChevronDown size={16} />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2 z-50">
              <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Profile</a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Settings</a>
              <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-800">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default VendorHeader;