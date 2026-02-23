export interface ExternalListingSubmission {
    id: number;
    user_id: number;
    name: string;
    email: string;
    external_link: string;
    created_at: string;
    updated_at: string;
}


export interface Listing {
    id: number
    user_id: number
    city_id: number
    title: string
    description: string | null
    purchase_price: number | null
    listing_status: string
    property_type: string
    bedrooms: number
    bathrooms: number
    square_feet: number
    primary_image_url: string | null
    image_url: string[]
    status: string
    created_at: string
    updated_at: string
    galleries?: ListingGallery[]
    [key: string]: unknown;
}