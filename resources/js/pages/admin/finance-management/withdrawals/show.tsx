import React, { useState } from 'react'
import { Head, Link, router, useForm } from '@inertiajs/react'
import {
  ArrowLeft,
  Banknote,
  Check,
  Loader2,
  X,
} from 'lucide-react'
import AdminLayout from '@/layouts/admin-layout'
import { ActionButton } from '@/components/ui/action-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface PayoutAccount {
  account_holder_name: string
  account_type: string
  masked_number: string | null
  bank_name: string | null
  routing_number: string | null
  email: string | null
}

interface Withdrawal {
  id: number
  vendor_id: number
  vendor_name: string
  vendor_email: string | null
  vendor_phone: string | null
  vendor_address: string
  amount: number
  note: string | null
  status: string
  status_label: string
  created_at: string | null
  reviewed_at: string | null
  processed_at: string | null
  rejection_reason: string | null
  reviewer_name: string | null
  payout_account: PayoutAccount | null
}

interface Props {
  withdrawal: Withdrawal
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

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/40',
  approved: 'bg-blue-500/15 text-blue-300 border-blue-500/40',
  processing: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  rejected: 'bg-rose-500/15 text-rose-300 border-rose-500/40',
}

export default function WithdrawalShow({ withdrawal }: Props) {
  const [rejectOpen, setRejectOpen] = useState(false)
  const { data, setData, post, processing, errors, reset } = useForm({
    rejection_reason: '',
  })

  const statusKey = withdrawal.status in statusStyles ? withdrawal.status : 'pending'
  const isPending = withdrawal.status === 'pending'
  const canApproveOrReject = isPending
  const canMarkProcessing =
    withdrawal.status === 'pending' || withdrawal.status === 'approved'
  const canMarkCompleted =
    withdrawal.status === 'approved' || withdrawal.status === 'processing'

  const handleReject = () => {
    post(route('admin.fm.withdrawals.reject', withdrawal.id), {
      onSuccess: () => setRejectOpen(false),
      onFinish: () => reset('rejection_reason'),
    })
  }

  return (
    <AdminLayout activeSlug="withdrawals">
      <Head title={`Withdrawal #${withdrawal.vendor_name}`} />

      <div className="space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Link href={route('admin.fm.withdrawals.index')}>
              <ActionButton IconNode={ArrowLeft}>Back to Withdrawals</ActionButton>
            </Link>
            <h1 className="text-2xl font-semibold text-white">
              Withdrawal: {withdrawal.vendor_name}
            </h1>
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-sm font-medium ${
                statusStyles[statusKey] ?? 'bg-white/5 text-white'
              }`}
            >
              {withdrawal.status_label}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canApproveOrReject && (
              <>
                <Button
                  size="sm"
                  className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
                  onClick={() => {
                    if (confirm('Approve this withdrawal?')) {
                      router.post(
                        route('admin.fm.withdrawals.approve', withdrawal.id)
                      )
                    }
                  }}
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
                <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 text-rose-400 hover:text-rose-300"
                    >
                      <X className="h-4 w-4" />
                      Reject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Reject withdrawal</DialogTitle>
                      <DialogDescription>
                        Optionally provide a reason to be sent to the vendor.
                        The withdrawal of {formatCurrency(withdrawal.amount)}{' '}
                        will be rejected.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2 py-4">
                      <Label htmlFor="rejection_reason">Reason (optional)</Label>
                      <Textarea
                        id="rejection_reason"
                        value={data.rejection_reason}
                        onChange={(e) =>
                          setData('rejection_reason', e.target.value)
                        }
                        placeholder="e.g. Invalid payout account"
                        rows={3}
                        className="resize-none"
                      />
                      {errors.rejection_reason && (
                        <p className="text-sm text-rose-400">
                          {errors.rejection_reason}
                        </p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setRejectOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={processing}
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          'Reject withdrawal'
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </>
            )}
            {canMarkProcessing && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => {
                  if (
                    confirm(
                      'Mark this withdrawal as processing (funds being sent)?'
                    )
                  ) {
                    router.post(
                      route('admin.fm.withdrawals.mark-processing', withdrawal.id)
                    )
                  }
                }}
              >
                Mark processing
              </Button>
            )}
            {canMarkCompleted && (
              <Button
                size="sm"
                className="gap-1.5 bg-emerald-600 hover:bg-emerald-500"
                onClick={() => {
                  if (
                    confirm(
                      'Mark this withdrawal as completed? The vendor will be notified.'
                    )
                  ) {
                    router.post(
                      route('admin.fm.withdrawals.mark-completed', withdrawal.id)
                    )
                  }
                }}
              >
                <Banknote className="h-4 w-4" />
                Mark completed
              </Button>
            )}
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/5 bg-bg-gray p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Request details
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-gray">Amount</dt>
                <dd className="text-xl font-semibold text-emerald-300">
                  {formatCurrency(withdrawal.amount)}
                </dd>
              </div>
              <div>
                <dt className="text-text-gray">Requested at</dt>
                <dd className="text-white">
                  {formatDate(withdrawal.created_at)}
                </dd>
              </div>
              {withdrawal.reviewed_at && (
                <div>
                  <dt className="text-text-gray">Reviewed at</dt>
                  <dd className="text-white">
                    {formatDate(withdrawal.reviewed_at)}
                    {withdrawal.reviewer_name && (
                      <span className="text-text-gray">
                        {' '}
                        by {withdrawal.reviewer_name}
                      </span>
                    )}
                  </dd>
                </div>
              )}
              {withdrawal.processed_at && (
                <div>
                  <dt className="text-text-gray">Processed at</dt>
                  <dd className="text-white">
                    {formatDate(withdrawal.processed_at)}
                  </dd>
                </div>
              )}
              {withdrawal.note && (
                <div>
                  <dt className="text-text-gray">Note</dt>
                  <dd className="text-white">{withdrawal.note}</dd>
                </div>
              )}
              {withdrawal.rejection_reason && (
                <div>
                  <dt className="text-text-gray">Rejection reason</dt>
                  <dd className="text-rose-300">{withdrawal.rejection_reason}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-2xl border border-white/5 bg-bg-gray p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Vendor &amp; payout
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-text-gray">Vendor</dt>
                <dd className="font-medium text-white">
                  {withdrawal.vendor_name}
                </dd>
                {withdrawal.vendor_email && (
                  <dd className="text-text-gray">{withdrawal.vendor_email}</dd>
                )}
                {withdrawal.vendor_phone && (
                  <dd className="text-text-gray">{withdrawal.vendor_phone}</dd>
                )}
                {withdrawal.vendor_address && (
                  <dd className="text-text-gray">{withdrawal.vendor_address}</dd>
                )}
              </div>
              {withdrawal.payout_account && (
                <div className="mt-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <dt className="text-text-gray">Payout account</dt>
                  <dd className="mt-1 font-medium text-white">
                    {withdrawal.payout_account.account_holder_name}
                  </dd>
                  <dd className="text-text-gray">
                    {withdrawal.payout_account.account_type}
                    {withdrawal.payout_account.masked_number &&
                      ` •••• ${withdrawal.payout_account.masked_number}`}
                  </dd>
                  {withdrawal.payout_account.bank_name && (
                    <dd className="text-text-gray">
                      {withdrawal.payout_account.bank_name}
                    </dd>
                  )}
                  {withdrawal.payout_account.email && (
                    <dd className="text-text-gray">
                      {withdrawal.payout_account.email}
                    </dd>
                  )}
                </div>
              )}
            </dl>
          </section>
        </div>
      </div>
    </AdminLayout>
  )
}
