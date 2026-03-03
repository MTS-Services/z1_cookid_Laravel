import { ActionButton } from '@/components/ui/action-button'
import VendorLayout from '@/layouts/vendor-layout'
import { Banknote, CheckCircle2, Clock3, Plus, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import {
  AddAccountEmailModal,
  AddAccountModal,
  ConfirmWithdrawalModal,
  VerifyAccountModal,
  WithdrawFundsModal,
  WithdrawalSuccessModal,
} from '@/components/section/vendors/payments/withdrwal-modal'
import AdminLayout from '@/layouts/admin-layout'

const payoutStats = [
  {
    label: 'Total Balance',
    amount: '$20,450',
    caption: 'Across all time',
    icon: TrendingUp,
  },
  {
    label: 'Pending Payouts',
    amount: '$8,450',
    caption: 'Awaiting release',
    icon: Clock3,
  },
  {
    label: 'Completed Payouts',
    amount: '$12,450',
    caption: 'This month',
    icon: CheckCircle2,
  },
]

const withdrawals = [
  { date: 'Mar 20, 2026 23:14', amount: '$5,000.00', status: 'Confirmed' },
  { date: 'Mar 18, 2026 16:02', amount: '$4,500.00', status: 'Confirmed' },
  { date: 'Mar 15, 2026 09:43', amount: '$6,200.00', status: 'Confirmed' },
  { date: 'Mar 12, 2026 18:54', amount: '$3,800.00', status: 'Confirmed' },
  { date: 'Mar 10, 2026 11:37', amount: '$5,000.00', status: 'Confirmed' },
  { date: 'Mar 07, 2026 14:20', amount: '$2,950.00', status: 'Confirmed' },
  { date: 'Mar 02, 2026 21:05', amount: '$4,750.00', status: 'Confirmed' },
]

export default function Payment() {
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isVerifyOpen, setIsVerifyOpen] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false)
  const [isAddAccountEmailOpen, setIsAddAccountEmailOpen] = useState(false)
  const [isAccountVerifyOpen, setIsAccountVerifyOpen] = useState(false)
  const [isAccountSuccessOpen, setIsAccountSuccessOpen] = useState(false)
  const [accountEmail, setAccountEmail] = useState('example@gmail.com')

  const [withdrawDetails, setWithdrawDetails] = useState<{ amount: string; method: string } | null>(null)

  // Step 1: Withdraw -> Confirm
  const handleWithdrawContinue = (details: { amount: string; method: string }) => {
    setWithdrawDetails(details)
    setIsWithdrawOpen(false)
    setIsConfirmOpen(true)
  }

  // Step 2: Confirm -> Verify
  const handleConfirmSend = () => {
    setIsConfirmOpen(false)
    setIsSuccessOpen(true)
  }

  // Step 3: Verify -> Success
  const handleVerifyComplete = (code: string) => {
    console.log("Verifying code:", code)
    // Add API call logic here
    setIsVerifyOpen(false)
    setIsSuccessOpen(true)
  }

  const handleAddAccountContinue = () => {
    setIsAddAccountOpen(false)
    setIsAddAccountEmailOpen(true)
  }

  const handleAccountEmailContinue = (email: string) => {
    setAccountEmail(email)
    setIsAddAccountEmailOpen(false)
    setIsAccountVerifyOpen(true)
  }

  const handleAccountVerifyComplete = (code: string) => {
    console.log('Account verification code:', code)
    setIsAccountVerifyOpen(false)
    setIsAccountSuccessOpen(true)
  }
  return (
    <AdminLayout activeSlug="finances">
      <section className="space-y-8 text-white">
        <header>
          <h1 className="text-2xl font-semibold text-white">Payments &amp; Earnings</h1>
          <p className="text-md font-medium text-text-gray">Track balances, payouts, and withdrawal history.</p>
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

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-4 rounded-2xl border border-white/5 bg-bg-gray p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-md font-medium text-text-gray">Platform Earnings</p>
                <h2 className="text-xl font-semibold text-white">Linked Accounts</h2>
              </div>
              <ActionButton
                onClick={() => setIsAddAccountOpen(true)}
                IconNode={Plus}
                className="mt-4"
              >
                Add Account
              </ActionButton>
            </div>
            <article className="rounded-2xl bg-(--color-card-darker) p-4">
              <div className="flex items-center justify-between text-sm text-text-gray-50">
                <div>
                  <p className="text-white">HSBC Business Account</p>
                  <p>•••• •••• •••• 1234</p>
                </div>
                <span className="rounded-full bg-(--color-accent-blue)/20 px-3 py-1 text-xs font-semibold text-(--color-accent-blue)">
                  Primary
                </span>
              </div>
            </article>
          </section>

          <section className="space-y-4 rounded-2xl border border-white/5 bg-bg-gray p-6">
            <div>
              <p className="text-md font-medium text-text-gray">Platform Earnings</p>
              <h2 className="text-xl font-semibold text-white">Available Balance</h2>
              <p className="mt-3 text-3xl font-semibold">$12,450</p>
            </div>
            <ActionButton
              IconNode={Banknote}
              className="mt-4 w-full"
              onClick={() => setIsWithdrawOpen(true)}
            >
              Withdraw Funds
            </ActionButton>
          </section>
        </div>

        <section className="rounded-3xl bg-bg-gray shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col gap-2 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-md font-medium text-text-gray">Withdrawal History</p>
              <h2 className="text-xl font-semibold text-white">Recent payouts</h2>
            </div>
            <p className="text-md font-medium text-text-gray">Showing 1 to 7 results</p>
          </div>

          <div className="mt-6 overflow-hidden border border-white/5 border-x-0">
            <table className="min-w-full divide-y divide-white/5 text-sm">
              <thead className="bg-dark-gray text-left text-xs text-text-gray">
                <tr>
                  <th className="px-6 py-3">Date/Time</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {withdrawals.map((withdrawal) => (
                  <tr key={`${withdrawal.date}-${withdrawal.amount}`} className="text-text-gray-50">
                    <td className="px-6 py-4 text-white">{withdrawal.date}</td>
                    <td className="px-6 py-4 text-white">{withdrawal.amount}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full border border-(--color-accent-blue)/50 bg-(--color-accent-blue)/10 px-3 py-1 text-xs font-semibold text-(--color-accent-blue)">
                        {withdrawal.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-white/5 px-6 py-4 text-xs text-text-gray">
              <span>Showing 1 to 7 results</span>
              <div className="flex items-center gap-2">
                <button className="rounded-full border border-white/10 px-4 py-2 text-text-gray hover:text-white">Previous</button>
                <button className="rounded-full border border-white/10 px-4 py-2 text-white">Next</button>
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* MODAL ORCHESTRATION */}

      {/* 1. Entry Point */}
      <WithdrawFundsModal
        open={isWithdrawOpen}
        onOpenChange={setIsWithdrawOpen}
        onContinue={handleWithdrawContinue}
      />

      {/* 2. Review */}
      <ConfirmWithdrawalModal
        open={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        amount={withdrawDetails?.amount}
        methodLabel={withdrawDetails?.method}
        onConfirm={handleConfirmSend}
      />

      {/* 3. Security Check */}
      <VerifyAccountModal
        open={isVerifyOpen}
        onOpenChange={setIsVerifyOpen}
        onContinue={handleVerifyComplete}
      />

      {/* 4. Final Success */}
      <WithdrawalSuccessModal
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        amount={withdrawDetails?.amount}
      />

      {/* Independent Flow: Add Account */}
      <AddAccountModal
        open={isAddAccountOpen}
        onOpenChange={setIsAddAccountOpen}
        onContinue={handleAddAccountContinue}
      />
      <AddAccountEmailModal
        open={isAddAccountEmailOpen}
        onOpenChange={setIsAddAccountEmailOpen}
        onContinue={handleAccountEmailContinue}
      />
      <VerifyAccountModal
        open={isAccountVerifyOpen}
        onOpenChange={setIsAccountVerifyOpen}
        onContinue={handleAccountVerifyComplete}
      />
      <WithdrawalSuccessModal
        open={isAccountSuccessOpen}
        onOpenChange={setIsAccountSuccessOpen}
        amount=""
        title="Account Added Successfully!"
        description={`Your payout account (${accountEmail}) is ready to receive funds.`}
      />
    </AdminLayout>
  )
}