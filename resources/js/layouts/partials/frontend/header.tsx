import { useState } from "react";
import { Heart, User, Menu, X } from "lucide-react";
import {
  FaTwitter,
  FaFacebookF,
  FaPinterestP,
  FaInstagram,
  FaYoutube,
  FaRedditAlien,
} from "react-icons/fa";
import { Link } from "@inertiajs/react";

interface Props {
  activePage?: string;
  subPage?: string;
}

function FrontendHeader({ activePage, subPage }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (routeName: string) =>
    `block py-2 text-lg transition-colors ${route().current(routeName)
      ? "text-blue-500 font-semibold"
      : "text-gray-300 hover:text-white"
    }`;

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="bg-black text-gray-300 text-sm">
        <div className="container mx-auto px-6 py-3 flex flex-col justify-start items-start md:flex-row md:items-center md:justify-between gap-2">
          <div className="text-center md:text-left">
            Welcome to Glossed eCommerce store.
          </div>

          <div className="flex items-center justify-center md:justify-end gap-4">
            <span className="hidden md:inline">Follow us:</span>

            <a href={"https://x.com/glossedbooking?s=21"} target="_blank" className="hover:text-white">
              <FaTwitter size={14} />
            </a>
            <a href={"https://www.facebook.com/share/p/1ArbKDvNrq/"} target="_blank" className="hover:text-white">
              <FaFacebookF size={14} />
            </a>
            {/* <Link href="#" className="hover:text-white">
              <FaPinterestP size={14} />
            </Link>
            <Link href="#" className="hover:text-white">
              <FaRedditAlien size={14} />
            </Link> */}
            <a href={"https://www.youtube.com/channel/UCdsmPvh1P00ur9N7JgAACDw"} target="_blank" className="hover:text-white">
              <FaYoutube size={14} />
            </a>
            <a href="https://www.instagram.com/glossedbooking?igsh=MXMwM20zbXNodGVzYw%3D%3D&utm_source=qr" target="_blank" className="hover:text-white">
              <FaInstagram size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header className="bg-gray-900 border-b border-gray-800 relative">
        <div className="container mx-auto px-6 py-2 md:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href={route("frontend.home")}>
            <div className="w-16 md:w-24">
              <img src="/assets/logo/black-logo.png" alt="Logo" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href={route("frontend.home")} className={linkClass("frontend.home")}>
              Home
            </Link>

            <Link href={route("frontend.services")} className={linkClass("frontend.services")}>
              Service
            </Link>

            <Link href={route("frontend.categories")} className={linkClass("frontend.categories")}>
              Categories
            </Link>

            <Link href={route("frontend.how-it-works")} className={linkClass("frontend.how-it-works")}>
              How It Works
            </Link>
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-5">
            <Link href="#" className="text-gray-300 hover:text-white">
              <Heart size={20} />
            </Link>

            <Link href={route("user.auth.login")} className="text-gray-300 hover:text-white">
              <User size={20} />
            </Link>

            <Link
              href={route("user.auth.register")}
              className="bg-navy hover:bg-navy/80 text-white px-5 py-3 rounded-md text-sm font-medium"
            >
              Become a Provider
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {mobileOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* ================= MOBILE DROPDOWN ================= */}
        {mobileOpen && (
          <div className="md:hidden bg-gray-900 border-t border-gray-800 px-6 py-6 space-y-4">

            <Link href={route("frontend.home")} className={linkClass("frontend.home")}>
              Home
            </Link>

            <Link href={route("frontend.services")} className={linkClass("frontend.services")}>
              Service
            </Link>

            <Link href={route("frontend.categories")} className={linkClass("frontend.categories")}>
              Categories
            </Link>

            <Link href={route("frontend.how-it-works")} className={linkClass("frontend.how-it-works")}>
              How It Works
            </Link>

            <div className="border-t border-gray-800 pt-4 flex items-center gap-6">
              <Link href="#" className="text-gray-300 hover:text-white flex items-center gap-2">
                <Heart size={18} />
                Wishlist
              </Link>

              <Link
                href={route("user.auth.login")}
                className="text-gray-300 hover:text-white flex items-center gap-2"
              >
                <User size={18} />
                Login
              </Link>
            </div>

            <Link
              href={route("user.auth.register")}
              className="block bg-navy hover:bg-navy/80 text-white px-5 py-2 rounded-md text-center text-sm font-medium"
            >
              Become a Provider
            </Link>
          </div>
        )}
      </header>
    </>
  );
}

export default FrontendHeader;