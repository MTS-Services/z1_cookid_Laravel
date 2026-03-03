import React from 'react';
import { Head } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { ActionButton } from '@/components/ui/action-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Vendor } from '@/types';

interface Props {
    vendor: Vendor;
}

export default function VendorShow({ vendor }: Props) {
    const fullName = [vendor.first_name, vendor.last_name].filter(Boolean).join(' ') || vendor.shop_name;
    const location = [vendor.address, vendor.city, vendor.region_state, vendor.zip_code]
        .filter(Boolean)
        .join(', ') || '—';

    return (
        <AdminLayout activeSlug="vendor-management">
            <Head title={`Vendor: ${fullName}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                        Vendor Details
                    </h1>
                    <ActionButton href={route('admin.vm.vendors.index')} IconNode={ArrowLeft}>
                        Back to Vendors
                    </ActionButton>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Name</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">{fullName}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Shop Name</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">{vendor.shop_name ?? '—'}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Email</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">{vendor.email}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Phone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">{vendor.phone ?? '—'}</p>
                        </CardContent>
                    </Card>
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-white">{location}</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
