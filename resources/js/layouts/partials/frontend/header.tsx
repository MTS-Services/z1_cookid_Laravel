import { Link } from '@inertiajs/react';
import { Heart, User } from 'lucide-react';
import React from 'react';

interface Props {
  activePage?: string;
  subPage?: string;
}

function FrontendHeader({ activePage, subPage }: Props) {
  const linkClass = (routeName: string) =>
    `text-lg transition-colors ${route().current(routeName)
      ? 'text-blue-600 font-semibold'
      : 'text-gray-300 hover:text-white'
    }`;

  return (
    <header className="bg-gray-900 border-b border-gray-800 py-4">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <div className="w-24">
          <img src="/assets/logo/black-logo.png" alt="Logo" />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href={route('frontend.home')}
            className={linkClass('frontend.home')}
          >
            Home
          </Link>

          <Link
            href={route('frontend.services')}
            className={linkClass('frontend.services')}
          >
            Service
          </Link>

          <Link
            href="#"
            className={`text-lg transition-colors ${route().current('categories*')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-300 hover:text-white'
              }`}
          >
            Categories
          </Link>

          <Link
            href="#"
            className={`text-lg transition-colors ${route().current('how-it-works*')
                ? 'text-blue-600 font-semibold'
                : 'text-gray-300 hover:text-white'
              }`}
          >
            How It Works
          </Link>
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-5">
          <button className="text-gray-300 hover:text-white">
            <Heart size={20} />
          </button>

          <Link
            href={route('user.auth.login')}
            className="text-gray-300 hover:text-white"
          >
            <User size={20} />
          </Link>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-lg font-medium transition-colors">
            Become a Provider
          </button>
        </div>
      </div>
    </header>
  );
}

export default FrontendHeader;