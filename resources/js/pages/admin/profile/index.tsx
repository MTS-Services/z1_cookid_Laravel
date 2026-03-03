import React, { useMemo, useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { toast } from 'sonner';

interface AdminProfile {
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
}

interface Props {
    admin: AdminProfile;
    flash?: { success?: string };
}

export default function AdminProfileIndex({ admin, flash }: Props) {
    const [isEditing, setIsEditing] = useState(false);

    const initialData = useMemo(
        () => ({
            first_name: admin.first_name ?? '',
            last_name: admin.last_name ?? '',
            email: admin.email ?? '',
            phone: admin.phone ?? '',
            current_password: '',
            password: '',
            password_confirmation: '',
        }),
        [admin]
    );

    const { data, setData, patch, processing, errors, reset } = useForm(initialData);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('admin.profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                toast.success('Profile updated successfully');
                reset('current_password', 'password', 'password_confirmation');
            },
        });
    };

    const handleEdit = () => {
        setData({
            ...data,
            first_name: admin.first_name ?? '',
            last_name: admin.last_name ?? '',
            email: admin.email ?? '',
            phone: admin.phone ?? '',
        });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setData(initialData);
        reset();
    };

    return (
        <AdminLayout activeSlug="settings">
            <Head title="Profile" />

            <div className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold text-white">
                        Profile
                    </h1>
                    <p className="mt-1 text-sm text-muted">
                        Manage your account settings and preferences
                    </p>
                </header>

                <Card className="bg-bg-gray border-0 p-4">
                    <CardHeader>
                        <CardTitle className="text-white text-xl text-center">Personal Details</CardTitle>
                    </CardHeader>
                    <CardContent className="bg-card-foreground p-4 rounded-2xl">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name" className="text-muted-foreground">
                                        First Name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData('first_name', e.target.value)}
                                        disabled={!isEditing}
                                        className="border-input bg-transparent text-white placeholder:text-muted-foreground disabled:opacity-80"
                                        placeholder="Jenny"
                                    />
                                    {errors.first_name && (
                                        <p className="text-xs text-destructive">{errors.first_name}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name" className="text-muted-foreground">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="last_name"
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData('last_name', e.target.value)}
                                        disabled={!isEditing}
                                        className="border-input bg-transparent text-white placeholder:text-muted-foreground disabled:opacity-80"
                                        placeholder="Wilson"
                                    />
                                    {errors.last_name && (
                                        <p className="text-xs text-destructive">{errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-muted-foreground">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={!isEditing}
                                    className="border-input bg-transparent text-white placeholder:text-muted-foreground disabled:opacity-80"
                                    placeholder="almalowisong@example.com"
                                />
                                {errors.email && (
                                    <p className="text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-muted-foreground">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    disabled={!isEditing}
                                    className="border-input bg-transparent text-white placeholder:text-muted-foreground disabled:opacity-80"
                                    placeholder="0412 345 678"
                                />
                                {errors.phone && (
                                    <p className="text-xs text-destructive">{errors.phone}</p>
                                )}
                            </div>

                            {isEditing && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="current_password" className="text-muted-foreground">
                                            Current Password
                                        </Label>
                                        <PasswordInput
                                            id="current_password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            className="border-input bg-transparent text-white placeholder:text-muted-foreground"
                                            placeholder="••••••••"
                                        />
                                        {errors.current_password && (
                                            <p className="text-xs text-destructive">
                                                {errors.current_password}
                                            </p>
                                        )}
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
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                {isEditing && (
                                    <>
                                        <Button type="submit" disabled={processing}>
                                            {processing ? 'Saving...' : 'Save'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={processing}
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )}
                            </div>
                        </form>
                        {
                            !isEditing && (
                                <Button type="button" onClick={handleEdit}>
                                    Edit
                                </Button>
                            )
                        }
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
