import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';

import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { PaginationData, ColumnConfig, FilterConfig } from '@/types/data-table.types';

type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

interface Order extends Record<string, unknown> {
    id: number;
    order_number: string;
    service_name: string;
    vendor_name: string;
    price: number;
    commission: number;
    vendor_earning: number;
    status: OrderStatus | string;
    created_at?: string;
}

interface Props {
    orders: Order[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    tab: string;
}

const statusLabel: Record<OrderStatus, string> = {
    pending: 'Pending',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const statusClassName: Record<OrderStatus, string> = {
    pending: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
    in_progress: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
    completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
    cancelled: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
};

const TABS = [
    { key: 'requested', label: 'Order Request' },
    { key: 'active', label: 'Active Orders' },
    { key: 'all', label: 'All Orders' },
] as const;

const TAB_TITLES: Record<string, string> = {
    requested: 'Order Request',
    active: 'Active Orders',
    all: 'All Orders',
};

const TAB_DESCRIPTIONS: Record<string, string> = {
    requested: 'Review new booking requests awaiting confirmation.',
    active: 'Monitor ongoing jobs currently in progress.',
    all: 'View the full history of marketplace bookings.',
};

export default function AdminOrdersIndex({
    orders,
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
        only: ['orders', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder'],
    });

    const columns: ColumnConfig<Order>[] = [
        {
            key: 'order_number',
            label: 'Order ID',
            sortable: true,
            render: (order) => <span className="font-medium text-gray-100">{order.order_number}</span>,
        },
        {
            key: 'service_name',
            label: 'Service',
            sortable: true,
            render: (order) => <span className="text-gray-200">{order.service_name}</span>,
        },
        {
            key: 'vendor_name',
            label: 'Vendor',
            sortable: true,
            render: (order) => <span className="text-gray-300">{order.vendor_name}</span>,
        },
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (order) => <span className="text-gray-100">${order.price}</span>,
        },
        {
            key: 'commission',
            label: 'Commission',
            sortable: true,
            render: (order) => (
                <span className="text-amber-300">
                    ${order.commission}
                </span>
            ),
        },
        {
            key: 'vendor_earning',
            label: 'Vendor Earning',
            sortable: true,
            render: (order) => (
                <span className="text-emerald-300">
                    ${order.vendor_earning}
                </span>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            sortable: true,
            render: (order) => {
                const key = (order.status as OrderStatus) || 'pending';
                const label = statusLabel[key] ?? order.status;
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
            render: (order) => (
                <div className="flex justify-end">
                    <Button
                        type="button"
                        size="sm"
                        className="h-9 rounded bg-navy px-4 text-xs font-medium text-white hover:bg-navy"
                    >
                        <span>View booking</span>
                        <ArrowRight className="ml-2 h-3 w-3" />
                    </Button>
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
                { label: 'Pending', value: 'pending' },
                { label: 'In Progress', value: 'in_progress' },
                { label: 'Completed', value: 'completed' },
                { label: 'Cancelled', value: 'cancelled' },
            ],
        },
    ];

    return (
        <AdminLayout activeSlug="orders">
            <Head title={TAB_TITLES[tab] ?? 'Orders'} />

            <div className="space-y-6">

                <nav className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
                    {TABS.map(({ key, label }) => (
                        <Link
                            key={key}
                            href={route('admin.om.orders.index', { tab: key })}
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
                <header>
                    <h1 className="text-2xl font-semibold text-white">
                        {TAB_TITLES[tab] ?? 'Orders'}
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        {TAB_DESCRIPTIONS[tab] ?? 'View and manage customer bookings and order statuses.'}
                    </p>
                </header>
                <CardContent>
                    <DataTable<Order>
                        data={orders}
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
                        emptyMessage="No orders found"
                        searchPlaceholder="Search by order ID, service, or vendor"
                    />
                </CardContent>
            </div>
        </AdminLayout>
    );
}

