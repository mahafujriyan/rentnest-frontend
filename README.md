<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/home.svg" alt="RentNest Logo" width="80" height="80" />
  <h1 align="center">RentNest Frontend</h1>
  <p align="center">
    <strong>A Premium Rental Property Marketplace Built with Next.js 16</strong>
  </p>
  <p align="center">
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?style=flat-square&logo=tailwindcss" alt="TailwindCSS" /></a>
    <a href="https://ui.shadcn.com/"><img src="https://img.shields.io/badge/Shadcn-UI-black?style=flat-square&logo=shadcn" alt="ShadcnUI" /></a>
    <a href="https://zustand-demo.pmnd.rs/"><img src="https://img.shields.io/badge/State-Zustand-orange?style=flat-square" alt="Zustand" /></a>
  </p>
</div>

<br/>

Find & List Rental Properties with Ease. **RentNest** is a commercial-grade SaaS platform designed for tenants, landlords, and administrators. It features role-based dashboards, secure JWT authentication, and a modern glassmorphism UI.

## 🚀 Tech Stack

- **Core:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS (v4), Shadcn UI, Framer Motion, Next Themes (Dark Mode)
- **Data Fetching:** TanStack Query (React Query v5), Axios
- **State Management:** Zustand (for Auth and UI state)
- **Forms & Validation:** React Hook Form, Zod
- **Payments:** Stripe integration via backend

---

## 🛠️ Getting Started

Follow these instructions to set up the project 

### Prerequisites
- Node.js 20+ installed
- npm or yarn or pnpm

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   *Note: Update `.env.local` if necessary (see below).*

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 🔑 Environment Variables

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://rentnest-dev.vercel.app/api` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe PK (Optional) | *(Checkout handled by backend)* |

---

## 📁 Folder Structure (Feature-Based)

```text
src/
├── app/              # Next.js App Router & Pages
├── components/       # Shared UI & Layout Components (Shadcn)
├── features/         # Feature-specific isolated logic (Home, Properties, Auth)
├── hooks/            # TanStack Query & Custom React Hooks
├── providers/        # Context Providers (Theme, Query, Auth)
├── services/         # Axios API Service Layer
├── store/            # Zustand global stores
├── types/            # TypeScript type definitions
├── lib/              # Utilities, Axios instances, Formatters
├── constants/        # Application constants
└── middleware.ts     # Route protection (JWT/Role-based)
```

---

## 🧭 Application Routes

The platform implements strict role-based route protection using Next.js Middleware.

| Route Structure | Access Level | Description |
|-----------------|--------------|-------------|
| `/`, `/properties`, `/about`, `/contact`, `/faq` | **Public** | Browse properties, general info |
| `/login`, `/register` | **Guest** | Authentication |
| `/tenant/*` | **Tenant** | Manage rentals, payments, reviews |
| `/landlord/*` | **Landlord** | Manage listings, approve requests |
| `/admin/*` | **Admin** | System management, users, stats |
| `/payment/success`, `/payment/cancel` | **Auth** | Stripe checkout redirects |

---

## 🛡️ Admin Credentials Placeholder

To test the Admin Dashboard, use the following credentials (provided by the backend):

```text
Email: admin@rentnest.com
Password: Admin@123
```
*(Note: If these credentials fail, please register a new user and escalate the role via database if needed, or ask the backend administrator.)*

---

## 📜 Available Scripts

- `npm run dev` — Starts the development server.
- `npm run build` — Builds the application for production.
- `npm run start` — Starts the production server.
- `npm run lint` — Runs ESLint to check for code issues.

---

## 🚢 Deployment Guide (Vercel)

This project is fully optimized for **Vercel** with zero-configuration needed.

1. Push your code to a GitHub repository.
2. Go to your [Vercel Dashboard](https://vercel.com/new).
3. Import the repository.
4. Expand **Environment Variables** and add `NEXT_PUBLIC_API_URL`.
5. Click **Deploy**.

*All server components, dynamic imports, and route caching will be automatically handled.*

---

## 📚 API Integration
For detailed information on the backend API integration, please refer to the [API_INTEGRATION.md](./API_INTEGRATION.md) file.
