// components/PremiumCarDetailingCard.tsx
import { Star, MapPin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, router, usePage } from '@inertiajs/react';
import type { ServiceDetailsPayload } from './details';
import { toast } from 'sonner';

interface PremiumCarDetailingCardProps {
    service: ServiceDetailsPayload;
}

function StarRating({ rating }: { rating: number }) {
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
        <div className="flex items-center text-yellow-400">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    fill={i < full || (i === full && hasHalf) ? 'currentColor' : 'none'}
                    stroke="currentColor"
                />
            ))}
        </div>
    );
}

export default function PremiumCarDetailingCard({ service }: PremiumCarDetailingCardProps) {
    const pageProps = usePage().props as { auth?: { user?: { id: number } | null } };
    const isLoggedIn = Boolean(pageProps.auth?.user);
    const categoryLabel = service.categoryName ?? 'Service';
    const vehicleLabel = service.vehicleTypeName ?? '—';
    const inWishlist = Boolean(service.inWishlist);
    const wishlistId = service.wishlistId ?? null;

    const handleWishlistToggle = () => {
        if (inWishlist && wishlistId != null) {
            toast.error('Removed from Wishlist');
            router.delete(route('user.wishlist.destroy', wishlistId));
        } else {
            toast.success('Added to Wishlist');
            router.post(route('user.wishlist.store'), { service_id: service.id });
        }
    };

    return (
        <div className="w-full lg:p-6 text-white shadow-2xl">
            {/* Rating */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <StarRating rating={service.rating} />
                <span className="font-medium">{service.rating.toFixed(1)} Star Rating</span>
                <span className="text-white/70">({service.totalReviews.toLocaleString()} User feedback)</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-3">
                {service.title}
            </h1>

            {/* Description */}
            <p className="text-white/80 mb-4 leading-relaxed">
                {service.description}
            </p>

            {/* Duration & Notes */}
            <div className="text-sm mb-6 space-y-1">
                <p>
                    <span className="font-medium">Service Duration:</span> {service.duration}
                </p>
                <p>
                    <span className="font-medium">Category:</span> {categoryLabel}
                </p>
                <p>
                    <span className="font-medium">Car Type:</span> {vehicleLabel}
                </p>
            </div>

            {/* What's Included: prefer structured inclusions, fallback to features (HTML) */}
            {(service.inclusions?.length > 0 || (service.features && service.features.trim() !== '')) && (
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">What&apos;s Included</h2>
                    <div className="space-y-6">
                        {service.inclusions?.length > 0 ? (
                            service.inclusions.map((section) => (
                                <div key={section.label}>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60 mb-3">
                                        {section.label}
                                    </h3>
                                    <ul className="space-y-2 text-sm text-white/90">
                                        {section.items.map((item, i) => (
                                            <li key={i} className="flex gap-2">
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))
                        ) : (
                            <div
                                className="prose prose-invert prose-sm max-w-none text-white/90 [&_ul]:list-disc [&_ul]:pl-5 [&_li]:my-1 [&_p]:my-2"
                                dangerouslySetInnerHTML={{ __html: service.features ?? '' }}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Price & Buttons */}
            <div className="mb-8">
                <p className="text-4xl font-bold mb-5">${service.price.toLocaleString()}</p>

                <div className="flex gap-4">
                    <Link
                        href={route('user.order.billing-address', { service_id: service.encryptedId ?? service.id })}
                        className="flex-1"
                    >
                        <Button className="w-full bg-navy hover:bg-navy text-white rounded-lg py-6 text-base font-medium">
                            Book Now
                        </Button>
                    </Link>
                    {isLoggedIn ? (
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 bg-bg-gray border-none text-text-white"
                            onClick={handleWishlistToggle}
                        >
                            <Heart
                                size={18}
                                className={inWishlist ? 'fill-current text-red-400' : ''}
                            />
                            {inWishlist ? 'Remove from Wishlist' : 'Add To Wishlist'}
                        </Button>
                    ) : (
                        <Link href={route('user.auth.login')} className="flex-1">
                            <Button
                                variant="outline"
                                className="w-full flex-1 bg-bg-gray border-none text-text-white"
                            >
                                <Heart size={18} />
                                Add To Wishlist
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* Store Info */}
            <div className="p-4 flex gap-4 bg-transparent text-white">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-white/80">
                        {service.vendor.name.charAt(0)}
                    </span>
                </div>
                <div>
                    <p className="font-semibold">{service.vendor.name}</p>
                    {service.vendor.location && (
                        <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                            <MapPin size={14} />
                            {service.vendor.location}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}