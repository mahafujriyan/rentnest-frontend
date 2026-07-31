# API Integration Guide

Base URL: `https://rentnest-dev.vercel.app/api`

All requests use JSON. Authenticated routes require `Authorization: Bearer <token>` header.

## Authentication

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/auth/login` | `{ email, password }` | `{ token, user }` |
| POST | `/register` | `{ name, email, password, role, phone? }` | `{ token, user }` |
| GET | `/auth/me` | — | `User` |
| PATCH | `/auth/me` | `{ name, phone? }` | `User` |

JWT stored in cookie `rentnest_token`. Middleware decodes role for route protection.

## Properties

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/properties` | Public | List with filters (`search`, `city`, `category`, `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `sortBy`, `sortOrder`, `page`, `limit`) |
| GET | `/properties/:id` | Public | Property details |
| GET | `/categories` | Public | All categories |
| GET | `/landlord/properties` | Landlord | Own properties |
| POST | `/landlord/properties` | Landlord | Create property |
| PUT | `/landlord/properties/:id` | Landlord | Update property |
| DELETE | `/landlord/properties/:id` | Landlord | Delete property |

## Rentals

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/rentals` | Tenant | Own rental requests |
| POST | `/rentals` | Tenant | Create rental request |
| GET | `/rentals/:id` | Auth | Rental details |
| GET | `/landlord/requests` | Landlord | Incoming requests |
| PATCH | `/landlord/requests/:id` | Landlord | Approve/reject `{ status: "APPROVED" \| "REJECTED" }` |

## Payments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/payments` | Tenant | Payment history |
| GET | `/payments/:id` | Auth | Payment details |
| POST | `/payments` | Tenant | Create Stripe checkout `{ rentalId }` → `{ url }` |

Redirect URLs: `/payment/success`, `/payment/cancel`

## Reviews

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/reviews` | Tenant | `{ propertyId, rating, comment }` |

## Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/users` | List all users |
| PATCH | `/admin/users/:id` | Ban/unban `{ status: "ACTIVE" \| "BANNED" }` |
| GET | `/admin/properties` | All properties |
| GET | `/admin/rentals` | All rentals |
| POST | `/admin/categories` | Create category `{ name, description? }` |

## Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "meta": { "page": 1, "limit": 10, "total": 100, "totalPages": 10 }
}
```

## Error Handling

- **401**: Token expired/invalid → redirect to login
- **403**: Insufficient permissions
- **404**: Resource not found
- **422**: Validation errors in `errorDetails`

Axios interceptor in `src/lib/axios.ts` handles global error toasts and auth redirects.

## Frontend Service Layer

```
src/services/
├── auth.service.ts
├── property.service.ts
├── rental.service.ts
├── payment.service.ts
├── review.service.ts
└── admin.service.ts
```

All UI components consume data via TanStack Query hooks in `src/hooks/`.
