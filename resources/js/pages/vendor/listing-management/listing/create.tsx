import { Button } from '@/components/ui/button'
import VendorLayout from '@/layouts/vendor-layout'
import { useMemo, useRef, useState } from 'react'

export default function ListingCreate() {
    const totalSteps = 3
    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState({
        serviceTitle: '',
        description: '',
        duration: '2+ Hours',
        carType: '',
        category: 'Car Wash',
        location: '',
        features: '',
        price: '',
        coverImage: null as File | null,
        galleryImages: [] as File[],
    })

    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])
    const galleryInputRef = useRef<HTMLInputElement | null>(null)

    const coverLabel = useMemo(() => {
        if (!formData.coverImage) {
            return 'Choose file'
        }

        return formData.coverImage.name.length > 18
            ? `${formData.coverImage.name.slice(0, 18)}...`
            : formData.coverImage.name
    }, [formData.coverImage])

    const progress = (currentStep / totalSteps) * 100

    const handleNext = () => {
        if (currentStep < totalSteps) {
            setCurrentStep((prev) => prev + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1)
        }
    }

    const handlePublish = () => {
        console.log('Publishing listing', formData)
    }

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] ?? null
        setFormData((prev) => ({
            ...prev,
            coverImage: file,
        }))

        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setCoverPreview(previewUrl)
        } else {
            setCoverPreview(null)
        }
    }

    const handleGalleryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? [])

        if (!files.length) {
            return
        }

        setFormData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, ...files],
        }))

        setGalleryPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))])

        event.target.value = ''
    }

    const handleGalleryButtonClick = () => {
        galleryInputRef.current?.click()
    }

    return (
        <VendorLayout activeSlug="listing">
            <section className="space-y-8">
                <header className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Create listing</p>
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-white">New Service Experience</h1>
                            <p className="text-sm text-slate-400">Craft a compelling listing so customers instantly understand your value.</p>
                        </div>
                        <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
                            Step {currentStep} of {totalSteps}
                        </span>
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
                            </label>
                            <label className="space-y-2 text-sm font-medium">
                                <span>Description</span>
                                <textarea
                                    rows={5}
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                    placeholder="Share your proven process, what’s special, and outcomes customers can expect..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
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
                                </label>
                                <label className="space-y-2 text-sm font-medium">
                                    <span>Car Type</span>
                                    <select
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                        value={formData.carType}
                                        onChange={(e) => setFormData({ ...formData, carType: e.target.value })}
                                    >
                                        <option value="">Select</option>
                                        <option>Sedan</option>
                                        <option>SUV</option>
                                        <option>Luxury</option>
                                    </select>
                                </label>
                                <label className="space-y-2 text-sm font-medium">
                                    <span>Car Category</span>
                                    <select
                                        className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option>Car Wash</option>
                                        <option>Detailing</option>
                                        <option>Maintenance</option>
                                    </select>
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
                            </label>
                            <label className="space-y-2 text-sm font-medium">
                                <span>Features</span>
                                <textarea
                                    rows={5}
                                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none"
                                    placeholder="Hand wash, ceramic finish, premium products, lounge access..."
                                    value={formData.features}
                                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                />
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
                            </label>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-8 text-white">
                            <div className="text-sm text-slate-400">
                                <h2 className="text-xl font-semibold text-white">Visual verification</h2>
                                <p>Upload proof of quality so shoppers trust what they see.</p>
                            </div>
                            <div className="w-full max-w-sm">
                                <p className="text-sm font-medium">Cover Image</p>
                                <label
                                    htmlFor="cover-upload"
                                    className="mt-3 flex h-48 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/30 text-center text-slate-400 transition hover:border-white/30"
                                >
                                    {coverPreview ? (
                                        <img
                                            src={coverPreview}
                                            alt="Cover preview"
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
                                        id="cover-upload"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleCoverChange}
                                    />
                                </label>
                            </div>
                            <div>
                                <p className="text-sm font-medium">Gallery Images</p>
                                <div className="mt-4 flex flex-wrap gap-4">
                                    {galleryPreviews.length
                                        ? galleryPreviews.map((preview, index) => (
                                            <div
                                                key={`${preview}-${index}`}
                                                className="h-20 w-28 rounded-xl border border-white/10 bg-cover bg-center"
                                                style={{ backgroundImage: `url(${preview})` }}
                                            />
                                        ))
                                        : [1, 2, 3, 4].map((item) => (
                                            <div
                                                key={item}
                                                className="h-20 w-28 rounded-xl border border-white/10 bg-cover bg-center"
                                                style={{ backgroundImage: `url(/assets/images/service/gallery-${item}.jpg)` }}
                                            />
                                        ))}
                                    <button
                                        type="button"
                                        onClick={handleGalleryButtonClick}
                                        className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-white/20 text-2xl text-slate-400 transition hover:border-white/40"
                                    >
                                        +
                                    </button>
                                    <input
                                        ref={galleryInputRef}
                                        id="gallery-upload"
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
                            <Button className="bg-navy" onClick={handlePublish}>
                                Publish Listing
                            </Button>
                        )}
                    </div>
                </div>
            </section>
        </VendorLayout>
    )
}