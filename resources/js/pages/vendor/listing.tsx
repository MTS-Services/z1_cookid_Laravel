import { Button } from '@/components/ui/button'
import Pagination from '@/components/ui/pagination'
import VendorLayout from '@/layouts/vendor-layout'
import { Link } from '@inertiajs/react'
import { MapPin, Star, X } from 'lucide-react'
import { useState } from 'react'

const listings = [
    {
        id: 1,
        name: 'Elite Auto Spa',
        location: 'Downtown',
        price: 120,
        service: 'Detailing',
        rating: 4.9,
        image: '/assets/images/service/EliteAutoSpa.png',
    },
    {
        id: 2,
        name: 'Quick Clean Pro',
        location: 'Westside',
        price: 45,
        service: 'Car Wash',
        rating: 4.9,
        image: '/assets/images/service/Frame 2147225286 (1).png',
    },
    {
        id: 3,
        name: 'Master Tint & Wrap',
        location: 'North Hills',
        price: 180,
        service: 'Cleaning',
        rating: 4.9,
        image: '/assets/images/service/EliteAutoSpa.png',
    },
    {
        id: 4,
        name: 'Elite Automotive Detailers',
        location: 'San Francisco',
        price: 120,
        service: 'Detailing',
        rating: 4.9,
        image: '/assets/images/service/Frame 2147225286 (1).png',
    },
    {
        id: 5,
        name: 'Elite Automotive Detailers',
        location: 'San Francisco',
        price: 120,
        service: 'Detailing',
        rating: 4.9,
        image: '/assets/images/service/EliteAutoSpa.png',
    },
    {
        id: 6,
        name: 'Elite Automotive Detailers',
        location: 'San Francisco',
        price: 120,
        service: 'Detailing',
        rating: 4.9,
        image: '/assets/images/service/EliteAutoSpa.png',
    },
]

export default function Listing() {
    const [isWizardOpen, setIsWizardOpen] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 3
    const [formData, setFormData] = useState({
        serviceTitle: '',
        description: '',
        duration: '2+ Hours',
        carType: '',
        category: 'Car Wash',
        location: '',
        features: '',
        price: '',
    })

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
        setIsWizardOpen(false)
        setCurrentStep(1)
    }

    return (
        <VendorLayout activeSlug="listing">
            <section className="space-y-8">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Vendor tools</p>
                        <h1 className="text-2xl font-semibold text-white">Listings Management</h1>
                    </div>
                    <Button
                        className="flex items-center gap-2 bg-navy px-6 py-2 text-white"
                        // onClick={() => setIsWizardOpen(true)}
                    >
                        <Link href={route('vendor.listing.create')}>
                            New Listing
                            <span className="text-lg"> +</span>
                        </Link>
                    </Button>
                </header>

                <div className="rounded-3xl border border-white/5 bg-bg-gray p-4 shadow-[0_30px_70px_rgba(0,0,0,0.45)] md:p-6">
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {listings.map((listing) => (
                            <article
                                key={listing.id}
                                className="flex flex-col overflow-hidden rounded-xl border border-white/5 bg-dark-gray text-white shadow-lg"
                            >
                                <div className="h-40 w-full overflow-hidden">
                                    <img
                                        src={listing.image}
                                        alt={listing.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-1 flex-col gap-4 p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h3 className="text-lg font-semibold">{listing.name}</h3>
                                            <p className="flex items-center gap-2 text-sm text-slate-400">
                                                <MapPin className="h-4 w-4 text-navy" />
                                                {listing.location}
                                            </p>
                                        </div>
                                        <span className="flex items-center gap-1 text-sm">
                                            <Star className="h-4 w-4 text-amber-400" />
                                            {listing.rating}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wide text-slate-200">
                                            {listing.service}
                                        </span>
                                        <span className="text-2xl font-semibold">${listing.price}</span>
                                    </div>
                                    <div className="mt-auto flex gap-3">
                                        <Button className="flex-1 bg-navy text-white">Edit</Button>
                                        <Button variant="secondary" className="flex-1 border border-white/10 bg-white/5 text-white">
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                    <Pagination currentPage={1} totalPages={6} onPageChange={(page) => console.log(page)} />
                </div>
            </section>

            {isWizardOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 px-4 py-10">
                    <div className="relative w-full max-w-3xl rounded-2xl bg-dark-gray p-6 shadow-2xl">
                        <button
                            className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
                            onClick={() => setIsWizardOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <div className="space-y-6 text-white">
                            <div>
                                <h2 className="text-2xl font-semibold">Create New Listing</h2>
                                <p className="text-sm text-slate-400">Step {currentStep} of {totalSteps}</p>
                            </div>
                            <div className="h-2 rounded-full bg-white/10">
                                <div
                                    className="h-full rounded-full bg-linear-to-r from-blue-400 to-blue-600"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <label className="space-y-2 text-sm font-medium">
                                        <span>Service Title</span>
                                        <input
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                                            placeholder="Enter a title"
                                            value={formData.serviceTitle}
                                            onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm font-medium">
                                        <span>Description</span>
                                        <textarea
                                            rows={4}
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                                            placeholder="Describe your service in detail..."
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </label>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <label className="space-y-2 text-sm font-medium">
                                            <span>Service Duration</span>
                                            <select
                                                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
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
                                                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
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
                                                className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
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
                                <div className="space-y-4">
                                    <label className="space-y-2 text-sm font-medium">
                                        <span>Store Location</span>
                                        <input
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                                            placeholder="Downtown"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm font-medium">
                                        <span>Features</span>
                                        <textarea
                                            rows={4}
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                                            placeholder="Describe your service features..."
                                            value={formData.features}
                                            onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                        />
                                    </label>
                                    <label className="space-y-2 text-sm font-medium">
                                        <span>Price</span>
                                        <input
                                            type="number"
                                            className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                                            placeholder="$120"
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </label>
                                </div>
                            )}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm font-medium">Cover Image</p>
                                        <div className="mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/20 text-center text-slate-400">
                                            <div>
                                                <p className="font-semibold">Upload Cover Image</p>
                                                <p className="text-xs">JPEG/PNG up to 10MB</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Gallery Images</p>
                                        <div className="mt-3 flex flex-wrap gap-3">
                                            {[1, 2, 3, 4].map((item) => (
                                                <div
                                                    key={item}
                                                    className="h-16 w-24 rounded-lg border border-white/10 bg-cover bg-center"
                                                    style={{ backgroundImage: `url(/assets/images/service/gallery-${item}.jpg)` }}
                                                />
                                            ))}
                                            <button className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-white/20 text-2xl text-slate-400">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                {currentStep > 1 && (
                                    <Button variant="secondary" className="bg-black/30 text-white" onClick={handleBack}>
                                        Back
                                    </Button>
                                )}
                                {currentStep < totalSteps ? (
                                    <Button className="bg-navy" onClick={handleNext}>
                                        Next
                                    </Button>
                                ) : (
                                    <Button className="bg-navy" onClick={handlePublish}>
                                        Publish Listing
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </VendorLayout>
    )
}
