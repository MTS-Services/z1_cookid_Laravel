import AppLogo from '@/components/app-logo';
import { NavItem } from '@/components/ui/nav-item';
import { cn } from '@/lib/utils';
import { type NavItemType, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import * as React from 'react';
import { LayoutGrid, BarChart2, DollarSign, Home, List, Settings, ShoppingBag } from 'lucide-react'


// Navigation configuration
const adminNavItems: NavItemType[] = [
    {
        title: "Home",
        href: route("vendor.dashboard"),
        icon: Home,
        slug: "home",
    },
    {
        title: "Listing",
        href: route("vendor.listing"),
        icon: List,
        slug: "listing",
    },
    {
        title: "Orders",
        href: route("vendor.orders"),
        icon: ShoppingBag,
        slug: "orders",
    },
    {
        title: "Payments",
        href: route("vendor.payments"),
        icon: DollarSign,
        slug: "payments",
    },
    {
        title: "Performance",
        href: route("vendor.performance"),
        icon: BarChart2,
        slug: "performance",
    },
    {
        title: "Account",
        href: route("vendor.account"),
        icon: Settings,
        slug: "account",
    },
];

interface VendorSidebarProps {
    isCollapsed: boolean;
    activeSlug?: string;
}

export const VendorSidebar = React.memo<VendorSidebarProps>(
    ({ isCollapsed, activeSlug }) => {
        const { props } = usePage();

        // Extract permissions safely
        const userPermissions = React.useMemo(() => {
            const auth = props.auth as SharedData['auth'];

            return (
                auth?.user?.permissions ||
                auth?.user?.all_permissions ||
                []
            );
        }, [props.auth]);

        return (
            <aside
                className={cn(
                    'bg-bg-black relative hidden h-screen border-r border-text-border',
                    'transition-all duration-300 ease-in-out',
                    'flex-col md:flex',
                    isCollapsed ? 'w-16' : 'w-64',
                )}
            >
                {/* Logo Section */}
                <div
                    className={cn(
                        'flex p-2 items-center border-b border-text-border',
                        isCollapsed ? 'justify-center px-2' : 'px-6',
                    )}
                >
                    <Link
                        href="/"
                        className="flex items-center gap-2 transition-opacity hover:opacity-80"
                    >
                        {isCollapsed ? (
                            <LayoutGrid className="h-6 w-6 text-white" />
                        ) : (
                            <AppLogo className="text-base!" />
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <div className="custom-scrollbar flex-1 overflow-y-auto px-3 py-4">
                    <nav className="space-y-1">
                        {adminNavItems.map((item, index) => {
                            const isParentActive =
                                activeSlug === item.slug;

                            const isChildActive = item.children?.some(
                                (child) => child.slug === activeSlug
                            );

                            return (
                                <NavItem
                                    key={`${item.title}-${index}`}
                                    item={item}
                                    isCollapsed={isCollapsed}
                                    activeSlug={activeSlug}
                                    isActive={isParentActive || isChildActive}
                                    permissions={userPermissions}
                                />
                            );
                        })}
                    </nav>
                </div>
            </aside>
        );
    },
);

VendorSidebar.displayName = 'VendorSidebar';
