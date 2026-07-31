# RentNest Frontend

Find & List Rental Properties with Ease — a production-ready rental marketplace built with Next.js 16.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS** + **Shadcn UI**
- **TanStack Query** + **Axios**
- **Zustand** (auth state)
- **React Hook Form** + **Zod**
- **Framer Motion** + **Sonner**
- **Stripe** (payments via backend)

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (default: `https://rentnest-dev.vercel.app/api`) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (optional, backend handles checkout) |

## Folder Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Shared UI & layout components
├── features/         # Feature-specific components
├── hooks/            # TanStack Query hooks
├── providers/        # React context providers
├── services/         # Axios API layer
├── store/            # Zustand stores
├── types/            # TypeScript types
├── lib/              # Utilities, auth, axios, validations
├── constants/        # App constants
└── middleware.ts     # JWT route protection
```

## Pages

| Route | Access |
|-------|--------|
| `/` | Public — Home |
| `/properties` | Public — Property listing |
| `/properties/[id]` | Public — Property details |
| `/login`, `/register` | Guest |
| `/tenant/*` | Tenant |
| `/landlord/*` | Landlord |
| `/admin/*` | Admin |
| `/payment/success`, `/payment/cancel` | Authenticated |

## Admin Credentials

Use credentials provided by your backend administrator. Default test admin (if seeded):

```
Email: admin@rentnest.com
Password: Admin@123
```

## Scripts

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Deployment (Vercel)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

No additional configuration required.

## License

Academic assignment — MIT
