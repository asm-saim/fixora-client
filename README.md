<h1>
  <img src="./public/images/logo.png" alt="Fixora logo" width="36" align="absmiddle" />
  Fixora
</h1>

**A repair marketplace for devices and home appliances.** Technicians list their repair services, customers request a repair, follow every step of the job, and pay only after the work is done.

<br clear="left" />

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-5-000000?logo=express)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Better Auth](https://img.shields.io/badge/Better_Auth-000000?logo=betterauth&logoColor=white)](https://www.better-auth.com)
[![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)](https://stripe.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel)](https://vercel.com)

---

## Live Site

| Resource | URL |
|---|---|
| **Live Site** | [fixora-v1.vercel.app](https://fixora-v1.vercel.app/) |
| **Server Repository** | [github.com/asm-saim/fixora-server](https://github.com/asm-saim/fixora-server) |
| **Client Repository** | [github.com/asm-saim/fixora-client](https://github.com/asm-saim/fixora-client) |


---

## Examiner Test Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** (approves services, manages users, sees all payments) | `admin@fixora.com` | `Admin1234` |
| **Technician** (lists services, handles repair requests) | `rahim.tech@example.com` | `Fixora123` |
| **Customer** (requests repairs, pays) | `ayesha.customer@example.com` | `Fixora123` |

**Stripe test card:** `4242 4242 4242 4242`, any future expiry date, any CVC.

---

## Overview

Fixora is a full-stack web application that makes it simple to find and book a trusted repair technician. It connects people with a broken phone, laptop, AC, fridge, TV, washing machine or electrical fault to approved local technicians.

A customer requests a repair, the technician moves it through a strictly enforced pipeline (`requested → accepted → in-progress → completed`), and payment becomes possible only once the job is marked completed. Every rule is enforced on the server, not just in the interface.

---

## Features

### Home Page & Service Discovery
- **Dynamic Home Page:** Hero with search, the six latest approved services fetched from MongoDB, clickable category cards, a four-step "How It Works" section, testimonials and platform stats.
- **Explore & Search:** Browse services in an equal-height card grid with debounced search, category and service-mode filters, sorting and server-side pagination using MongoDB `skip` and `limit`. All filters live in the URL, so they survive a reload and `/services?category=AC` works from the home page.

### Service Management
- **Service CRUD:** Technicians create, edit and delete their own services with pricing, category, service mode, area and description.
- **Approval Workflow:** New and edited services start as **Pending**. Only admin-approved, available services appear publicly.
- **Availability Switch:** Technicians can pause a service without losing its approval.
- **Image Upload:** Service and profile images are uploaded through ImgBB.
- **Service Details:** Large image, full information, technician summary, ratings and reviews.

### Repair Request & Booking Pipeline
- **Request Form:** Customers submit a repair request from a modal with phone, address, preferred date and a problem description (20+ characters).
- **Role-Aware Request Button:** Logged-out visitors are sent to sign in and back. Technicians and admins see a notice that only customers can request a repair.
- **Status Pipeline:** `requested → accepted | rejected`, `accepted → in-progress`, `in-progress → completed` (a final amount above zero is required). Any other transition is rejected with an error.
- **Duplicate Protection:** A customer cannot have two active requests for the same service (HTTP 409), enforced by the API and a database index.
- **Cancel & Timeline:** Customers can cancel while a request is still `requested`. A job timeline tracker uses the `statusHistory` array to show every status change.
- **Ratings & Reviews:** Customers can review a completed job, and average ratings appear on service cards and service detail pages.

### Payments
- **Stripe Checkout:** Pay Now is available only for completed, unpaid bookings owned by the customer. The amount comes from the database, never from the browser.
- **Webhook Verification:** A signed `checkout.session.completed` webhook verifies and records successful payments.
- **Idempotent Recording:** The success page and Stripe webhook can both record a payment. Unique indexes on `stripeSessionId` and `bookingId` ensure payments are recorded only once, including during webhook retries.
- **Payment History:** Customers see every transaction. Admins see all transactions with total revenue.

### Dashboards
- **Customer:** Overview stats and chart, My Bookings, Payments.
- **Technician:** Overview stats and chart, Add Service, My Services, Requests with only the valid next action shown.
- **Admin:** Overview with charts, Users and role management (an admin cannot change their own role), Service approval with pending items first, All Bookings with a status filter, Transactions.
- **Profile:** Update name, phone, area, bio and photo. The navbar and top bar refresh without signing out.

### Security & Authorization
- **Authentication:** Email and password registration and Google sign-in through Better Auth with its MongoDB adapter. Validation rules show inline errors under each field.
- **Role Safety:** Sign-up allows only `customer` or `technician`. Admin accounts cannot be created through the app, and roles cannot be changed through the auth API.
- **JWT Verification:** The API uses `verifyToken`, `verifyCustomer`, `verifyTechnician` and `verifyAdmin` middlewares. The client issues a short-lived signed JWT, and Express verifies it against the client's public JWKS endpoint.
- **Server-Side Authorization:** Express returns **401** for a missing or invalid token and **403** for the wrong role. It reads the role from the database rather than trusting the token, and ownership checks always use the email from the token.
- **Route Protection:** Next.js middleware plus a server-side role check in every dashboard layout. Reloading a private page never bounces a signed-in user to the sign-in page.
- **Business Rule Enforcement:** Only valid booking status transitions are allowed. Payment checkout is restricted to completed, unpaid bookings owned by the authenticated customer. Sensitive operations are validated on the server.

### User Experience & Interface
- **Light & Dark Themes:** Smooth light and dark theme toggle with preferences remembered across reloads.
- **Responsive Design:** Optimized for mobile, tablet and desktop, with tables that become cards on small screens.
- **Loading States:** Skeleton loaders on every data view.
- **Notifications:** Sonner toasts for every action.
- **Custom Error Handling:** Tools-themed 404 page, error boundary, confirmation modals for delete, cancel and reject, and contextual empty states.
- **Consistent Badges:** Requested blue, Accepted indigo, In Progress amber, Completed green, Rejected red, Cancelled gray.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui (Base UI), Lucide icons, React Icons, Framer Motion |
| Charts & Forms | Recharts, React Hook Form, Zod |
| Feedback | Sonner toasts, confirm modals, next-themes |
| Authentication | Better Auth, MongoDB adapter, Google OAuth, JWT (`jose` on the server) |
| Backend | Express 5 |
| Database | MongoDB Atlas |
| Payments | Stripe Checkout and webhooks (test mode) |
| Image uploads | ImgBB API |
| Hosting | Vercel |

---

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Hero, featured services, categories, how it works |
| `/services` | Public | Explore, search, filter and sort |
| `/services/[id]` | Public | Service details and repair request |
| `/about` | Public | About and How It Works |
| `/sign-in`, `/sign-up` | Public | Authentication |
| `/dashboard` | Private | Redirects to your role dashboard |
| `/dashboard/profile` | Private | Update your profile |
| `/dashboard/customer` | Customer | Overview |
| `/dashboard/customer/bookings` | Customer | Your bookings, cancel, pay, review |
| `/dashboard/customer/payments` | Customer | Payment history |
| `/dashboard/technician` | Technician | Overview |
| `/dashboard/technician/add-service` | Technician | Create a service |
| `/dashboard/technician/my-services` | Technician | Edit, delete, availability |
| `/dashboard/technician/requests` | Technician | Accept, reject, progress, complete |
| `/dashboard/admin` | Admin | Overview with charts |
| `/dashboard/admin/users` | Admin | Manage users and roles |
| `/dashboard/admin/services` | Admin | Approve or reject services |
| `/dashboard/admin/bookings` | Admin | All bookings (read-only) |
| `/dashboard/admin/transactions` | Admin | All payments and total revenue |
| `/payment/success`, `/payment/cancel` | Customer | Stripe return pages |

---

## Data Design

Fixora uses four MongoDB collections for its own data: `users`, `services`, `bookings` and `payments`. Better Auth adds its own `session`, `account`, `verification` and `jwks` collections, and its user collection is the `users` collection, extended with `role`, `phone`, `area` and `bio`.

| Collection | Written by | Purpose |
|---|---|---|
| `users` | Better Auth sign-up, profile update, admin | Every account, its role and profile |
| `services` | Technician (create, edit); admin (approval) | Repair services a technician offers |
| `bookings` | Customer (request); technician (status); Stripe (payment status) | Every repair job and its current status |
| `payments` | Stripe verification and webhook | One record per paid job |

```
users.email ──► services.technicianEmail
services._id ─► bookings.serviceId
users.email ──► bookings.customerEmail / bookings.technicianEmail
bookings._id ─► payments.bookingId   (at most one payment per booking)
```

Bookings copy the service and technician details at request time, so a booking still displays correctly if the service is edited or deleted later.

### Job status rules

| Current status | Next status | Who can change it | Extra rule |
|---|---|---|---|
| `requested` | `accepted` | Technician who owns the job | none |
| `requested` | `rejected` | Technician who owns the job | Final state |
| `requested` | `cancelled` | Customer who owns the booking | Final state |
| `accepted` | `in-progress` | Technician who owns the job | none |
| `in-progress` | `completed` | Technician who owns the job | `finalAmount` greater than 0 |
| `completed` and unpaid | paid | Stripe, after the customer pays | Only once per booking |

Any other change, such as `requested` to `completed`, is rejected by the API.

### Business rules

- A customer cannot have two active requests (`requested`, `accepted` or `in-progress`) for the same service.
- Only customers can send repair requests. Technicians and admins cannot, and a technician cannot request their own service.
- A technician sees and updates only bookings where `technicianEmail` matches their own. A customer sees only their own bookings.
- Pay Now appears only when `status` is `completed` and `paymentStatus` is `unpaid`.
- Editing a service sets it back to `pending` for admin review.

---

## npm Packages Used

### Client (`fixora-client`)

| Package | Purpose |
|---|---|
| `next`, `react`, `react-dom` | Framework and UI library |
| `better-auth` | Authentication (email and password, Google, JWT plugin) |
| `mongodb` | MongoDB driver for the Better Auth adapter |
| `tailwindcss`, `@tailwindcss/turbopack`, `tw-animate-css` | Styling and animation utilities |
| `shadcn`, `@base-ui/react`, `@radix-ui/react-slot`, `class-variance-authority`, `cn` | Component primitives and class helpers |
| `lucide-react`, `react-icons` | Icons, including the X logo |
| `react-hook-form`, `@hookform/resolvers`, `zod` | Forms and validation |
| `recharts` | Dashboard charts |
| `framer-motion` | Animations |
| `sonner` | Toast notifications |
| `next-themes` | Dark mode |
| `date-fns` | Date formatting |
| `typescript`, `eslint`, `eslint-config-next`, `babel-plugin-react-compiler` | Tooling (dev) |

### Server (`fixora-server`)

| Package | Purpose |
|---|---|
| `express` | HTTP server and routing |
| `mongodb` | Database driver |
| `jose` | JWT verification against the client's JWKS |
| `stripe` | Checkout sessions and webhook signature verification |
| `cors` | Environment-based allowed origins |
| `helmet` | Security headers |
| `morgan` | Request logging |
| `multer` | Image upload handling (forwarded to ImgBB) |
| `dotenv` | Environment variables |
| `nodemon` | Auto-restart in development (dev) |

---

## Local Setup

### Prerequisites

- Node.js **20.9 or newer** and npm
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (allow your IP in Network Access)
- A [Stripe](https://stripe.com) account in test mode, plus the [Stripe CLI](https://docs.stripe.com/stripe-cli) for local webhooks
- A free [ImgBB API key](https://api.imgbb.com)
- A Google OAuth client ([Google Cloud Console](https://console.cloud.google.com/apis/credentials)), optional

### 1. Start the client

The client runs Better Auth, so start it first. The server's seed script creates accounts through it.

```bash
git clone https://github.com/asm-saim/fixora-client.git
cd fixora-client
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000

BETTER_AUTH_SECRET=a-long-random-string          # openssl rand -base64 32
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/fixora?retryWrites=true&w=majority
DB_NAME=fixora

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Used only by the admin seed script
ADMIN_NAME=Fixora Admin
ADMIN_EMAIL=admin@fixora.com
ADMIN_PASSWORD=Admin1234
```

In Google Cloud Console, add `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. Then run:

```bash
npm run dev      # http://localhost:3000
```

### 2. Start the server

```bash
git clone https://github.com/asm-saim/fixora-server.git
cd fixora-server
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/fixora?retryWrites=true&w=majority
DB_NAME=fixora
CLIENT_URLS=http://localhost:3000
CLIENT_URL=http://localhost:3000

# Must match the client
AUTH_JWKS_URL=http://localhost:3000/api/auth/jwks
AUTH_ISSUER=http://localhost:3000

STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
IMGBB_API_KEY=your-imgbb-key
```

Run it, then seed the demo data (with the client still running):

```bash
npm run dev      # http://localhost:5000
npm run seed     # admin, technicians, customers, approved services, bookings and payments
```

To receive Stripe webhooks locally, run this in a third terminal and copy the printed `whsec_...` into `STRIPE_WEBHOOK_SECRET`:

```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

---

## How It Fits Together

```
Browser ──► Next.js client (Vercel) ──► Express API (Vercel) ──► MongoDB Atlas
              │  Better Auth sessions        │  verifies the JWT (JWKS)
              │  issues a short-lived JWT    │  role + ownership checks
              │                              └─ Stripe Checkout + webhook
              └─ ImgBB image uploads (through the API)
```

The Next.js app handles sign-up and sign-in, and exposes a public JWKS endpoint. For each API call it attaches a short-lived signed JWT. Express verifies the signature, then loads the user and role from MongoDB before touching any data, so a token alone never grants a role.

---

## Application Architecture

The project is split into two applications that live side by side:

```text
Fixora
│
├── fixora-client                    # Next.js app (this repository)
│   ├── src
│   │   ├── app                      # (auth), (public), dashboard, payment, api/auth
│   │   ├── components               # admin, auth, bookings, home, layout, payments, services, shared, ui
│   │   ├── hooks                    # useApi, useCurrentUser, useSignOut
│   │   ├── lib                      # Auth config, API client, validations, constants
│   │   └── proxy.ts                 # Route protection middleware
│   ├── scripts                      # Admin seed and maintenance scripts
│   ├── public                       # Logo and static assets
│   └── README.md
│
└── fixora-server                    # Express REST API
    ├── src
    │   ├── config                   # Database and environment checks
    │   ├── routes                   # services, bookings, payments, admin, stats, users, upload
    │   ├── controllers              # Request handlers, including the Stripe webhook
    │   ├── middlewares              # verifyToken, role checks, error and 404 handlers
    │   └── utils                    # Validation, ownership, booking rules, stats pipelines
    ├── scripts                      # seed.js, indexes.js
    └── vercel.json
```

---

## Future Improvements

Potential enhancements include:

- PDF invoice download for paid jobs.
- Pro Technician plan with Stripe subscriptions and a "Verified Pro" badge.
- Real-time notifications for status changes.
- In-app chat between customer and technician.
- Technician availability calendar and scheduling.
- Location-based technician search.

---

## Author

Built by **A S M Saim**