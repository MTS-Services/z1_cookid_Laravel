interface Props{
    image: string;
    name: string;
    rating: number;
    location: string;
    service: string;
    price: number;
}


export default function ServiceCard({image, name, rating, location, service, price}: Props) {
    return(
        <div className="flex flex-col overflow-hidden rounded-2xl bg-[#292929] text-white shadow-xl">
                <div className="h-44 overflow-hidden">
                    <img
                        src={image}
                        alt="Elite Auto Spa"
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="flex flex-col gap-3 p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-base font-semibold">
                            {name}
                        </span>
                        <div className="flex items-center gap-1 text-sm">
                            <span className="text-orange-400">★</span>
                            <span className="font-medium text-white">
                                {rating}
                            </span>
                        </div>
                    </div>
                    <div className="-mt-1 flex items-center gap-1 text-sm text-[#A5A5A5]">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        <span className="text-sm font-normal">{location}</span>
                    </div>
                    <div>
                        <span className="rounded-sm bg-[#434343] font-medium text-sm border border-[#767676] text-[#E6E6E6] px-3 py-1.5">
                            {service}
                        </span>
                    </div>
                    <div className="border-t border-[#767676] my-4" />
                    <div className="flex items-center justify-between">
                        <span className="text-2xl font-semibold">${price}</span>
                        <button className="rounded-lg bg-[#2D60C8] p-3 text-base font-medium text-[#F0F7FE]">
                            See Details
                        </button>
                    </div>
                </div>
        </div>
    )
}