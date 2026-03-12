import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Banknote, CheckCircle2, CreditCard, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'

type ModalBaseProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    size?: 'sm' | 'md' | 'lg'
    children: React.ReactNode
}

const modalSizeMap: Record<NonNullable<ModalBaseProps['size']>, string> = {
    sm: 'max-w-[360px]',
    md: 'max-w-[420px]',
    lg: 'max-w-[520px]',
}

const modalShellClass =
    'w-full rounded-3xl border border-white/5 bg-(--color-card-dark) p-8 text-white shadow-[0_25px_70px_rgba(0,0,0,0.55)] [&_[data-slot="dialog-close"]]:hidden'

function PaymentModalShell({ open, onOpenChange, size = 'md', children }: ModalBaseProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn(modalShellClass, modalSizeMap[size])}>
                <DialogClose className="absolute right-6 top-6 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/15">
                    <X className="h-4 w-4" />
                </DialogClose>
                {children}
            </DialogContent>
        </Dialog>
    )
}

type WithdrawFundsModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    availableBalance?: string
    methods?: { label: string; value: string }[]
    onContinue?: (details: { amount: string; method: string }) => void
}

const defaultMethods = [
    { label: 'Bank Account ••••1234', value: 'bank:1234' },
    { label: 'HSBC Business Account', value: 'hsbc' },
]

export function WithdrawFundsModal({
    open,
    onOpenChange,
    availableBalance = '$12,000.50',
    methods = defaultMethods,
    onContinue,
}: WithdrawFundsModalProps) {
    const [amount, setAmount] = useState('120.00')
    const [selectedMethod, setSelectedMethod] = useState(methods[0]?.value ?? '')

    return (
        <PaymentModalShell open={open} onOpenChange={onOpenChange}>
            <div className="space-y-6">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-text-gray">Withdraw Funds</p>
                    <h2 className="text-2xl font-semibold">Enter amount</h2>
                </div>

                <label className="space-y-2 text-sm">
                    <span className="text-text-gray">Amount</span>
                    <div className="flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                        <span className="text-text-gray-50 text-lg font-semibold">$</span>
                        <input
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            type="number"
                            step="0.01"
                            className="ml-3 w-full bg-transparent text-lg font-semibold text-white placeholder:text-text-gray focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>
                    <span className="text-xs text-(--color-accent-blue)">Available: {availableBalance}</span>
                </label>

                <label className="space-y-2 text-sm">
                    <span className="text-text-gray">Select payment method</span>
                    <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-1">
                        <select
                            className="w-full bg-transparent py-2 text-white focus:outline-none"
                            value={selectedMethod}
                            onChange={(event) => setSelectedMethod(event.target.value)}
                        >
                            {methods.map((method) => (
                                <option key={method.value} value={method.value} className="bg-bg-black text-black">
                                    {method.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row mt-4">
                    <Button
                        variant="outline"
                        className="w-full rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                        onClick={() => {
                            onContinue?.({ amount, method: selectedMethod })
                        }}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </PaymentModalShell>
    )
}

type ConfirmWithdrawalModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    amount?: string
    methodLabel?: string
    onConfirm?: () => void
}

export function ConfirmWithdrawalModal({
    open,
    onOpenChange,
    amount = '$120',
    methodLabel = 'Bank Account ••••1234',
    onConfirm,
}: ConfirmWithdrawalModalProps) {
    return (
        <PaymentModalShell open={open} onOpenChange={onOpenChange} size="sm">
            <div className="space-y-6">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-text-gray">Confirm withdrawal</p>
                    <h2 className="text-2xl font-semibold">Review details</h2>
                </div>

                <dl className="space-y-3 rounded-2xl border border-white/5 bg-black/20 p-4 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-text-gray">Amount</dt>
                        <dd className="font-semibold text-white">{amount}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                        <dt className="text-text-gray">Method</dt>
                        <dd className="font-semibold text-white">{methodLabel}</dd>
                    </div>
                </dl>

                <p className="text-sm text-text-gray">
                    Please confirm the withdrawal details above. Funds will be transferred within 24 hours.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                        variant="outline"
                        className="w-full rounded-2xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                        onClick={onConfirm}
                    >
                        Send Request
                    </Button>
                </div>
            </div>
        </PaymentModalShell>
    )
}

type WithdrawalSuccessModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    amount?: string
    title?: string
    description?: string
    illustrationSrc?: string
}

export function WithdrawalSuccessModal({
    open,
    onOpenChange,
    amount = '$120',
    title = 'Withdrawal Request Successful!',
    description = 'Funds will appear in your account within 24 hours.',
    illustrationSrc = '/assets/images/booking/Confit.png',
}: WithdrawalSuccessModalProps) {
    return (
        <PaymentModalShell open={open} onOpenChange={onOpenChange} size="sm">
            <div className="space-y-6 text-center">
                <div className="flex justify-center">
                    <img src={illustrationSrc} alt="Success" />
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">{title}</h2>
                    <p className="mt-2 text-sm text-text-gray">{description}</p>
                    {amount && (
                        <p className="mt-1 text-sm text-white">Amount: {amount}</p>
                    )}
                </div>
                <Button
                    className="mt-4 w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                    onClick={() => onOpenChange(false)}
                >
                    Close
                </Button>
            </div>
        </PaymentModalShell>
    )
}

type VerifyAccountModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    phoneNumber?: string
    onContinue?: (code: string) => void
}

