import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import UserDashboardLayout from '@/layouts/user-dashboard-layout';
import { useForm } from '@inertiajs/react';
import { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios'; // Ensure axios is imported for adding new features

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

interface Props {
    cities: City[];
    propertyTypes: PropertyOption[];
    propertyStatuses: PropertyOption[];
}

export default function AddListingHome({ cities, propertyTypes, propertyStatuses }: Props) {
    const [activeTab, setActiveTab] = useState('manual');

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        purchase_price: '',
        city_id: '',
        listing_status: propertyStatuses[0]?.value || '',
        property_type: propertyTypes[0]?.value || '',
        bedrooms: '',
        bathrooms: '',
        square_feet: '',
        primary_image_url: null as File | null,
        youtube_video_url: '',
        gallery_images: [] as File[],
    });

    const { data: linkData, setData: setLinkData, post: postLink, processing: linkProcessing, errors: linkErrors } = useForm({
        name: '',
        email: '',
        external_link: '',
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(data);
        post(route('user.store-listing-home'), {
            onSuccess: () => {
                reset();
                toast.success('Listing created successfully.');
            },
            onError: () => {
                console.log(data);
                toast.error('Failed to create listing.');
            },
        });
    };

    const handleLinkSubmit = (e: FormEvent) => {
        e.preventDefault();
        postLink(route('user.add-listing-link-store'), {
            onSuccess: () => {
                setLinkData({
                    name: '',
                    email: '',
                    external_link: '',
                });
                toast.success('Listing created successfully.');
            },
            onError: () => {
                toast.error('Failed to create listing.');
            },
        });
    };

    const handlePrimaryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setData('primary_image_url', e.target.files[0]);
        }
    };

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData('gallery_images', Array.from(e.target.files));
        }
    };


    return (
        <UserDashboardLayout>
            <div className="bg-gray-50 min-h-screen">
                <div className="contact mx-auto">
                    {/* Header Buttons */}
                    <div className="flex gap-3 mb-4 justify-center">
                        <button
                            onClick={() => setActiveTab('manual')}
                            className={`px-6 py-2.5 rounded-md font-medium transition-colors ${activeTab === 'manual'
                                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                                : 'bg-white text-slate-800 border border-slate-300'
                                }`}
                        >
                            Add Listing Manually
                        </button>
                        <button
                            onClick={() => setActiveTab('link')}
                            className={`px-6 py-2.5 rounded-md font-medium transition-colors ${activeTab === 'link'
                                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                                : 'bg-white text-slate-800 border border-slate-300'
                                }`}
                        >
                            Submit Listing via Link
                        </button>
                    </div>

                    {/* Form Container */}
                    <div className="bg-white rounded-lg p-8 shadow-lg">
                        {activeTab === 'manual' && (
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    <div className="w-80 col-span-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="primary_image_url">Image</Label>
                                            <FileUpload
                                                value={data.primary_image_url}
                                                onChange={(file) => setData('primary_image_url', file as File | null)}
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
                                            onChange={handleGalleryImagesChange}
                                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-gray-300 file:text-sm file:font-medium file:bg-gray-50 hover:file:bg-gray-100 file:transition"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Maximum file size: 25 MB</p>
                                        <InputError message={errors.gallery_images} />
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
                                    <div className="grid gap-2">
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
                                    <div className="grid gap-2">
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
                                    {/* Square Youtube Video */}
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
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-secondary hover:bg-primary text-white px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                >
                                    {processing ? 'Submitting...' : 'Submit Listing for Review'}
                                </button>
                            </form>
                        )}

                        {activeTab === 'link' && (
                            <form onSubmit={handleLinkSubmit} className="space-y-6 max-w-2xl">
                                <div className="grid gap-2">
                                    <Label htmlFor="external_link">External Link (Zillow, Realtor, Redfin or Broker)</Label>
                                    <Input
                                        id="external_link"
                                        type="url"
                                        value={linkData.external_link}
                                        onChange={(e) => setLinkData('external_link', e.target.value)}
                                        placeholder="Enter external link"
                                    />
                                    <InputError message={linkErrors.external_link} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={linkProcessing}
                                    className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {linkProcessing ? 'Submitting...' : 'Submit'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
