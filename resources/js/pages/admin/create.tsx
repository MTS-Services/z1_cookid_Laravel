import React, { useEffect } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FileUpload from '@/components/file-upload';
import { storeAdmin, index } from '@/actions/App/Http/Controllers/Admin/AdminController';

interface FormData {
    username: string;
    name: string;
    email: string;
    phone: string;
    your_self: string;
    image: null | File | null,
    password: string;
    password_confirmation: string;
}

export default function CreateAdmin() {
    const { data, setData, post, processing, errors } = useForm<FormData>({
        username: '',
        name: '',
        email: '',
        phone: '',
        your_self: '',
        image: null,
        password: '',
        password_confirmation: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        post(storeAdmin.url(), {
            onSuccess: () => router.visit(route('admin.index')),
        });
    }

    return (
        <AdminLayout activeSlug="admin-users">
            <Head title="Create User" />

            <Card>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className='text-2xl'>Create New User</CardTitle>
                    <Link href={index.url()} className="ml-auto">
                        <Button>Back to Admin</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4 grid md:grid-cols-2 gap-6">
                            {/* Image */}
                            <div className="grid gap-2">
                                <Label htmlFor="image">Image</Label>
                                <FileUpload
                                    value={data.image}
                                    onChange={(file) => setData('image', file as File | null)}
                                    accept="image/*"
                                    maxSize={10}
                                />
                            </div>
                            <div></div>
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    value={data.username}
                                    onChange={(e) => setData('username', e.target.value)}
                                    required
                                />
                                {errors.username && <div className="text-red-500 text-sm">{errors.username}</div>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                {errors.name && <div className="text-red-500 text-sm">{errors.name}</div>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                />
                                {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="your_self">Your Self</Label>
                                <Input
                                    id="your_self"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('your_self', e.target.value)}
                                    required
                                />
                                {errors.your_self && <div className="text-red-500 text-sm">{errors.your_self}</div>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                {errors.password && <div className="text-red-500 text-sm">{errors.password}</div>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create User'}
                            </Button>
                            <Link href={index.url()}>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AdminLayout>
    );
}
