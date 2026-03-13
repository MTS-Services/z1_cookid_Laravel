import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { CreditCard, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

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
    methods: { id: number; label: string }[]
    onContinue?: (details: { amount: string; payoutAccountId: number; methodLabel: string }) => void
}

export function WithdrawFundsModal({
    open,
    onOpenChange,
    availableBalance = '$0.00',
    methods,
    onContinue,
}: WithdrawFundsModalProps) {
    const [amount, setAmount] = useState('')
    const [selectedMethodId, setSelectedMethodId] = useState<number | undefined>(methods[0]?.id)

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
                            value={selectedMethodId ?? ''}
                            onChange={(event) => setSelectedMethodId(Number(event.target.value))}
                        >
                            <option value="" disabled className="bg-bg-black text-black">
                                Select payout account
                            </option>
                            {methods.map((method) => (
                                <option key={method.id} value={method.id} className="bg-bg-black text-black">
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
                            if (!selectedMethodId) {
                                return
                            }
                            const method = methods.find((item) => item.id === selectedMethodId)
                            if (!method) {
                                return
                            }
                            onContinue?.({ amount, payoutAccountId: selectedMethodId, methodLabel: method.label })
                        }}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </PaymentModalShell>
    )
}

export type PayoutAccountDraft = {
    account_type: 'card' | 'paypal' | 'stripe'
    account_holder_name: string
    account_number?: string | null
    bank_name?: string | null
    routing_number?: string | null
    card_expiry_month?: string | null
    card_expiry_year?: string | null
    security_code?: string | null
    email?: string | null
    is_default?: boolean
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
    isSubmitting?: boolean
    errorMessage?: string | null
    otpLength?: number
    resendAfterSeconds?: number
    onResend?: () => void
    onCodeChange?: (code: string) => void
}

export function VerifyAccountModal({
    open,
    onOpenChange,
    phoneNumber = '+61 412 345 678',
    onContinue,
    isSubmitting = false,
    errorMessage = null,
    otpLength = 4,
    resendAfterSeconds = 60,
    onResend,
    onCodeChange,
}: VerifyAccountModalProps) {
    const [code, setCode] = useState(Array(otpLength).fill(''))
    const [secondsLeft, setSecondsLeft] = useState(resendAfterSeconds)
    const [isResending, setIsResending] = useState(false)
    const inputRefs = useRef<HTMLInputElement[]>([])

    const codeValue = useMemo(() => code.join(''), [code])

    useEffect(() => {
        onCodeChange?.(codeValue)
    }, [codeValue, onCodeChange])

    useEffect(() => {
        if (!open) {
            return
        }

        setCode(Array(otpLength).fill(''))
        setSecondsLeft(resendAfterSeconds)
        setIsResending(false)

        const timeout = setTimeout(() => {
            inputRefs.current[0]?.focus()
        }, 150)

        return () => clearTimeout(timeout)
    }, [open, otpLength, resendAfterSeconds])

    useEffect(() => {
        if (!open || secondsLeft <= 0) {
            return
        }

        const interval = setInterval(() => {
            setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
        }, 1000)

        return () => clearInterval(interval)
    }, [open, secondsLeft])

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

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault()
        const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength)
        if (!pasted) {
            return
        }

        const next = Array(otpLength)
            .fill('')
            .map((_, idx) => pasted[idx] ?? '')
        setCode(next)

        const nextEmptyIndex = next.findIndex((digit) => digit === '')
        const focusIndex = nextEmptyIndex === -1 ? otpLength - 1 : nextEmptyIndex
        inputRefs.current[focusIndex]?.focus()
    }

    const handleResend = async () => {
        if (!onResend || secondsLeft > 0) {
            return
        }

        setIsResending(true)
        try {
            await onResend()
            setSecondsLeft(resendAfterSeconds)
            setCode(Array(otpLength).fill(''))
            inputRefs.current[0]?.focus()
        } finally {
            setIsResending(false)
        }
    }

    const isCodeComplete = codeValue.length === otpLength && !code.includes('')

    return (
        <PaymentModalShell open={open} onOpenChange={onOpenChange} size="sm">
            <div className="space-y-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-black/40">
                    <span className="text-sm font-semibold">G</span>
                </div>
                <div>
                    <h2 className="text-2xl font-semibold">Verify Your Account</h2>
                    <p className="mt-2 text-sm text-text-gray">
                        We’ve sent a {otpLength}-digit verification code to your mobile number {phoneNumber}. Enter the code below to
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
                            onPaste={handlePaste}
                            maxLength={1}
                            inputMode="numeric"
                            className="h-14 w-14 rounded-2xl border border-white/10 bg-black/20 text-center text-2xl font-semibold text-white focus:outline-none focus:ring-2 focus:ring-(--color-accent-blue)"
                        />
                    ))}
                </div>

                <div className="text-xs text-text-gray">
                    {secondsLeft > 0 ? (
                        <p>
                            Didn’t receive the code? Resend available in{' '}
                            <span className="font-semibold text-white">00:{secondsLeft.toString().padStart(2, '0')}</span>
                        </p>
                    ) : (
                        <button
                            className="text-(--color-accent-blue) disabled:cursor-not-allowed"
                            disabled={isResending}
                            onClick={handleResend}
                        >
                            {isResending ? 'Sending…' : 'Resend Code'}
                        </button>
                    )}
                </div>

                {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

                <Button
                    className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                    disabled={isSubmitting || !isCodeComplete}
                    onClick={() => isCodeComplete && onContinue?.(codeValue)}
                >
                    {isSubmitting ? 'Linking Account…' : 'Continue'}
                </Button>
            </div>
        </PaymentModalShell>
    )
}

type AddAccountModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onContinue?: (details: { payload: PayoutAccountDraft; displayLabel: string }) => void
}

const providerTabs: { id: PayoutAccountDraft['account_type']; label: string }[] = [
    { id: 'card', label: 'Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'stripe', label: 'Stripe' },
]

export function AddAccountModal({ open, onOpenChange, onContinue }: AddAccountModalProps) {
    const [provider, setProvider] = useState<PayoutAccountDraft['account_type']>('card')
    const baseFormState = {
        accountHolder: '',
        accountNumber: '',
        bankName: '',
        routingNumber: '',
        expiryMonth: '',
        expiryYear: '',
        securityCode: '',
        isDefault: true,
    }
    const [form, setForm] = useState(baseFormState)
    const [formError, setFormError] = useState<string | null>(null)

    useEffect(() => {
        if (!open) {
            setProvider('card')
            setForm(baseFormState)
            setFormError(null)
        }
    }, [open])

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

                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
                        <CreditCard className="h-4 w-4" />
                        {provider === 'card' ? 'Add Credit / Debit Card' : 'Link payout account'}
                    </div>
                    <div className="space-y-4 text-sm">
                        <Input
                            placeholder="Account holder’s name"
                            value={form.accountHolder}
                            onChange={(event) => setForm((prev) => ({ ...prev, accountHolder: event.target.value }))}
                            className="rounded-xl border-white/10 bg-black/30 text-white"
                        />
                        <Input
                            placeholder={provider === 'card' ? 'Card Number' : 'Account Identifier (optional)'}
                            value={form.accountNumber}
                            onChange={(event) => setForm((prev) => ({ ...prev, accountNumber: event.target.value }))}
                            className="rounded-xl border-white/10 bg-black/30 text-white"
                        />
                        {provider === 'card' ? (
                            <div className="grid gap-4 sm:grid-cols-3">
                                <Input
                                    placeholder="MM"
                                    maxLength={2}
                                    value={form.expiryMonth}
                                    onChange={(event) => setForm((prev) => ({ ...prev, expiryMonth: event.target.value }))}
                                    className="rounded-xl border-white/10 bg-black/30 text-white"
                                />
                                <Input
                                    placeholder="YYYY"
                                    maxLength={4}
                                    value={form.expiryYear}
                                    onChange={(event) => setForm((prev) => ({ ...prev, expiryYear: event.target.value }))}
                                    className="rounded-xl border-white/10 bg-black/30 text-white"
                                />
                                <Input
                                    placeholder="CVV"
                                    maxLength={4}
                                    value={form.securityCode}
                                    onChange={(event) => setForm((prev) => ({ ...prev, securityCode: event.target.value }))}
                                    className="rounded-xl border-white/10 bg-black/30 text-white"
                                />
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input
                                    placeholder="Bank Name (optional)"
                                    value={form.bankName}
                                    onChange={(event) => setForm((prev) => ({ ...prev, bankName: event.target.value }))}
                                    className="rounded-xl border-white/10 bg-black/30 text-white"
                                />
                                <Input
                                    placeholder="Routing Number (optional)"
                                    value={form.routingNumber}
                                    onChange={(event) => setForm((prev) => ({ ...prev, routingNumber: event.target.value }))}
                                    className="rounded-xl border-white/10 bg-black/30 text-white"
                                />
                            </div>
                        )}
                        <label className="flex items-center gap-2 text-xs text-text-gray">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-white/20 bg-black/40"
                                checked={form.isDefault}
                                onChange={(event) => setForm((prev) => ({ ...prev, isDefault: event.target.checked }))}
                            />
                            Set as default payout account
                        </label>
                        {formError && <p className="text-sm text-red-400">{formError}</p>}
                    </div>
                </div>

                <Button
                    className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                    onClick={() => {
                        if (!form.accountHolder.trim()) {
                            setFormError('Account holder name is required.')
                            return
                        }
                        if (provider === 'card') {
                            if (!form.accountNumber.trim()) {
                                setFormError('Card number is required for card payouts.')
                                return
                            }
                            if (!form.expiryMonth.trim() || !form.expiryYear.trim()) {
                                setFormError('Card expiry details are required.')
                                return
                            }
                            if (!form.securityCode.trim()) {
                                setFormError('Security code is required for cards.')
                                return
                            }
                        }

                        const digits = form.accountNumber.replace(/\D/g, '')
                        const last4 = digits.slice(-4)
                        const displayLabel = form.accountHolder
                            ? `${form.accountHolder}${last4 ? ` ••••${last4}` : ''}`
                            : provider === 'card'
                                ? 'Card payout account'
                                : 'Payout account'

                        const payload: PayoutAccountDraft = {
                            account_type: provider,
                            account_holder_name: form.accountHolder.trim(),
                            account_number: form.accountNumber.trim() || null,
                            bank_name: form.bankName.trim() || null,
                            routing_number: form.routingNumber.trim() || null,
                            card_expiry_month: form.expiryMonth.trim() || null,
                            card_expiry_year: form.expiryYear.trim() || null,
                            security_code: form.securityCode.trim() || null,
                            is_default: form.isDefault,
                        }

                        setFormError(null)
                        onContinue?.({ payload, displayLabel })
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
    initialEmail?: string
    onContinue?: (email: string) => void
}

export function AddAccountEmailModal({ open, onOpenChange, onContinue, initialEmail }: AddAccountEmailModalProps) {
    const [email, setEmail] = useState(initialEmail ?? '')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (open) {
            setEmail(initialEmail ?? '')
            setError(null)
        }
    }, [open, initialEmail])

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
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button
                    className="w-full rounded-2xl bg-(--color-accent-blue) text-white hover:bg-(--color-accent-blue-dark)"
                    onClick={() => {
                        if (!email.trim()) {
                            setError('Email is required to continue.')
                            return
                        }
                        setError(null)
                        onContinue?.(email.trim())
                    }}
                >
                    Continue
                </Button>
            </div>
        </PaymentModalShell>
    )
}
