# 3DEES Consulting Works — Public Website

Public-facing marketing and recruitment site for **3DEES Consulting Works** (RC: 9160527), a Nigerian workforce-solutions and recruitment firm based in Abuja. The site lets visitors browse job vacancies, apply to them with a multi-step form and document uploads, read about the company, and send business inquiries.

It is a React 19 + Vite single-page app. It has **no admin/login UI of its own anymore** — an earlier admin & superadmin portal (dashboards, job management, application review, audit trail, user management) was built directly into this app and then deliberately removed (see [History](#history) below) once the plan shifted to a separate admin frontend (the `3DEES_admin` repo). The leftover admin data layer (auth, admin services, admin context actions) has since been removed too, so this site only talks to public endpoints and never reads or writes auth storage.

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
| HTTP client | `axios` | Single configured instance with an error-normalizing interceptor |
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
├── docs/
│   └── field-catalog-draft.md      # Draft canonical field catalog for the dynamic application form (pending review)
├── public/
│   ├── 3dees_Logo.png             # Brand logo used in Navbar/Footer
│   ├── favicon.png                # Browser tab icon
│   ├── favicon.ico                # Legacy favicon format (fallback)
│   └── _redirects                 # Netlify-style SPA rewrite ("/* /index.html 200"), redundant with vercel.json's rewrite on Vercel
└── src/
    ├── main.jsx                   # React root bootstrap
    ├── App.jsx                    # Route table + public layout shell
    ├── App.css                    # Layout-level styles (public-base-layout/main)
    ├── index.css                  # Global reset, CSS custom properties (brand colors/fonts), body defaults
    ├── context/
    │   └── PortalContext.jsx      # App-wide state: jobs, field catalog, toasts + the applyToJob action
    ├── hooks/
    │   ├── useJobs.js              # Thin selector hook over PortalContext (jobs slice)
    │   ├── useFieldCatalog.js       # Thin selector hook over PortalContext (field catalog slice)
    │   ├── useApplications.js      # Thin selector hook over PortalContext (applyToJob)
    │   └── useToast.js             # Thin selector hook over PortalContext (toast slice)
    ├── services/                   # axios-based API clients, one per resource
    │   ├── api.js                   # Shared axios instance: base URL + error normalization (no auth)
    │   ├── jobsService.js           # Public job reads, snake_case→camelCase normalization
    │   ├── applicationsService.js   # Public multipart application submit
    │   ├── contactService.js        # Public contact form submit
    │   └── fieldCatalogService.js   # Fetches + in-memory-caches the dynamic field catalog
    ├── utils/
    │   └── fieldCatalogHelpers.js   # Catalog-driven section/field visibility, validation, and derived-value helpers
    ├── components/                  # Reusable UI shared across pages
    │   ├── Navbar.jsx                # Top nav bar + mobile drawer + exports LogoSVG
    │   ├── Footer.jsx                # Site footer: about, quick links, services, contact, socials
    │   ├── Toast.jsx                 # ToastContainer + individual animated toast notifications
    │   ├── FieldRenderer.jsx          # Renders one catalog field's input, by type, recursively for experience sub-fields
    │   └── styles/
    │       ├── Navbar.css
    │       ├── Footer.css
    │       └── Toast.css
    └── pages/                        # One component per route
        ├── Home.jsx                  # Landing page: hero, stats, featured jobs, process steps
        ├── Jobs.jsx                   # Job listing with search/filter/pagination
        ├── JobDetail.jsx               # Single job's full detail + catalog-driven requirements checklist
        ├── Apply.jsx                   # Catalog-driven, per-job-section application wizard with file uploads
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
The single source of truth for the whole app — a `useReducer`-based context provider. Holds: `jobs`, `isLoadingJobs`, `fieldCatalog`, `isLoadingCatalog`, `toasts`. It has no auth state and never touches `localStorage` — sessions belong to the separate admin dashboard, which in development shares this origin's storage (both apps default to `localhost:5173`), so this site must not read, rewrite or clear those keys.

On mount it:
- Fetches public jobs via `jobsService.getJobs()` and populates `jobs`; shows an error toast if that fails; always flips `isLoadingJobs` to `false` in a `finally`.
- Fetches the dynamic field catalog via `fieldCatalogService.getCatalog()` (no auth required, response cached by the service) and populates `fieldCatalog`; shows an error toast if that fails; always flips `isLoadingCatalog` to `false` in a `finally`.

Exposes functions consumed through the `hooks/` selectors:
- **Toasts**: `addToast(type, title, message)`, `removeToast(id)`.
- **Applications**: `applyToJob({jobId, answers, files})` — the public application submission. `answers` is a flat `{ [fieldKey]: string|boolean }` map covering every non-file catalog field the applicant answered (across whichever sections the job's `applicationRequirements` enabled) and `files` is `{ [fieldKey]: File | File[] }`. Builds one `FormData` multipart field per answer/file key — no JSON-blob wrapping — and returns the server-issued `referenceId`.

**`src/hooks/useJobs.js` / `useFieldCatalog.js` / `useApplications.js` / `useToast.js`**
Each is a tiny wrapper: `useContext(PortalContext)`, throws if used outside `<PortalProvider>`, and returns a narrowed-down slice of the context (only the fields/functions relevant to that concern). `useJobs()` returns `{ jobs, isLoadingJobs }`, `useFieldCatalog()` returns `{ catalog, isLoadingCatalog }`, `useApplications()` returns `{ applyToJob }`. This keeps page components from importing the raw context and picking fields ad hoc.

### Services (API layer)

**`src/services/api.js`**
The shared axios instance every service imports. Base URL is `(VITE_API_BASE_URL || '') + '/api'`, default `Content-Type: application/json` (the application submit overrides it to multipart per call). No `Authorization` header is ever sent — every endpoint this site calls is public. A response interceptor normalizes every error to `{ message, code, status }` so callers don't need to know axios's error shape (`Apply` and `Contact` show `err.message` in their failure toasts).

**`src/services/jobsService.js`**
`normalizeJob` converts the API's snake_case job object (`client_org`, `salary_range`, `closing_date`, `posted_by`, `application_requirements`, `created_at`, `is_expired`, …) into the camelCase shape the rest of the app uses. Exposes public reads only: `getJobs`, `getJob`.

**`src/services/applicationsService.js`**
One function, `submitApplication(formData)` — multipart POST to `/applications`.

**`src/services/fieldCatalogService.js`**
`getCatalog()` — `GET /field-catalog` (no auth). Memoizes the response in a module-level variable after the first successful call, and de-dupes concurrent calls behind a single in-flight promise, so the catalog is fetched once per page load no matter how many components ask for it (`PortalContext` on mount, plus any `Apply`/`JobDetail` instance via `useFieldCatalog()`).

**`src/services/contactService.js`**
One function, `submit({fullName, email, phone, orgName, subject, message})`, posting to `/contact`. `phone`/`orgName` are optional and stripped to `undefined` if blank rather than sent as empty strings.

### Utils

**`src/utils/fieldCatalogHelpers.js`**
Client-side helpers meant to mirror a `src/config/fieldCatalog.js` + submission validator on the backend (the backend stays authoritative; this only drives wizard UX and gives friendly per-field errors before a round trip). Exposes:
- `deriveFullName` / `deriveAge` — computed from `firstName`/`middleName`/`lastName` and `dateOfBirth` rather than asked as their own inputs (a typed age could contradict the DOB; a computed one can't).
- `getEnabledSections(catalog, applicationRequirements)` — which catalog sections a given job's config turns on, in catalog order; drives the Apply wizard's step list.
- `getVisibleSectionFields` / `getSubfieldsOf` — which fields render for one step, including an experience-trio's Years/Detail/Proof sub-fields, which only appear once their `yesno` parent is enabled for the job *and* answered "Yes" (they're never independently listed in a job's requirements).
- `validateFieldValue` / `validateFile` / `validateSectionFields` — per-type format validation (email/tel/date/number/year/select/yesno) plus required/file/declaration checks for a whole step.
- `formatAnswerForReview` — human-readable value for the Review step.

### Components

**`src/components/Navbar.jsx`**
Exports both `Navbar` (the nav bar itself) and `LogoSVG` (an `<img>`-wrapping component reused by `Footer.jsx`). Tracks scroll position to toggle a `navbar--scrolled` class, highlights the active link based on `useLocation()`, and renders a `motion`-animated mobile drawer (hamburger ⇄ X icon, slide-down link list with staggered entrance) for small screens. Nav items: Home, Jobs, About Us, Contact.

**`src/components/Footer.jsx`**
Four-column footer: brand blurb + social links (LinkedIn/X/Facebook — currently placeholder `https://linkedin.com` etc. URLs, not real handles), quick links, a static "Operations Spectrum" services list, and headquarters contact details (address, two phone numbers, email). Bottom bar shows the copyright year (computed live) and two badges (RC number, "Registered Corporate Workforce Solutions Provider") that are hidden below 1024px per a recent mobile-layout commit.

**`src/components/Toast.jsx`**
`ToastContainer` reads `toasts` from `useToast()` and renders a `ToastItem` per entry inside an `AnimatePresence`. Each toast auto-dismisses after 4 seconds via `setTimeout`, has a type-specific icon/border color (`success`/`error`/`info`, defaulting to `info`), a manual close button, and an animated progress bar that shrinks over the 4-second window.

**`src/components/FieldRenderer.jsx`**
Renders a single catalog field's input control, driven entirely by `field.type` (`text`/`tel`/`email`, `textarea`, `number`/`year`, `date` — with a live computed-age preview beside `dateOfBirth` — `select` — with a dependent State-of-Origin→LGA dropdown that falls back to free text if the LGA list isn't known — `yesno`, `declaration`, `file`). Recurses to render an experience-trio's Years/Detail/Proof sub-fields, animated in/out via `AnimatePresence`, directly beneath a "Yes"-answered `yesno` field. `file` fields support single or (for `otherDocsUpload`) multiple attachments with a max-count cap, client-side MIME/size validation, and per-file removal.

### Pages

**`src/pages/Home.jsx`**
The landing page. Sections, top to bottom: animated hero (headline, description, CTAs to `/jobs` and `/about`, a stats card showing "5,000+ Roles Managed" / "16+ Years Active"); an intro/mission blurb with four `StatCounter` components that animate-count up to their target numbers on mount (Placements Administered, Partner Corporations, Years in Operations, Nigerian States Active); a "Featured Vacancies" grid pulling the first 3 `Active`-status jobs from `useJobs()` (with an empty-state message if none); and a static 6-step "Recruitment Process" pipeline (Register → Screen → Test → Interview → Verify → Offer).

**`src/pages/Jobs.jsx`**
The job board. Pulls `jobs`/`isLoadingJobs` from `useJobs()`. Client-side filtering only (no server-side query params sent) by: free-text search (matches title/clientOrg/description), category, location (matched against the first word of the job's location string, e.g. state name), and employment type — all derived as dropdown option sets from the currently-loaded active jobs via `useMemo`. Pagination is "load more" style: starts at 6 visible, +4 per click. Shows 3 skeleton cards while loading, and a dedicated empty state (with a "Clear Search & View All" reset) when filters match nothing.

**`src/pages/JobDetail.jsx`**
Single job view keyed by the `:id` route param, looked up client-side from the already-loaded `jobs` array (no separate detail fetch). Renders a loading skeleton while jobs are loading, a "Vacancy Not Found" state if the ID doesn't match, and otherwise: header card (category, title, org, location/type/deadline), overview, responsibilities and requirements (each split from a newline-delimited string field), a static benefits blurb, and a sidebar with a "Recruitment Dossier" summary (salary, openings, closing date, a hardcoded "3DEES Garki II" vetting agent) plus a "Candidate Requirements Checklist" built from `useFieldCatalog()` — every non-conditional catalog field enabled in the job's `applicationRequirements` is bucketed into required/optional documents and required/optional "other information", labelled straight from the catalog rather than a hardcoded list, so the checklist automatically covers whatever fields an admin turns on for that job.

**`src/pages/Apply.jsx`**
The application wizard, also keyed by `:id`, entirely driven by the field catalog rather than a fixed 4-step shape. `getEnabledSections(catalog, job.applicationRequirements)` decides which catalog sections (Personal, Job Info, Employment, Education, Documents, Professional, Referees, Declarations, Role-Specific — whichever ones the job's config turns on) become wizard steps, in catalog order, plus a trailing Review step. Each step renders its visible fields via `<FieldRenderer>`, with a `motion`-animated slide transition between steps (direction-aware — forward slides one way, back slides the other). `validateStep()` (from `fieldCatalogHelpers`) re-validates the current step's visible fields before `handleNext()` advances; `handleSubmit` also re-validates every step defensively in case the applicant backtracked. Building the submission payload re-walks every enabled section's visible fields so conditional experience sub-fields are only included if their `yesno` parent was answered "Yes". On success, calls `applyToJob({jobId, answers, files})` from `useApplications()` and shows a confirmation screen with the server-issued reference code; on failure toasts the error message and lets the user retry.

**`src/pages/About.jsx`**
Static company-profile page: hero banner; a two-column "Corporate Identity" section (mission/core-value cards + a "Vetting Code" widget listing the 3-step verification process — NIN check, academic verification, NYSC records validation); a 4-card services grid (Recruitment & Staffing, Workforce Planning, HR Consulting, Mass Recruitment); a governance/charter section with a compliance checklist and a "Charter Vetted" badge; a 4-person leadership team grid (currently photo **placeholders** — camera icon + initials overlay, with an inline comment showing how to swap in a real `<img>` per person); and a closing CTA strip linking to `/contact`.

**`src/pages/Contact.jsx`**
Two-column contact page: left is a validated lead-intake form (name, email, phone, optional org name, inquiry category dropdown, message) that posts via `contactService.submit()` and resets on success; right is a static "Direct Coordinates" card (address, phones, email, business hours). A simulated Google-Maps placeholder block (SVG grid + animated pin) that used to sit below the coordinates card is now **entirely commented out** rather than deleted — a real map integration was decided against for now but the markup was kept for reference.

### Styles (`*/styles/*.css`)

Each page/component has a dedicated CSS file scoped by class-name prefix (e.g. everything on the Jobs page is prefixed `jobs-*`, JobDetail is `jd-*`, Apply is `apply-*`) rather than CSS Modules or a CSS-in-JS library — plain global CSS files, manually namespaced to avoid collisions. All of them consume the CSS custom properties defined once in `src/index.css` (brand orange `#FF6600`, dark `#0A0A0A`, light `#F5F5F5`, text gray `#666666`, `Inter` font, a shared subtle box-shadow) so the palette stays consistent without a design-token build step.

### Config files

**`vite.config.js`** — registers `@vitejs/plugin-react`; configures a dev-only proxy so any request to `/api/*` from the Vite dev server (`localhost:5173`) is forwarded to `http://localhost:3000/api/*`, avoiding CORS during local development.

**`vercel.json`** — one rewrite rule (`"/(.*)" → "/index.html"`) so that deep-linking to e.g. `/jobs/42` on Vercel doesn't 404 — the SPA's router handles the path client-side after `index.html` loads.

**`public/_redirects`** — the Netlify-equivalent SPA rewrite (`/* /index.html 200`). Vite copies it into `dist/` unchanged since anything in `public/` is served as-is. Only takes effect on Netlify; harmless (and unread) on Vercel, which relies on `vercel.json` instead. Its presence suggests Netlify was being evaluated as an alternate/backup host alongside Vercel.

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

hooks/useJobs.js, useFieldCatalog.js, useApplications.js, useToast.js
   │  (each just useContext + pick relevant fields)
   ▼
pages/*.jsx  ← call hook functions, render state, no direct axios/localStorage access
```

Pages never import `services/` directly (except `Contact.jsx`, which calls `contactService.submit()` inline since contact form submission has no shared state to manage) or touch `localStorage` — everything flows through the context/hooks layer. This keeps the "where does this state live / how do I refetch jobs" question answerable from one file.

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

# EGI Portal integration endpoint. Not referenced by any code in this repo —
# the sync happens server-side, and the admin toast that alluded to it was
# removed with the dead admin layer. Safe to drop from .env.
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

The app expects a backend running at `localhost:3000` (or whatever `VITE_API_BASE_URL` points to) implementing the routes below — without it, jobs and the field catalog won't load (error toasts fire for each) and every form submission will fail.

---

## Backend contract (API expected)

Inferred from the service layer — this is what a compatible backend must expose. All responses are expected in the shape `{ data: ... }` (services read `response.data.data`).

**Public**
- `GET /api/jobs` — list active jobs (`?search&category&location&type`)
- `GET /api/jobs/:id`
- `GET /api/field-catalog` — the dynamic field catalog: `{ sections, fields, mandatoryKeys, lgasByState }` (see [docs/field-catalog-draft.md](docs/field-catalog-draft.md) for the proposed field-by-field shape). Cached client-side after first fetch by `fieldCatalogService`.
- `POST /api/applications` — multipart form: `jobId`, plus one multipart field per catalog key the applicant answered (e.g. `firstName`, `email`, `dateOfBirth`, `cvUpload`, …) — no JSON-blob fields; which keys are sent depends entirely on the job's `applicationRequirements` config
- `POST /api/contact` — `{ fullName, email, phone?, orgName?, subject, message }`

That is the whole contract. Auth and `/api/admin/*` endpoints are used only by the separate admin dashboard.

---

## Deployment

Hosted on **Vercel**. `vercel.json` rewrites every path to `/index.html` so client-side routes resolve correctly on a hard refresh/direct link. In production, `VITE_API_BASE_URL` must be set to the real API domain (e.g. `https://api.3dees.com`) since there is no dev proxy in production.

A `public/_redirects` file is also present, which is the equivalent SPA rewrite for **Netlify**. It has no effect on Vercel; it just means the `dist/` build is deployable as-is to either host without extra config.

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
5. **Real backend integration** (commit `6dca174`) — `localStorageDb.js` deleted; `services/` added (`api.js`, `authService.js`, `jobsService.js`, `applicationsService.js`, `contactService.js`, `usersService.js`, `auditLogsService.js`); `PortalContext` rewritten to call the API instead of reading/writing `localStorage` directly, with two-step OTP login and silent token refresh. See `.claude memory` note `project_api_integration.md` for the session this happened in.
6. Small fixes: Vercel SPA rewrite config, mobile footer-badge visibility.
7. **Dynamic job application requirements** (commit `939a1c9`) — replaced the old fixed 4-step Apply wizard (hardcoded Bio-Data/Education/Documents/Review fields, `personalInfo`/`educationInfo` JSON blobs) with a field-catalog-driven system: `fieldCatalogService`/`useFieldCatalog` fetch and cache a canonical field catalog from the backend; `fieldCatalogHelpers` derives which sections/fields a job's `applicationRequirements` config enables and validates them; `FieldRenderer` renders any catalog field by type; `Apply.jsx` and `JobDetail.jsx`'s requirements checklist were both rewritten against this catalog instead of a hardcoded field list. `docs/field-catalog-draft.md` is the working draft of that catalog, with open items still flagged for review (derived vs. input fields, duplicate fields across sections, experience-field shape) — it isn't locked yet, so the backend's actual catalog may still change shape.
8. **README sync + Netlify redirect rule** (commits `d1c5c65`, `063087e`, current `HEAD`) — README updated to fully document the field-catalog work above, and `public/_redirects` added for Netlify-compatible SPA routing alongside the existing `vercel.json` rewrite.
9. **Dead admin data layer removed** — the admin code left behind after step 4 was deleted: `authService`, `usersService`, `auditLogsService` and `useAuth`; the admin methods in `jobsService`/`applicationsService`; every auth/admin action, state field and reducer case in `PortalContext`; and the Bearer-token interceptor plus silent-refresh logic in `api.js`. None of it was reachable from a route, but it shipped in the bundle (exposing admin endpoint paths and request shapes), restored a stored session with an unguarded `JSON.parse` on every page load (a malformed value blanked the site), attached any stored admin token to public requests, and — because the admin dashboard shares `localStorage` with this site in development — could rotate the dashboard's refresh token behind its back. The site now never touches auth storage.

**Why the admin portal was removed rather than kept:** the codebase and commit history don't state a reason explicitly, but the context strongly suggests the plan moved to a *separate* admin frontend backed by its own dedicated auth service — a sibling project, `egi-admin-portal` (see the `EGI Hub Backend` directory), describes itself as "a standalone authentication backend... so that a separate admin frontend can register a superadmin, log in, and maintain a session, independent of any other EGI backend service." That backend currently only handles auth (register/login/logout/me) and doesn't yet expose jobs/applications/users/audit-log endpoints, so it is **not** a drop-in replacement for the API this site's `services/` layer already expects — it appears to be an earlier or parallel piece of a still-being-built separate admin system, not the backend this site is currently pointed at.

---

## Known gaps / things to know

- **Don't reintroduce auth storage access here.** In development this site and the admin dashboard share `localStorage` (same default port), so any read, rewrite or cleanup of `3dees_access_token` / `3dees_refresh_token` / `3dees_current_user` from this site interferes with a live dashboard session.
- **Page `<title>`** in `index.html` is still the Vite template default (`"3dees-original"`), not the site's actual name — not yet rebranded.
- **Social links** in the footer (LinkedIn/X/Facebook) point at the bare platform homepages, not 3DEES's real profiles — placeholders.
- **Contact page map** is fully built (SVG grid, animated pin, GPS badge) but commented out, not deleted — a real map was decided against for now.
- **`VITE_EGI_PORTAL_ENDPOINT`** is declared in `.env` but unused by any code in this repo — that sync happens server-side.
- **Jobs/Apply pages filter and validate entirely client-side** against the already-fetched job list; there's no server-side search/pagination even though `jobsService.getJobs()` accepts `search`/`category`/`location`/`type` params (they're just never passed from the UI).
- **Field catalog isn't locked yet.** `docs/field-catalog-draft.md` still has open review flags (e.g. whether Full Name/Age are derived vs. input fields, a duplicated Professional Registration Number field, whether §9 experience fields need years/detail beyond yes/no) — until it's finalized as the backend's real `GET /api/field-catalog` response, the Apply wizard and JobDetail checklist are only as correct as that draft.
- **No client-side `src/config/fieldCatalog.js` exists** — the frontend has no fallback catalog; `Apply`/`JobDetail` show an explicit "form unavailable" state if `GET /api/field-catalog` fails or the backend hasn't implemented it yet.
- No test suite exists (no `*.test.js`/`*.spec.js` files, no test runner in `package.json`).
