type FilterValue = string | number | null;

interface FilterOption {
    label: string;
    value: FilterValue;
}

interface FilterProps {
    title?: string;
    items: FilterOption[];
    active: FilterValue;
    onChange: (value: FilterValue, option: FilterOption) => void;
}

export default function FilterSection({ title, items, active, onChange }: FilterProps) {
    return (
        <div className="mb-8">
            {title && (
                <h3 className="text-2xl font-medium mb-4">{title}</h3>
            )}

            <ul className="space-y-3">
                {items.map((item) => {
                    const option = typeof item === 'string' ? { label: item, value: item } : item;
                    const isActive = option.value === active || (option.value === null && (active === null || active === undefined));

                    return (
                        <li
                            key={`${option.label}-${option.value ?? 'all'}`}
                            onClick={() => onChange(option.value, option)}
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
                                {option.label}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
