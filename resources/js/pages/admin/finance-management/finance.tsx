import { ActionButton } from '@/components/ui/action-button'
import AdminLayout from '@/layouts/admin-layout'
import { Banknote, CheckCircle2, Clock3, CreditCard, FileText, TrendingUp } from 'lucide-react'
import { Head, Link } from '@inertiajs/react'

interface Stats {
  totalAvailableBalance: number
  totalPendingWithdrawalAmount: number
  pendingWithdrawalCount: number
  completedThisMonth: number
}

interface Props {
  stats: Stats
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export default function FinanceDashboard({ stats }: Props) {
  const payoutStats = [
    {
      label: 'Total Vendor Balance',
      amount: formatCurrency(stats.totalAvailableBalance),
      caption: 'Available across all vendors',
      icon: TrendingUp,
    },
    {
      label: 'Pending Withdrawals',
      amount: formatCurrency(stats.totalPendingWithdrawalAmount),
      caption: `${stats.pendingWithdrawalCount} request(s) awaiting review`,
      icon: Clock3,
    },
    {
      label: 'Completed This Month',
      amount: formatCurrency(stats.completedThisMonth),
      caption: 'Paid out this month',
      icon: CheckCircle2,
    },
  ]

  return (
    <AdminLayout activeSlug="finances">
      <Head title="Finance Management" />

      <section className="space-y-8 text-white">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Finance Management</h1>
            <p className="text-md font-medium text-text-gray">
              Track vendor balances, review withdrawal requests, and monitor payouts.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href={route('admin.fm.payment-gateways.edit')}>
              <ActionButton IconNode={CreditCard} className="shrink-0">
                Payment gateways
              </ActionButton>
            </Link>
            <Link href={route('admin.fm.withdrawals.index')}>
              <ActionButton IconNode={FileText} className="shrink-0">
                Withdrawal Requests
              </ActionButton>
            </Link>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-3">
          {payoutStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/5 bg-bg-gray p-5 shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-md font-medium text-text-gray">{stat.label}</p>
                  <p className="mt-3 text-2xl font-semibold">{stat.amount}</p>
                  <p className="text-xs text-text-gray">{stat.caption}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C4E0F9]">
                  <stat.icon className="h-5 w-5 text-black" />
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="rounded-2xl border border-white/5 bg-bg-gray p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Vendor Withdrawals</h2>
              <p className="text-sm text-text-gray">
                Review, approve, or reject vendor withdrawal requests. Mark requests as processing or completed.
              </p>
            </div>
            <Link href={route('admin.fm.withdrawals.index')}>
              <ActionButton IconNode={Banknote}>Manage Withdrawals</ActionButton>
            </Link>
          </div>
        </section>
      </section>
    </AdminLayout>
  )
}
