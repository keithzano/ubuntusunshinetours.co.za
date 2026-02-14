export interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'client';
    phone?: string;
    avatar?: string;
    country?: string;
    city?: string;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
    bookings_count?: number;
    total_spent?: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    fallback_image?: string;
    icon?: string;
    is_active: boolean;
    sort_order: number;
    tours_count?: number;
    active_tours_count?: number;
}

export interface Location {
    id: number;
    name: string;
    slug: string;
    city?: string;
    region?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    image?: string;
    fallback_image?: string;
    is_active: boolean;
    is_featured: boolean;
    tours_count?: number;
    active_tours_count?: number;
}

export interface TourPricingTier {
    id: number;
    tour_id: number;
    name: string;
    description?: string;
    price: number;
    min_age?: number;
    max_age?: number;
    is_active: boolean;
    sort_order: number;
}

export interface TourTimeSlot {
    id: number;
    tour_id: number;
    date: string;
    start_time: string;
    end_time?: string;
    available_spots: number;
    booked_spots: number;
    price_override?: number;
    is_active: boolean;
}

export interface Tour {
    id: number;
    title: string;
    slug: string;
    short_description: string;
    description: string;
    category_id: number;
    location_id: number;
    price: number;
    original_price?: number;
    price_type: 'per_person' | 'per_group';
    max_group_size?: number;
    duration: string;
    duration_minutes?: number;
    highlights?: string[];
    includes?: string[];
    excludes?: string[];
    what_to_bring?: string[];
    meeting_point?: {
        address?: string;
        instructions?: string;
        latitude?: number;
        longitude?: number;
    };
    cancellation_policy?: string;
    languages?: string[];
    accessibility?: string[];
    available_days?: string[];
    start_time?: string;
    end_time?: string;
    min_participants: number;
    max_participants?: number;
    booking_cutoff_hours: number;
    featured_image?: string;
    gallery?: string[];
    video_url?: string;
    rating: number;
    reviews_count: number;
    bookings_count: number;
    views_count: number;
    is_active: boolean;
    is_featured: boolean;
    is_bestseller: boolean;
    instant_confirmation: boolean;
    free_cancellation: boolean;
    free_cancellation_hours?: number;
    discount_percentage?: number;
    formatted_price?: string;
    category?: Category;
    location?: Location;
    pricing_tiers?: TourPricingTier[];
    time_slots?: TourTimeSlot[];
    available_time_slots?: TourTimeSlot[];
    approved_reviews?: Review[];
}

export interface CartParticipant {
    tier_id: number;
    name: string;
    quantity: number;
    price: number;
}

export interface CartItem {
    id: number;
    cart_id: number;
    tour_id: number;
    time_slot_id?: number;
    tour_date: string;
    tour_time?: string;
    participants: CartParticipant[];
    subtotal: number;
    tour?: Tour;
    time_slot?: TourTimeSlot;
}

export interface Cart {
    id: number;
    user_id?: number;
    session_id?: string;
    email?: string;
    items: CartItem[];
    total: number;
    item_count: number;
}

export interface BookingParticipant {
    tier: string;
    quantity: number;
    price: number;
}

export interface Booking {
    id: number;
    booking_reference: string;
    user_id?: number;
    tour_id: number;
    time_slot_id?: number;
    customer_name: string;
    customer_email: string;
    customer_phone?: string;
    customer_country?: string;
    tour_date: string;
    tour_time?: string;
    participants: BookingParticipant[];
    total_participants: number;
    special_requirements?: string;
    subtotal: number;
    discount: number;
    discount_code?: string;
    tax: number;
    total: number;
    currency: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
    payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
    confirmed_at?: string;
    cancelled_at?: string;
    cancellation_reason?: string;
    invoice_number?: string;
    invoice_generated_at?: string;
    created_at: string;
    updated_at: string;
    tour?: Tour;
    user?: User;
    payments?: Payment[];
    review?: Review;
}

export interface Payment {
    id: number;
    booking_id: number;
    payment_method: string;
    transaction_id?: string;
    payment_id?: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
    paid_at?: string;
}

export interface Review {
    id: number;
    tour_id: number;
    booking_id: number;
    user_id?: number;
    customer_name: string;
    customer_email: string;
    rating: number;
    title?: string;
    comment: string;
    photos?: string[];
    is_verified: boolean;
    is_approved: boolean;
    status: 'pending' | 'approved' | 'rejected';
    approved_at?: string;
    created_at: string;
    tour?: Tour;
    booking?: Booking;
    user?: User;
}

export interface DiscountCode {
    id: number;
    code: string;
    description?: string;
    type: 'percentage' | 'fixed';
    value: number;
    min_order_amount?: number;
    max_discount?: number;
    max_uses?: number;
    used_count: number;
    per_user_limit?: number;
    valid_from?: string;
    expires_at?: string;
    is_active: boolean;
    status: 'active' | 'inactive' | 'expired';
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export interface Settings {
    general: {
        site_name?: string;
        site_description?: string;
        contact_email?: string;
        contact_phone?: string;
        contact_address?: string;
        whatsapp_number?: string;
        currency?: string;
        currency_symbol?: string;
        logo?: string;
    };
    payfast: {
        payfast_merchant_id?: string;
        payfast_merchant_key?: string;
        payfast_passphrase?: string;
        payfast_sandbox?: boolean;
    };
    email: {
        mail_from_name?: string;
        mail_from_address?: string;
        booking_notification_email?: string;
        cart_abandonment_enabled?: boolean;
        cart_abandonment_delay_hours?: number;
    };
    seo: {
        meta_title?: string;
        meta_description?: string;
        meta_keywords?: string;
        google_analytics_id?: string;
        facebook_pixel_id?: string;
    };
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User | null;
    };
    flash: {
        success?: string;
        error?: string;
    };
};
