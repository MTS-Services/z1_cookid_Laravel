import React, { useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone, MapPin, ShieldCheck, Search, Check, X } from 'lucide-react';

import AdminLayout from '@/layouts/admin-layout';
import { ActionButton } from '@/components/ui/action-button';
import { Vendor } from '@/types';

interface Props {
    vendor: Vendor & {
        avatar_url?: string | null;
        government_id_path?: string | string[] | null;
        status_label?: string | null;
    };
}

export default function VendorShow({ vendor }: Props) {
    const fullName = [vendor.first_name, vendor.last_name].filter(Boolean).join(' ') || vendor.shop_name;
    const locationText = [vendor.address, vendor.city, vendor.region_state].filter(Boolean).join(', ') || '—';

    const governmentIdImages = useMemo(() => {
        if (Array.isArray(vendor.government_id_path)) {
            return vendor.government_id_path.filter(Boolean) as string[];
        }
        return typeof vendor.government_id_path === 'string' ? [vendor.government_id_path] : [];
    }, [vendor.government_id_path]);

    const orders = Array(9).fill({
        id: '#6548-225568',
        service: 'Elite Auto Spa',
        vendor: 'Maktech Store',
        price: '$100.00',
        commission: '$07.00',
        earning: '$93.00'
    });

    return (
        <AdminLayout activeSlug="vendor-management">
            <Head title={`Vendor Details - ${vendor.shop_name}`} />

            <div className="min-h-screen bg-[#0a0a0a] text-white">
                {/* Header Section */}
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-2xl font-medium text-white">Vendor Details</h1>
                    <ActionButton href={route('admin.vm.vendors.index')} IconNode={ArrowLeft}>
                        Back to Vendors
                    </ActionButton>
                </div>

                {/* Profile Section (Matching image_8eb5fb.png) */}
                <section className="mb-12">
                    <div className="flex flex-col gap-6 md:flex-row md:items-start">
                        <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/5">
                            <img
                                src={vendor.avatar_url ?? '/user.png'}
                                alt="Shop Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">{vendor.shop_name ?? 'Maktech Store'}</h2>
                            <p className="text-slate-400">{vendor.email ?? 'albertflores@gmail.com'}</p>
                            <p className="text-slate-400">{vendor.phone ?? '(302) 555-0107'}</p>
                            <p className="text-xs text-slate-500 max-w-xs">{locationText}</p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-xl font-semibold mb-6">Government Issued ID</h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {governmentIdImages.length > 0 ? governmentIdImages.map((img, i) => (
                                <div key={i} className="flex aspect-video items-center justify-center rounded-xl bg-[#e5e7eb]/10 p-8 shadow-inner">
                                    <img src={img || 'no-image.png'} alt="ID Document" className="max-h-full rounded-lg shadow-2xl" />
                                </div>
                            )) : (
                                <>
                                    <div className="flex aspect-video items-center justify-center rounded-xl bg-[#e5e7eb] p-10">
                                        <div className="text-center text-gray-400">ID Image Front</div>
                                    </div>
                                    <div className="flex aspect-video items-center justify-center rounded-xl bg-[#dcd7cc] p-10">
                                        <div className="text-center text-gray-400">ID Image Back</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}