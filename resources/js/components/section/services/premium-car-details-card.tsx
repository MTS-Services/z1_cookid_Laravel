// components/PremiumCarDetailingCard.tsx
import { Star, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function PremiumCarDetailingCard() {
    return (
        <div className="w-full p-6 text-white shadow-2xl">
            {/* Rating */}
            <div className="flex items-center gap-2 text-sm mb-4">
                <div className="flex items-center text-yellow-400">
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                    <Star size={16} fill="currentColor" />
                </div>
                <span className="font-medium">4.7 Star Rating</span>
                <span className="text-white/70">(21,671 User feedback)</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold mb-3">
                Premium Car Detailing Service
            </h1>

            {/* Description */}
            <p className="text-white/80 mb-4 leading-relaxed">
                Give your car a showroom-fresh look with complete interior and exterior detailing service.
                Our experts use high-quality products and advanced techniques to restore shine, remove dirt,
                and protect your vehicle's finish.
            </p>

            {/* Duration & Notes */}
            <div className="text-sm mb-6 space-y-1">
                <p>
                    <span className="font-medium">Service Duration:</span> 3 – 4 Hours
                </p>
                <p className="text-red-400 text-xs">
                    Note: Time may vary depending on vehicle size and condition.
                </p>
                <p className="text-xs text-white/60">
                    Category: Car Wash • Car Type: Sedan
                </p>
            </div>

            {/* What's Included */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">What's Included</h2>

                <div className="space-y-6">
                    {/* Exterior */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60 mb-3">
                            Exterior Detailing
                        </h3>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li>• Hand wash & foam cleaning</li>
                            <li>• Wheel & tire deep cleaning</li>
                            <li>• Wax polish & paint protection</li>
                            <li>• Window cleaning (inside & outside)</li>
                        </ul>
                    </div>

                    {/* Interior */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wide text-white/60 mb-3">
                            Interior Detailing
                        </h3>
                        <ul className="space-y-2 text-sm text-white/90">
                            <li>• Full vacuum / leather conditioning</li>
                            <li>• Seat shampoo cleaning</li>
                            <li>• Dashboard & console cleaning</li>
                            <li>• Odor removal treatment</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Price & Buttons */}
            <div className="mb-8">
                <p className="text-4xl font-bold mb-5">$1699</p>

                <div className="flex gap-4">
                    <Link href={route('frontend.booking-confirm')} className="flex-1">
                        <Button className="w-full bg-navy hover:bg-navy text-white rounded-lg py-6 text-base font-medium">
                            Book Now
                        </Button>
                    </Link>
                    <Link href="#" className="flex-1">
                    <Button
                        variant="outline"
                        className="w-full flex-1 bg-bg-gray border-none text-text-white"
                    >
                        Add To Wishlist
                    </Button>
                    </Link>
                </div>
            </div>

            {/* Store Info */}
            <div className="p-4 flex gap-4 bg-transparent text-white">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src="/maktech.png" alt="Profile Image" />
                </div>
                <div>
                    <p className="font-semibold">Makttech Store</p>
                    <p className="text-sm text-white/70 flex items-center gap-1 mt-1">
                        <MapPin size={14} />
                        2715 Ash Dr. San Jose, South Dakota 83475
                    </p>
                </div>
            </div>
        </div>
    );
}