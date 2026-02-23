import { Link } from '@inertiajs/react';
import { LogOut } from 'lucide-react';

import {
    DropdownMenuItem,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { Admin } from '@/types';
import { AdminInfo } from './admin-info';

interface AdminMenuContentProps {
    admin: Admin;
}

export function AdminMenuContent({ admin }: AdminMenuContentProps) {
    const cleanup = useMobileNavigation();

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <AdminInfo admin={admin} showRole={true} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full cursor-pointer"
                    href="/admin/logout"
                    method="post"
                    as="button"
                    onBefore={cleanup}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    Log out
                </Link>
            </DropdownMenuItem>
        </>
    );
}