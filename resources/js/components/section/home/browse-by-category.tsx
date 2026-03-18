import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

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
            </div>
        </div>
    );
}
