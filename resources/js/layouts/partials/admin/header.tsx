import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useInitials } from '@/hooks/use-initials';
import { type BreadcrumbItem, type SharedData, type NavItemType } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronsLeft, ChevronsRight, Search, BellIcon, ChevronDown } from 'lucide-react';
import * as React from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuList, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { cn, toUrl } from '@/lib/utils';
import { Icon } from '@/components/icon';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { useActiveUrl } from '@/hooks/use-active-url';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { Separator } from '@radix-ui/react-separator';
import { AdminMenuContent } from '@/components/admin-menu-content';

interface AdminHeaderProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AdminHeader({ isCollapsed, setIsCollapsed }: AdminHeaderProps) {
    const { auth } = usePage<SharedData>().props;
    const adminAvatarSrc = auth.admin?.image_url || '/user.png';
    const getInitials = useInitials();
    const page = usePage<SharedData>();
    const { urlIsActive } = useActiveUrl();


    return (
        <header className="bg-bg-black flex h-24.5 shrink-0 items-center gap-2 border-b border-text-border px-6 transition-all ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
            >
                {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </Button>

            <div className="ml-auto flex items-center space-x-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-secondary hover:text-white"
                    aria-label="Notifications"
                >
                    <BellIcon size={16} className="w-6 h-6" />
                </Button>
                <Separator orientation="vertical" className="hidden h-6 bg-white! sm:block" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div
                            className="group flex items-center gap-3 rounded-full bg-transparent px-1.5 py-1 text-left hover:bg-transparent"
                        >
                            <Avatar className="size-14 overflow-hidden rounded border border-neutral-800">
                                <AvatarImage
                                    src={adminAvatarSrc}
                                    alt={auth.admin.first_name + ' ' + auth.admin.last_name || 'Admin avatar'}
                                />
                                <AvatarFallback className="rounded-full bg-neutral-700 text-xl font-semibold text-white">
                                    {getInitials(auth.admin.first_name + ' ' + auth.admin.last_name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="hidden min-w-30 flex-col text-left text-white sm:flex">
                                <span className="text-base font-semibold leading-tight">{auth.admin.first_name + ' ' + auth.admin.last_name}</span>
                                <span className="text-xs text-neutral-400">Admin</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-neutral-500 transition group-hover:text-white" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <AdminMenuContent admin={auth.admin} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

        </header>
    );
}