import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { X, Check, Eye } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginationData, ColumnConfig } from '@/types/data-table.types';
import { Button } from '@/components/ui/button';
import { Vendor } from '@/types';

interface Props {
    vendors: Vendor[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    tab: string;
}

const TABS = [
    { key: 'requested', label: 'Requested Vendor' },
    { key: 'all', label: 'All Vendor List' },
    { key: 'suspended', label: 'Suspended Vendor' },
] as const;

const TAB_TITLES: Record<string, string> = {
    requested: 'Requested Vendor',
    all: 'All Vendor List',
    suspended: 'Suspended Vendor',
};

export default function VendorManagementIndex({
    vendors,
    pagination,
    offset,
    filters,
    search,
    sortBy,
    sortOrder,
    tab,
}: Props) {
    const {
        isLoading,
        handleSearch,
        handleFilterChange,
        handleSort,
        handlePerPageChange,
        handlePageChange,
    } = useDataTable({
        only: ['vendors', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder', 'tab'],
    });

    const columns: ColumnConfig<Vendor>[] = [
        {
            key: 'created_at',
            label: 'Date',
            sortable: true,
            render: (vendor) => (
                <span className="text-white">
                    {new Date(vendor.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </span>
            ),
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (vendor) => (
                <span className="font-medium text-white">
                    {[vendor.first_name, vendor.last_name].filter(Boolean).join(' ') || vendor.shop_name}
                </span>
            ),
        },
        {
            key: 'location',
            label: 'Location',
            render: (vendor) => (
                <span className="text-white">
                    {[vendor.address, vendor.city, vendor.region_state].filter(Boolean).join(', ') || '—'}
                </span>
            ),
        },
        {
            key: 'phone',
            label: 'Number',
            sortable: true,
            render: (vendor) => (
                <span className="text-white">{vendor.phone || '—'}</span>
            ),
        },
        {
            key: 'actions',
            label: 'Action',
            render: (vendor) => (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Decline this vendor request?')) {
                                router.visit(route('admin.vm.vendors.reject', vendor.id), {
                                    method: 'post',
                                });
                            }
                        }}
                        className="rounded p-1.5 text-blue-600 hover:bg-blue-600/10 dark:text-blue-400 dark:hover:bg-blue-400/10"
                        aria-label="Decline"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('Approve this vendor?')) {
                                router.visit(route('admin.vm.vendors.approve', vendor.id), {
                                    method: 'post',
                                });
                            }
                        }}
                        className="rounded p-1.5 text-blue-600 hover:bg-blue-600/10 dark:text-blue-400 dark:hover:bg-blue-400/10"
                        aria-label="Approve"
                    >
                        <Check className="h-5 w-5" />
                    </button>
                    <Link href={route('admin.vm.vendors.show', vendor.id)}>
                        <Button variant="default" size="sm" className="gap-1.5">
                            <Eye className="h-4 w-4" />
                            See Details
                        </Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <AdminLayout activeSlug="vendor-management">
            <Head title={TAB_TITLES[tab] ?? 'Vendor Management'} />

            <div className="space-y-6">
                <nav className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
                    {TABS.map(({ key, label }) => (
                        <Link
                            key={key}
                            href={route('admin.vm.vendors.index', { tab: key })}
                            className={`pb-3 text-sm font-medium transition-colors ${
                                tab === key
                                    ? 'border-b-2 border-blue-600 text-blue-600'
                                    : 'text-white hover:text-gray-400'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <h1 className="text-xl font-semibold text-white">
                    {TAB_TITLES[tab] ?? 'Vendor Management'}
                </h1>

                <DataTable
                    data={vendors}
                    columns={columns}
                    pagination={pagination}
                    offset={offset}
                    showNumbering={false}
                    onSearch={handleSearch}
                    onFilterChange={handleFilterChange}
                    onSort={handleSort}
                    onPerPageChange={handlePerPageChange}
                    onPageChange={handlePageChange}
                    searchValue={search}
                    filterValues={filters}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    isLoading={isLoading}
                    emptyMessage="No vendors found"
                    searchPlaceholder="Search vendors..."
                />
            </div>
        </AdminLayout>
    );
}
