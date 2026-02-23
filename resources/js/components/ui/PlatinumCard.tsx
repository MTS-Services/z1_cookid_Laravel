import listing from "@/routes/admin/listing";
import { Link } from "@inertiajs/react";
import React from "react";
import { FaBath, FaBed, FaClone, FaMapMarkerAlt } from "react-icons/fa";

// type Property = {
//     title: string;
//     location: string;
//     sqft: string;
//     beds: number;
//     baths: number;
//     price: string;
//     img: string;
// };

const PlatinumCard: React.FC<{ property: any; type: string }> = ({ property, type }) => {
    const { title, location, sqft, beds, baths, price, img } = property;
    const isRental = type === 'rental';
    const isListing = type === 'listing';
    const isRoute = isRental ? 'frontend.single-product.rental' : isListing ? 'frontend.single-product.listing' : 'frontend.single-product.rental';

    return (
        <Link href={route(isRoute, property.id)}>
            <div className="border border-gray-100 rounded-lg overflow-hidden shadow-xl transition duration-300 group bg-white">
                {/* Image */}
                <div className="relative overflow-hidden">

                    <img
                        src={property.image_url}
                        alt={property.title}
                        className="w-full h-64 object-cover group-hover:scale-105 transition duration-500"
                    />

                    <span className="absolute top-4 left-4 bg-secondary text-white text-xs uppercase font-bold px-3 py-2.5 rounded-full">
                        {property.listing_status_label || "For Rent"}
                    </span>

                    <span className="absolute top-4 right-4 bg-primary text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-sm">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        }).format(property.purchase_price)}
                    </span>
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-lg text-brand-dark font-semibold mb-4 line-clamp-1">
                        {property.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-brand-dark" />
                            <span>{property.city?.name}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaClone className="text-brand-dark" />
                            <span>{property.square_feet} sqft</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaBed className="text-brand-dark" />
                            <span>{property.bedrooms} Bedroom</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FaBath className="text-brand-dark" />
                            <span>{property.bathrooms} Bathroom</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>

    );
};

export { PlatinumCard };
