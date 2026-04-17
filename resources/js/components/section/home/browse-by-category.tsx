import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Link } from '@inertiajs/react';

interface Category {
    id: number;
    name: string;
    image: string;
}
export default function Category({ categories }: { categories: Category[] }) {

    return (
        <div
            className="py-10"

        >
            {/* Content */}
            <div className="relative z-10 container mt-5 lg:mt-20 px-4">
                <h2 className="mb-5 text-3xl font-medium text-text-white">
                    Browse By Category
                </h2>
                {categories.length > 0 ? (
                    <Swiper
                        slidesPerView={3}
                        spaceBetween={16}
                        grabCursor
                        className="w-full"
                        breakpoints={{
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 6 },
                            1280: { slidesPerView: 7 },
                        }}
                    >
                        {categories.map((item) => (
                            <SwiperSlide key={item.id} className="text-center w-full h-full">
                                <div className="w-full flex flex-col items-center">
                                    <img
                                        className="rounded-full w-full h-full object-cover"
                                        src={item.image}
                                        alt={item.name}
                                    />
                                    <h4 className="mt-4 text-sm font-medium text-text-white">
                                        {item.name}
                                    </h4>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>    
            ):(
                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center backdrop-blur-sm">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-bg-nevy/70 text-2xl">
                        !
                    </div>
                    <h3 className="text-lg font-semibold text-text-white">No categories available right now</h3>
                    <p className="mt-2 max-w-md text-sm text-text-gray-100/80">
                        New categories are added regularly. Explore all categories to find nearby options.
                    </p>
                    <div className="mt-6 flex gap-3">
                        <Link href={route('frontend.categories')} className="rounded-lg bg-bg-nevy px-5 py-2.5 text-sm font-medium text-text-gray-100 transition hover:opacity-90">
                            Browse Categories
                        </Link>
                    </div>
                </div>
            )}
            </div>
        </div>
    );
}
