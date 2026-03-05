import { type FormEvent, type HTMLInputTypeAttribute, useEffect, useMemo, useState } from 'react'
import { useForm, usePage, router } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { SharedData } from '@/types'
import { Label } from '@/components/ui/label'
import FileUpload from '@/components/file-upload'
import { toast } from 'sonner'

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

type AccountFormData = {
    first_name: string
    last_name: string
    email: string
    phone: string
    avatar: File | null
}

type ExistingAvatar = {
    id: string | number
    path: string
    url: string
    mime_type: string
    name?: string
}

type ProfileUser = SharedData['auth']['user'] & Partial<AccountFormData>

type EditableFieldKey = Exclude<keyof AccountFormData, 'avatar'>

/* -------------------------------------------------------------------------- */
/*                                   FIELDS                                   */
/* -------------------------------------------------------------------------- */

const fields: { key: EditableFieldKey; label: string; type?: HTMLInputTypeAttribute }[] = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'phone', label: 'Phone Number' },
]

/* -------------------------------------------------------------------------- */
/*                         EXISTING AVATAR BUILDER                            */
/* -------------------------------------------------------------------------- */

const buildExistingAvatar = (user: ProfileUser): ExistingAvatar[] => {
    if (!user.avatar_url) return []

    return [
        {
            id: 'current-avatar',
            path: typeof user.avatar === 'string' ? user.avatar : 'current-avatar',
            url: user.avatar_url,
            mime_type: 'image/*',
            name: 'Profile photo',
        },
    ]
}

/* -------------------------------------------------------------------------- */
/*                              COMPONENT                                     */
/* -------------------------------------------------------------------------- */

export function AccountSection() {
    const { auth } = usePage<SharedData>().props

    /* ---------------------------- Safe user object ---------------------------- */

    const fallbackUser: ProfileUser = {
        id: 0,
        email: '',
        phone: '',
        email_verified_at: null,
        created_at: '',
        updated_at: '',
        first_name: '',
        last_name: '',
        avatar_url: '',
        avatar: null,
    }

    const user: ProfileUser = {
        ...fallbackUser,
        ...(auth?.user as ProfileUser | undefined),
    }

    /* --------------------------- Initial Form Data --------------------------- */

    const initialValues = useMemo<AccountFormData>(() => {
        const derivedFirstName = user.first_name ?? user.name?.split(' ')[0] ?? ''
        const derivedLastName = user.last_name ?? user.name?.split(' ').slice(1).join(' ') ?? ''

        return {
            first_name: derivedFirstName,
            last_name: derivedLastName,
            email: user.email ?? '',
            phone: user.phone ?? '',
            avatar: null,
        }
    }, [user.first_name, user.last_name, user.name, user.email, user.phone])

    const { data, setData, post, processing, errors, recentlySuccessful } =
        useForm<AccountFormData>(initialValues)

    /* ------------------------- Reset when user changes ------------------------ */

    useEffect(() => {
        setData(initialValues)
    }, [initialValues])

    /* --------------------------- Existing Avatar ----------------------------- */

    const [existingFiles, setExistingFiles] = useState<ExistingAvatar[]>([])

    useEffect(() => {
        setExistingFiles(buildExistingAvatar(user))
    }, [user.avatar_url, user.avatar])

    /* -------------------------- Remove Existing ------------------------------ */

    const handleRemoveExisting = () => {
        if (
            confirm(
                'Are you sure you want to remove this photo? Upload a new one before saving.'
            )
        ) {
            setExistingFiles([])
            setData('avatar', null)
        }
    }

    /* ------------------------------ Submit ----------------------------------- */

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        post(route('user.profile.update'), {
            preserveScroll: true,
            forceFormData: true,

            onSuccess: () => {
                router.reload({ only: ['auth'] })
                setData('avatar', null)
                setExistingFiles([])
                toast.success('Profile updated successfully')
            },
        })
    }

    /* -------------------------------------------------------------------------- */

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

                    {/* ---------------- Avatar + Fields Row ---------------- */}

                    <div className="flex flex-col gap-6 lg:flex-row lg:items-center">

                        {/* Avatar Upload */}
                        <div className="grid gap-2 w-36 lg:mr-6">
                            <Label htmlFor="avatar">Image</Label>

                            <FileUpload
                                value={data.avatar}
                                onChange={(file) =>
                                    setData('avatar', file as File | null)
                                }
                                existingFiles={existingFiles}
                                onRemoveExisting={handleRemoveExisting}
                                accept="image/*"
                                maxSize={10}
                            />

                            {errors.avatar && (
                                <p className="text-xs text-rose-400">
                                    {errors.avatar}
                                </p>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid flex-1 gap-6 md:grid-cols-2">
                            {fields.map(({ key, label, type }) => (
                                <label key={key} className="space-y-2 text-sm">
                                    <span className="text-slate-300 font-semibold">
                                        {label}
                                    </span>

                                    <input
                                        type={type ?? 'text'}
                                        name={key}
                                        value={data[key] ?? ''}
                                        onChange={(event) =>
                                            setData(key, event.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#292929] bg-slate-950/60 px-4 py-3 text-white focus:border-navy focus:outline-none"
                                    />

                                    {errors[key] && (
                                        <p className="text-xs text-rose-400">
                                            {errors[key]}
                                        </p>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={processing}
                        className="self-start bg-navy hover:bg-navy px-8 cursor-pointer disabled:opacity-70"
                    >
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </form>
            </Card>
        </section>
    )
}