import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Eye } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginationData, ColumnConfig, ActionConfig } from '@/types/data-table.types';
import { User } from '@/types';


interface Props {
    users: User[];
    pagination: PaginationData;
    offset: number;
    filters: Record<string, string | number>;
    search: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

export default function index({
    users,
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
    } = useDataTable();

    const USER_TYPE_LABELS: Record<string, string> = {
        property_owner: 'Property Owner / Manager',
        realtor: 'Realtor',
        both: 'Both',
    };


    const columns: ColumnConfig<User>[] = [
        {
            key: 'image',
            label: 'Avatar',
            render: (user) => (
                <img
                    src={user.image_url ? `${user.image_url}` : '/no-user-image-icon.png'}
                    alt={user.name}
                    className="h-8 w-8 rounded-full object-cover"
                />
            ),
        },
        {
            key: 'name',
            label: 'Name',
            sortable: true,
            render: (user) => (
                <div className="font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                </div>
            ),
        },
        {
            key: 'email',
            label: 'Email',
            sortable: true,
            render: (user) => (
                <div className="text-gray-600 dark:text-gray-400">
                    {user.email}
                </div>
            ),
        },
        {
            key: 'phone',
            label: 'Phone',
            sortable: true,
            render: (user) => (
                <div className="text-gray-600 dark:text-gray-400">
                    {user.phone}
                </div>
            ),
        },
        {
            key: 'user_type',
            label: 'User Type',
            sortable: true,
            render: (user) => (
                <div className="text-gray-600 dark:text-gray-400">
                    {USER_TYPE_LABELS[user.user_type] ?? user.user_type}
                </div>
            ),
        },
        {
            key: 'is_verified',
            label: 'Verified',
            sortable: true,
            render: (user) => (
                <div className="text-gray-600 dark:text-gray-400">
                    <span className={`${user.is_verified ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded-full text-xs font-semibold ${user.is_verified ? 'bg-green-500' : 'bg-red-500'}-600`}>{user.is_verified ? 'Verified' : 'Not Verified'}</span>
                </div>
            ),
        },

        {
            key: 'created_at',
            label: 'Joined Date',
            sortable: true,
            render: (user) => (
                <div className="text-gray-600 dark:text-gray-400">
                    {new Date(user.created_at).toLocaleDateString()}
                </div>
            ),
        },
    ];

    const actions: ActionConfig<User>[] = [
        {
            label: 'Verify',
            icon: <Eye className="h-4 w-4" />,
            onClick: (user) => {
                if (confirm(`Are you sure you want to verify ${user.name}?`)) {
                    router.visit(route('admin.um.user.verify', user?.id));
                }
            },
            variant: 'destructive',
        },
    ];

    return (
        <AdminLayout activeSlug="pending-verification">
            <Head title="Pending Verification" />

            <div className="mx-auto">
                <DataTable
                    data={users}
                    columns={columns}
                    pagination={pagination}
                    offset={offset}
                    showNumbering={true}
                    actions={actions}
                    filters={[
                        {
                        key: 'user_type',
                        label: 'User Type',
                        options: [
                            { value: 'property_owner', label: 'Property Owner' },
                            { value: 'realtor', label: 'Realtor' },
                            { value: 'both', label: 'Both' },
                        ],
                        },
                    ]}
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
                    emptyMessage="No users found"
                    searchPlaceholder="Search users by name, email..."
                />
            </div>
        </AdminLayout>
    );
}
