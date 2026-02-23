import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserDashboardLayout from '@/layouts/user-dashboard-layout';
import { useForm } from '@inertiajs/react';
import { id } from 'date-fns/locale';
import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

interface City {
    id: number;
    name: string;
}
interface Facility {
    id: number;
    name: string;
}

interface PropertyOption {
    value: string;
    label: string;
}

interface Listing {
    id: number;
    title: string;
    description: string;
    purchase_price: string;
    city_id: number;
    listing_status: string;
    property_type: string;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    primary_image_url: string | null;
    youtube_video_url: string;
    image_url: string[];
}

interface Props {
    listing: Listing;
    cities: City[];
    propertyTypes: PropertyOption[];
    propertyStatuses: PropertyOption[];
}

export default function EditListingHome({ listing, cities, propertyTypes, propertyStatuses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: listing.title || '',
        description: listing.description || '',
        purchase_price: listing.purchase_price || '',
        city_id: String(listing.city_id) || '',
        listing_status: listing.listing_status || propertyStatuses[0]?.value || '',
        property_type: listing.property_type || propertyTypes[0]?.value || '',
        bedrooms: String(listing.bedrooms) || '',
        bathrooms: String(listing.bathrooms) || '',
        square_feet: String(listing.square_feet) || '',
        primary_image_url: null as File | null,
        youtube_video_url: listing.youtube_video_url || '',
        gallery_images: [] as File[],
        _method: 'PUT',
    });
    const [existingFiles, setExistingFiles] = useState<any[]>([]);
    useEffect(() => {
        if (data) {
            setData({
                ...data,
                _method: 'PUT',
            });

            // Update existing files whenever information changes
            if (listing.primary_image_url) {
                setExistingFiles([{
                    id: listing.id,
                    url: listing.image_url,
                    name: listing.primary_image_url,
                    path: listing.primary_image_url,
                    mime_type: 'image/*'
                }]);
            } else {
                setExistingFiles([]);
            }
        }
    }, [listing]);

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('gallery_images', Array.from(e.target.files));
        }
    };
    const handleRemoveExisting = () => {
        if (confirm('Are you sure you want to remove this file? You must upload a new file to save the changes.')) {
            setExistingFiles([]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('user.update-listing-home', listing.id), {
            onSuccess: () => {
                toast.success('Listing updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update listing.');
            },
        });
    };

    return (
        <UserDashboardLayout>
            <div className="bg-gray-50 min-h-screen p-2">
                <div className="container mx-auto bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Listing</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Listing Title */}
                            <div className="mb-6 w-80 col-span-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="primary_image_url">Image</Label>
                                    <FileUpload
                                        value={data.primary_image_url}
                                        onChange={(file) => setData('primary_image_url', file as File | null)}
                                        existingFiles={existingFiles}
                                        onRemoveExisting={handleRemoveExisting}
                                        accept="image/*"
                                        maxSize={10}
                                    />
                                    <InputError message={errors.primary_image_url} />
                                </div>
                            </div>
                            {/* Photo Gallery */}
                            <div className="grid gap-2 mb-6 col-span-2">
                                <Label htmlFor="gallery_images">Photo Gallery*</Label>
                                <input
                                    id="gallery_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleGalleryImagesChange}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100 file:transition"
                                />
                                <p className="text-xs text-gray-500 mt-1">Maximum file size: 25 MB</p>
                                <InputError message={errors.gallery_images} />
                            </div>
                            {/* Listing Title */}
                            <div className="grid gap-2 mb-6">
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
                            <div className="grid gap-2 mb-6">
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
                            <div className="grid gap-2 mb-6">
                                <Label htmlFor="city_id">City*</Label>
                                <Select
                                    value={data.city_id}
                                    onValueChange={(value) => setData('city_id', value)}
                                >
                                    <SelectTrigger className="datatable-select">
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city) => (
                                            <SelectItem key={city.id} value={String(city.id)}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.city_id} />
                            </div>

                            {/* Listing Status */}
                            <div className="grid gap-2 mb-6">
                                <Label htmlFor="listing_status">Listing Status*</Label>
                                <Select
                                    value={data.listing_status}
                                    onValueChange={(value) => setData('listing_status', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select listing status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyStatuses.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.listing_status} />
                            </div>

                            {/* Property Type */}
                            <div className="grid gap-2 mb-6">
                                <Label htmlFor="property_type">Home Type*</Label>
                                <Select
                                    value={data.property_type}
                                    onValueChange={(value) => setData('property_type', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select home type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.property_type} />
                            </div>

                            {/* Bedrooms */}
                            <div className="grid gap-2 mb-6">
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
                            <div className="grid gap-2 mb-6">
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
                            <div className="grid gap-2 mb-8">
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
                            {/* Square Youtube Video */}
                            <div className="grid gap-2 mb-6 col-span-2">
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

                            {/* Listing Description */}
                            <div className="grid gap-2 mb-6 col-span-2">
                                <Label htmlFor="description">Listing Description*</Label>
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
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-md font-medium disabled:opacity-50 mt-4"
                        >
                            {processing ? 'Saving...' : 'Update Listing'}
                        </button>
                    </form>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
