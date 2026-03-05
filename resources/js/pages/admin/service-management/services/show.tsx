import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';

import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';

type ServiceStatus = 'requested' | 'in_progress' | 'completed' | 'cancelled';

interface Vendor {
    id: number;
    shop_name: string;
    address?: string;
    city?: string;
    region_state?: string;
    email?: string;
    phone?: string;
}

interface Service {
    id: number;
    service_name: string;
    area: string;
    city?: string;
    price: number;
    status: ServiceStatus | string;
    short_description?: string | null;
    description?: string | null;
    hero_image?: string | null;
    gallery_images?: unknown;
    vendor?: Vendor | null;
}

interface Props {
    service: Service;
}

export default function ServiceShowPage({ service }: Props) {
    const locationParts = [
        service.vendor?.address,
        service.vendor?.city,
        service.vendor?.region_state,
    ].filter(Boolean);

    const location = locationParts.join(', ');

    const canModerate = service.status === 'requested';

    const handleApprove = () => {
        if (confirm('Approve this service request?')) {
            router.visit(route('admin.sm.services.approve', service.id), {
                method: 'post',
            });
        }
    };

    const handleCancel = () => {
        if (confirm('Cancel this service request?')) {
            router.visit(route('admin.sm.services.cancel', service.id), {
                method: 'post',
            });
        }
    };

    const heroImage =
        service.hero_image ||
        'https://images.pexels.com/photos/4870705/pexels-photo-4870705.jpeg?auto=compress&cs=tinysrgb&w=1600';

    const rawGallery = service.gallery_images;

    let galleryImages: string[] = [];

    if (Array.isArray(rawGallery)) {
        galleryImages = rawGallery.filter((item): item is string => typeof item === 'string' && item.length > 0);
    } else if (typeof rawGallery === 'string' && rawGallery.length > 0) {
        galleryImages = [rawGallery];
    }

    if (galleryImages.length === 0) {
        galleryImages = [
            heroImage,
            'https://images.pexels.com/photos/4870709/pexels-photo-4870709.jpeg?auto=compress&cs=tinysrgb&w=1600',
        ];
    }

    return (
        <AdminLayout activeSlug="service-management">
            <Head title={`${service.service_name} - Service Details`} />

            <div className="space-y-6">
                {/* Vendor header block */}
                <section className="rounded-3xl border border-white/5 bg-bg-gray/90 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.45)]">
                    <div className="flex flex-col gap-2 text-sm text-gray-200">
                        <h2 className="text-base font-semibold text-white">
                            {service.vendor?.shop_name ?? 'Maktech Store'}
                        </h2>
                        {service.vendor?.email && (
                            <p className="text-text-mute-foreground">{service.vendor.email}</p>
                        )}
                        {service.vendor?.phone && (
                            <p className="text-text-mute-foreground">{service.vendor.phone}</p>
                        )}
                        {location && (
                            <p className="text-text-mute-foreground text-xs">
                                {location}
                            </p>
                        )}
                    </div>
                </section>

                {/* Main service details card */}
                <section className="rounded-3xl border border-white/5 bg-bg-gray/90 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] space-y-6">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Service Details</h1>
                        <p className="mt-1 text-sm text-text-mute-foreground">
                            {service.service_name}
                        </p>
                    </div>

                    {/* Images row */}
                    <div className="overflow-hidden rounded-2xl bg-black">
                        <div className="grid gap-2 md:grid-cols-[3fr,2fr]">
                            <img
                                src={heroImage}
                                alt={service.service_name}
                                className="h-64 w-full object-cover md:h-72"
                            />
                            <div className="flex flex-col gap-2">
                                {galleryImages.slice(0, 2).map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`${service.service_name} ${index + 1}`}
                                        className="h-32 w-full object-cover md:h-36"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-6">
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-text-mute-foreground">
                                Service
                            </p>
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                WASH
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-text-mute-foreground">
                                Location
                            </p>
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                {[service.area, service.city].filter(Boolean).join(', ') || 'Downtown'}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 text-sm leading-relaxed text-gray-200">
                        <h2 className="text-base font-semibold text-white">
                            {service.short_description || 'Showcase Properties from a New Perspective'}
                        </h2>
                        {service.description && (
                            <p className="text-text-mute-foreground whitespace-pre-line">
                                {service.description}
                            </p>
                        )}
                    </div>

                    {/* Actions aligned to bottom */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                            type="button"
                            disabled={!canModerate}
                            onClick={handleApprove}
                            className="flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-medium text-white hover:bg-navy disabled:cursor-not-allowed disabled:bg-navy/40"
                        >
                            Approved
                        </Button>
                        <Button
                            type="button"
                            disabled={!canModerate}
                            variant="outline"
                            onClick={handleCancel}
                            className="flex items-center justify-center gap-2 rounded-full border-gray-500/70 bg-transparent px-6 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:border-gray-700/40 disabled:text-gray-500"
                        >
                            Canceled
                        </Button>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

