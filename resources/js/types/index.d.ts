import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    admin: Admin;
}
export interface Admin {
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    image?: string | null;
    image_url?: string | null;
    created_at: string | null;
    updated_at: string | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItemType[];
}

export interface NavItemType {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | string | null;
    slug?: string;
    isActive?: boolean;
    children?: NavItemType[];
    permission?: string;
    onClick?: (item: NavItemType, event?: React.MouseEvent) => void;
    badge?: string | number;
    disabled?: boolean;
    external?: boolean;
    target?: '_blank' | '_self' | '_parent' | '_top';
    className?: string;
    description?: string;
    [key: string]: any;
}

// Alias for backward compatibility
export type NavItem = NavItemType;

export interface SharedData {
    name: string;
    auth: Auth;
    admin: Admin;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
    email: string;
    phone?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    image?: string | null;
    image_url?: string | null;
    email_verified_at?: string | null;
    role_label?: string | null;
    permissions?: string[];
    all_permissions?: string[];
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
}

export interface Vendor {
    id: number;
    first_name: string;
    last_name: string;
    shop_name: string;
    email: string;
    phone: string;
    address?: string | null;
    region_state?: string | null;
    city?: string | null;
    zip_code?: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export interface ExternalListingSubmission {
    id: number;
    user_id: number;
    name: string;
    email: string;
    external_link: string;
    external_listing_type: string;
    created_at: string;
    updated_at: string;
}

export interface NavItemProps {
    item: NavItemType;
    isCollapsed: boolean;
    level?: number;
    isActive?: boolean;
    currentRoute?: string;
    permissions?: string[];
    activeSlug?: string;
}

export interface DropdownPosition {
    top: number;
    left: number;
}

export interface Rental {
    id: number
    user_id: number
    city_id: number
    title: string
    description: string | null
    purchase_price: number | null
    property_type: string
    security_deposit: number | null
    lease_length: number
    bedrooms: number
    bathrooms: number
    square_feet: number
    pet_friendly: boolean
    parking_garage: number | null
    primary_image_url: string | null
    image_url: string[]
    status: string
    created_at: string
    updated_at: string
    galleries?: ListingGallery[]
}


export interface City {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}
