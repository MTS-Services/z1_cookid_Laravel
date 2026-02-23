import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Pencil, Trash2, Eye, ShieldCheck } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginationData, ColumnConfig, ActionConfig } from '@/types/data-table.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User } from '@/types';
import { UserVerificationModal } from '@/components/ui/user-verification-modal';


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

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
          {user.phone ? user.phone : 'N/A'}
        </div>
      ),
    },
    // user type
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
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (user) => {
        router.visit(route('admin.um.user.view', user?.id));
      },
    },
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (user) => {
        router.visit(route('admin.um.user.edit', user?.id));
      },
    },
    {
      label: 'Verify License',
      icon: <ShieldCheck className="h-4 w-4" />, // ShieldCheck icon import korun
      onClick: (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
      },
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (user) => {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
          router.visit(route('admin.um.user.destroy', user?.id));
        }
      },
      variant: 'destructive',
    },
  ];

  return (
    <AdminLayout activeSlug="users">
      <Head title="Users" />

      <div className="flex justify-end mb-6">
        <Link href={route('admin.um.user.create')}>
          <Button>Create User</Button>
        </Link>
      </div>

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
            {
              key: 'is_verified',
              label: 'Verification',
              options: [
                { value: '1', label: 'Verified' },
                { value: '0', label: 'Not Verified' },
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

        <UserVerificationModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />

      </div>
    </AdminLayout>
  );
}
