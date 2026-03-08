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
import FileUpload from '@/components/file-upload';
import { toast } from 'sonner';

type CategoryStatus = 'active' | 'inactive';

interface Category extends Record<string, unknown> {
  id: number;
  name: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  status: CategoryStatus;
  created_at: string;
}

interface ExistingUploadFile {
  id: number | string;
  path: string;
  url: string;
  mime_type: string;
  name?: string;
}

interface CategoryPageProps {
  categories: Category[];
  pagination: PaginationData;
  offset: number;
  filters: Record<string, string | number>;
  search: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  statuses: { label: string; value: CategoryStatus }[];
}

type CategoryFormData = {
  id: number | null;
  name: string;
  status: CategoryStatus;
  image: File | null;
  remove_image: boolean;
};

const defaultFormValues: CategoryFormData = {
  id: null,
  name: '',
  status: 'active',
  image: null,
  remove_image: false,
};

const resolveImageUrl = (image?: string | null): string => {
  if (!image) {
    return '/no-image.png';
  }

  if (image.startsWith('http') || image.startsWith('/')) {
    return image;
  }

  return `/storage/${image}`;
};

const buildExistingImage = (category: Category): ExistingUploadFile[] => {
  if (!category.image) {
    return [];
  }

  return [
    {
      id: `category-image-${category.id}`,
      path: category.image,
      url: resolveImageUrl(category.image_url),
      mime_type: 'image/*',
      name: category.name,
    },
  ];
};

export default function CategoryIndex({
  categories,
  pagination,
  offset,
  filters,
  search,
  sortBy,
  sortOrder,
  statuses,
}: CategoryPageProps) {
  const { isLoading, handleSearch, handleFilterChange, handleSort, handlePerPageChange, handlePageChange } = useDataTable({
    only: ['categories', 'pagination', 'offset', 'filters', 'search', 'sortBy', 'sortOrder', 'statuses'],
  });

  const form = useForm<CategoryFormData>({ ...defaultFormValues });

  const { data, setData, post, processing, errors, reset } = form;

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [existingFiles, setExistingFiles] = useState<ExistingUploadFile[]>([]);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const columns: ColumnConfig<Category>[] = useMemo(
    () => [
      {
        key: 'image',
        label: 'Image',
        render: (item) => (
          <img src={resolveImageUrl(item.image_url)} alt={item.name} className="h-16 w-16 rounded-full object-cover" />
        ),
      },
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        render: (item) => (
          <div>
            <p className="font-semibold">{item.name}</p>
          </div>
        ),
      },
      {
        key: 'status',
        label: 'Status',
        sortable: true,
        render: (item) => (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-800'
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
    setExistingFiles([]);
    setCurrentCategoryId(null);
    setData(() => ({ ...defaultFormValues }));
  };

  const populateForm = (category: Category | null) => {
    if (category) {
      setData(() => ({
        id: category.id,
        name: category.name,
        status: category.status,
        image: null,
        remove_image: false,
      }));
    } else {
      setData(() => ({ ...defaultFormValues }));
    }
  };

  const openCreate = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEdit = (category: Category) => {
    setCurrentCategoryId(category.id);
    populateForm(category);
    setExistingFiles(buildExistingImage(category));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  const submitCategory = () => {
    const url = currentCategoryId
      ? route('vendor.lm.category.update', currentCategoryId)
      : route('vendor.lm.category.store');

    post(url, {
      method: 'post',
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        closeForm();
        setExistingFiles([]);
        toast.success('Category saved successfully');
      },
    });
  };

  const confirmDelete = () => {
    if (!categoryToDelete) {
      return;
    }

    router.delete(route('vendor.lm.category.destroy', categoryToDelete.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteOpen(false);
        setCategoryToDelete(null);
      },
    });
  };

  const handleImageChange = (file: File | File[] | null) => {
    setData('image', (file as File) ?? null);
    setData('remove_image', false);
  };

  const handleRemoveExistingImage = () => {
    setExistingFiles([]);
    setData('remove_image', true);
  };

  return (
    <VendorLayout activeSlug="category">
      <Head title="Category Management" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-muted-foreground">Manage your service categories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>
      <DataTable<Category>
        data={categories}
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
        emptyMessage="No categories found"
        searchPlaceholder="Search categories"
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
            <DialogTitle className="text-white">{currentCategoryId ? 'Edit Category' : 'Create Category'}</DialogTitle>
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
              <FieldLabel className="text-white">Image</FieldLabel>
              <FileUpload
                value={data.image}
                onChange={handleImageChange}
                existingFiles={existingFiles}
                onRemoveExisting={handleRemoveExistingImage}
                accept="image/*"
                maxSize={10}
              />
              <FieldError errors={errors.image ? [{ message: errors.image }] : undefined} className="mt-2" />
            </Field>

            <Field>
              <FieldLabel className="text-white">Status</FieldLabel>
              <FieldContent className="text-white">
                <Select value={data.status} onValueChange={(value) => setData('status', value as CategoryStatus)}>
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
            <Button onClick={submitCategory} disabled={processing}>
              {processing ? 'Saving...' : currentCategoryId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteOpen(false);
            setCategoryToDelete(null);
          } else {
            setIsDeleteOpen(true);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-white">
            Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setCategoryToDelete(null);
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