export function VerifyAccountModal({
    open,
    onOpenChange,
    phoneNumber = '+61 412 345 678',
    onContinue,
}: VerifyAccountModalProps) {
    const otpLength = 4
    const [code, setCode] = useState(Array(otpLength).fill(''))
    const inputRefs = useRef<HTMLInputElement[]>([])

    const codeValue = useMemo(() => code.join(''), [code])

    const handleChange = (index: number, value: string) => {
        if (!/^\d?$/.test(value)) {
            return
        }

        const next = [...code]
        next[index] = value
        setCode(next)

        if (value && inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus()
        }
    }

    const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !code[index] && inputRefs.current[index - 1]) {
            const prev = index - 1
            const next = [...code]
            next[prev] = ''
            setCode(next)
            inputRefs.current[prev]?.focus()
        }
    }

    return (
        <PaymentModalShell open={open} onOpenChange={onOpenChange} size="sm">
            <div className="space-y-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/40">
                    <span className="text-sm font-semibold">G</span>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Verify Your Account</h2>
                    <p className="mt-2 text-sm text-text-gray">
                        We’ve sent a 4-digit verification code to your mobile number {phoneNumber}. Enter the code below to
                        continue.
                    </p>
                </div>

                <div className="flex items-center justify-center gap-3">
                    {code.map((digit, index) => (
                        <input
                            key={index}
                            ref={(element) => {
                                if (element) {
                                    inputRefs.current[index] = element
                                }
                            }}
                            value={digit}
                            onChange={(event) => handleChange(index, event.target.value)}
                            onKeyDown={(event) => handleKeyDown(index, event)}
                            maxLength={1}
                            className="h-14 w-14 rounded-2xl border border-white/10 bg-black/20 text-center text-2xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-(--color-accent-blue)"
                        />
                    ))}
                </div>

                <p className="text-xs text-text-gray">
                    Didn’t receive the code? <button className="text-(--color-accent-blue)">Resend Code (wait 60s)</button>
                </p>

                <Button
                    className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                    onClick={() => onContinue?.(codeValue)}
                >
                    Continue
                </Button>
            </div>
        </PaymentModalShell>
    )
}

type AddAccountModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onContinue?: (accountLabel: string) => void
}

const providerTabs = [
    { id: 'card', label: 'Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'stripe', label: 'Stripe' },
]

export function AddAccountModal({ open, onOpenChange, onContinue }: AddAccountModalProps) {
    const [provider, setProvider] = useState('card')
    const [cardHolder, setCardHolder] = useState('')
    const [cardNumber, setCardNumber] = useState('')

    return (
        <PaymentModalShell open={open} onOpenChange={onOpenChange} size="lg">
            <div className="space-y-6">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-text-gray">Account Type</p>
                    <h2 className="text-2xl font-semibold">Link payout account</h2>
                </div>

                <div className="flex flex-wrap gap-2">
                    {providerTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setProvider(tab.id)}
                            className={cn(
                                'rounded-xl border px-4 py-2 text-sm font-semibold transition',
                                provider === tab.id
                                    ? 'border-(--color-accent-blue) bg-(--color-accent-blue)/15 text-white'
                                    : 'border-white/10 bg-black/20 text-text-gray hover:border-(--color-accent-blue)'
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                        <CreditCard className="h-4 w-4" />
                        {provider === 'card' ? 'Add Credit / Debit Card' : 'Link payout account'}
                    </div>
                    <div className="space-y-4 text-sm">
                        <Input
                            placeholder="Account holder’s name"
                            value={cardHolder}
                            onChange={(event) => setCardHolder(event.target.value)}
                            className="rounded-xl border-white/10 bg-black/30 text-white"
                        />
                        <Input
                            placeholder={provider === 'card' ? 'Card Number' : 'Account Identifier'}
                            value={cardNumber}
                            onChange={(event) => setCardNumber(event.target.value)}
                            className="rounded-xl border-white/10 bg-black/30 text-white"
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Input placeholder="Month" className="rounded-xl border-white/10 bg-black/30 text-white" />
                            <Input placeholder="Year" className="rounded-xl border-white/10 bg-black/30 text-white" />
                        </div>
                        <Input placeholder="Security Code" className="rounded-xl border-white/10 bg-black/30 text-white" />
                    </div>
                </div>

                <Button
                    className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                    onClick={() => {
                        const digits = cardNumber.replace(/\D/g, '')
                        const last4 = digits.slice(-4)
                        const label =
                            cardHolder && last4
                                ? `${cardHolder} ••••${last4}`
                                : cardHolder || (provider === 'card' ? 'Card payout account' : 'Payout account')
                        onContinue?.(label)
                    }}
                >
                    Continue
                </Button>
            </div>
        </PaymentModalShell>
    )
}

type AddAccountEmailModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onContinue?: (email: string) => void
}

export function AddAccountEmailModal({ open, onOpenChange, onContinue }: AddAccountEmailModalProps) {
    const [email, setEmail] = useState('example@gmail.com')

    return (
        <PaymentModalShell open={open} onOpenChange={onOpenChange} size="sm">
            <div className="space-y-6">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-text-gray">Email</p>
                    <h2 className="text-2xl font-semibold">Verify your details</h2>
                </div>
                <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="rounded-2xl border-white/10 bg-black/20 text-white"
                    placeholder="example@gmail.com"
                />
                <Button
                    className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                    onClick={() => onContinue?.(email)}
                >
                    Continue
                </Button>
            </div>
        </PaymentModalShell>
    )
}
