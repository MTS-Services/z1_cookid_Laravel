import FileUpload from '@/components/file-upload';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import AddFeatureModal from '@/components/add-feature-modal';
import PetEssentialsInput, { PetEssential } from '@/components/pet-essentials-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import UserDashboardLayout from '@/layouts/user-dashboard-layout';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

interface City {
    id: number;
    name: string;
}

interface PropertyOption {
    value: string;
    label: string;
}

interface Rental {
    id: number;
    title: string;
    description: string;
    purchase_price: string;
    city_id: number;
    property_type: string;
    security_deposit: string;
    lease_length: number;
    bedrooms: number;
    bathrooms: number;
    square_feet: number;
    pet_friendly: boolean;
    parking_garage: number;
    primary_image_url: string | null;
    image_url: string[];
    youtube_video_url: string | null;
    features: { id: number }[];
    pet_essentials?: {
        id: number;
        pet_type: string;
        allowed: 'yes' | 'no';
        number_allowed?: number | null;
        icon?: string | null;
    }[];
    petEssentials?: {
        id: number;
        pet_type: string;
        allowed: 'yes' | 'no';
        number_allowed?: number | null;
        icon?: string | null;
    }[];
}

interface Feature {
    id: number;
    name: string;
    feature_category_id?: number | null;
}

interface FeatureCategory {
    id: number;
    name: string;
}

interface FormData {
    title: string;
    description: string;
    purchase_price: string;
    city_id: string;
    property_type: string;
    security_deposit: string;
    lease_length: string;
    bedrooms: string;
    bathrooms: string;
    square_feet: string;
    pet_friendly: string;
    parking_garage: string;
    primary_image_url: File | null;
    gallery_images: File[];
    youtube_video_url: string;
    features: number[];
    pet_essentials: PetEssential[];
    _method: 'PUT';
}

interface Props {
    rental: Rental;
    cities: City[];
    propertyTypes: PropertyOption[];
    features: Feature[];
    featureCategories: FeatureCategory[];
}

