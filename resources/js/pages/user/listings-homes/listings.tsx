import { Button } from '@/components/ui/button';
import DeleteModal from '@/components/ui/delete-modal';
import UserDashboardLayout from '@/layouts/user-dashboard-layout';
import { Link } from '@inertiajs/react';

interface Listings {
    data: any;
}
interface Props {
    listings: Listings;
}
export default function Listings({ listings }: Props) {
    console.log(listings);
    return (
        <UserDashboardLayout>
            <div className="grid grid-cols-1 items-center gap-4 space-x-4 md:grid-cols-2 lg:grid-cols-3">
                {listings.data.map((listing: any) => (
                    <div
                        className="max-w-sm overflow-hidden rounded-lg bg-white shadow-xl"
                        key={listing.id}
                    >
                        <div className="relative h-64">
                            <img
                                src={listing.image_url}
                                alt={listing.title}
                                className="h-full w-full object-cover"
                            />

                            <div className="absolute top-4 left-4 rounded-full bg-[#d4a854] px-3 py-2 text-lg font-medium text-white shadow-sm">
                                Basic
                            </div>

                            <div className="absolute top-4 right-4 rounded-full bg-[#233d6b] px-3 py-2 text-lg font-medium text-white shadow-md">
                                ${listing.purchase_price}
                            </div>
                        </div>

                        <div className="h-34 p-2">
                            <h2 className="text-1xl mb-2 font-semibold text-gray-700">
                                {listing.title}
                            </h2>

                            <div className="grid grid-cols-2 gap-y-5 text-gray-800">
                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                    <span className="truncate font-medium">{`${listing.city?.name}, TN`}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span className="font-medium">{`${listing.square_feet}/sqft`}</span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
                                    </svg>
                                    <span className="font-medium">
                                        Bedroom: {listing.bedrooms}
                                    </span>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M7 7c0-1.1.9-2 2-2s2 .9 2 2H7zm10 5v-1c0-2.21-1.79-4-4-4h-1V5c0-1.66-1.34-3-3-3S6 3.34 6 5v2H5c-2.21 0-4 1.79-4 4v1h16zm-2 4H3v1c0 .55.45 1 1 1h10c.55 0 1-.45 1-1v-1z" />
                                    </svg>
                                    <span className="font-medium">
                                        Bathroom: {listing.bathrooms}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="w-full">
                                <Link
                                    href={route('user.edit-listing-home', {
                                        id: listing.id,
                                    })}
                                >
                                    <Button className="w-full rounded-none">
                                        Edit Post
                                    </Button>
                                </Link>
                            </div>
                            {/* <div className='w-full'>
                                <ActionButton IconNode={Trash} href={route('user.delete-listing-home', listing.id)} className="rounded-none w-full!">
                                    Delete Post
                                </ActionButton>
                            </div> */}
                            <div className="w-full">
                                <DeleteModal
                                    href={route(
                                        'user.delete-listing-home',
                                        listing.id,
                                    )}
                                    className="h-auto w-full! cursor-pointer rounded-none bg-primary px-4 py-3 font-medium text-white hover:bg-secondary"
                                >
                                    Delete Post
                                </DeleteModal>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </UserDashboardLayout>
    );
}
