

export interface Service {
    id: number;
    name: string;
    image: string;
    rating: number;
    location: string;
    price: number;
    service: string;
    category?: string | null;
    vehicleType?: string | null;
}

export interface ServiceFilters {
    search?: string;
    category?: string | null;
    vehicleType?: number | null;
    location?: string | null;
    minPrice?: number | null;
    maxPrice?: number | null;
}

export interface FilterOptionItem {
    label: string;
    value: string | number;
}

export interface PriceRangeOption {
    label: string;
    min: number;
    max: number;
}

export interface ServiceOptions {
    categories: FilterOptionItem[];
    vehicleTypes: FilterOptionItem[];
    locations: string[];
    priceRanges: PriceRangeOption[];
    priceBounds: {
        min: number;
        max: number;
    };
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface Paginated<T> {
    data: T[];
    meta: PaginationMeta;
}
