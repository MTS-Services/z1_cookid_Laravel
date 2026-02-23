
import { ActionButton } from '@/components/ui/action-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin-layout';
import { Admin } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, SquarePen } from 'lucide-react';


interface Props {
    admin: Admin;
}

export default function View({ admin }: Props) {
    return (
        <AdminLayout activeSlug={'admin-solar-panels'}>
            <Head title="Solar Panel Details" />

            <div className="container mx-auto py-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Admin Detail</h1>
                    <div className="flex gap-2">
                      <ActionButton IconNode={ArrowLeft} href={route('admin.index')}>Back to admins</ActionButton>
                      <ActionButton IconNode={SquarePen} href={route('admin.edit', admin.id)}>Edit</ActionButton>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column */}
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>name</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg text-muted-foreground">{admin.name}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">
                                    {admin.email}
                                </p>
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
                                    <p className="text-sm text-muted-foreground">
                                        Created At
                                    </p>
                                    <p className="font-medium">{new Date(admin.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                      Updated At
                                    </p>
                                    <p className="font-medium">{ admin.updated_at ? new Date(admin.updated_at).toLocaleDateString() : 'N/A' }</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">
                                      Email Verified At
                                    </p>
                                    <p className="font-medium">{ admin.email_verified_at ? new Date(admin.email_verified_at).toLocaleDateString() : 'N/A' }</p>
                                </div>
                            </CardContent>
                        </Card>
                        {/* <Card>
                            <CardHeader>
                                <CardTitle>Additional Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    Use this area for notes, specifications, or
                                    any extra content. The spacing and
                                    typography keep the layout looking classic
                                    and professional.
                                </p>
                            </CardContent>
                        </Card> */}

                        
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}