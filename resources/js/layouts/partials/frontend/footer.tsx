import { Link } from '@inertiajs/react';
import React from 'react';
import {FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';

const SOCIAL_ICONS = [
    { Icon: FaFacebookF, href: '#' },
    { Icon: FaTwitter, href: '#' },
    { Icon: FaInstagram, href: '#' },
    { Icon: FaLinkedinIn, href: '#' },
];

const FrontendFooter: React.FC = () => {
    return (
       <footer className="bg-black text-white">
       
                   {/* ───────── CTA BOX ───────── */}
                   <div className="max-w-6xl mx-auto px-6 pt-24 z-10 -mb-8 relative">
                       <div className="rounded-2xl bg-gradient-to-br from-[#0b1530] to-[#0a1225] px-10 py-16 text-center shadow-2xl">
                           <h2 className="text-3xl md:text-4xl font-semibold mb-3">
                               Grow Your Car Service Business
                           </h2>
                           <p className="text-gray-400 max-w-xl mx-auto mb-8">
                               Join our platform and get more customers in your area.
                           </p>
                           <Link
                               href="/provider/register"
                               className="inline-block bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-md font-medium"
                           >
                               Become a Provider
                           </Link>
                       </div>
                   </div>
       
                   {/* ───────── FOOTER CONTENT ───────── */}
                   <div className="bg-gray-800">
                     <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
       
                       {/* Brand */}
                       <div>
                           <div className="flex items-center gap-3 mb-6">
                               <div className="w-14 h-14 rounded-full border-2 border-white flex items-center justify-center italic font-serif text-lg">
                                   Glossed
                               </div>
                           </div>
       
                           <div className="flex gap-4">
                             {SOCIAL_ICONS.map(({ Icon, href }, index) => (
                                 <a
                                     key={index}
                                     href={href}
                                     className="w-10 h-10 bg-blue-600 rounded-md flex items-center justify-center
                                               hover:bg-blue-700 transition"
                                     aria-label="Social link"
                                 >
                                     <Icon size={20} />
                                 </a>
                             ))}
                         </div>
                       </div>
       
                       {/* Company */}
                       <div>
                           <h4 className="font-semibold mb-4 border-b border-gray-600 inline-block pb-1">
                               Company
                           </h4>
                           <ul className="space-y-3 text-gray-200">
                               <li><Link href="/about">About</Link></li>
                               <li><Link href="/contact">Contact</Link></li>
                           </ul>
                       </div>
       
                       {/* Customers */}
                       <div>
                           <h4 className="font-semibold mb-4 border-b border-gray-600 inline-block pb-1">
                               Customers
                           </h4>
                           <ul className="space-y-3 text-gray-200">
                               <li><Link href="/services">Find Services</Link></li>
                               <li><Link href="/categories">Categories</Link></li>
                               <li><Link href="/how-it-works">How It Works</Link></li>
                           </ul>
                       </div>
       
                       {/* Account */}
                       <div>
                           <h4 className="font-semibold mb-4 border-b border-gray-600 inline-block pb-1">
                               My Account
                           </h4>
                           <ul className="space-y-3 text-gray-200">
                               <li>
                                   <Link href="/login" className="flex items-center gap-2 text-blue-500">
                                       Sign In →
                                   </Link>
                               </li>
                               <li><Link href="/orders">Orders</Link></li>
                               <li><Link href="/wishlist">Wishlist</Link></li>
                               <li><Link href="/order-history">Order History</Link></li>
                           </ul>
                       </div>
                   </div>
       
                   {/* ───────── FOOTER BOTTOM ───────── */}
                   <div className="border-t border-gray-800">
                       <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-200">
                           <span>Copyright © 2026. Glossed. All rights reserved</span>
       
                           <div className="flex gap-6">
                               <Link href="/privacy-policy">Privacy Policy</Link>
                               <Link href="/terms">Terms & Condition</Link>
                               <Link href="/cookies">Cookie Policy</Link>
                           </div>
                       </div>
                   </div>
                   </div>
       
               </footer>
    );
};

export { FrontendFooter };
