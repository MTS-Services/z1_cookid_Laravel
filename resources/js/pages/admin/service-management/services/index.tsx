import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Check, X } from 'lucide-react';

import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import type { PaginationData, ColumnConfig, FilterConfig } from '@/types/data-table.types';
import { Button } from '@/components/ui/button';

type ServiceStatus = 'active' | 'inactive';

interface Vendor {
    id: number;
    shop_name: string;
}

interface Service extends Record<string, unknown> {
    id: number;
    title: string;
    slug: string;
    location: string;
    price: number;
    status: ServiceStatus | string;
    image_url?: string | null;
    created_at?: string;
    vendor?: Vendor;
}

interface Props {
    services: Service[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    tab: string;
}

const statusLabel: Record<ServiceStatus, string> = {
    active: 'Active',
    inactive: 'Inactive',
};

const statusClassName: Record<ServiceStatus, string> = {
    active: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    inactive: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
};

const TABS = [
    { key: 'inactive', label: 'Requested Services' },
    { key: 'all', label: 'All Services List' },
    { key: 'active', label: 'Active Services List' },
] as const;

const TAB_TITLES: Record<string, string> = {
    all: 'All Services List',
    active: 'Active Services List',
    inactive: 'Requested Services',
};

export default function ServiceManagementIndex({
    services,
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
        only: ['services', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder', 'tab'],
    });

    const columns: ColumnConfig<Service>[] = [
        {
            key: 'title',
            label: 'Service Name',
            sortable: true,
            render: (service) => (
                <span className="font-medium text-gray-100">{service.title}</span>
            ),
        },
        {
            key: 'location',
            label: 'Location',
            sortable: true,
            render: (service) => (
                <span className="text-gray-300">{service.location ?? '—'}</span>
            ),
        },
        {
            key: 'price',
            label: 'Amount',
            sortable: true,
            render: (service) => <span className="text-gray-100">${service.price}</span>,
        },
        {
            key: 'vendor',
            label: 'Vendor',
            render: (service) => (
                <span className="text-gray-300">
                    {service.vendor?.shop_name ?? '—'}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (service) => {
                const key = (service.status as ServiceStatus) || 'inactive';
                const label = statusLabel[key] ?? service.status;
                const classes = statusClassName[key] ?? 'bg-white/5 text-white border-white/10';

                return (
                    <span
                        className={[
                            'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
                            classes,
                        ].join(' ')}
                    >
                        {label}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (service) => (
                <div className="flex justify-end gap-2">
                    {service.status === 'inactive' && (
                        <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                                if (confirm('Activate this service?')) {
                                    router.visit(route('admin.sm.services.approve', service.id), {
                                        method: 'post',
                                    });
                                }
                            }}
                            className="rounded-full cursor-pointer"
                        >
                            <span className="inline-flex items-center gap-1">
                                <Check className="h-3 w-3" />
                                Activate
                            </span>
                        </Button>
                    )}
                    {service.status === 'active' && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                if (confirm('Deactivate this service?')) {
                                    router.visit(route('admin.sm.services.cancel', service.id), {
                                        method: 'post',
                                    });
                                }
                            }}
                            className="rounded-full cursor-pointer"
                        >
                            <span className="inline-flex items-center gap-1">
                                <X className="h-3 w-3" />
                                Deactivate
                            </span>
                        </Button>
                    )}
                    <Link href={route('admin.sm.services.show', service.id)}>
                        <Button
                            type="button"
                            size="sm"
                            className="h-9 rounded bg-navy px-4 text-xs font-medium text-white hover:bg-navy"
                        >
                            <span>See Details</span>
                            <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            ),
            className: 'text-right',
        },
    ];

    const filterConfig: FilterConfig[] = [
        {
            key: 'status',
            label: 'Status',
            placeholder: 'Filter by status',
            options: [
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
            ],
        },
    ];

    const title = TAB_TITLES[tab] ?? 'Service Management';

    return (
        <AdminLayout activeSlug="service-management">
            <Head title={title} />

            <div className="space-y-6">
                <nav className="flex gap-6 border-b border-gray-200/10">
                    {TABS.map(({ key, label }) => (
                        <Link
                            key={key}
                            href={route('admin.sm.services.index', { tab: key })}
                            className={`pb-3 text-sm font-medium transition-colors ${
                                tab === key
                                    ? 'border-b-2 border-navy text-blue-400'
                                    : 'text-white hover:text-gray-400'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">{title}</h1>
                        <p className="mt-1 text-sm text-muted">
                            Review and manage detailing services and booking requests.
                        </p>
                    </div>
                </header>

                <div className="rounded-3xl border border-white/5 bg-bg-gray/90 p-4 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                    <DataTable<Service>
                        data={services}
                        columns={columns}
                        pagination={pagination}
                        offset={offset}
                        filters={filterConfig}
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
                        emptyMessage="No services found"
                        searchPlaceholder="Search by title, location, or vendor"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

