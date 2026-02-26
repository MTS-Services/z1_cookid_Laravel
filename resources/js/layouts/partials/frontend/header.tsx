import { Link } from '@inertiajs/react';
import { Heart, User } from 'lucide-react';
import React from 'react';

interface Props {
  activePage?: string;
  subPage?: string
}

function FrontendHeader({ activePage, subPage }: Props) {
  return (
    <header className="bg-gray-900 border-b border-gray-900 py-4" >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="w-24">
          <img src="/assets/logo/black-logo.png" alt="Logo" />
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <Link href={route('frontend.home')} className="text-gray-300 hover:text-white text-sm transition-colors">
            Home
          </Link>
          <Link href={route('frontend.services')} className="text-gray-300 hover:text-white text-sm transition-colors">
            Service
          </Link>
          <Link href="/categories" className="text-gray-300 hover:text-white text-sm transition-colors">
            Categories
          </Link>
          <Link href="/how-it-works" className="text-gray-300 hover:text-white text-sm transition-colors">
            How It Works
          </Link>
        </nav>

        <div className="flex items-center gap-5">
          <button className="text-gray-300 hover:text-white">
            <Heart size={20} />
          </button>
          <Link href={route('user.auth.login')} className="text-gray-300 hover:text-white">
            <User size={20} />
          </Link>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors">
            Become a Provider
          </button>
        </div>
      </div>
    </header>
  );
}

export default FrontendHeader;