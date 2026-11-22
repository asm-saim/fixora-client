# Fixora

**Smart device and home appliance repair platform.** Book verified technicians, track every repair step, and pay only after the job is done.

- **Live site:** `https://<your-client>.vercel.app`
- **API:** `https://<your-server>.vercel.app`
- **Server repo:** `fixora-server`

## Demo credentials

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@fixora.com` | `Admin1234` |
| Technician | `rahim.tech@example.com` | `Fixora123` |
| Customer | `ayesha.customer@example.com` | `Fixora123` |

Stripe test card: `4242 4242 4242 4242`, any future expiry, any CVC.

## Purpose

Fixora connects customers who have a broken phone, laptop, AC, fridge, TV, washing machine or electrical fault with approved local technicians. The customer requests a repair, the technician moves it through a strict pipeline, and payment is only possible once the job is marked completed.

## Key features

**Public**
- Home page: hero with search, 6 latest services, How It Works, clickable Popular Categories (`/services?category=AC`), testimonials and stats
- `/services` with debounced search, category and mode filters, sorting and pagination, all stored in URL query params so they survive a reload
- Service details with technician summary, reviews, and role-aware **Request Repair** button (logged out → sign in and back; technician/admin → notice; customer → form)
- About / How It Works, tools-themed 404 page, loading and error boundaries

**Auth and security**
- BetterAuth (email + password, optional Google) with MongoDB adapter and extra fields `role`, `phone`, `area`, `bio`
- Role is forced to `customer` unless `technician` is chosen; nobody can sign up as admin, and the role cannot be changed through the auth API
- Middleware (`proxy.ts`) plus a server-side role check in every dashboard layout; a reload never bounces a signed-in user to `/sign-in`
- Short-lived JWT (15 min) sent to the Express API, which re-checks the role in the database

**Customer:** overview stats and chart, My Bookings (cancel with confirm, job timeline tracker, review after completion), **Pay Now** via Stripe Checkout, payment history

**Technician:** overview stats and chart, add service with ImgBB upload, My Services (edit, delete, availability switch, approval badges), request management showing only valid next actions, final-amount modal, confirm on reject

**Admin:** overview with charts, user role management (cannot change own role), service approval (pending first), read-only all-bookings with status filter, transactions with total revenue

**Polish and extras:** dark mode, server-side pagination, job timeline tracker, ratings and reviews, consistent status/payment badge colors, skeleton loaders, empty states, toasts on every action, confirm modals on destructive actions, responsive tables that become cards on mobile

## Tech stack and npm packages

Next.js 16 (App Router, TypeScript), React 19, Tailwind CSS 4, shadcn/ui

| Purpose | Packages |
| --- | --- |
| Auth | `better-auth`, `mongodb` |
| UI | `@base-ui/react`, `@radix-ui/react-slot`, `class-variance-authority`, `lucide-react`, `react-icons`, `tw-animate-css`, `next-themes`, `sonner` |
| Forms and validation | `react-hook-form`, `@hookform/resolvers`, `zod` |
| Charts and motion | `recharts`, `framer-motion` |
| Utilities | `date-fns` |

Fonts: Sora (headings) and Inter (body).

## Environment variables

Copy `.env.example` to `.env.local`.

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | public | Express server URL |
| `NEXT_PUBLIC_APP_URL` | public | This app's URL (BetterAuth client base URL) |
| `BETTER_AUTH_SECRET` | server | Random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | server | This app's URL. Must equal the server's `AUTH_ISSUER` |
| `TRUSTED_ORIGINS` | server | Optional comma-separated origins (defaults to `BETTER_AUTH_URL`) |
| `MONGODB_URI`, `DB_NAME` | server | Same database as the API |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | server | Google sign-in. Redirect URI: `{BETTER_AUTH_URL}/api/auth/callback/google` |

`NEXT_PUBLIC_*` values are inlined at build time, so redeploy after changing them.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in the values
npm run dev                  # http://localhost:3000
npm run seed:admin           # creates the admin account
```

Run `fixora-server` too (`npm run dev` on port 5000), then `npm run seed` there for demo data.

## Deploy to Vercel

Order matters because the two apps point at each other:

1. Deploy this client first with all variables set (use a placeholder for `NEXT_PUBLIC_API_URL`).
2. Deploy the server with `AUTH_JWKS_URL=https://<client>/api/auth/jwks`, `AUTH_ISSUER=https://<client>` and `CLIENT_URLS=https://<client>`.
3. Set the real server URL in `NEXT_PUBLIC_API_URL` here and **redeploy** the client.
4. Add `https://<client>` to `TRUSTED_ORIGINS` (or leave it unset and set `BETTER_AUTH_URL` correctly).
5. Add the Google redirect URI for the production domain, if Google sign-in is used.
6. Create the Stripe webhook (see the server README), then run the seeds against production.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` / `build` / `start` | Development, production build, production server |
| `npm run lint` | ESLint |
| `npm run seed:admin` | Create or promote the admin account |
| `npm run repair:accounts` | Maintenance script for account records |