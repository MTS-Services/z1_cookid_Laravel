import AdminLayout from '@/layouts/admin-layout';
import { Head, useForm } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { Save, ArrowLeft } from 'lucide-react';
import { ActionButton } from '@/components/ui/action-button';

interface Admin {
    id: number;
    name: string;
    email: string;
    phone: string;
    your_self: string | null;
    image_url: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    admin: Admin;
}

export default function EditAdmin({ admin }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: admin.name,
        id: admin.id,
        phone: admin.phone,
        email: admin.email, 
        your_self: admin.your_self,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('admin.update'));
    }

    return (
        <AdminLayout activeSlug="admins">
            <Head title={`Edit Admin: ${admin.name}`} />

            <CardHeader className="flex items-center flex-row justify-between">
                <h1 className="text-2xl font-bold">Edit Admin</h1>
                <ActionButton IconNode={ArrowLeft} href={route('admin.index')}>
                    Back
                </ActionButton>
            </CardHeader>

            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* LEFT SIDE */}
                        <div className="space-y-6 lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Basic Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* NAME (EDITABLE) */}
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }

                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    {/* EMAIL (READ ONLY) */}
                                    <div className="grid gap-2">
                                        <Label>Email</Label>
                                        <Input
                                            value={admin.email}
                                            readOnly
                                            className="bg-muted cursor-not-allowed"
                                        />
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
                                            value={data.your_self}
                                            onChange={(e) => setData('your_self', e.target.value)}
                                            required
                                        />
                                        {errors.your_self && <div className="text-red-500 text-sm">{errors.your_self}</div>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-sm text-muted-foreground">
                                            Email Verified At
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {admin.email_verified_at
                                                ? new Date(
                                                    admin.email_verified_at,
                                                ).toLocaleString()
                                                : 'Not Verified'}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-sm text-muted-foreground">
                                            Created At
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {new Date(
                                                admin.created_at,
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <Label className="text-sm text-muted-foreground">
                                            Updated At
                                        </Label>
                                        <p className="text-sm font-medium">
                                            {new Date(
                                                admin.updated_at,
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* ACTION */}
                            <Card>
                                <CardContent className="pt-6">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-black text-white hover:bg-black/80 cursor-pointer"
                                    >
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Updating…' : 'Update Admin'}
                                    </Button>

                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </CardContent>
        </AdminLayout>
    );
}
