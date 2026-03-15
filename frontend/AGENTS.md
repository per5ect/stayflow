## AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

StayFlow is a platform for booking accommodations, similar to Airbnb. It connects landlords (who list apartments) with renters (who book them). The backend is fully implemented as a Spring Boot REST API with JWT authentication. This repository contains only the Next.js frontend.
There are four application workflows depending on the user's role. There are three roles for registered users: ADMIN, RENTER, LANDLORD. Unauthenticated guests can browse apartments

### Data Flow

The frontend communicates exclusively with the Spring Boot backend via REST API (base URL configured in environment variables as `NEXT_PUBLIC_API_URL`). Authentication uses JWT tokens sent as `Authorization: Bearer <token>` header on every protected request.

For full API surface, business rules, domain entities and response structures see `../backend/AGENTS.md`.

Backend response structures are defined in `../backend/src/main/java/com/stayflow/backend/web/` (dto folders inside each controller package). Use these as the source of truth when typing API responses in `src/domains/`.

### App Internal Structure

App follows this pattern:

frontend/
├── public/
├── pages/ # Next.js routing (thin layer, imports screens)
│ ├── app.tsx
│ ├── index.tsx # → screens/guest/Home
│ ├── apartments/[id].tsx # → screens/guest/ApartmentDetail
│ ├── auth/
│ │ ├── login.tsx
│ │ ├── register.tsx
│ │ └── verify.tsx
│ ├── renter/
│ │ ├── search.tsx          # → screens/guest/Search (public)
│ │ ├── reservations.tsx
│ │ ├── payments.tsx # → screens/renter/MyPayments
│ │ └── checkout/[id].tsx
│ ├── landlord/
│ │ ├── apartments.tsx
│ │ ├── apartments/new.tsx
│ │ ├── apartments/[id]/edit.tsx
│ │ ├── reservations.tsx
│ │ └── payments.tsx # → screens/landlord/Payments (earnings/payouts)
│ ├── admin/
│ │ ├── dashboard.tsx
│ │ ├── users.tsx
│ │ ├── apartments.tsx
│ │ ├── reservations.tsx # → screens/admin/Reservations
│ │ └── payments.tsx # → screens/admin/Payments
│ └── profile.tsx # → screens/shared/Profile
└── src/
├── adapters/ # API calls (one file per domain)
│ ├── auth.adapter.ts
│ ├── apartment.adapter.ts
│ ├── reservation.adapter.ts
│ ├── payment.adapter.ts
│ ├── user.adapter.ts
│ └── admin.adapter.ts # Admin-only calls: stats, users CRUD, all reservations/payments
├── domains/ # TypeScript types and interfaces
│ ├── auth.types.ts
│ ├── apartment.types.ts # Includes ApartmentType, ApartmentStatus enums
│ ├── availability.types.ts # ApartmentAvailableDates (id, availableFrom, availableTo)
│ ├── reservation.types.ts # Includes ReservationStatus enum, landlordMessage, nights fields
│ ├── payment.types.ts # Includes commission, landlordPayout fields
│ ├── user.types.ts # Includes UserStatsResponse (role-dependent fields)
│ └── admin.types.ts # AdminStatsResponse, AdminUserResponse
├── lib/ # Third-party library configs
│ ├── queryClient.ts # React Query client
│ ├── axios.ts # Axios instance with JWT interceptor
│ └── mui.ts # MUI theme
├── hooks/ # Global hooks
│ ├── useAuth.ts # Current user, role, token
│ └── useToast.ts
├── contexts/
│ └── AuthContext.tsx # JWT token, user state, logout
├── utils/
│ ├── formatPrice.ts
│ ├── formatDate.ts
│ └── roleGuard.ts # Role-based route protection
├── components/ # Role-agnostic reusable components (atomic design)
│ ├── atoms/
│ │ ├── Logo/
│ │ ├── StatusBadge/ # PENDING, APPROVED, DECLINED etc.
│ │ └── PriceDisplay/
│ ├── molecules/
│ │ ├── ApartmentCard/ # Used by guest, renter, landlord, admin
│ │ ├── ReservationCard/ # Shows status, landlordMessage, nights, totalPrice
│ │ ├── PaymentCard/ # Shows amount, commission, landlordPayout, cardBrand, receiptNumber
│ │ ├── UserAvatar/
│ │ ├── DateRangePicker/
│ │ └── ConfirmDialog/
│ └── organisms/
│ ├── Navbar/ # Renders different items based on role from useAuth
│ ├── ApartmentGrid/
│ ├── ReservationList/
│ └── PhotoUploader/
└── screens/ # Feature screens organized by role
├── guest/                 # Public screens — no auth required
│ ├── Home/
│ ├── Search/             # Accessible to all roles + unauthenticated guests
│ └── ApartmentDetail/
├── auth/
│ ├── Login/
│ ├── Register/
│ └── VerifyEmail/
├── renter/
│ ├── MyReservations/
│ ├── MyPayments/ # GET /api/payments/my
│ └── Checkout/
├── landlord/
│ ├── MyApartments/
│ ├── ApartmentForm/ # Create and edit; includes availability windows management
│ ├── IncomingReservations/
│ └── Payments/ # GET /api/payments/landlord (earnings and payouts)
├── admin/
│ ├── Dashboard/ # GET /api/admin/stats
│ ├── Users/ # GET /api/admin/users, DELETE /api/admin/users/{id}
│ ├── Apartments/ # GET /api/admin/apartments
│ ├── Reservations/ # GET /api/admin/reservations
│ └── Payments/ # GET /api/admin/payments
└── shared/
└── Profile/ # GET+PUT /api/users/me, PUT /api/users/me/password, GET /api/users/me/stats

