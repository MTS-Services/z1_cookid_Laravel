import AdminLayout from '@/layouts/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Head, useForm, usePage } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { toast } from 'sonner'
import InputError from '@/components/input-error'

type Settings = {
    stripe_publishable_key: string
    stripe_currency: string
    stripe_active: boolean
    paypal_client_id: string
    paypal_environment: string
    paypal_currency: string
    paypal_active: boolean
    has_stripe_secret: boolean
    has_paypal_client_secret: boolean
}

interface Props {
    settings: Settings
    flash?: { success?: string }
}

export default function PaymentGatewaysPage({ settings, flash = {} }: Props) {
    const pageFlash = (usePage().props as { flash?: Props['flash'] }).flash ?? flash

    const form = useForm({
        stripe_publishable_key: settings.stripe_publishable_key,
        stripe_secret: '',
        stripe_currency: settings.stripe_currency,
        stripe_active: settings.stripe_active,
        paypal_client_id: settings.paypal_client_id,
        paypal_client_secret: '',
        paypal_environment: settings.paypal_environment === 'live' ? 'live' : 'sandbox',
        paypal_currency: settings.paypal_currency,
        paypal_active: settings.paypal_active,
    })

    const submit: FormEventHandler = (e) => {
        e.preventDefault()
        form.put(route('admin.fm.payment-gateways.update'), {
            onSuccess: () => {
                toast.success('Payment gateways settings updated successfully')
            },
            onError: () => {
                toast.error('Failed to update payment gateways settings')
            },
            preserveScroll: true,
        })
    }

    return (
        <AdminLayout activeSlug="payment-gateways">
            <Head title="Payment gateways" />

            <section className="space-y-8 text-white">
                <header className="space-y-2">
                    <h1 className="text-2xl font-semibold">Payment gateways</h1>
                    {/* <p className="text-sm text-text-gray">
                        Stripe and PayPal credentials used for customer checkout. Values saved here override{' '}
                        <code className="rounded bg-white/10 px-1 py-0.5 text-xs">.env</code> when set. Secret keys are
                        encrypted in the database; leave secret fields empty to keep the current value.
                    </p> */}
                    <p className="text-sm text-text-gray">
                        For security, secret keys are encrypted and stored safely in the database. If you do not want to change an existing secret key, simply leave that field empty — the current value will remain unchanged.
                    </p>
                </header>
                <form onSubmit={submit} className="space-y-10 rounded-2xl border border-white/5 bg-bg-gray p-6">
                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold">Stripe</legend>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-bg-black/50 p-4">
                            <input
                                type="checkbox"
                                checked={form.data.stripe_active}
                                onChange={(e) => form.setData('stripe_active', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-text-border"
                            />
                            <span>
                                <span className="font-medium text-white">Active at checkout</span>
                                <span className="mt-1 block text-sm text-text-gray">
                                    When off, customers will not see Stripe on the booking payment step.
                                </span>
                            </span>
                        </label>
                        <div className="space-y-2">
                            <label htmlFor="stripe_publishable_key" className="text-sm font-medium text-text-gray">
                                Publishable key
                            </label>
                            <Input
                                id="stripe_publishable_key"
                                value={form.data.stripe_publishable_key}
                                onChange={(e) => form.setData('stripe_publishable_key', e.target.value)}
                                autoComplete="off"
                                className="border-text-border bg-bg-black text-white"
                            />
                            <InputError
                                message={form.errors.stripe_publishable_key}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="stripe_secret" className="text-sm font-medium text-text-gray">
                                Secret key
                            </label>
                            <Input
                                id="stripe_secret"
                                type="password"
                                value={form.data.stripe_secret}
                                onChange={(e) => form.setData('stripe_secret', e.target.value)}
                                placeholder={settings.has_stripe_secret ? '•••••••• (unchanged if left blank)' : 'sk_test_…'}
                                autoComplete="new-password"
                                className="border-text-border bg-bg-black text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="stripe_currency" className="text-sm font-medium text-text-gray">
                                Currency (ISO)
                            </label>
                            <Input
                                id="stripe_currency"
                                value={form.data.stripe_currency}
                                onChange={(e) => form.setData('stripe_currency', e.target.value)}
                                placeholder="usd"
                                className="border-text-border bg-bg-black text-white"
                            />
                        </div>
                    </fieldset>

                    <fieldset className="space-y-4">
                        <legend className="text-lg font-semibold">PayPal</legend>
                        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-bg-black/50 p-4">
                            <input
                                type="checkbox"
                                checked={form.data.paypal_active}
                                onChange={(e) => form.setData('paypal_active', e.target.checked)}
                                className="mt-1 h-4 w-4 rounded border-text-border"
                            />
                            <span>
                                <span className="font-medium text-white">Active at checkout</span>
                                <span className="mt-1 block text-sm text-text-gray">
                                    When off, customers will not see PayPal on the booking payment step.
                                </span>
                            </span>
                        </label>
                        <div className="space-y-2">
                            <label htmlFor="paypal_client_id" className="text-sm font-medium text-text-gray">
                                Client ID
                            </label>
                            <Input
                                id="paypal_client_id"
                                value={form.data.paypal_client_id}
                                onChange={(e) => form.setData('paypal_client_id', e.target.value)}
                                autoComplete="off"
                                className="border-text-border bg-bg-black text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="paypal_client_secret" className="text-sm font-medium text-text-gray">
                                Client secret
                            </label>
                            <Input
                                id="paypal_client_secret"
                                type="password"
                                value={form.data.paypal_client_secret}
                                onChange={(e) => form.setData('paypal_client_secret', e.target.value)}
                                placeholder={
                                    settings.has_paypal_client_secret
                                        ? '•••••••• (unchanged if left blank)'
                                        : 'PayPal secret'
                                }
                                autoComplete="new-password"
                                className="border-text-border bg-bg-black text-white"
                            />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label htmlFor="paypal_environment" className="text-sm font-medium text-text-gray">
                                    Environment
                                </label>
                                <select
                                    id="paypal_environment"
                                    value={form.data.paypal_environment}
                                    onChange={(e) => form.setData('paypal_environment', e.target.value)}
                                    className="border-text-border bg-bg-black h-10 w-full rounded-md border px-3 text-sm text-white"
                                >
                                    <option value="sandbox">Sandbox</option>
                                    <option value="live">Live</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="paypal_currency" className="text-sm font-medium text-text-gray">
                                    Currency (ISO)
                                </label>
                                <Input
                                    id="paypal_currency"
                                    value={form.data.paypal_currency}
                                    onChange={(e) => form.setData('paypal_currency', e.target.value)}
                                    placeholder="USD"
                                    className="border-text-border bg-bg-black text-white"
                                />
                            </div>
                        </div>
                    </fieldset>

                    {Object.keys(form.errors).length > 0 ? (
                        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                            {Object.values(form.errors).map((msg) => (
                                <p key={msg}>{msg}</p>
                            ))}
                        </div>
                    ) : null}

                    <Button type="submit" disabled={form.processing} className="bg-navy text-white hover:bg-navy/90">
                        {form.processing ? 'Saving…' : 'Save settings'}
                    </Button>
                </form>
            </section>
        </AdminLayout>
    )
}
