import React from 'react';
import { Head } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginationData, ColumnConfig } from '@/types/data-table.types';
import { User } from '@/types';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Props {
    customers: User[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function CustomersIndex({
    customers,
    pagination,
    offset,
    filters,
    search,
    sortBy,
    sortOrder,
}: Props) {
    const {
        isLoading,
        handleSearch,
        handleFilterChange,
        handleSort,
        handlePerPageChange,
        handlePageChange,
    } = useDataTable({
        only: ['customers', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder'],
    });

    const [selectedCustomer, setSelectedCustomer] = React.useState<User | null>(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);

    const columns: ColumnConfig<User>[] = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (customer) => (
                <span className="font-medium text-gray-100">
                    {customer.name ||
                        [customer.first_name, customer.last_name].filter(Boolean).join(' ') ||
                        'Unknown'}
                </span>
            ),
        },
        {
            key: 'phone',
            label: 'Phone Number',
            sortable: true,
            render: (customer) => (
                <span className="text-gray-300">{customer.phone ?? 'N/A'}</span>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
            render: (customer) => (
                <span className="text-gray-300">{customer.email}</span>
            ),
        },
        {
            key: 'location',
            label: 'Location',
            render: (customer) => {
                const address = (customer as any).address as string | undefined;
                const city = (customer as any).city as string | undefined;
                const regionState = (customer as any).region_state as string | undefined;

                const location = [address, city, regionState].filter(Boolean).join(', ');

                return (
                    <span className="text-gray-300">
                        {location || 'N/A'}
                    </span>
                );
            },
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (customer) => (
                <button
                    type="button"
                    onClick={() => {
                        setSelectedCustomer(customer);
                        setIsDetailOpen(true);
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-200 hover:bg-white/10"
                    aria-label="View customer details"
                >
                    <Eye className="h-4 w-4" />
                </button>
            ),
        },
    ];

    const fullName =
        selectedCustomer?.name ||
        [selectedCustomer?.first_name, selectedCustomer?.last_name].filter(Boolean).join(' ') ||
        '';

    const location = selectedCustomer
        ? [
              (selectedCustomer as any).address,
              (selectedCustomer as any).city,
              (selectedCustomer as any).region_state,
              (selectedCustomer as any).zip_code,
          ]
              .filter(Boolean)
              .join(', ')
        : '';

    const initials = fullName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join('') || 'CU';

    return (
        <AdminLayout activeSlug="customers">
            <Head title="All Customers List" />

            <div className="space-y-6">
                <h1 className="text-xl font-semibold text-gray-100">All Customers List</h1>

                <DataTable
                    data={customers}
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
                    emptyMessage="No customers found"
                    searchPlaceholder="Search for something"
                />
            </div>

            <Dialog
                open={isDetailOpen}
                onOpenChange={(open) => {
                    setIsDetailOpen(open);
                    if (!open) {
                        setSelectedCustomer(null);
                    }
                }}
            >
                <DialogContent className="max-w-sm border-0 bg-[#111827] text-center text-gray-100 gap-0">
                    <DialogHeader className="items-center gap-3">
                        <Avatar className="h-24 w-24">
                            <AvatarImage
                                src={
                                    (selectedCustomer as any)?.image_url ||
                                    (selectedCustomer as any)?.avatar_url ||
                                    undefined
                                }
                                alt={fullName}
                            />
                            <AvatarFallback className="bg-white/10 text-lg font-semibold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <DialogTitle className="text-lg font-semibold">
                            {fullName || 'Customer'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className=" space-y-1 text-sm text-gray-300">
                        {selectedCustomer?.email && <p>{selectedCustomer.email}</p>}
                        {selectedCustomer?.phone && <p>{selectedCustomer.phone}</p>}
                        {location && <p>{location || 'N/A'}</p>}
                    </div>

                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

