import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar() {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState(false);
    const { auth } = usePage<SharedData>().props;
    const [userType, setUserType] = useState(auth.user.user_type);

    // const logout = () => {
    //     router.post(route('user.logout'));
    // };

    const NavItem = ({
        href,
        label,
        onClick,
    }: {
        href?: string;
        label: string;
        onClick?: () => void;
    }) => (
        <Link
            href={href || '#'}
            onClick={onClick}
            className={cn(
                'flex items-center rounded-lg px-4 py-3 font-semibold text-white transition',
                url === href ? 'bg-secondary' : 'bg-primary hover:bg-secondary',
            )}
        >
            {label}
        </Link>
    );
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const confirmLogout = () => {
        router.post(route('user.logout'));
    };

    return (
        <div className="relative z-50">
            {/* Mobile toggle */}
            <div className="flex items-center gap-4 md:hidden">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="rounded-lg bg-primary p-2 text-white shadow-lg md:hidden"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <h4 className="text-lg font-semibold text-primary">
                    Dashboard
                </h4>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/50 md:hidden"
                />
            )}

            <aside
                className={cn(
                    'fixed top-0 left-0 z-50 h-full w-72 bg-white transition-transform duration-300 md:relative md:translate-x-0 md:bg-transparent',
                    isOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Mobile Close Button */}
                <div className="flex items-center justify-between p-4 md:hidden">
                    <span className="text-lg font-semibold text-primary">
                        Menu
                    </span>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-md p-2 text-primary hover:bg-gray-100"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="space-y-2 p-4 pt-0">

                    {/* <NavItem href='/account/edit-listing-home' label="Edit Listing (Homes)" /> */}
                    {userType == 'both' || userType == 'realtor' ? (
                        <>
                            {/* Homes */}
                            <NavItem
                                href="/account/listings-homes"
                                label="Listings (Homes)"
                            />
                            <NavItem
                                href="/account/add-listing-home"
                                label="Add New Listing (Homes)"
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    {userType == 'both' || userType == 'property_owner' ? (
                        <>
                            {/* Rental */}
                            <NavItem
                                href="/account/listings-rentals"
                                label="Listings (Rental)"
                            />
                            <NavItem
                                href="/account/add-listing-rental"
                                label="Add New Listing "
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    {/* Account */}
                    <NavItem
                        href="/account/account-settings"
                        label="Account Settings"
                    />

                    <NavItem
                        href="/account/license-verification-status"
                        label="License Verification Status"
                    />

                    {/* Logout */}
                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full cursor-pointer rounded-lg bg-primary px-4 py-3 text-left font-semibold text-white transition hover:bg-secondary"
                    >
                        Log Out
                    </button>
                </nav>
            </aside>
            {/* Logout Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
                    <div className="w-[92%] max-w-sm scale-100 transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-all">
                        {/* Top Icon / Header Section */}
                        <div className="mb-4 flex flex-col items-center text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                                <svg
                                    className="h-7 w-7 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                Confirm Logout
                            </h2>
                            <p className="mt-2 text-sm leading-relaxed text-gray-500">
                                Are you sure you want to sign out of your
                                account? You’ll need to login again to access
                                your data.
                            </p>
                        </div>

                        {/* Buttons Section */}
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 cursor-pointer rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-95"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 cursor-pointer rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-secondary active:scale-95"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
