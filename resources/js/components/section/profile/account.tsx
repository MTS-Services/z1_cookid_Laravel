import { type FormEvent, type HTMLInputTypeAttribute, useEffect, useMemo, useState } from 'react'
import { useForm, usePage } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { SharedData } from '@/types'
import { Label } from '@/components/ui/label'
import FileUpload from '@/components/file-upload'

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

const fields: { key: EditableFieldKey; label: string; type?: HTMLInputTypeAttribute }[] = [
    { key: 'first_name', label: 'First Name' },
    { key: 'last_name', label: 'Last Name' },
    { key: 'email', label: 'Email Address', type: 'email' },
    { key: 'phone', label: 'Phone Number' },
]

export function AccountSection() {
    const { auth } = usePage<SharedData>().props
    const fallbackUser: ProfileUser = {
        id: 0,
        email: '',
        phone: '',
        email_verified_at: null,
        created_at: '',
        updated_at: '',
        first_name: '',
        last_name: '',
        image_url: '',
        avatar: null,
    }
    const user: ProfileUser = {
        ...fallbackUser,
        ...(auth?.user as ProfileUser | undefined),
    }

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

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm<AccountFormData>(initialValues)

    useEffect(() => {
        setData(() => initialValues)
    }, [initialValues, setData])

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        post(route('user.profile.update'), {
            preserveScroll: true,
            forceFormData: true,
        })
    }

    const buildExistingAvatar = (): ExistingAvatar[] => {
        if (!user.image_url) {
            return []
        }

        const avatarPath = typeof user.avatar === 'string' ? user.avatar : 'current-avatar'

        return [
            {
                id: 'current-avatar',
                path: avatarPath,
                url: user.image_url,
                mime_type: 'image/jpeg',
                name: 'Profile photo',
            },
        ]
    }

    const [existingFiles, setExistingFiles] = useState<ExistingAvatar[]>(buildExistingAvatar)

    useEffect(() => {
        setExistingFiles(buildExistingAvatar())
    }, [user.image_url, user.avatar])

    const handleRemoveExisting = (fileId: string | number) => {
        setExistingFiles((prev) => prev.filter((file) => file.id !== fileId))
        setData('avatar', null)
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
                        <div className="grid gap-2 max-w-36">
                            {/* <Label htmlFor="image">Image</Label> */}
                            {/* <FileUpload
                                value={data.avatar}
                                onChange={(file) => setData('avatar', file as File | null)}
                                existingFiles={existingFiles}
                                onRemoveExisting={handleRemoveExisting}
                                accept="image/*"
                                maxSize={10}
                                error={errors.avatar}
                            />
                            {errors.avatar && <p className="text-xs text-rose-400">{errors.avatar}</p>} */}
                            <img src={data.avatar ? URL.createObjectURL(data.avatar) : user.image_url} alt="" />
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
