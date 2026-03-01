interface Filter{
    title: string;
    items: string[];
    active: string;
    onChange: (item: string) => void;
}

export default function FilterSection({ title, items, active, onChange }: Filter) {
    return (
        <div className="mb-8">
            {title && (
                <h3 className="text-2xl font-medium mb-4">{title}</h3>
            )}

            <ul className="space-y-3">
                {items.map((item: string) => {
                    const isActive = item === active;

                    return (
                        <li
                            key={item}
                            onClick={() => onChange(item)}
                            className="flex items-center gap-4 cursor-pointer"
                        >
                            {/* Outer Circle */}
                            <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200
                            ${isActive
                                        ? 'bg-navy'
                                        : 'bg-gray-300'
                                    }`}
                            >
                                {/* Inner Dot */}
                                <div
                                    className={`w-2.5 h-2.5 rounded-full
                                ${isActive
                                            ? 'bg-white'
                                            : 'bg-gray-300'
                                        }`}
                                />
                            </div>

                            {/* Text */}
                            <span
                                className={`text-md transition-colors
                            ${isActive
                                        ? 'text-navy'
                                        : 'text-white'
                                    }`}
                            >
                                {item}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
