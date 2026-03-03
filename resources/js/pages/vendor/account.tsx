import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import VendorLayout from '@/layouts/vendor-layout';
import { Camera } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PasswordInput } from '@/components/ui/password-input';

type VendorAccountPageProps = {
    vendor: {
        id: number;
        first_name: string | null;
        last_name: string | null;
        email: string;
        phone: string | null;
        shop_name: string | null;
        region_state: string | null;
        city: string | null;
        zip_code: string | null;
        address: string | null;
        avatar_url?: string | null;
    };
    flash?: {
        success?: string;
    };
};

export default function Account() {
    const { props } = usePage<VendorAccountPageProps>();
    const vendor = props.vendor;
    const defaultAvatar = vendor.avatar_url ?? '/user.png';

    const initialFormData = useMemo(
        () => ({
            _method: 'PATCH',
            avatar: null as File | null,
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
    );

    const { data, setData, post, processing, errors, reset } = useForm(initialFormData);
    const [photoPreview, setPhotoPreview] = useState(defaultAvatar);

    const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null;
        setData('avatar', file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPhotoPreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        post(route('vendor.account.update'), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                toast.success('Account updated successfully');
                reset('avatar', 'current_password', 'password', 'password_confirmation');
            },
        });
    };

    return (
        <VendorLayout activeSlug="account">
            <Head title="Account Settings" />
            <section className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-white">Account Setting</h1>
                    <p className="text-sm text-slate-400">Manage how your shop looks across Glossed Marketplace.</p>
                </header>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-3xl border border-white/5 bg-bg-gray/80 p-6 shadow-xl"
                >
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4 border-b border-white/5 pb-8 md:flex-row md:items-start md:gap-8">
                        <div className="relative">
                            <img
                                src={photoPreview}
                                alt="Profile"
                                className="h-32 w-32 rounded-full border-4 border-white/10 object-cover"
                            />
                            <label
                                htmlFor="avatar"
                                className="absolute bottom-2 right-2 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-navy text-white shadow-lg hover:bg-navy/90 transition-colors"
                            >
                                <Camera size={16} />
                                <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                            </label>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-xl font-semibold text-white">{vendor.shop_name ?? 'Your Shop'}</h2>
                            <p className="text-sm text-slate-400">Upload a clear photo so customers can recognize your storefront.</p>
                            {errors.avatar && <p className="mt-2 text-xs text-red-400">{errors.avatar}</p>}
                        </div>
                    </div>

                    {/* Form Fields Section */}
                    <div className="mt-8 space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="shop_name" className="text-slate-300">Shop Name</Label>
                            <Input
                                id="shop_name"
                                value={data.shop_name}
                                onChange={(e) => setData('shop_name', e.target.value)}
                                className="bg-black/40 border-white/10 text-white"
                                placeholder="Enter your shop name"
                            />
                            {errors.shop_name && <p className="text-xs text-red-400">{errors.shop_name}</p>}
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-slate-300">First Name</Label>
                                <Input
                                    id="first_name"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="bg-black/40 border-white/10 text-white"
                                />
                                {errors.first_name && <p className="text-xs text-red-400">{errors.first_name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-slate-300">Last Name</Label>
                                <Input
                                    id="last_name"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="bg-black/40 border-white/10 text-white"
                                />
                                {errors.last_name && <p className="text-xs text-red-400">{errors.last_name}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="bg-black/40 border-white/10 text-white"
                                />
                                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="bg-black/40 border-white/10 text-white"
                                />
                                {errors.phone && <p className="text-xs text-red-400">{errors.phone}</p>}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="current_password" className="text-slate-300">Current Password</Label>
                                <PasswordInput
                                    id="current_password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    className="bg-black/40 border-white/10 text-white"
                                    placeholder="••••••••"
                                />
                                {errors.current_password && <p className="text-xs text-red-400">{errors.current_password}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-muted-foreground">
                                    New Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="border-input bg-transparent text-white placeholder:text-muted-foreground"
                                    placeholder="••••••••"
                                />
                                {errors.password && (
                                    <p className="text-xs text-destructive">{errors.password}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-muted-foreground">
                                    Confirm New Password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="border-input bg-transparent text-white placeholder:text-muted-foreground"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address" className="text-slate-300">Address</Label>
                            <Textarea
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                rows={3}
                                className="bg-black/40 border-white/10 text-white"
                                placeholder="Full shop address..."
                            />
                            {errors.address && <p className="text-xs text-red-400">{errors.address}</p>}
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-navy hover:bg-navy/90 text-white px-8 py-6"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </section>
        </VendorLayout>
    );
}