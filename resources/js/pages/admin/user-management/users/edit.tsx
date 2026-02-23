import React, { useEffect, useState } from 'react';
import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { update, index } from '@/actions/App/Http/Controllers/Admin/UserManagement/UserController';
import FileUpload from '@/components/file-upload';
import { toast } from 'sonner';
import { User } from '@/types';

interface Props {
    user: User;
}

export default function EditUser({ user }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        id: '',
        username: '',
        email: '',
        phone: '',
        brokerage_name: '',
        license_number: '',
        image: null as File | null,
        password: '',
        password_confirmation: '',
        _method: 'PUT',
    });
    const [existingFiles, setExistingFiles] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            setData({
                name: user.name,
                id: user.id,
                username: user.username || '',
                email: user.email,
                phone: user.phone || '',
                brokerage_name: user.brokerage_name || '',
                license_number: user.license_number || '',
                image: null,
                _method: 'PUT',
            });

            // Update existing files whenever information changes
            if (user.image) {
                setExistingFiles([{
                    id: user.id,
                    url: `${user.image_url}`,
                    name: user.image.split('/').pop(),
                    mime_type: 'image/*',
                    path: user.image,
                }]);
            } else {
                setExistingFiles([]);
            }
        }
    }, [user]);

    const handleRemoveExisting = () => {
        if (confirm('Are you sure you want to remove this file? You must upload a new file to save the changes.')) {
            setExistingFiles([]);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // @ts-ignore - Inertia will handle FormData correctly
        post(update.url(user.id), {
            forceFormData: true,
            onSuccess: () => {
                // Clear the "New Files" preview after successful upload
                setData('image', null);
                reset('image');
                setExistingFiles([]);
                toast.success('User updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update user.');
            }
        });
    };

    return (
        <AdminLayout activeSlug="admin-users">
            <Head title={`Edit User: ${user.name}`} />

            <CardHeader className="flex items-center flex-row justify-between">
                <h1 className="text-2xl font-bold">Edit User</h1>
                <Link href={index.url()} className="ml-auto">
                    <Button>Back to Users</Button>
                </Link>
            </CardHeader>

            <CardContent>
                <form onSubmit={submit} className="space-y-6">
                    <div className="space-y-4 grid md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="image">Image</Label>
                            <FileUpload
                                value={data.image}
                                onChange={(file) => setData('image', file as File | null)}
                                existingFiles={existingFiles}
                                onRemoveExisting={handleRemoveExisting}
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
                                
                            />
                            {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="brokerage_name">Brokerage Name</Label>
                            <Input
                                id="brokerage_name"
                                type="text"
                                value={data.brokerage_name}
                                onChange={(e) => setData('brokerage_name', e.target.value)}
                                
                            />
                            {errors.brokerage_name && <div className="text-red-500 text-sm">{errors.brokerage_name}</div>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="license_number">License Number</Label>
                            <Input
                                id="license_number"
                                type="text"
                                value={data.license_number}
                                onChange={(e) => setData('license_number', e.target.value)}
                                
                            />
                            {errors.license_number && <div className="text-red-500 text-sm">{errors.license_number}</div>}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update User'}
                        </Button>
                        <Link href={index.url()}>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </CardContent>
        </AdminLayout>
    );
}
