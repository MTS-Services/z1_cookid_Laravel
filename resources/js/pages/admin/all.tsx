import React from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { Pencil, Trash2, Eye } from 'lucide-react';
import AdminLayout from '@/layouts/admin-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginationData, ColumnConfig, ActionConfig } from '@/types/data-table.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Admin } from '@/types';


interface Props {
  admins: Admin[];
  pagination: PaginationData;
  offset: number;
  filters: Record<string, string | number>;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export default function All({
  admins,
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

  const columns: ColumnConfig<Admin>[] = [
    {
      key: 'image',
      label: 'Avatar',
      render: (admin) => (
        <img
          src={admin.image_url ? `${admin.image_url}` : '/no-user-image-icon.png'}
          alt={admin.name}
          className="h-8 w-8 rounded-full object-cover"
        />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (admin) => (
        <div className="font-medium text-gray-900 dark:text-gray-100">
          {admin.name}
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (admin) => (
        <div className="text-gray-600 dark:text-gray-400">
          {admin.email}
        </div>
      ),
    },
    {
      key: 'created_at',
      label: 'Joined Date',
      sortable: true,
      render: (admin) => (
        <div className="text-gray-600 dark:text-gray-400">
          {new Date(admin.created_at).toLocaleDateString()}
        </div>
      ),
    },
  ];

  const actions: ActionConfig<Admin>[] = [
    {
      label: 'View',
      icon: <Eye className="h-4 w-4" />,
      onClick: (admin) => {
        router.visit(route('admin.view.detail', admin?.id));
      },
    },
    {
      label: 'Edit',
      icon: <Pencil className="h-4 w-4" />,
      onClick: (admin) => {
        router.visit(route('admin.edit', admin?.id));
      },
    },
    {
      label: 'Delete',
      icon: <Trash2 className="h-4 w-4" />,
      onClick: (admin) => {
        if (confirm(`Are you sure you want to delete ${admin.name}?`)) {
          router.visit(route('admin.delete', admin?.id));
        }
      },
      variant: 'destructive',
    },
  ];

  return (
    <AdminLayout activeSlug="admin-users">
      <Head title="Users" />

      <div className="flex justify-end mb-6">
        <Link href={route('admin.create')}>
          <Button>Create Admin</Button>
        </Link>
      </div>

      <div className="mx-auto">
        <DataTable
          data={admins}
          columns={columns}
          pagination={pagination}
          offset={offset}
          showNumbering={true}
          actions={actions}
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