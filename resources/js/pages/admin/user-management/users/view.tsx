
import React from 'react';
import { ActionButton } from '@/components/ui/action-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, SquarePen } from 'lucide-react';
import { edit, index } from '@/actions/App/Http/Controllers/Admin/UserManagement/UserController';


export default function View({ user }: User | any) {

    return (
        <AdminLayout activeSlug={'admin-users'}>
            <Head title="User Details" />

            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">User Detail</h1>
                    <div className="flex gap-2">
                        <ActionButton IconNode={ArrowLeft} href={index.url()}>Back to Users</ActionButton>
                        <ActionButton IconNode={SquarePen} href={edit.url(user.id)}>Edit</ActionButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {(user as any).image ? (
                                    <img src={(user as any).image_url} alt="user-image" className="w-48 h-48 object-cover rounded" />
                                ) : (
                                    <p className="text-muted-foreground">No image available</p>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Name</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg text-muted-foreground">{user.name ?? 'N/A'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Username</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{(user as any).username ?? 'N/A'}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{user.email ?? 'N/A'}</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Phone</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{(user as any).phone ?? 'N/A'}</p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Brokerage</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{(user as any).brokerage_name ?? 'N/A'}</p>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>License Number</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{(user as any).license_number ?? 'N/A'}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>License Verification Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{(user as any).license_verification_status ?? 'N/A'}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Insights</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created At</p>
                                    <p className="font-medium">{user.created_at ? new Date(user.created_at).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Updated At</p>
                                    <p className="font-medium">{user.updated_at ? new Date(user.updated_at).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email Verified At</p>
                                    <p className="font-medium">{user.email_verified_at ? new Date(user.email_verified_at).toLocaleString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Admin?</p>
                                    <p className="font-medium">{(user as any).is_admin ? 'Yes' : 'No'}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}