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
            <div className="relative z-10 container mt-20">
                <h2 className="mb-5 text-3xl font-medium text-text-white">
                    Browse By Category
                </h2>
                <div className="flex items-center justify-between text-center">
                    {categories.map((item, index) => (
                        <div className="">
                            <img
                                src={item.image}
                                alt="Car Wash"
                            />
                            <h4 className="mt-4 text-sm font-medium text-text-white">
                                {item.name}
                            </h4>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
