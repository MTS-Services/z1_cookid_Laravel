import React from 'react'
import { Head, Link, router } from '@inertiajs/react'
import { ArrowRight, Check, Eye, X } from 'lucide-react'
import AdminLayout from '@/layouts/admin-layout'
import { CardContent } from '@/components/ui/card'
import { DataTable } from '@/components/ui/data-table'
import { useDataTable } from '@/hooks/use-data-table'
import type { PaginationData, ColumnConfig } from '@/types/data-table.types'
import { Button } from '@/components/ui/button'

type WithdrawalStatusKey =
  | 'pending'
  | 'approved'
  | 'processing'
  | 'completed'
  | 'rejected'

interface Withdrawal {
  id: number
  vendor_id: number
  vendor_name: string
  vendor_email: string | null
  amount: number
  note: string | null
  status: WithdrawalStatusKey | string
  status_label: string
  created_at: string | null
  reviewed_at: string | null
  processed_at: string | null
  rejection_reason: string | null
}

type StatusOption = { value: string; label: string }

interface Props {
  withdrawals: Withdrawal[]
  pagination: PaginationData
  offset: number
  filters: Record<string, string | number>
  search: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  tab: string
  withdrawalStatuses: StatusOption[]
}

const statusClassName: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  approved: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  processing: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
}

const TABS = [
  { key: 'pending', label: 'Pending' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'completed', label: 'Completed' },
  { key: 'rejected', label: 'Rejected' },
  { key: 'all', label: 'All' },
] as const

const TAB_TITLES: Record<string, string> = {
  pending: 'Pending Withdrawals',
  in_progress: 'In Progress',
  completed: 'Completed',
  rejected: 'Rejected',
  all: 'All Withdrawals',
}

const TAB_DESCRIPTIONS: Record<string, string> = {
  pending: 'Review and approve or reject vendor withdrawal requests.',
  in_progress: 'Withdrawals approved or currently being processed.',
  completed: 'Successfully completed payouts.',
  rejected: 'Rejected withdrawal requests.',
  all: 'View all vendor withdrawal requests.',
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function WithdrawalsIndex({
  withdrawals,
  pagination,
  offset,
  filters,
  search,
  sortBy,
  sortOrder,
  tab,
  withdrawalStatuses = [],
}: Props) {
  const {
    isLoading,
    handleSearch,
    handleFilterChange,
    handleSort,
    handlePerPageChange,
    handlePageChange,
  } = useDataTable({
    only: [
      'withdrawals',
      'pagination',
      'offset',
      'filters',
      'search',
      'sortBy',
      'sortOrder',
      'tab',
      'withdrawalStatuses',
    ],
  })

  const statusKey = (s: string) => (s in statusClassName ? s : 'pending')
  const columns: ColumnConfig<Withdrawal>[] = [
    {
      key: 'vendor_name',
      label: 'Vendor',
      render: (w) => (
        <div>
          <span className="font-medium text-white">{w.vendor_name}</span>
          {w.vendor_email && (
            <p className="text-xs text-text-gray">{w.vendor_email}</p>
          )}
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (w) => (
        <span className="font-semibold text-emerald-300">
          {formatCurrency(w.amount)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (w) => {
        const key = statusKey(w.status as string)
        const label = w.status_label ?? w.status
        const classes = statusClassName[key] ?? 'bg-white/5 text-white border-white/10'
        return (
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${classes}`}
          >
            {label}
          </span>
        )
      },
    },
    {
      key: 'created_at',
      label: 'Requested',
      sortable: true,
      render: (w) => (
        <span className="text-gray-300">{formatDate(w.created_at)}</span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (w) => (
        <div className="flex items-center gap-2">
          <Link href={route('admin.fm.withdrawals.show', w.id)}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Eye className="h-4 w-4" />
              View
            </Button>
          </Link>
          {(w.status === 'pending' || w.status === 'Pending') && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-rose-400 hover:text-rose-300"
                onClick={() => {
                  if (confirm('Reject this withdrawal request?')) {
                    router.post(route('admin.fm.withdrawals.reject', w.id))
                  }
                }}
              >
                <X className="h-4 w-4" />
                Reject
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
                onClick={() => {
                  if (confirm('Approve this withdrawal request?')) {
                    router.post(route('admin.fm.withdrawals.approve', w.id))
                  }
                }}
              >
                <Check className="h-4 w-4" />
                Approve
              </Button>
            </>
          )}
        </div>
      ),
      className: 'text-right',
    },
  ]

  const filterConfig =
    withdrawalStatuses.length > 0
      ? [
          {
            key: 'status',
            label: 'Status',
            placeholder: 'Filter by status',
            options: withdrawalStatuses.map((s) => ({
              label: s.label,
              value: s.value,
            })),
          },
        ]
      : []

  return (
    <AdminLayout activeSlug="withdrawals">
      <Head title={TAB_TITLES[tab] ?? 'Withdrawals'} />

      <div className="space-y-6">
        <nav className="flex gap-6 border-b border-gray-200 dark:border-gray-700">
          {TABS.map(({ key, label }) => (
            <Link
              key={key}
              href={route('admin.fm.withdrawals.index', { tab: key })}
              className={`pb-3 text-sm font-medium transition-colors ${
                tab === key
                  ? 'border-b-2 border-navy text-navy'
                  : 'text-white hover:text-gray-400'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <header className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {TAB_TITLES[tab] ?? 'Withdrawals'}
            </h1>
            <p className="mt-1 text-sm text-muted">
              {TAB_DESCRIPTIONS[tab] ??
                'View and manage vendor withdrawal requests.'}
            </p>
          </div>
          <Link
            href={route('admin.fm.index')}
            className="flex items-center gap-2 text-sm text-text-gray hover:text-white"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Back to Finance
          </Link>
        </header>

        <CardContent>
          <DataTable<Withdrawal>
            data={withdrawals}
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
            emptyMessage="No withdrawals found"
            searchPlaceholder="Search by vendor name, email, or amount"
          />
        </CardContent>
      </div>
    </AdminLayout>
  )
}
