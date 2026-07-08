# 3DEES Consulting Works — Public Website

Public-facing marketing and recruitment site for **3DEES Consulting Works** (RC: 9160527), a Nigerian workforce-solutions and recruitment firm based in Abuja. The site lets visitors browse job vacancies, apply to them with a multi-step form and document uploads, read about the company, and send business inquiries.

It is a React 19 + Vite single-page app. It has **no admin/login UI of its own anymore** — an earlier admin & superadmin portal (dashboards, job management, application review, audit trail, user management) was built directly into this app and then deliberately removed (see [History](#history) below) once the plan shifted to a separate admin frontend talking to its own backend. The data layer (`PortalContext` + service modules) still contains the admin operations, wired to a REST API, in case that portal is reintroduced here — but no route currently renders them.

---

## Table of contents

1. [Tech stack](#tech-stack)
2. [Project structure](#project-structure)
3. [Every file, explained](#every-file-explained)
4. [Data flow & state management](#data-flow--state-management)
5. [Routing](#routing)
6. [Styling & design tokens](#styling--design-tokens)
7. [Environment variables](#environment-variables)
8. [Running the project](#running-the-project)
9. [Backend contract (API expected)](#backend-contract-api-expected)
10. [Deployment](#deployment)
11. [History](#history)
12. [Known gaps / things to know](#known-gaps--things-to-know)

---

## Tech stack

| Concern | Package | Notes |
|---|---|---|
| UI framework | `react` / `react-dom` 19 | Function components + hooks only |
| Build tool | `vite` 8 | Dev server, HMR, production bundling |
| Routing | `react-router-dom` 7 | `BrowserRouter`, nested layout routes |
| HTTP client | `axios` | Single configured instance with interceptors |
| Animation | `motion` (Framer Motion's successor package) | Page transitions, drawer/menu animation, counters, toasts |
| Icons | `lucide-react`, `react-icons` | Line icons; `react-icons` used only for brand social icons (LinkedIn/X/Facebook) |
| Linting | `eslint` 10 + `eslint-plugin-react-hooks` + `eslint-plugin-react-refresh` | `npm run lint` |
| Fonts | Google Fonts `Inter` (loaded via `@import` in `index.css`) | |
| Hosting | Vercel | `vercel.json` rewrites all paths to `index.html` for client-side routing |

No CSS framework — every page/component has a hand-written companion `.css` file (plain CSS, custom properties, no preprocessor).

---

## Project structure

```
3DEES_Website/
├── index.html                    # Vite entry HTML — mounts #root, loads src/main.jsx
├── vite.config.js                # Vite config: React plugin + /api dev proxy → localhost:3000
├── vercel.json                   # SPA rewrite rule so deep links resolve to index.html on Vercel
├── package.json / package-lock.json
├── eslint.config.js              # Flat ESLint config
├── .env                          # Local env values (gitignored) — VITE_API_BASE_URL, VITE_EGI_PORTAL_ENDPOINT
├── .gitignore
├── public/
│   ├── 3dees_Logo.png             # Brand logo used in Navbar/Footer
│   └── favicon.png                # Browser tab icon
└── src/
    ├── main.jsx                   # React root bootstrap
    ├── App.jsx                    # Route table + public layout shell
    ├── App.css                    # Layout-level styles (public-base-layout/main)
    ├── index.css                  # Global reset, CSS custom properties (brand colors/fonts), body defaults
    ├── context/
    │   └── PortalContext.jsx      # App-wide state: auth, jobs, applications, admins, audit logs, toasts
    ├── hooks/
    │   ├── useAuth.js              # Thin selector hook over PortalContext (auth slice)
    │   ├── useJobs.js              # Thin selector hook over PortalContext (jobs slice)
    │   ├── useApplications.js      # Thin selector hook over PortalContext (applications/audit slice)
    │   └── useToast.js             # Thin selector hook over PortalContext (toast slice)
    ├── services/                   # axios-based API clients, one per resource
    │   ├── api.js                   # Shared axios instance: base URL, auth header injection, silent token refresh
    │   ├── authService.js           # login (OTP step 1) / verifyOtp (step 2) / refresh / logout
    │   ├── jobsService.js           # Public + admin job CRUD, snake_case→camelCase normalization
    │   ├── applicationsService.js   # Public multipart submit, admin list/review/bulk/export
    │   ├── contactService.js        # Public contact form submit
    │   ├── usersService.js          # Superadmin-only admin-user management
    │   └── auditLogsService.js      # Audit log list + CSV export
    ├── components/                  # Reusable UI shared across pages
    │   ├── Navbar.jsx                # Top nav bar + mobile drawer + exports LogoSVG
    │   ├── Footer.jsx                # Site footer: about, quick links, services, contact, socials
    │   ├── Toast.jsx                 # ToastContainer + individual animated toast notifications
    │   └── styles/
    │       ├── Navbar.css
    │       ├── Footer.css
    │       └── Toast.css
    └── pages/                        # One component per route
        ├── Home.jsx                  # Landing page: hero, stats, featured jobs, process steps
        ├── Jobs.jsx                   # Job listing with search/filter/pagination
        ├── JobDetail.jsx               # Single job's full detail + requirements checklist
        ├── Apply.jsx                   # 4-step application wizard with file uploads
        ├── About.jsx                   # Company profile, mission, services, team, governance
        ├── Contact.jsx                  # Contact form + office info
        └── styles/
            ├── Home.css
            ├── Jobs.css
            ├── JobDetail.css
            ├── Apply.css
            ├── About.css
            └── Contact.css
```

---

## Every file, explained

### Entry & shell

**`src/main.jsx`**
Standard Vite/React bootstrap. Wraps `<App />` in `<StrictMode>` and mounts it to `#root` from `index.html`.

**`src/App.jsx`**
Defines the entire route table using `react-router-dom`. Wraps everything in `<PortalProvider>` (global state) and `<BrowserRouter>`. Renders `<ToastContainer />` once, globally, so any page can fire a toast. `PublicBaseLayout` is the shared shell (`Navbar` + `<Outlet />` + `Footer`) applied to every public route. All six public pages (`/`, `/jobs`, `/jobs/:id`, `/apply/:id`, `/about`, `/contact`) sit under that layout. Any unmatched path (`*`) redirects to `/`.

**`src/App.css`**
Styles for the `public-base-layout`/`public-base-main` wrapper elements created in `App.jsx` (min-height flex column so the footer sticks to the bottom, etc.).

**`src/index.css`**
Global stylesheet loaded once. Imports the Inter font from Google Fonts, defines the site's CSS custom properties (`--color-brand-primary: #FF6600` orange, `--color-brand-dark`, `--color-brand-light`, `--color-brand-text`, `--shadow-subtle`), a `box-sizing: border-box` reset, smooth scrolling, and default `body` background/font.

**`index.html`**
The single HTML page Vite serves. Just a `#root` div and a module script pointing at `main.jsx`. Title is still the Vite template default `"3dees-original"` (not yet rebranded).

### State layer

**`src/context/PortalContext.jsx`**
The single source of truth for the whole app — a `useReducer`-based context provider. Holds: `currentUser`, `token`, `pendingAuthToken` (mid-OTP-flow), `jobs`, `isLoadingJobs`, `applications`, `admins`, `auditLogs`, `toasts`.

On mount it:
- Deletes legacy `localStorage` keys from a prior all-client-side prototype (`3dees_users`, `3dees_jobs`, `3dees_applications`, `3dees_audit_log`, `3dees_token`).
- Rehydrates auth from `3dees_current_user` / `3dees_access_token` in `localStorage` if present, so a refresh doesn't log the user out.
- Fetches public jobs via `jobsService.getJobs()` and populates `jobs`; shows an error toast if that fails; always flips `isLoadingJobs` to `false` in a `finally`.
- Subscribes to a custom `auth:session-expired` window event (dispatched by `services/api.js` when a token refresh fails) and clears auth state + shows a warning toast when it fires.

Exposes functions consumed through the `hooks/` selectors:
- **Auth**: `login(email, password)` (step 1 → OTP triggered, returns `{pendingToken, destination}`), `verifyOtp(pendingToken, otpCode)` (step 2 → sets real tokens, persists them to `localStorage`, toasts a welcome message, and eagerly calls `loadAdminData()`), `logout()` (best-effort server-side revoke, always clears local tokens).
- **Admin data loader**: `loadAdminData()` — parallel-fetches applications, admins, and audit logs after login; failure here is treated as non-fatal (dashboard would just show empty states).
- **Jobs (admin)**: `postJob`, `editJob`, `removeJob` — call `jobsService`, dispatch reducer updates, and toast the result.
- **Applications**: `applyToJob({jobId, personalInfo, educationInfo, documents})` — the public application submission. Splits `fullName` into first/last name, builds a `FormData` multipart payload mapping the wizard's field names to the API's expected shape, appends any attached `File` objects, and returns the server-issued `referenceId`. `reviewApplication` and `bulkReviewApplications` are admin actions that update status and refresh audit logs; approving an application also fires a toast implying an "EGI Portal sync" is queued (see `VITE_EGI_PORTAL_ENDPOINT`).
- **Admin users**: `registerAdmin`, `toggleAdminSuspension`, `resetAdminPass`, `removeAdmin` — superadmin user-management operations, all currently unreachable from the UI since the admin routes were removed.

**`src/hooks/useAuth.js` / `useJobs.js` / `useApplications.js` / `useToast.js`**
Each is a tiny wrapper: `useContext(PortalContext)`, throws if used outside `<PortalProvider>`, and returns a narrowed-down slice of the context (only the fields/functions relevant to that concern). This keeps page components from importing the raw context and picking fields ad hoc.

### Services (API layer)

**`src/services/api.js`**
The shared axios instance every service imports. Base URL is `(VITE_API_BASE_URL || '') + '/api'`. A request interceptor attaches `Authorization: Bearer <token>` from `localStorage` on every call. A response interceptor:
- On a `401` with `error: 'TokenExpired'` (and not already retried), it silently calls `/auth/refresh` with the stored refresh token, stores the new access/refresh tokens, retries the original request, and — if multiple requests fail at once — queues them behind a single in-flight refresh via a subscriber list (`isRefreshing` / `refreshSubscribers`) so the app doesn't fire N parallel refresh calls.
- If the refresh itself fails, it clears all three `localStorage` auth keys and dispatches the `auth:session-expired` `CustomEvent` that `PortalContext` listens for.
- Every other error is normalized to `{ message, code, status }` so callers don't need to know axios's error shape.

**`src/services/authService.js`**
Thin wrappers around `/auth/login`, `/auth/verify-otp`, `/auth/refresh`, `/auth/logout`. Login is intentionally two-step (password → OTP email → OTP code) rather than a single call.

**`src/services/jobsService.js`**
`normalizeJob` converts the API's snake_case job object (`client_org`, `salary_range`, `closing_date`, `posted_by`, `application_requirements`, `created_at`, `is_expired`, …) into the camelCase shape the rest of the app uses. Exposes public reads (`getJobs`, `getJob` — no auth) and admin CRUD (`adminGetJobs`, `adminGetJob`, `adminCreateJob`, `adminUpdateJob`, `adminDeleteJob` — Bearer token required).

**`src/services/applicationsService.js`**
`normalizeApplication` does the same snake_case→camelCase mapping for applications (`job_id`, `reference_id`, `personal_info`, `education_info`, `status_history`, `egi_sync_status`, `submitted_at`, …). `submitApplication(formData)` is the only public endpoint (multipart POST to `/applications`); everything else (`getApplications`, `exportApplications` as CSV blob, `getApplication`, `updateStatus`, `bulkUpdateStatus`) is admin-only, hitting `/admin/applications/*`.

**`src/services/contactService.js`**
One function, `submit({fullName, email, phone, orgName, subject, message})`, posting to `/contact`. `phone`/`orgName` are optional and stripped to `undefined` if blank rather than sent as empty strings.

**`src/services/usersService.js`**
Superadmin-only admin-account management: `getUsers`, `createUser`, `toggleStatus` (Active ⇄ Suspended), `resetPassword` (also revokes that user's refresh tokens server-side), `deleteUser`. Normalizes `created_at`/`last_login` to camelCase.

**`src/services/auditLogsService.js`**
`getLogs` (list, with optional `search`/`status`/`officer` filters) and `exportLogs` (CSV blob) against `/admin/audit-logs*`. Normalizes each log entry (`application_id`, `applicant_name`, `job_title`, `prev_status`, `new_status`, `changed_by`, `timestamp`).

### Components

**`src/components/Navbar.jsx`**
Exports both `Navbar` (the nav bar itself) and `LogoSVG` (an `<img>`-wrapping component reused by `Footer.jsx`). Tracks scroll position to toggle a `navbar--scrolled` class, highlights the active link based on `useLocation()`, and renders a `motion`-animated mobile drawer (hamburger ⇄ X icon, slide-down link list with staggered entrance) for small screens. Nav items: Home, Jobs, About Us, Contact.

**`src/components/Footer.jsx`**
Four-column footer: brand blurb + social links (LinkedIn/X/Facebook — currently placeholder `https://linkedin.com` etc. URLs, not real handles), quick links, a static "Operations Spectrum" services list, and headquarters contact details (address, two phone numbers, email). Bottom bar shows the copyright year (computed live) and two badges (RC number, "Registered Corporate Workforce Solutions Provider") that are hidden below 1024px per a recent mobile-layout commit.

**`src/components/Toast.jsx`**
`ToastContainer` reads `toasts` from `useToast()` and renders a `ToastItem` per entry inside an `AnimatePresence`. Each toast auto-dismisses after 4 seconds via `setTimeout`, has a type-specific icon/border color (`success`/`error`/`info`, defaulting to `info`), a manual close button, and an animated progress bar that shrinks over the 4-second window.

### Pages

**`src/pages/Home.jsx`**
The landing page. Sections, top to bottom: animated hero (headline, description, CTAs to `/jobs` and `/about`, a stats card showing "5,000+ Roles Managed" / "16+ Years Active"); an intro/mission blurb with four `StatCounter` components that animate-count up to their target numbers on mount (Placements Administered, Partner Corporations, Years in Operations, Nigerian States Active); a "Featured Vacancies" grid pulling the first 3 `Active`-status jobs from `useJobs()` (with an empty-state message if none); and a static 6-step "Recruitment Process" pipeline (Register → Screen → Test → Interview → Verify → Offer).

**`src/pages/Jobs.jsx`**
The job board. Pulls `jobs`/`isLoadingJobs` from `useJobs()`. Client-side filtering only (no server-side query params sent) by: free-text search (matches title/clientOrg/description), category, location (matched against the first word of the job's location string, e.g. state name), and employment type — all derived as dropdown option sets from the currently-loaded active jobs via `useMemo`. Pagination is "load more" style: starts at 6 visible, +4 per click. Shows 3 skeleton cards while loading, and a dedicated empty state (with a "Clear Search & View All" reset) when filters match nothing.

**`src/pages/JobDetail.jsx`**
Single job view keyed by the `:id` route param, looked up client-side from the already-loaded `jobs` array (no separate detail fetch). Renders a loading skeleton while jobs are loading, a "Vacancy Not Found" state if the ID doesn't match, and otherwise: header card (category, title, org, location/type/deadline), overview, responsibilities and requirements (each split from a newline-delimited string field), a static benefits blurb, and a sidebar with a "Recruitment Dossier" summary (salary, openings, closing date, a hardcoded "3DEES Garki II" vetting agent) plus a dynamically-built checklist of required documents derived from the job's `applicationRequirements` object (CV, cover letter, academic cert, NYSC cert, passport photo, national ID, DOB, state of origin, LGA).

**`src/pages/Apply.jsx`**
The application wizard, also keyed by `:id`. Four steps with a `motion`-animated slide transition between them (direction-aware — forward slides one way, back slides the other): **1. Bio-Data** (name, email, phone, gender, residential address always; DOB/state-of-origin/LGA conditionally required per `job.applicationRequirements`), **2. Education** (qualification, institution, graduation year, work summary always; years of experience/current employer conditionally required), **3. Documents** (per-requirement file upload blocks with client-side type/size validation — 5MB cap, extension or MIME allowlist per field — that store the file as `{name, size, type, url: objectURL, fileRef: File}`), **4. Review** (read-only recap of everything entered + attached files, plus a mandatory legal declaration checkbox). `validateStep()` re-validates the current step's fields before allowing `handleNext()` to advance. On final submit, calls `applyToJob()` from `useApplications()`; on success shows a confirmation screen with the server-issued reference code and a "Back to Open Positions" button; on failure toasts the error message and lets the user retry.

**`src/pages/About.jsx`**
Static company-profile page: hero banner; a two-column "Corporate Identity" section (mission/core-value cards + a "Vetting Code" widget listing the 3-step verification process — NIN check, academic verification, NYSC records validation); a 4-card services grid (Recruitment & Staffing, Workforce Planning, HR Consulting, Mass Recruitment); a governance/charter section with a compliance checklist and a "Charter Vetted" badge; a 4-person leadership team grid (currently photo **placeholders** — camera icon + initials overlay, with an inline comment showing how to swap in a real `<img>` per person); and a closing CTA strip linking to `/contact`.

**`src/pages/Contact.jsx`**
Two-column contact page: left is a validated lead-intake form (name, email, phone, optional org name, inquiry category dropdown, message) that posts via `contactService.submit()` and resets on success; right is a static "Direct Coordinates" card (address, phones, email, business hours). A simulated Google-Maps placeholder block (SVG grid + animated pin) that used to sit below the coordinates card is now **entirely commented out** rather than deleted — a real map integration was decided against for now but the markup was kept for reference.

### Styles (`*/styles/*.css`)

Each page/component has a dedicated CSS file scoped by class-name prefix (e.g. everything on the Jobs page is prefixed `jobs-*`, JobDetail is `jd-*`, Apply is `apply-*`) rather than CSS Modules or a CSS-in-JS library — plain global CSS files, manually namespaced to avoid collisions. All of them consume the CSS custom properties defined once in `src/index.css` (brand orange `#FF6600`, dark `#0A0A0A`, light `#F5F5F5`, text gray `#666666`, `Inter` font, a shared subtle box-shadow) so the palette stays consistent without a design-token build step.

### Config files

**`vite.config.js`** — registers `@vitejs/plugin-react`; configures a dev-only proxy so any request to `/api/*` from the Vite dev server (`localhost:5173`) is forwarded to `http://localhost:3000/api/*`, avoiding CORS during local development.

**`vercel.json`** — one rewrite rule (`"/(.*)" → "/index.html"`) so that deep-linking to e.g. `/jobs/42` on Vercel doesn't 404 — the SPA's router handles the path client-side after `index.html` loads.

**`eslint.config.js`** — flat-config ESLint setup with the React Hooks and React Refresh plugins; run via `npm run lint`.

**`.env`** (gitignored) — see [Environment variables](#environment-variables).

---

## Data flow & state management

```
PortalProvider (context/PortalContext.jsx)
   │
   ├─ useReducer(portalReducer, initialState)  ← single state tree
   │
   ├─ services/*.js  ← axios calls, each normalizing snake_case → camelCase
   │
   └─ exposes: state + action functions via Context

hooks/useAuth.js, useJobs.js, useApplications.js, useToast.js
   │  (each just useContext + pick relevant fields)
   ▼
pages/*.jsx  ← call hook functions, render state, no direct axios/localStorage access
```

Pages never import `services/` directly (except `Contact.jsx`, which calls `contactService.submit()` inline since contact form submission has no shared state to manage) or touch `localStorage` — everything flows through the context/hooks layer. This keeps the "where does auth state live / how do I refetch jobs" question answerable from one file.

---

## Routing

All routes are declared in `src/App.jsx`:

| Path | Component | Notes |
|---|---|---|
| `/` | `Home` | |
| `/jobs` | `Jobs` | |
| `/jobs/:id` | `JobDetail` | |
| `/apply/:id` | `Apply` | |
| `/about` | `About` | |
| `/contact` | `Contact` | |
| `*` | — | Redirects to `/` |

There is currently **no admin route** (`/admin/*`, `/superadmin/*`) — see [History](#history).

---

## Styling & design tokens

Defined once in `src/index.css`:

```css
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
--color-brand-light: #F5F5F5;
--color-brand-primary: #FF6600;   /* 3DEES orange */
--color-brand-secondary: #F25C00;
--color-brand-text: #666666;
--color-brand-dark: #0A0A0A;
--shadow-subtle: 0 2px 16px rgba(0, 0, 0, 0.07);
```

No Tailwind, no CSS Modules, no styled-components — plain CSS files, one per page/component, imported directly into the corresponding `.jsx` file.

---

## Environment variables

Set in `.env` (gitignored — copy from an `.env.example` if one exists, or create fresh):

```bash
# API base URL.
# Development: leave empty — Vite proxy forwards /api → http://localhost:3000
# Production:  set to your domain, e.g. https://api.3dees.com
VITE_API_BASE_URL=

# EGI Portal integration endpoint (referenced conceptually by the "approved →
# synced to EGI Portal" toast in PortalContext; not currently called directly
# from the frontend — the actual sync happens server-side).
VITE_EGI_PORTAL_ENDPOINT=https://egi-portal.3dees.net/api/candidates
```

---

## Running the project

```bash
npm install
npm run dev       # Vite dev server at localhost:5173, proxies /api → localhost:3000
npm run build      # production build to dist/
npm run preview    # serve the production build locally
npm run lint        # ESLint
```

The app expects a backend running at `localhost:3000` (or whatever `VITE_API_BASE_URL` points to) implementing the routes below — without it, jobs won't load (an error toast fires) and every form submission will fail.

---

## Backend contract (API expected)

Inferred from the service layer — this is what a compatible backend must expose. All responses are expected in the shape `{ data: ... }` (services read `response.data.data`).

**Public**
- `GET /api/jobs` — list active jobs (`?search&category&location&type`)
- `GET /api/jobs/:id`
- `POST /api/applications` — multipart form: `jobId`, `personalInfo` (JSON string), `educationInfo` (JSON string), plus file fields `cv`, `coverLetter`, `academicCert`, `nyscCert`, `passportPhoto`, `nationalId` as attached
- `POST /api/contact` — `{ fullName, email, phone?, orgName?, subject, message }`

**Auth**
- `POST /api/auth/login` — `{ email, password }` → `{ pendingToken, destination }`
- `POST /api/auth/verify-otp` — `{ pendingToken, otpCode }` → `{ accessToken, refreshToken, user }`
- `POST /api/auth/refresh` — `{ refreshToken }` → `{ accessToken, refreshToken }`
- `POST /api/auth/logout` — `{ refreshToken }`

**Admin (Bearer token)**
- `GET/POST/PUT/DELETE /api/admin/jobs[/:id]`
- `GET /api/admin/applications`, `GET /api/admin/applications/export` (CSV), `GET /api/admin/applications/:id`, `PATCH /api/admin/applications/:id/status`, `PATCH /api/admin/applications/bulk-status`
- `GET /api/admin/users`, `POST /api/admin/users`, `PATCH /api/admin/users/:id/status`, `PATCH /api/admin/users/:id/password`, `DELETE /api/admin/users/:id` (superadmin)
- `GET /api/admin/audit-logs`, `GET /api/admin/audit-logs/export` (CSV)

A 401 response with `{ error: 'TokenExpired' }` triggers the frontend's silent-refresh flow automatically.

---

## Deployment

Hosted on **Vercel**. `vercel.json` rewrites every path to `/index.html` so client-side routes resolve correctly on a hard refresh/direct link. In production, `VITE_API_BASE_URL` must be set to the real API domain (e.g. `https://api.3dees.com`) since there is no dev proxy in production.

---

## History

Chronological summary of what's been built, from `git log`:

1. **Bootstrap** — Vite + React + ESLint scaffold (`2748071`).
2. **All-client-side prototype** — an initial version stored users/jobs/applications/audit-log entirely in `localStorage` (`localStorageDb.js`, now deleted), including a full admin/superadmin suite built directly into this app:
   - `AdminLogin`, `AdminLayout` (sidebar shell), `AdminDashboard` (job stats + recent applications), `AdminJobs` (dynamic requirements builder), `AdminApplications` (filtering, bulk actions, CSV export)
   - `SuperadminDashboard`, `SuperadminManageAdmins`, `SuperadminViewAllApplications`, `SuperadminAuditTrail`
   - `ProtectedRoute` (role-based route gating) and `PortalContext`/hooks to back it all
   - Alongside the public pages: `Home`, `Jobs`, `JobDetail`, `Apply`, `About`, `Contact`, plus `Navbar`, `Footer`, `Toast`
3. **Polish pass** — `motion`-based animations (Navbar scroll/drawer, About page transitions, Toast progress bars), `lucide-react`/`react-icons` icon adoption, responsive-layout fixes, About page team section rewritten with photo placeholders, Contact page's map block commented out.
4. **Admin portal removed from this repo** (commit `46735e0`) — all Admin*/Superadmin* pages, `AdminLayout`, `ProtectedRoute`, and their CSS were deleted (~6,500 lines), along with the corresponding routes in `App.jsx` and the admin-specific Navbar logic. This site became public-only.
5. **Real backend integration** (commit `6dca174`, current `HEAD`) — `localStorageDb.js` deleted; `services/` added (`api.js`, `authService.js`, `jobsService.js`, `applicationsService.js`, `contactService.js`, `usersService.js`, `auditLogsService.js`); `PortalContext` rewritten to call the API instead of reading/writing `localStorage` directly, with two-step OTP login and silent token refresh. See `.claude memory` note `project_api_integration.md` for the session this happened in.
6. Small fixes since: Vercel SPA rewrite config, mobile footer-badge visibility.

**Why the admin portal was removed rather than kept:** the codebase and commit history don't state a reason explicitly, but the context strongly suggests the plan moved to a *separate* admin frontend backed by its own dedicated auth service — a sibling project, `egi-admin-portal` (see the `EGI Hub Backend` directory), describes itself as "a standalone authentication backend... so that a separate admin frontend can register a superadmin, log in, and maintain a session, independent of any other EGI backend service." That backend currently only handles auth (register/login/logout/me) and doesn't yet expose jobs/applications/users/audit-log endpoints, so it is **not** a drop-in replacement for the API this site's `services/` layer already expects — it appears to be an earlier or parallel piece of a still-being-built separate admin system, not the backend this site is currently pointed at.

---

## Known gaps / things to know

- **Admin UI is gone but admin logic isn't.** `PortalContext` still exposes `postJob`, `editJob`, `removeJob`, `reviewApplication`, `bulkReviewApplications`, `registerAdmin`, `toggleAdminSuspension`, `resetAdminPass`, `removeAdmin`, and `useAuth()` still returns `admins`/admin functions — none of it is reachable from any route today. If an admin portal is reintroduced here, this is where it would plug back in.
- **Page `<title>`** in `index.html` is still the Vite template default (`"3dees-original"`), not the site's actual name — not yet rebranded.
- **Social links** in the footer (LinkedIn/X/Facebook) point at the bare platform homepages, not 3DEES's real profiles — placeholders.
- **Contact page map** is fully built (SVG grid, animated pin, GPS badge) but commented out, not deleted — a real map was decided against for now.
- **`VITE_EGI_PORTAL_ENDPOINT`** is declared in `.env` and referenced conceptually (the "Client Sync Queued" toast on application approval) but never actually fetched from the frontend — that sync is assumed to happen server-side.
- **Jobs/Apply pages filter and validate entirely client-side** against the already-fetched job list; there's no server-side search/pagination even though `jobsService.getJobs()` accepts `search`/`category`/`location`/`type` params (they're just never passed from the UI).
- No test suite exists (no `*.test.js`/`*.spec.js` files, no test runner in `package.json`).
