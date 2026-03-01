import { type FormEvent, type HTMLInputTypeAttribute, useEffect, useMemo } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { SharedData } from '@/types'

type AccountFormFields = {
    first_name: string
    last_name: string
    email: string
    phone: string
}

type ProfileUser = SharedData['auth']['user'] & Partial<AccountFormFields>

const fields: { key: keyof AccountFormFields; label: string; type?: HTMLInputTypeAttribute }[] = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'phone', label: 'Phone Number' },
]

export function AccountSection() {
    const { auth } = usePage<SharedData>().props
    const fallbackUser: ProfileUser = {
        id: 0,
        username: '',
        name: '',
        email: '',
        phone: '',
        email_verified_at: null,
        created_at: '',
        updated_at: '',
        first_name: '',
        last_name: '',
        image_url: '',
    }
    const user: ProfileUser = {
        ...fallbackUser,
        ...(auth?.user as ProfileUser | undefined),
    }

    const initialValues = useMemo<AccountFormFields>(() => {
        const [firstName = '', lastName = ''] = (user.name ?? '').split(' ')
        return {
            first_name: user.first_name ?? firstName,
            last_name: user.last_name ?? lastName,
            email: user.email ?? '',
            phone: user.phone ?? '',
        }
    }, [user])

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<AccountFormFields>(initialValues)

    useEffect(() => {
        setData(() => initialValues)
    }, [initialValues, setData])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        post(route('user.profile.update'), {
            preserveScroll: true,
        })
    }

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Account Settings</h2>
                {recentlySuccessful && (
                    <span className="text-sm text-emerald-400">Saved!</span>
                )}
            </div>
            <Card className="bg-[#292929]/60 border-[#292929] text-white">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 py-8">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                        <div className="flex items-center justify-center w-24 h-24">
                            <img src={user.image_url ?? '/user.png'} alt={user.name ?? 'Profile photo'} />
                        </div>
                        <div className="grid flex-1 gap-6 md:grid-cols-2">
                            {fields.map(({ key, label, type }) => (
                                <label key={key} className="space-y-2 text-sm">
                                    <span className="text-slate-300 font-semibold">{label}</span>
                                    <input
                                        type={type ?? 'text'}
                                        name={key}
                                        value={data[key] ?? ''}
                                        onChange={(event) => setData(key, event.target.value)}
                                        className="w-full rounded-lg border border-[#292929] bg-slate-950/60 px-4 py-3 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                    {errors[key] && <p className="text-xs text-rose-400">{errors[key]}</p>}
                                </label>
                            ))}
                        </div>
                    </div>
                    <Button type="submit" disabled={processing} className="self-start bg-navy hover:bg-navy px-8 cursor-pointer disabled:opacity-70">
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </Card>
        </section>
    )
}
