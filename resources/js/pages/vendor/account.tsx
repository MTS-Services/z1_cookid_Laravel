import VendorLayout from '@/layouts/vendor-layout'
import { useForm, usePage } from '@inertiajs/react'
import { Camera } from 'lucide-react'
import { FormEvent, useEffect, useMemo, useState } from 'react'

type VendorAccountPageProps = {
    vendor: {
        id: number
        first_name: string | null
        last_name: string | null
        email: string
        phone: string | null
        shop_name: string | null
        region_state: string | null
        city: string | null
        zip_code: string | null
        address: string | null
        profile_photo_url?: string | null
    }
    flash?: {
        success?: string
    }
}

export default function Account() {
    const { props } = usePage<VendorAccountPageProps>()
    const vendor = props.vendor

    const defaultAvatar = vendor.profile_photo_url ?? '/user.png'

    const initialFormData = useMemo(
        () => ({
            profile_photo: null as File | null,
            shop_name: vendor.shop_name ?? '',
            first_name: vendor.first_name ?? '',
            last_name: vendor.last_name ?? '',
            email: vendor.email ?? '',
            phone: vendor.phone ?? '',
            region_state: vendor.region_state ?? '',
            city: vendor.city ?? '',
            zip_code: vendor.zip_code ?? '',
            address: vendor.address ?? '',
            current_password: '',
            password: '',
            password_confirmation: '',
        }),
        [vendor]
    )

    const { data, setData, patch, processing, errors, recentlySuccessful, reset } = useForm(initialFormData)

    const [photoPreview, setPhotoPreview] = useState(defaultAvatar)

    useEffect(() => {
        setData(initialFormData)
        setPhotoPreview(defaultAvatar)
    }, [initialFormData, defaultAvatar, setData])

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null
        setData('profile_photo', file)

        if (file) {
            const reader = new FileReader()
            reader.onload = e => {
                setPhotoPreview(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        } else {
            setPhotoPreview(defaultAvatar)
        }
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()

        patch(route('vendor.account.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset('profile_photo', 'current_password', 'password', 'password_confirmation')
            },
        })
    }

    return (
        <VendorLayout activeSlug="account">
            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-white">Account Setting</h1>
                    <p className="text-sm text-slate-400">Manage how your shop looks across Glossed Marketplace.</p>
                    {props.flash?.success && (
                        <p className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">
                            {props.flash.success}
                        </p>
                    )}
                    {recentlySuccessful && !props.flash?.success && (
                        <p className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">Changes saved</p>
                    )}
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-white/5 bg-bg-gray/80 p-6 shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
                >
                    <div className="flex flex-col items-center gap-4 border-b border-white/5 pb-8 md:flex-row md:items-start md:gap-8">
                        <div className="relative">
                            <img
                                src={photoPreview}
                                alt="Profile"
                                className="h-32 w-32 rounded-full border-4 border-white/10 object-cover"
                            />
                            <label
                                htmlFor="profile_photo"
                                className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-navy text-white shadow-lg"
                            >
                                <Camera size={16} />
                                <input
                                    id="profile_photo"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                />
                            </label>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-xl font-semibold text-white">{vendor.shop_name ?? 'Your Shop'}</h2>
                            <p className="text-sm text-slate-400">Upload a clear photo so customers can recognize your storefront.</p>
                            {errors.profile_photo && <p className="mt-2 text-xs text-red-400">{errors.profile_photo}</p>}
                        </div>
                    </div>

                    <div className="mt-8 space-y-6 text-white">
                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Shop Name</label>
                            <input
                                type="text"
                                value={data.shop_name}
                                onChange={e => setData('shop_name', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                placeholder="Enter your shop name"
                            />
                            {errors.shop_name && <p className="mt-1 text-xs text-red-400">{errors.shop_name}</p>}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">First Name</label>
                                <input
                                    type="text"
                                    value={data.first_name}
                                    onChange={e => setData('first_name', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                    placeholder="First name"
                                />
                                {errors.first_name && <p className="mt-1 text-xs text-red-400">{errors.first_name}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Last Name</label>
                                <input
                                    type="text"
                                    value={data.last_name}
                                    onChange={e => setData('last_name', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                    placeholder="Display name"
                                />
                                {errors.last_name && <p className="mt-1 text-xs text-red-400">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                    placeholder="your@email.com"
                                />
                                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Phone Number</label>
                                <input
                                    type="text"
                                    value={data.phone}
                                    onChange={e => setData('phone', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                    placeholder="+1-202-555-0118"
                                />
                                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Current Password</label>
                                <input
                                    type="password"
                                    value={data.current_password}
                                    onChange={e => setData('current_password', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                    placeholder="****************"
                                />
                                {errors.current_password && <p className="mt-1 text-xs text-red-400">{errors.current_password}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">New Password</label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                    placeholder="****************"
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Location</label>
                            <input
                                type="text"
                                value={data.region_state}
                                onChange={e => setData('region_state', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                placeholder="Downtown"
                            />
                            {errors.region_state && <p className="mt-1 text-xs text-red-400">{errors.region_state}</p>}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">City</label>
                                <input
                                    type="text"
                                    value={data.city}
                                    onChange={e => setData('city', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                />
                                {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
                            </div>
                            <div>
                                <label className="mb-2 block text-sm text-slate-300">Zip Code</label>
                                <input
                                    type="text"
                                    value={data.zip_code}
                                    onChange={e => setData('zip_code', e.target.value)}
                                    className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                />
                                {errors.zip_code && <p className="mt-1 text-xs text-red-400">{errors.zip_code}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm text-slate-300">Address</label>
                            <textarea
                                rows={3}
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-sm focus:border-navy focus:outline-none"
                                placeholder="Road No. 13/1, House no. 1230/C, Flat No. 5D"
                            />
                            {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy/90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </section>
        </VendorLayout>
    )
}
