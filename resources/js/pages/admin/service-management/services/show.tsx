import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Check, X } from 'lucide-react';

import AdminLayout from '@/layouts/admin-layout';
import { Button } from '@/components/ui/button';

type ServiceStatus = 'active' | 'inactive';

interface Vendor {
    id: number;
    shop_name: string;
    avatar_url: string;
    address?: string;
    city?: string;
    region_state?: string;
    email?: string;
    phone?: string;
}

interface ServiceImage {
    id: number;
    image: string;
    sort_order: number;
}

interface ServiceInclusion {
    id: number;
    section_label?: string | null;
    item: string;
    sort_order: number;
}

interface Service {
    id: number;
    title: string;
    slug: string;
    description: string;
    location: string;
    duration: string;
    price: number;
    image?: string | null;
    image_url?: string | null;
    average_rating?: number | null;
    total_reviews?: number;
    status: ServiceStatus | string;
    features?: string | null;
    vendor?: Vendor | null;
    category?: { id: number; name: string } | null;
    car_type?: { id: number; name: string } | null;
    images?: ServiceImage[];
    inclusions?: ServiceInclusion[];
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

    const canActivate = service.status === 'inactive';
    const canDeactivate = service.status === 'active';

    const handleActivate = () => {
        if (confirm('Activate this service?')) {
            router.visit(route('admin.sm.services.approve', service.id), {
                method: 'post',
            });
        }
    };

    const handleDeactivate = () => {
        if (confirm('Deactivate this service?')) {
            router.visit(route('admin.sm.services.cancel', service.id), {
                method: 'post',
            });
        }
    };

    const heroImage =
        service.image_url ||
        'https://images.pexels.com/photos/4870705/pexels-photo-4870705.jpeg?auto=compress&cs=tinysrgb&w=1600';

    const galleryImages =
        (service.images?.length ?? 0) > 0
            ? service.images!.map((img) =>
                  img.image.startsWith('http') ? img.image : `/storage/service_images/${img.image}`,
              )
            : [heroImage];

    return (
        <AdminLayout activeSlug="service-management">
            <Head title={`${service.title} - Service Details`} />

            <div className="space-y-6">
                {/* Vendor header block */}
                <section className="p-5 flex justify-between">
                    <div className="flex flex-col gap-2 text-sm text-gray-200">
                        <div className="h-24 w-24 overflow-hidden rounded-full ring-2 ring-white/5">
                            <img
                                src={service.vendor?.avatar_url ?? '/user.png'}
                                alt="Shop Logo"
                                className="h-full w-full object-cover"
                            />
                        </div>
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
                    <div>
                        <Button
                            type="button"
                            onClick={() => router.get('/admin/service-management/services')}
                            className="flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-medium text-white hover:bg-navy disabled:cursor-not-allowed disabled:bg-navy/80"
                        >
                            Back
                        </Button>
                    </div>
                </section>

                {/* Main service details card */}
                <section className="rounded-3xl border border-white/5 bg-bg-gray/90 p-6 shadow-[0_25px_70px_rgba(0,0,0,0.45)] space-y-6">
                    <div>
                        <h1 className="text-lg font-semibold text-white">Service Details</h1>
                        <p className="mt-1 text-sm text-text-mute-foreground">
                            {service.title}
                        </p>
                    </div>

                    {/* Images row */}
                    <div className="overflow-hidden">
                        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
                            <img
                                src={heroImage}
                                alt={service.title}
                                className="h-full w-full object-cover rounded-md"
                            />
                            <div className="flex flex-col gap-2">
                                {galleryImages.slice(0, 2).map((src, index) => (
                                    <img
                                        key={index}
                                        src={src}
                                        alt={`${service.title} ${index + 1}`}
                                        className="h-full w-full object-cover rounded-md"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-6">
                        {service.category && (
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-wide text-text-mute-foreground">
                                    Category
                                </p>
                                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                    {service.category.name}
                                </span>
                            </div>
                        )}
                        {service.car_type && (
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-wide text-text-mute-foreground">
                                    Car Type
                                </p>
                                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                    {service.car_type.name}
                                </span>
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-text-mute-foreground">
                                Location
                            </p>
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                {service.location || '—'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-text-mute-foreground">
                                Duration
                            </p>
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                {service.duration || '—'}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs uppercase tracking-wide text-text-mute-foreground">
                                Price
                            </p>
                            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white">
                                ${Number(service.price).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 text-sm leading-relaxed text-gray-200">
                        {service.description && (
                            <p className="text-text-mute-foreground whitespace-pre-line">
                                {service.description}
                            </p>
                        )}
                    </div>

                    {/* Inclusions */}
                    {service.inclusions && service.inclusions.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-base font-semibold text-white">Inclusions</h2>
                            <ul className="list-inside list-disc space-y-1 text-text-mute-foreground">
                                {service.inclusions
                                    .sort((a, b) => a.sort_order - b.sort_order)
                                    .map((inc) => (
                                        <li key={inc.id}>
                                            {inc.section_label ? `${inc.section_label}: ` : ''}
                                            {inc.item}
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    )}

                    {/* Actions aligned to bottom */}
                    <div className="flex flex-wrap gap-3 pt-2">
                        <Button
                            type="button"
                            disabled={!canActivate}
                            onClick={handleActivate}
                            className="flex items-center justify-center gap-2 rounded-full bg-navy px-6 py-2 text-sm font-medium text-white hover:bg-navy disabled:cursor-not-allowed disabled:bg-navy/80"
                        >
                            Activate
                        </Button>
                        <Button
                            type="button"
                            disabled={!canDeactivate}
                            variant="outline"
                            onClick={handleDeactivate}
                            className="flex items-center justify-center gap-2 rounded-full border-gray-500/70 bg-transparent px-6 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 disabled:cursor-not-allowed disabled:border-text-border/80 disabled:text-gray-200"
                        >
                            Deactivate
                        </Button>
                    </div>
                </section>
            </div>
        </AdminLayout>
    );
}