Screens use a controller pattern: `ScreenName.tsx` + `useScreenNameController.tsx`.

### Screen Component Structure

Every non-trivial screen folder must follow this layout:

```
screens/<role>/<ScreenName>/
├── ScreenName.tsx                  # Thin orchestration only — imports components, reads controller, renders layout
├── useScreenNameController.ts      # All state, queries, mutations, derived values, handlers
└── components/                     # Screen-private components (not reused elsewhere)
    ├── SomePart.tsx                # One component per file, named export
    └── ...
```

**Rules:**

- `ScreenName.tsx` must stay thin — no inline component definitions, no local hooks beyond `useScreenNameController`. If JSX grows beyond a simple layout, extract a component.
- Any component defined only inside this screen goes in `components/`. Never inline multi-line components inside the screen file.
- Components in `components/` use **named exports** (not default). One component per file, filename matches component name.
- Components that receive only data/callbacks via props are preferred (pure/presentational). Components that need to call `useScreenNameController()` or other hooks internally may do so — pass no props in that case.
- If a component is used in more than one screen, move it to `src/components/molecules/` or `src/components/organisms/`.

**Example — ApartmentDetail:**

```
screens/guest/ApartmentDetail/
├── ApartmentDetail.tsx                  ← layout only (~80 lines)
├── useApartmentDetailController.ts      ← all logic
└── components/
    ├── PhotoCarousel.tsx                ← receives urls[]
    ├── InfoCard.tsx                     ← receives apartment + availability
    ├── AvailableDates.tsx               ← receives availability[]
    ├── BookingSection.tsx               ← calls useApartmentDetailController internally
    ├── AboutSection.tsx                 ← receives description string
    └── ApartmentDetailSkeleton.tsx      ← no props, pure skeleton UI
```

### Key Business Rules (from backend)

- **Discount**: 10% off if reservation is 7+ nights (`totalPrice = nights × pricePerNight × 0.9`)
- **Cancellation**: cannot cancel less than 24h before check-in; only from PENDING or APPROVED status
- **Reservation flow**: PENDING → APPROVED / DECLINED → PAID / CANCELLED
- **Payment**: only APPROVED reservations can be paid; reservation moves to PAID after payment
- **Commission**: 10% fixed; `landlordPayout = amount - commission`
- **Apartment availability**: landlord must add availability windows; renter can only book within them
- **Photos**: max 10 photos per apartment (uploaded to Cloudinary)
- **Public endpoints**: `GET /api/apartments`, `GET /api/apartments/{id}`, all `/api/auth/**`
- **Stats**: `GET /api/users/me/stats` returns different fields for RENTER vs LANDLORD; ADMIN uses `GET /api/admin/stats`
- **Role restriction**: only RENTER and LANDLORD roles at registration (not ADMIN)

### UI Library

Use Material UI (MUI) as the primary component library. Prefer MUI components over writing custom ones for standard UI elements (buttons, inputs, tables, modals, cards, etc.). Use MUI's sx prop or styled() for custom styling. Do not use plain CSS files or CSS modules unless absolutely necessary.

### State Management

- **React Query** (TanStack) for server state / data fetching
- **React Hook Form** for form state

### Components

- Named React components must use **function declarations** (not arrow functions), except in stories and tests
- Follow atomic design: atoms → molecules → organisms → templates

### Formatting

- Prettier: single quotes, trailing commas
- 2-space indentation (editorconfig)

### Build Verification

Before considering any task complete, run `npm run build` from the `frontend/` directory to catch TypeScript and compilation errors. Review the output and fix all errors before moving on.
