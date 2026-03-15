import AppLogo from '@/components/app-logo';
import { NavItem } from '@/components/ui/nav-item';
import { cn } from '@/lib/utils';
import { type NavItemType, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import * as React from 'react';
import {
    Home,
    Building2,
    Boxes,
    Users,
    ClipboardList,
    DollarSign,
    Percent,
    Settings,
    LayoutGrid,
} from "lucide-react";

// Navigation configuration
const adminNavItems: NavItemType[] = [
    {
        title: "Home",
        href: route("admin.dashboard"),
        icon: Home,
        slug: "home",
    },
    {
        title: "Vendor Management",
        href: route("admin.vm.vendors.index"),
        icon: Building2,
        slug: "vendor-management",
    },
    {
        title: "Service Management",
        href: route("admin.sm.services.index"),
        icon: Boxes,
        slug: "service-management",
    },
    {
        title: "Customers",
        href: route("admin.cm.customers.index"),
        icon: Users,
        slug: "customers",
    },
    {
        title: "Orders",
        href: route("admin.om.orders.index"),
        icon: ClipboardList,
        slug: "orders",
    },
    {
        title: "Finance Management",
        href: route('admin.fm.index'),
        icon: DollarSign,
        slug: "finance-management",
        children: [
            {
                title: "Finances",
                href: route('admin.fm.index'),
                icon: DollarSign,
                slug: "finances",
            },
            {
                title: "Withdrawals",
                href: route('admin.fm.withdrawals.index'),
                icon: DollarSign,
                slug: "withdrawals",
            },
        ],
    },
    {
        title: "Commission",
        href: route('admin.commission'),
        icon: Percent,
        slug: "commission",
    },
    {
        title: "Settings",
        href: route('admin.profile.index'),
        icon: Settings,
        slug: "settings",
    },
];

interface AdminSidebarProps {
    isCollapsed: boolean;
    activeSlug?: string;
}

export const AdminSidebar = React.memo<AdminSidebarProps>(
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

                {/* Footer */}
                {/* {!isCollapsed && (
                    <div className="border-t p-4">
                        <div className="text-center text-xs text-muted-foreground">
                            v1.0.0
                        </div>
                    </div>
                )} */}
            </aside>
        );
    },
);

AdminSidebar.displayName = 'AdminSidebar';