export default function EditListingRental({
    rental,
    cities,
    propertyTypes,
    features: initialFeatures,
    featureCategories,
}: Props) {
    const [features, setFeatures] = useState(initialFeatures);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);

    const rentalPetEssentials = useMemo(
        () => rental.pet_essentials ?? rental.petEssentials ?? [],
        [rental],
    );

    const { data, setData, post, processing, errors } = useForm<FormData>({
        title: rental.title || '',
        description: rental.description || '',
        purchase_price: rental.purchase_price || '',
        city_id: String(rental.city_id) || '',
        property_type: rental.property_type || propertyTypes[0]?.value || '',
        security_deposit: rental.security_deposit || '',
        lease_length: String(rental.lease_length) || '',
        bedrooms: String(rental.bedrooms) || '',
        bathrooms: String(rental.bathrooms) || '',
        square_feet: String(rental.square_feet) || '',
        pet_friendly: rental.pet_friendly ? 'yes' : 'no',
        parking_garage: String(rental.parking_garage) || '',
        primary_image_url: null as File | null,
        gallery_images: [] as File[],
        youtube_video_url: rental.youtube_video_url || '',
        features: rental.features?.map((f: any) => f.id) || [],
        pet_essentials: rentalPetEssentials.map((item: any) => ({
            pet_type: item.pet_type ?? '',
            allowed: item.allowed === 'no' ? 'no' : 'yes',
            number_allowed: item.number_allowed ? String(item.number_allowed) : '',
            icon: null,
            icon_url: item.icon_url ?? null,
            existing_icon: item.icon ?? item.existing_icon ?? null,
        })),
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
            if (rental.primary_image_url) {
                setExistingFiles([
                    {
                        id: rental.id,
                        url: rental.image_url,
                        name: rental.primary_image_url,
                        path: rental.primary_image_url,
                        mime_type: 'image/*',
                    },
                ]);
            } else {
                setExistingFiles([]);
            }
        }
    }, [rental]);

    const handleAddFeature = async (name: string, categoryId: number) => {
        setModalLoading(true);
        try {
            const res = await axios.post(route('admin.feature.store'), {
                name,
                feature_category_id: categoryId,
            });
            setFeatures([...features, res.data]);
            toast.success('Feature added successfully.');
            setModalOpen(false);
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to add feature');
        } finally {
            setModalLoading(false);
        }
    };

    const handleFeatureToggle = (id: number) => {
        const current = [...data.features];
        const index = current.indexOf(id);
        if (index > -1) {
            current.splice(index, 1);
        } else {
            current.push(id);
        }
        setData('features', current);
    };

    const handleRemoveExisting = () => {
        if (
            confirm(
                'Are you sure you want to remove this file? You must upload a new file to save the changes.',
            )
        ) {
            setExistingFiles([]);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('user.update-listing-rental', rental.id), {
            forceFormData: true, 
            onSuccess: () => {
                toast.success('Rental listing updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update rental listing.');
            },
        });
    };

    return (
        <UserDashboardLayout>
            <div className="min-h-screen bg-gray-50 p-2">
                <AddFeatureModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    onSubmit={handleAddFeature}
                    featureCategories={featureCategories}
                    loading={modalLoading}
                />
                <div className="container mx-auto rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-6 text-2xl font-bold text-gray-800">
                        Edit Rental Listing
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Primary Image */}
                            <div className="col-span-2 w-80">
                                <div className="grid gap-2">
                                    <Label htmlFor="primary_image_url">
                                        Image
                                    </Label>
                                    <FileUpload
                                        value={data.primary_image_url}
                                        onChange={(file) =>
                                            setData(
                                                'primary_image_url',
                                                file as File | null,
                                            )
                                        }
                                        existingFiles={existingFiles}
                                        onRemoveExisting={handleRemoveExisting}
                                        accept="image/*"
                                        maxSize={10}
                                    />
                                    <InputError
                                        message={errors.primary_image_url}
                                    />
                                </div>
                            </div>

                            {/* Photo Gallery */}
                            <div className="col-span-2 grid gap-2">
                                <Label htmlFor="gallery_images">
                                    Photo Gallery (Optional - only upload to
                                    replace)
                                </Label>
                                <input
                                    id="gallery_images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setData(
                                                'gallery_images',
                                                Array.from(e.target.files),
                                            );
                                        }
                                    }}
                                    className="block w-full text-sm text-gray-700 file:mr-4 file:rounded file:border file:border-gray-300 file:bg-gray-50 file:px-4 file:py-2 file:text-sm file:font-medium file:transition hover:file:bg-gray-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Maximum file size: 200 MB total
                                </p>
                                <InputError message={errors.gallery_images} />
                            </div>

                            {/* Listing Title */}
                            <div className="grid gap-2">
                                <Label htmlFor="title">
                                    Listing Title*
                                </Label>
                                <Input
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) =>
                                        setData('title', e.target.value)
                                    }
                                    placeholder="Enter listing title"
                                />
                                <InputError message={errors.title} />
                            </div>

                            {/* Purchase Price */}
                            <div className="grid gap-2">
                                <Label htmlFor="purchase_price">
                                    Purchase Price*
                                </Label>
                                <Input
                                    id="purchase_price"
                                    type="text"
                                    value={data.purchase_price}
                                    onChange={(e) =>
                                        setData(
                                            'purchase_price',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter purchase price"
                                />
                                <InputError message={errors.purchase_price} />
                            </div>

                            {/* City */}
                            <div className="grid gap-2">
                                <Label htmlFor="city_id">City*</Label>
                                <Select
                                    value={data.city_id}
                                    onValueChange={(value) =>
                                        setData('city_id', value)
                                    }
                                >
                                    <SelectTrigger className="datatable-select">
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {cities.map((city: any) => (
                                            <SelectItem
                                                key={city.id}
                                                value={String(city.id)}
                                            >
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.city_id} />
                            </div>

                            {/* Property Type */}
                            <div className="grid gap-2">
                                <Label htmlFor="property_type">
                                    Property Type*
                                </Label>
                                <Select
                                    value={data.property_type}
                                    onValueChange={(value) =>
                                        setData('property_type', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select property type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {propertyTypes.map((type) => (
                                            <SelectItem
                                                key={type.value}
                                                value={type.value}
                                            >
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
                                    onChange={(e) =>
                                        setData('bedrooms', e.target.value)
                                    }
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
                                    onChange={(e) =>
                                        setData('bathrooms', e.target.value)
                                    }
                                    placeholder="Type number of bathrooms"
                                />
                                <InputError message={errors.bathrooms} />
                            </div>

                            {/* Square Feet */}
                            <div className="grid gap-2">
                                <Label htmlFor="square_feet">
                                    Square Feet*
                                </Label>
                                <Input
                                    id="square_feet"
                                    type="number"
                                    min="0"
                                    value={data.square_feet}
                                    onChange={(e) =>
                                        setData('square_feet', e.target.value)
                                    }
                                    placeholder="Type square footage"
                                />
                                <InputError message={errors.square_feet} />
                            </div>

                            {/* Security Deposit */}
                            <div className="grid gap-2">
                                <Label htmlFor="security_deposit">
                                    Security Deposit
                                </Label>
                                <Input
                                    id="security_deposit"
                                    type="number"
                                    value={data.security_deposit}
                                    onChange={(e) =>
                                        setData(
                                            'security_deposit',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter security deposit"
                                />
                                <InputError message={errors.security_deposit} />
                            </div>

                            {/* Lease Length */}
                            <div className="grid gap-2">
                                <Label htmlFor="lease_length">
                                    Lease Length
                                </Label>
                                <Input
                                    id="lease_length"
                                    type="number"
                                    value={data.lease_length}
                                    onChange={(e) =>
                                        setData('lease_length', e.target.value)
                                    }
                                    placeholder="Enter lease length"
                                />
                                <InputError message={errors.lease_length} />
                            </div>

                            {/* Parking / Garage Spaces */}
                            <div className="grid gap-2">
                                <Label htmlFor="parking_garage">
                                    Parking / Garage Spaces*
                                </Label>
                                <Input
                                    id="parking_garage"
                                    type="number"
                                    min="0"
                                    value={data.parking_garage}
                                    onChange={(e) =>
                                        setData(
                                            'parking_garage',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Enter number of parking spaces"
                                />
                                <InputError message={errors.parking_garage} />
                            </div>

                            {/* YouTube Video URL */}
                            <div className="col-span-2 grid gap-2">
                                <Label htmlFor="youtube_video_url">
                                    YouTube Video URL
                                </Label>
                                <Input
                                    id="youtube_video_url"
                                    type="text"
                                    value={data.youtube_video_url}
                                    onChange={(e) =>
                                        setData(
                                            'youtube_video_url',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Type YouTube Video URL"
                                />
                                <InputError
                                    message={errors.youtube_video_url}
                                />
                            </div>

                            {/* Pet Friendly */}
                            <div className="col-span-2 grid gap-2">
                                <Label>Pet Friendly*</Label>
                                <div className="space-y-2">
                                    <label className="flex cursor-pointer items-center gap-2 font-normal">
                                        <input
                                            type="radio"
                                            name="pet_friendly"
                                            value="yes"
                                            checked={data.pet_friendly === 'yes'}
                                            onChange={(e) =>
                                                setData(
                                                    'pet_friendly',
                                                    e.target.value,
                                                )
                                            }
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
                                            onChange={(e) =>
                                                setData(
                                                    'pet_friendly',
                                                    e.target.value,
                                                )
                                            }
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        No
                                    </label>
                                </div>
                                <InputError message={errors.pet_friendly} />
                            </div>

                            {/* Pet Essentials */}
                            <div className="col-span-2 grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">
                                        Pet Essentials
                                    </Label>
                                    <span className="text-xs text-muted-foreground">
                                        Add allowed pet types & limits
                                    </span>
                                </div>
                                <PetEssentialsInput
                                    value={data.pet_essentials}
                                    onChange={(items) => setData('pet_essentials', items)}
                                    error={errors.pet_essentials as string | undefined}
                                />
                            </div>

                            {/* Listing Description */}
                            <div className="col-span-2 grid gap-2">
                                <Label htmlFor="description">
                                    Listing Description
                                </Label>
                                <textarea
                                    id="description"
                                    rows={4}
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="w-full resize-none rounded-md border border-gray-300 px-4 py-2.5 transition outline-none focus:border-transparent focus:ring-2 focus:ring-slate-500"
                                    placeholder="Enter listing description"
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Features Section */}
                            <div className="col-span-2 mb-8 grid gap-2">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">
                                        Unit Features
                                    </Label>
                                    <Button
                                        type="button"
                                        size="sm"
                                        onClick={() => setModalOpen(true)}
                                    >
                                        + Add New
                                    </Button>
                                </div>

                                <div className="space-y-4 rounded-md border bg-slate-50 p-4">
                                    {featureCategories.map((category) => {
                                        const categoryFeatures = features.filter(
                                            (feature) => feature.feature_category_id === category.id,
                                        );
                                        if (categoryFeatures.length === 0) {
                                            return null;
                                        }

                                        return (
                                            <div key={category.id}>
                                                <p className="mb-2 border-b pb-1 text-sm font-semibold text-slate-700">
                                                    {category.name}
                                                </p>
                                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                                    {categoryFeatures.map((feature) => (
                                                        <div key={feature.id} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`feature-${feature.id}`}
                                                                className="h-4 w-4 rounded border-gray-300 text-slate-800 focus:ring-slate-500"
                                                                checked={data.features.includes(feature.id)}
                                                                onChange={() => handleFeatureToggle(feature.id)}
                                                            />
                                                            <label
                                                                htmlFor={`feature-${feature.id}`}
                                                                className="cursor-pointer text-sm font-medium leading-none"
                                                            >
                                                                {feature.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {(() => {
                                        const categoryIds = featureCategories.map((c) => c.id);
                                        const uncategorized = features.filter(
                                            (feature) => !categoryIds.includes(feature.feature_category_id ?? 0),
                                        );

                                        if (!uncategorized.length) {
                                            return null;
                                        }

                                        return (
                                            <div>
                                                <p className="mb-2 border-b pb-1 text-sm font-semibold text-slate-700">
                                                    Other
                                                </p>
                                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                                                    {uncategorized.map((feature) => (
                                                        <div key={feature.id} className="flex items-center space-x-2">
                                                            <input
                                                                type="checkbox"
                                                                id={`feature-${feature.id}`}
                                                                className="h-4 w-4 rounded border-gray-300 text-slate-800 focus:ring-slate-500"
                                                                checked={data.features.includes(feature.id)}
                                                                onChange={() => handleFeatureToggle(feature.id)}
                                                            />
                                                            <label
                                                                htmlFor={`feature-${feature.id}`}
                                                                className="cursor-pointer text-sm font-medium leading-none"
                                                            >
                                                                {feature.name}
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })()}
                                </div>
                                <InputError message={errors.features} />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-secondary px-8 py-3 font-medium text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing
                                ? 'Updating...'
                                : 'Update Rental Listing'}
                        </button>
                    </form>
                </div>
            </div>
        </UserDashboardLayout>
    );
}
