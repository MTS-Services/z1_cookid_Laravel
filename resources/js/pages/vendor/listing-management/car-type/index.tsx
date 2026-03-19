import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';

import VendorLayout from '@/layouts/vendor-layout';
import { DataTable } from '@/components/ui/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { PaginationData, ColumnConfig } from '@/types/data-table.types';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

type CarTypeStatus = 'active' | 'inactive';

interface CarType extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
  status: CarTypeStatus;
  price: string | number | null;
  created_at: string;
}

interface CarTypePageProps {
  carTypes: CarType[];
  pagination: PaginationData;
  offset: number;
  filters: Record<string, string | number>;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  statuses: { label: string; value: CarTypeStatus }[];
}

type CarTypeFormData = {
  id: number | null;
  name: string;
  status: CarTypeStatus;
  price: string;
};

const defaultFormValues: CarTypeFormData = {
  id: null,
  name: '',
  status: 'active',
  price: '',
};

const formatPriceDisplay = (value: string | number | null | undefined): string => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(n)) {
    return '—';
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
};

export default function CarTypeIndex({
  carTypes,
  pagination,
  offset,
  filters,
  search,
  sortBy,
  sortOrder,
  statuses,
}: CarTypePageProps) {
  const { isLoading, handleSearch, handleFilterChange, handleSort, handlePerPageChange, handlePageChange } = useDataTable({
    only: ['carTypes', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder', 'statuses'],
  });

  const form = useForm<CarTypeFormData>({ ...defaultFormValues });
  const { data, setData, post, processing, errors, reset } = form;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCarTypeId, setCurrentCarTypeId] = useState<number | null>(null);
  const [carTypeToDelete, setCarTypeToDelete] = useState<CarType | null>(null);

  const columns: ColumnConfig<CarType>[] = useMemo(
    () => [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (item) => <span className="font-semibold">{item.name}</span>,
      },
      {
        key: 'price',
        label: 'Est. price',
        sortable: true,
        render: (item) => <span className="text-muted-foreground">{formatPriceDisplay(item.price)}</span>,
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (item) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {item.status}
          </span>
        ),
      },
      {
        key: 'created_at',
        label: 'Created',
        sortable: true,
        render: (item) => new Date(item.created_at).toLocaleDateString(),
      },
      {
        key: 'actions',
        label: 'Action',
        render: (item) => (
          <div className="flex items-center gap-2">
            <Button variant="default" size="sm" className="gap-1.5" onClick={() => openEdit(item)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => handleDelete(item)}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

  const resetForm = () => {
    reset();
    setCurrentCarTypeId(null);
    setData(() => ({ ...defaultFormValues }));
  };

  const populateForm = (carType: CarType | null) => {
    if (carType) {
      setData(() => ({
        id: carType.id,
        name: carType.name,
        status: carType.status,
        price:
          carType.price !== null && carType.price !== undefined && carType.price !== ''
            ? String(carType.price)
            : '',
      }));
    } else {
      setData(() => ({ ...defaultFormValues }));
    }
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (carType: CarType) => {
    setCurrentCarTypeId(carType.id);
    populateForm(carType);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (carType: CarType) => {
    setCarTypeToDelete(carType);
    setIsDeleteOpen(true);
  };

  const submitCarType = () => {
    const url = currentCarTypeId
      ? route('vendor.lm.car-type.update', currentCarTypeId)
      : route('vendor.lm.car-type.store');

    post(url, {
      method: 'post',
      preserveScroll: true,
      onSuccess: () => {
        closeForm();
        toast.success('Car type saved successfully');
      },
    });
  };

  const confirmDelete = () => {
    if (!carTypeToDelete) {
      return;
    }

    router.delete(route('vendor.lm.car-type.destroy', carTypeToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteOpen(false);
        setCarTypeToDelete(null);
      },
    });
  };

  return (
    <VendorLayout activeSlug="car-type">
      <Head title="Car Type Management" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Car Types</h1>
          <p className="text-muted-foreground">Manage the car types your services support</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Car Type
        </Button>
      </div>

      <DataTable<CarType>
        data={carTypes}
        columns={columns}
        pagination={pagination}
        offset={offset}
        filters={[
          {
            key: 'status',
            label: 'Status',
            options: statuses.map((status) => ({ label: status.label, value: status.value })),
            placeholder: 'Filter by status',
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
        emptyMessage="No car types found"
        searchPlaceholder="Search car types"
      />

      <Dialog
        open={isFormOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeForm();
          } else {
            setIsFormOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{currentCarTypeId ? 'Edit Car Type' : 'Create Car Type'}</DialogTitle>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel className="text-white">Name</FieldLabel>
              <FieldContent className="text-white">
                <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                <FieldError errors={errors.name ? [{ message: errors.name }] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-white">Estimated price (USD)</FieldLabel>
              <FieldContent className="text-white">
                <Input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  placeholder="Optional — rough estimate for clients"
                  value={data.price}
                  onChange={(e) => setData('price', e.target.value)}
                />
                <FieldError errors={errors.price ? [{ message: errors.price }] : undefined} />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="text-white">Status</FieldLabel>
              <FieldContent className="text-white">
                <Select value={data.status} onValueChange={(value) => setData('status', value as CarTypeStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={errors.status ? [{ message: errors.status }] : undefined} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button onClick={submitCarType} disabled={processing}>
              {processing ? 'Saving...' : currentCarTypeId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteOpen(false);
            setCarTypeToDelete(null);
          } else {
            setIsDeleteOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Car Type</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white">
            Are you sure you want to delete "{carTypeToDelete?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setCarTypeToDelete(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </VendorLayout>
  );
}
