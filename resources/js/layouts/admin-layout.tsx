import * as React from 'react';
import { AdminSidebar } from '@/layouts/partials/admin/sidebar';
import { AdminHeader } from '@/layouts/partials/admin/header';
import { AdminFooter } from './partials/admin/footer';
import { RealtimeNotificationListener } from '@/components/realtime-notification-listener';
import { useAppearance } from '@/hooks/use-appearance';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import type { SharedData } from '@/types';

interface AdminLayoutProps {
    children: React.ReactNode;
    activeSlug?: string | null;
}

export default function AdminLayout({ children, activeSlug }: AdminLayoutProps) {
    const { auth } = usePage<SharedData>().props;
    const adminId = auth.admin?.id;
    const notificationChannel = adminId != null ? `App.Models.Admin.${adminId}` : null;

    const [isCollapsed, setIsCollapsed] = React.useState(() => {
        // Persist sidebar state in localStorage
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('admin-sidebar-collapsed');
            return saved ? JSON.parse(saved) : false;
        }
        return false;
    });

    const { appearance, updateAppearance } = useAppearance();
    useEffect(() => {
        if (appearance !== 'light') {
            updateAppearance('light');
        }
    }, [appearance, updateAppearance]);

    // Save sidebar state to localStorage
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(isCollapsed));
        }
    }, [isCollapsed]);

    return (
        <>
            {notificationChannel && (
                <RealtimeNotificationListener channelName={notificationChannel} />
            )}
            <div className="relative flex h-full min-h-screen max-h-screen bg-bg-black">
                <AdminSidebar isCollapsed={isCollapsed} activeSlug={activeSlug} />
                <div className="flex flex-1 flex-col overflow-hidden">
                    <AdminHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                    <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6 text-white bg-dark-gray">
                        {children}
                    </main>

                </div>
            </div>
        </>
    );
}