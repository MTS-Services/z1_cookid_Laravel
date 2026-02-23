import { Link } from '@inertiajs/react';
import React from 'react';

interface Props {
  activePage?: string;
  subPage?: string
}

function FrontendHeader({ activePage, subPage }: Props) {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              Cookid
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`text-muted-foreground hover:text-secondary font-medium transition-colors ${
                activePage === 'home' ? 'text-secondary' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/privacy-policy"
              className={`text-muted-foreground hover:text-secondary font-medium transition-colors ${
                activePage === 'privacy-policy' ? 'text-secondary' : ''
              }`}
            >
              Privacy Policy
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-muted-foreground hover:text-secondary">
              Menu
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default FrontendHeader;