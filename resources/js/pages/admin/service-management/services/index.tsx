import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Check, X } from 'lucide-react';

import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import type { PaginationData, ColumnConfig, FilterConfig } from '@/types/data-table.types';
import { Button } from '@/components/ui/button';

type ServiceStatus = 'requested' | 'in_progress' | 'completed' | 'cancelled';

interface Vendor {
    id: number;
    shop_name: string;
}

interface Service extends Record<string, unknown> {
    id: number;
    service_name: string;
    area: string;
    city?: string;
    price: number;
    status: ServiceStatus | string;
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
    requested: 'Requested',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const statusClassName: Record<ServiceStatus, string> = {
    requested: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    in_progress: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    cancelled: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
};

const TABS = [
    { key: 'requested', label: 'Requested Service' },
    { key: 'all', label: 'All Service List' },
] as const;

const TAB_TITLES: Record<string, string> = {
    requested: 'Requested Service',
    all: 'All Service List',
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
            key: 'service_name',
            label: 'Service Name',
            sortable: true,
            render: (service) => (
                <span className="font-medium text-gray-100">{service.service_name}</span>
            ),
        },
        {
            key: 'area',
            label: 'Area',
            sortable: true,
            render: (service) => (
                <span className="text-gray-300">
                    {[service.area, service.city].filter(Boolean).join(', ')}
                </span>
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
                const key = (service.status as ServiceStatus) || 'requested';
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
                    {service.status === 'requested' && (
                        <>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Cancel this service request?')) {
                                        router.visit(route('admin.sm.services.cancel', service.id), {
                                            method: 'post',
                                        });
                                    }
                                }}
                                className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-200 hover:bg-white/10"
                            >
                                <span className="inline-flex items-center gap-1">
                                    <X className="h-3 w-3" />
                                    Cancel
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (confirm('Approve this service request?')) {
                                        router.visit(route('admin.sm.services.approve', service.id), {
                                            method: 'post',
                                        });
                                    }
                                }}
                                className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-500"
                            >
                                <span className="inline-flex items-center gap-1">
                                    <Check className="h-3 w-3" />
                                    Approve
                                </span>
                            </button>
                        </>
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
                { label: 'Requested', value: 'requested' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
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
                                    ? 'border-b-2 border-blue-600 text-blue-400'
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
                        searchPlaceholder="Search by service, area, or vendor"
                    />
                </div>
            </div>
        </AdminLayout>
    );
}

