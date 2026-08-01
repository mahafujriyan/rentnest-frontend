export const API_BASE_URL =
  "/api/backend";

export const APP_NAME = "RentNest";
export const APP_DESCRIPTION =
  "Find & List Rental Properties with Ease";

export const TOKEN_KEY = "rentnest_token";
export const USER_KEY = "rentnest_user";

export const ROLES = {
  TENANT: "TENANT",
  LANDLORD: "LANDLORD",
  ADMIN: "ADMIN",
} as const;

export const RENTAL_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  ACTIVE: "ACTIVE",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;

export const USER_STATUS = {
  ACTIVE: "ACTIVE",
  BANNED: "BANNED",
} as const;

export const POPULAR_CITIES = [
  { name: "New York", count: 120, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop" },
  { name: "Los Angeles", count: 98, image: "https://images.unsplash.com/photo-1580654712603-eb43229aff4d?w=400&h=300&fit=crop" },
  { name: "Chicago", count: 76, image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&h=300&fit=crop" },
  { name: "Miami", count: 65, image: "https://images.unsplash.com/photo-1514214246283-d427a95a798d?w=400&h=300&fit=crop" },
  { name: "Seattle", count: 54, image: "https://images.unsplash.com/photo-1502175353179-e7af172ef2b4?w=400&h=300&fit=crop" },
  { name: "Austin", count: 48, image: "https://images.unsplash.com/photo-1531218150217-54595c1653a9?w=400&h=300&fit=crop" },
];

export const AMENITIES = [
  "WiFi",
  "Parking",
  "Pool",
  "Gym",
  "Pet Friendly",
  "Air Conditioning",
  "Heating",
  "Laundry",
  "Balcony",
  "Garden",
  "Security",
  "Elevator",
];

export const NAV_LINKS = {
  public: [
    { href: "/", label: "Home" },
    { href: "/properties", label: "Properties" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ],
  tenant: [
    { href: "/dashboard/tenant", label: "Overview" },
    { href: "/dashboard/tenant/requests", label: "Rental Requests" },
    { href: "/dashboard/tenant/payments", label: "Payments" },
    { href: "/dashboard/tenant/reviews", label: "Reviews" },
    { href: "/dashboard/tenant/profile", label: "Profile" },
  ],
  landlord: [
    { href: "/dashboard/landlord", label: "Overview" },
    { href: "/dashboard/landlord/properties", label: "Properties" },
    { href: "/dashboard/landlord/requests", label: "Requests" },
    { href: "/dashboard/landlord/profile", label: "Profile" },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview" },
    { href: "/dashboard/admin/users", label: "Users" },
    { href: "/dashboard/admin/categories", label: "Categories" },
    { href: "/dashboard/admin/properties", label: "Properties" },
    { href: "/dashboard/admin/rentals", label: "Rentals" },
  ],
};

export const PROTECTED_ROUTES = {
  tenant: ["/dashboard/tenant"],
  landlord: ["/dashboard/landlord"],
  admin: ["/dashboard/admin"],
  auth: ["/login", "/register"],
};
