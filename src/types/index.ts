export type Role = "TENANT" | "LANDLORD" | "ADMIN";

export type RentalStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";

export type UserStatus = "ACTIVE" | "BANNED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status?: UserStatus;
  phone?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: { properties: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  address: string;
  city: string;
  state?: string;
  country?: string;
  zipCode?: string;
  images: string[];
  amenities: string[];
  isAvailable: boolean;
  categoryId: string;
  landlordId: string;
  category?: Category;
  landlord?: User;
  reviews?: Review[];
  averageRating?: number;
  _count?: { reviews: number };
  createdAt?: string;
  updatedAt?: string;
}

export interface Rental {
  id: string;
  propertyId: string;
  tenantId: string;
  /** Backend field — preferred move-in date */
  moveInDate?: string;
  /** @deprecated kept for older payloads; prefer moveInDate */
  startDate?: string;
  /** @deprecated not used by current backend */
  endDate?: string;
  status: RentalStatus;
  message?: string;
  property?: Property;
  tenant?: User;
  payment?: Payment;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: string;
  rentalId: string;
  amount: number;
  status: PaymentStatus;
  stripeSessionId?: string;
  rental?: Rental;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  userId: string;
  rating: number;
  comment: string;
  user?: User;
  property?: Property;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errorDetails?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PropertyFilters {
  search?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  sortBy?: "price" | "createdAt" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
}

export interface CreatePropertyData {
  title: string;
  description: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area?: number;
  address: string;
  city: string;
  state?: string;
  country?: string;
  zipCode?: string;
  images: string[];
  amenities: string[];
  categoryId: string;
}

export interface CreateRentalData {
  propertyId: string;
  moveInDate: string;
  message?: string;
}

export interface CreateReviewData {
  propertyId: string;
  rating: number;
  comment: string;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateRentalStatusData {
  status: "APPROVED" | "REJECTED";
}

export interface UpdateUserStatusData {
  status: UserStatus;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface DashboardStats {
  totalProperties?: number;
  totalRentals?: number;
  totalUsers?: number;
  totalRevenue?: number;
  pendingRequests?: number;
  activeRentals?: number;
}
