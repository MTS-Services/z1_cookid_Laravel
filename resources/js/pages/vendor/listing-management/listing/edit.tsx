import { index, update } from '@/actions/App/Http/Controllers/Vendor/ListingManagement/ListingController'
import { Button } from '@/components/ui/button'
import InputError from '@/components/input-error'
import VendorLayout from '@/layouts/vendor-layout'
import { Link, router, usePage } from '@inertiajs/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

interface CategoryOption {
    id: number
    name: string
}

interface GalleryImage {
    id: number
    image: string
    image_url: string
    sort_order: number
}

interface ListingFormData {
    id: number
    serviceTitle: string
    description: string
    duration: string
    carType: string
    category: string
    location: string
    features: string
    price: string
    image: string | null
    image_url: string
    status: string
    gallery: GalleryImage[]
}

interface ListingEditProps {
    listing: ListingFormData
    categories: CategoryOption[]
    carTypes: CategoryOption[]
    errors?: Partial<Record<string, string>>
}

export default function ListingEdit() {
    const { listing, categories, carTypes, errors = {} } = usePage().props as unknown as ListingEditProps
    const totalSteps = 3
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        serviceTitle: listing.serviceTitle,
        description: listing.description,
        duration: listing.duration,
        carType: listing.carType,
        category: listing.category,
        location: listing.location,
        features: listing.features,
        price: listing.price,
        coverImage: null as File | null,
        removeImage: false,
        removeGalleryIds: [] as number[],
        galleryImages: [] as File[],
    })

    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
    const galleryInputRef = useRef<HTMLInputElement | null>(null)

    const coverLabel = useMemo(() => {
        if (formData.coverImage) {
            return formData.coverImage.name.length > 18
                ? `${formData.coverImage.name.slice(0, 18)}...`
                : formData.coverImage.name
        }
        return 'Choose file'
    }, [formData.coverImage])

    const displayImage = coverPreview ?? (listing.image_url && !formData.removeImage ? listing.image_url : null)

    const progress = (currentStep / totalSteps) * 100

    useEffect(() => {
        const keys = Object.keys(errors)
        if (keys.length === 0) return
        const step1Fields = ['serviceTitle', 'description', 'duration', 'carType', 'category']
        const step2Fields = ['location', 'features', 'price']
        const firstKey = keys[0]?.replace(/\.\d+$/, '') ?? ''
        if (step1Fields.includes(firstKey)) setCurrentStep(1)
        else if (step2Fields.includes(firstKey)) setCurrentStep(2)
        else setCurrentStep(3)
    }, [errors])

    const handleNext = () => {
        if (currentStep < totalSteps) setCurrentStep((prev) => prev + 1)
    }

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep((prev) => prev - 1)
    }

    const handleUpdate = () => {
        const fd = new FormData()
        console.log(formData)
        fd.append('serviceTitle', formData.serviceTitle)
        fd.append('description', formData.description)
        fd.append('duration', formData.duration)
        fd.append('carType', formData.carType)
        fd.append('category', formData.category)
        fd.append('location', formData.location)
        fd.append('features', formData.features)
        fd.append('price', formData.price)
        fd.append('remove_image', formData.removeImage ? '1' : '0')
        if (formData.coverImage) {
            fd.append('image', formData.coverImage)
        }
        formData.removeGalleryIds.forEach((id) => fd.append('remove_gallery_ids[]', String(id)))
        formData.galleryImages.forEach((file, i) => fd.append(`gallery_images[${i}]`, file))
        router.post(update.url(listing.id), fd, {
            onSuccess: () => {
                toast.success('Listing updated successfully')
            },
            onError: (errors) => {
                console.log('error', errors)
            },
            preserveScroll: true,
            forceFormData: true,
        })
    }

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null
        setFormData((prev) => ({ ...prev, coverImage: file }))
        setCoverPreview(file ? URL.createObjectURL(file) : null)
    }

    const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])
        if (!files.length) return
        setFormData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...files],
        }))
        setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))])
        event.target.value = ''
    }

    const toggleRemoveGallery = (id: number) => {
        setFormData((prev) =>
            prev.removeGalleryIds.includes(id)
                ? { ...prev, removeGalleryIds: prev.removeGalleryIds.filter((x) => x !== id) }
                : { ...prev, removeGalleryIds: [...prev.removeGalleryIds, id] },
        )
    }

    const existingGallery = (listing.gallery ?? []).filter((g) => !formData.removeGalleryIds.includes(g.id))

    return (
        <VendorLayout activeSlug="listing">
            <section className="space-y-8">
                <header className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Edit listing</p>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">Edit Service Experience</h1>
                            <p className="text-sm text-slate-400">Update your listing details below.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button asChild variant="secondary" className="border border-white/10 bg-white/5 text-white">
                                <Link href={index.url()}>Back to list</Link>
                            </Button>
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                                Step {currentStep} of {totalSteps}
                            </span>
                        </div>
                    </div>
                </header>

                <div className="rounded-3xl border border-white/5 bg-bg-gray p-6 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                    <div className="mb-8 h-2 rounded-full bg-white/10">
                        <div
                            className="h-full rounded-full bg-linear-to-r from-[#4AB1F1] via-[#566CEC] to-[#D46BFF]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {currentStep === 1 && (
                        <div className="space-y-6 text-white">
                            <div className="text-sm text-slate-400">
                                <h2 className="text-xl font-semibold text-white">Describe the experience</h2>
                                <p>Include vivid details so car owners know exactly what they are booking.</p>
                            </div>
                            <label className="space-y-2 text-sm font-medium">
                                <span>Service Title</span>
                                <input
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                    placeholder="Elite Auto Detailing"
                                    value={formData.serviceTitle}
                                    onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                                />
                                <InputError message={errors.serviceTitle} className="mt-1 text-red-400" />
                            </label>
                            <label className="space-y-2 text-sm font-medium">
                                <span>Description</span>
                                <textarea
                                    rows={5}
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                    placeholder="Share your proven process..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                                <InputError message={errors.description} className="mt-1 text-red-400" />
                            </label>
                            <div className="grid gap-4 md:grid-cols-2">
                                <label className="space-y-2 text-sm font-medium">
                                    <span>Service Duration</span>
                                    <select
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                    >
                                        <option>2+ Hours</option>
                                        <option>Half-Day</option>
                                        <option>Full-Day</option>
                                    </select>
                                    <InputError message={errors.duration} className="mt-1 text-red-400" />
                                </label>
                                <label className="space-y-2 text-sm font-medium">
                                    <span>Car Type</span>
                                    <select
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                        value={formData.carType}
                                        onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        {carTypes.map((ct) => (
                                            <option key={ct.id} value={ct.id}>
                                                {ct.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.carType} className="mt-1 text-red-400" />
                                </label>
                                <label className="space-y-2 text-sm font-medium">
                                    <span>Car Category</span>
                                    <select
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.category} className="mt-1 text-red-400" />
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6 text-white">
                            <div className="text-sm text-slate-400">
                                <h2 className="text-xl font-semibold text-white">Location & value props</h2>
                                <p>Help shoppers understand where you operate and what’s included.</p>
                            </div>
                            <label className="space-y-2 text-sm font-medium">
                                <span>Store Location</span>
                                <input
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                    placeholder="Downtown San Francisco"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                                <InputError message={errors.location} className="mt-1 text-red-400" />
                            </label>
                            <label className="space-y-2 text-sm font-medium">
                                <span>Features</span>
                                <textarea
                                    rows={5}
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                    placeholder="Hand wash, ceramic finish..."
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                />
                                <InputError message={errors.features} className="mt-1 text-red-400" />
                            </label>
                            <label className="space-y-2 text-sm font-medium">
                                <span>Base Price</span>
                                <input
                                    type="number"
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                    placeholder="120"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                                <InputError message={errors.price} className="mt-1 text-red-400" />
                            </label>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-8 text-white">
                            <div className="text-sm text-slate-400">
                                <h2 className="text-xl font-semibold text-white">Cover image</h2>
                                <p>Update the cover image for this listing.</p>
                            </div>
                            <div className="w-full max-w-sm">
                                <p className="text-sm font-medium">Cover Image</p>
                                <label
                                    htmlFor="cover-upload-edit"
                                    className="mt-3 flex h-48 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/30 text-center text-slate-400 transition hover:border-white/30"
                                >
                                    {displayImage ? (
                                        <img
                                            src={displayImage}
                                            alt="Cover"
                                            className="h-full w-full rounded-2xl object-cover"
                                        />
                                    ) : (
                                        <div>
                                            <p className="font-semibold text-white">Upload Cover Image</p>
                                            <p className="text-xs">JPEG/PNG up to 10MB</p>
                                            <span className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white">
                                                {coverLabel}
                                            </span>
                                        </div>
                                    )}
                                    <input
                                        id="cover-upload-edit"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleCoverChange}
                                    />
                                </label>
                                <InputError message={errors.image} className="mt-1 text-red-400" />
                                {listing.image && (
                                    <label className="mt-3 flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={formData.removeImage}
                                            onChange={(e) => setFormData({ ...formData, removeImage: e.target.checked })}
                                            className="rounded border-white/20"
                                        />
                                        <span>Remove current image</span>
                                    </label>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium">Gallery Images</p>
                                <p className="mt-1 text-xs text-slate-400">Uncheck to keep, check to remove. Add new images below.</p>
                                <InputError
                                    message={
                                        errors.gallery_images ??
                                        Object.entries(errors).find(([k]) => k.startsWith('gallery_images'))?.[1]
                                    }
                                    className="mt-1 text-red-400"
                                />
                                <div className="mt-4 flex flex-wrap gap-4">
                                    {existingGallery.map((g) => (
                                        <label
                                            key={g.id}
                                            className="relative flex h-20 w-28 flex-col overflow-hidden rounded-xl border border-white/10"
                                        >
                                            <img
                                                src={g.image_url}
                                                alt=""
                                                className="h-full w-full object-cover opacity-90"
                                            />
                                            <label className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 transition hover:bg-black/70">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.removeGalleryIds.includes(g.id)}
                                                    onChange={() => toggleRemoveGallery(g.id)}
                                                    className="rounded border-white/20"
                                                />
                                                <span className="ml-2 text-xs">
                                                    {formData.removeGalleryIds.includes(g.id) ? 'Removing' : 'Keep'}
                                                </span>
                                            </label>
                                        </label>
                                    ))}
                                    {galleryPreviews.map((preview, i) => (
                                        <div
                                            key={`new-${i}`}
                                            className="h-20 w-28 rounded-xl border border-white/10 bg-cover bg-center"
                                            style={{ backgroundImage: `url(${preview})` }}
                                        />
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => galleryInputRef.current?.click()}
                                        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/20 text-2xl text-slate-400 transition hover:border-white/40"
                                    >
                                        +
                                    </button>
                                    <input
                                        ref={galleryInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                        onChange={handleGalleryChange}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end">
                        {currentStep > 1 && (
                            <Button variant="secondary" className="bg-black/40 text-white" onClick={handleBack}>
                                Back
                            </Button>
                        )}
                        {currentStep < totalSteps ? (
                            <Button className="bg-navy" onClick={handleNext}>
                                Next Step
                            </Button>
                        ) : (
                            <Button className="bg-navy" onClick={handleUpdate}>
                                Update Listing
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </VendorLayout>
    )
}
