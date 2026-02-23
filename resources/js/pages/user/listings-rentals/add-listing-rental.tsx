import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { ActionButton } from '@/components/ui/action-button';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'sonner';
import AddFeatureModal from '@/components/add-feature-modal';
import PetEssentialsInput, { PetEssential } from '@/components/pet-essentials-input';
import UserDashboardLayout from '@/layouts/user-dashboard-layout';

interface FormData {
    user_id?: string | number;
    sort_order: string;
    city_id: string;
    title: string;
    description: string;
    purchase_price: string;
    property_type: string;
    security_deposit?: string;
    lease_length?: string;
    bedrooms?: string;
    bathrooms?: string;
    square_feet?: string;
    pet_friendly?: string;
    parking_garage?: string;
    primary_image_url: File | null;
    gallery_images: File[];
    status: string;
    features: number[];
    youtube_video_url?: string;
    pet_essentials: PetEssential[];
}

export default function Create({
    cities = [],
    propertyTypes = [],
    users = [],
    status = {},
    features: initialfeatures = [],
    selectedUserId,
    featureCategories = [],
}: any = {}) {
    const [features, setfeatures] = useState(initialfeatures);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: '',
        description: '',
        purchase_price: '',
        property_type: '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        city_id: '',
        user_id: selectedUserId ? String(selectedUserId) : '',
        sort_order: '0',
        status: '',
        primary_image_url: null,
        gallery_images: [],
        features: [],
        youtube_video_url: '',
        pet_essentials: [], // 👈 new
    });

    const handleAddFeature = async (name: string, categoryId: number) => {
        setModalLoading(true);
        try {
            const res = await axios.post(route('admin.feature.store'), {
                name,
                feature_category_id: categoryId,
            });
            setfeatures([...features, res.data]);
            toast.success('Feature added successfully.');
            setModalOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add feature');
        } finally {
            setModalLoading(false);
        }
    };

    const handleFacilityToggle = (id: number) => {
        const current = [...data.features];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('features', current);
    };

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(route('user.store-listing-rental'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Rental listing created successfully.');
            },
            onError: () => {
                toast.error('Failed to create rental listing.');
            },
        });
    }

    const normalizedPropertyTypes = Array.isArray(propertyTypes)
        ? propertyTypes
        : Object.entries(propertyTypes ?? {}).map(([value, label]) => ({
              value,
              label,
          }));

    const statusOptions = Array.isArray(status)
        ? status
        : Object.entries(status ?? {}).map(([value, label]) => ({
              value,
              label,
          }));

    return (
        <UserDashboardLayout>
            <Head title="Create Rental Listing" />

            <AddFeatureModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleAddFeature}
                featureCategories={featureCategories}
                loading={modalLoading}
            />

            <CardContent>
                <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-2xl">Create Rental Listing</CardTitle>
                    <ActionButton href={route('user.listings-rentals')} IconNode={ArrowLeft}>
                        Back to Rentals
                    </ActionButton>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                            {/* Primary Image */}
                            <div className="w-80 col-span-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="primary_image_url">Image</Label>
                                    <FileUpload
                                        value={data.primary_image_url}
                                        onChange={(file) =>
                                            setData('primary_image_url', file as File | null)
                                        }
                                        accept="image/*"
                                        maxSize={10}
                                    />
                                    <InputError message={errors.primary_image_url} />
                                </div>
                            </div>

                            {/* Photo Gallery */}
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="gallery_images">Photo Gallery*</Label>
                                <input
                                    id="gallery_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setData('gallery_images', Array.from(e.target.files));
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100 file:transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">Maximum file size: 200 MB total</p>
                                <InputError message={errors.gallery_images} />
                            </div>

                            {/* User */}
                            <div className="grid gap-2">
                                <Label>User</Label>
                                <Select
                                    value={data.user_id}
                                    onValueChange={(v) => setData('user_id', v)}
                                    disabled={!!selectedUserId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {users.map((user: any) => (
                                            <SelectItem key={user.id} value={String(user.id)}>
                                                {user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.user_id} />
                            </div>

                            {/* Listing Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">Listing Title*</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter listing title"
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Purchase Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="purchase_price">Purchase Price*</Label>
                                <Input
                                    id="purchase_price"
                                    type="text"
                                    value={data.purchase_price}
                                    onChange={(e) => setData('purchase_price', e.target.value)}
                                    placeholder="Enter purchase price"
                                />
                                <InputError message={errors.purchase_price} />
                            </div>

                            {/* City */}
                            <div className="grid gap-2">
                                <Label htmlFor="city_id">City*</Label>
                                <Select
                                    value={data.city_id}
                                    onValueChange={(value) => setData('city_id', value)}
                                >
                                    <SelectTrigger className="datatable-select">
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city: any) => (
                                            <SelectItem key={city.id} value={String(city.id)}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.city_id} />
                            </div>

                            {/* Status */}
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status*</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statusOptions.map((option: any) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} />
                            </div>

                            {/* Property Type */}
                            <div className="grid gap-2">
                                <Label htmlFor="property_type">Property Type*</Label>
                                <Select
                                    value={data.property_type}
                                    onValueChange={(value) => setData('property_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {normalizedPropertyTypes.map((type: any) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.property_type} />
                            </div>

                            {/* Bedrooms */}
                            <div className="grid gap-2">
                                <Label htmlFor="bedrooms">Bedrooms*</Label>
                                <Input
                                    id="bedrooms"
                                    type="number"
                                    min="0"
                                    value={data.bedrooms}
                                    onChange={(e) => setData('bedrooms', e.target.value)}
                                    placeholder="Type number of bedrooms"
                                />
                                <InputError message={errors.bedrooms} />
                            </div>

                            {/* Bathrooms */}
                            <div className="grid gap-2">
                                <Label htmlFor="bathrooms">Bathrooms*</Label>
                                <Input
                                    id="bathrooms"
                                    type="number"
                                    min="0"
                                    value={data.bathrooms}
                                    onChange={(e) => setData('bathrooms', e.target.value)}
                                    placeholder="Type number of bathrooms"
                                />
                                <InputError message={errors.bathrooms} />
                            </div>

                            {/* Square Feet */}
                            <div className="grid gap-2">
                                <Label htmlFor="square_feet">Square Feet*</Label>
                                <Input
                                    id="square_feet"
                                    type="number"
                                    min="0"
                                    value={data.square_feet}
                                    onChange={(e) => setData('square_feet', e.target.value)}
                                    placeholder="Type square footage"
                                />
                                <InputError message={errors.square_feet} />
                            </div>

                            {/* Security Deposit */}
                            <div className="grid gap-2">
                                <Label htmlFor="security_deposit">Security Deposit</Label>
                                <Input
                                    id="security_deposit"
                                    type="number"
                                    value={data.security_deposit}
                                    onChange={(e) => setData('security_deposit', e.target.value)}
                                    placeholder="Enter security deposit"
                                />
                                <InputError message={errors.security_deposit} />
                            </div>

                            {/* Lease Length */}
                            <div className="grid gap-2">
                                <Label htmlFor="lease_length">Lease Length</Label>
                                <Input
                                    id="lease_length"
                                    type="number"
                                    value={data.lease_length}
                                    onChange={(e) => setData('lease_length', e.target.value)}
                                    placeholder="Enter lease length"
                                />
                                <InputError message={errors.lease_length} />
                            </div>

                            {/* Parking / Garage Spaces */}
                            <div className="grid gap-2">
                                <Label htmlFor="parking_garage">Parking / Garage Spaces*</Label>
                                <Input
                                    id="parking_garage"
                                    type="number"
                                    min="0"
                                    value={data.parking_garage}
                                    onChange={(e) => setData('parking_garage', e.target.value)}
                                    placeholder="Enter number of parking spaces"
                                />
                                <InputError message={errors.parking_garage} />
                            </div>

                            {/* YouTube Video URL */}
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="youtube_video_url">YouTube Video URL</Label>
                                <Input
                                    id="youtube_video_url"
                                    type="text"
                                    value={data.youtube_video_url}
                                    onChange={(e) => setData('youtube_video_url', e.target.value)}
                                    placeholder="Type YouTube Video URL"
                                />
                                <InputError message={errors.youtube_video_url} />
                            </div>

                            {/* Pet Friendly */}
                            <div className="grid gap-2 col-span-2">
                                <Label>Pet Friendly*</Label>
                                <div className="space-y-2">
                                    <label className="flex cursor-pointer items-center gap-2 font-normal">
                                        <input
                                            type="radio"
                                            name="pet_friendly"
                                            value="yes"
                                            checked={data.pet_friendly === 'yes'}
                                            onChange={(e) => setData('pet_friendly', e.target.value)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        Yes
                                    </label>
                                    <label className="flex cursor-pointer items-center gap-2 font-normal">
                                        <input
                                            type="radio"
                                            name="pet_friendly"
                                            value="no"
                                            checked={data.pet_friendly === 'no'}
                                            onChange={(e) => setData('pet_friendly', e.target.value)}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        No
                                    </label>
                                </div>
                                <InputError message={errors.pet_friendly} />
                            </div>

                            {/* ✅ Pet Essentials Section */}
                            <div className="grid gap-3 col-span-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Pet Essentials</Label>
                                    <span className="text-xs text-muted-foreground">
                                        Add details for each allowed pet type
                                    </span>
                                </div>
                                <PetEssentialsInput
                                    value={data.pet_essentials}
                                    onChange={(items) => setData('pet_essentials', items)}
                                    error={errors.pet_essentials as string | undefined}
                                />
                            </div>

                            {/* Listing Description */}
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="description">Listing Description</Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition resize-none"
                                    placeholder="Enter listing description"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Features Section */}
                            <div className="grid gap-2 mb-8 col-span-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Features</Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        + Add New
                                    </Button>
                                </div>

                                <div className="space-y-4 p-4 border rounded-md bg-slate-50">
                                    {featureCategories.map((category: any) => {
                                        const categoryFeatures = features.filter(
                                            (f: any) => f.feature_category_id === category.id,
                                        );
                                        if (categoryFeatures.length === 0) return null;
                                        return (
                                            <div key={category.id}>
                                                <p className="text-sm font-semibold text-slate-700 mb-2 border-b pb-1">
                                                    {category.name}
                                                </p>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                                    {categoryFeatures.map((facility: any) => (
                                                        <div key={facility.id} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`facility-${facility.id}`}
                                                                className="h-4 w-4 rounded border-gray-300 text-slate-800 focus:ring-slate-500"
                                                                checked={data.features.includes(facility.id)}
                                                                onChange={() => handleFacilityToggle(facility.id)}
                                                            />
                                                            <label
                                                                htmlFor={`facility-${facility.id}`}
                                                                className="text-sm font-medium leading-none cursor-pointer"
                                                            >
                                                                {facility.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <InputError message={errors.features} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-secondary hover:bg-primary text-white px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? 'Creating...' : 'Create Rental Listing'}
                        </button>
                    </form>
                </CardContent>
            </CardContent>
        </UserDashboardLayout>
    );
}