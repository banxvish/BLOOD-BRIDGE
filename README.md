# 🩸 Blood Bridge

> **Connecting blood seekers with donors — in minutes, not hours.**

A modern, full-stack web application that helps people in urgent need find compatible blood donors nearby. Built with a React/TypeScript frontend and designed to connect to a RESTful backend with a relational or NoSQL database.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Project Structure](#-project-structure)
- [Frontend Architecture](#-frontend-architecture)
  - [Tech Stack](#tech-stack)
  - [Pages & Routing](#pages--routing)
  - [Component Structure](#component-structure)
  - [State Management](#state-management)
  - [Styling System](#styling-system)
- [Backend Integration](#-backend-integration)
  - [API Communication Flow](#api-communication-flow)
  - [Expected REST API Endpoints](#expected-rest-api-endpoints)
  - [Database Schema (General)](#database-schema-general)
  - [Data Flow Diagram](#data-flow-diagram)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Running Tests](#running-tests)
- [Environment Variables](#-environment-variables)
- [Scripts Reference](#-scripts-reference)

---

## 🏥 Project Overview

Blood Bridge is a platform with two primary user flows:

| Flow | Description |
|------|-------------|
| **Find a Donor** | Search available blood donors by blood type, city/location, and urgency level |
| **Become a Donor** | Register your profile (name, blood group, contact, city, availability) |

Currently, the frontend is **fully integrated** with a live Node.js/Express backend utilizing a PostgreSQL database via Prisma ORM.

---

## 📁 Project Structure

```
blood-bridge/
│
├── blood-donor-backend/        # Node.js + Express API + PostgreSQL
│   ├── prisma/                 # Database schema and migrations
│   ├── src/                    # API Routes and Controllers
│   └── .env                    # Database connection string
│
├── frontend/                   # React + Vite Frontend
│
├── public/                     # Static assets served as-is
│   └── favicon.ico / og-image
│
├── src/
│   ├── assets/                 # Images, icons bundled by Vite
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   ├── HeroSection.tsx     # Landing page hero banner
│   │   ├── FeaturesSection.tsx # Features highlight section
│   │   ├── ProblemSection.tsx  # Problem statement section
│   │   ├── NavLink.tsx         # Styled navigation link
│   │   └── ui/                 # shadcn/ui primitive components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── badge.tsx
│   │       ├── toast.tsx
│   │       └── ... (40+ primitives)
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── use-toast.ts        # Toast notification hook
│   │
│   ├── lib/                    # Utility helpers
│   │   └── utils.ts            # cn() class merger (clsx + tailwind-merge)
│   │
│   ├── pages/                  # Route-level page components
│   │   ├── Index.tsx           # Home / Landing page   [Route: /]
│   │   ├── SearchPage.tsx      # Donor search page     [Route: /search]
│   │   ├── RegisterPage.tsx    # Donor register page   [Route: /register]
│   │   └── NotFound.tsx        # 404 fallback page     [Route: *]
│   │
│   ├── test/                   # Unit/integration tests (Vitest)
│   ├── App.tsx                 # Root component + router setup
│   ├── main.tsx                # React DOM entry point
│   ├── index.css               # Global CSS + Tailwind base styles
│   └── App.css                 # App-level scoped styles
│
├── index.html                  # Vite HTML shell
├── vite.config.ts              # Vite configuration (port 8080, path alias @/)
├── tailwind.config.ts          # TailwindCSS theme + custom tokens
├── tsconfig.json               # TypeScript project config
├── package.json                # Dependencies & npm scripts
└── vitest.config.ts            # Vitest test runner config
```

---

## 🖥️ Frontend Architecture

### Tech Stack

| Technology | Role | Version |
|------------|------|---------|
| **React** | UI framework | 18.x |
| **TypeScript** | Type safety | 5.x |
| **Vite** | Build tool & dev server | 5.x |
| **React Router DOM** | Client-side routing | 6.x |
| **TailwindCSS** | Utility-first styling | 3.x |
| **shadcn/ui** | Accessible component primitives | Latest |
| **Radix UI** | Headless UI primitives | Latest |
| **Framer Motion** | Animations & transitions | 12.x |
| **TanStack React Query** | Server state & data fetching | 5.x |
| **React Hook Form** | Form state management | 7.x |
| **Zod** | Schema validation | 3.x |
| **Lucide React** | Icon library | Latest |

---

### Pages & Routing

Routing is configured in `src/App.tsx` using React Router DOM v6:

```
/           →  Index.tsx        (Landing page)
/search     →  SearchPage.tsx   (Find donors)
/register   →  RegisterPage.tsx (Become a donor)
*           →  NotFound.tsx     (404 page)
```

**Route Tree:**

```
<BrowserRouter>
  <QueryClientProvider>        ← React Query context for API calls
    <TooltipProvider>          ← Radix UI tooltip context
      <Toaster />              ← Global toast notifications
      <Routes>
        /          → <Index />
        /search    → <SearchPage />
        /register  → <RegisterPage />
        *          → <NotFound />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
</BrowserRouter>
```

---

### Component Structure

#### Landing Page (`/`)
```
<Index>
  ├── <Navbar />              ← Navigation with links to /search and /register
  ├── <HeroSection />         ← Headline, sub-headline, CTA buttons
  ├── <ProblemSection />      ← Problem statement with statistics
  ├── <FeaturesSection />     ← Feature cards (fast, verified, free)
  └── <Footer />              ← Copyright and brand info (inline in Index)
```

#### Search Page (`/search`)
```
<SearchPage>
  ├── <Navbar />
  └── Filter Bar
      ├── <Input>             ← Search by name or city
      ├── <Select>            ← Filter by blood type (A+, B-, O+, etc.)
      ├── <Select>            ← Filter by urgency (Critical / High / Normal)
      └── <Button>            ← Trigger search
  └── Donor Cards Grid
      └── DonorCard (×N)
          ├── Name, City, Distance
          ├── Blood Type badge
          ├── Availability status badge
          ├── Last donation date
          └── "Contact Donor" button
```

#### Register Page (`/register`)
```
<RegisterPage>
  ├── <Navbar />
  └── Registration Form
      ├── Full Name            (required)
      ├── Blood Group          (Select, required)
      ├── Contact Number       (required)
      ├── City / Location      (required)
      ├── Last Donation Date   (date picker)
      ├── Age                  (18–65, required)
      ├── Availability Toggle  (Switch, default ON)
      └── Submit Button        → shows success confirmation
```

---

### State Management

| State Type | Tool | Where Used |
|------------|------|------------|
| Local UI state | `React.useState` | Filter inputs, form toggles, submission status |
| Form state | `react-hook-form` | Registration form field values + validation |
| Server/API state | `@tanstack/react-query` | Future: donor list fetching, registration POST |
| Notifications | Custom `useToast` hook | Success/error toast messages |

> **Note:** The `SearchPage` uses `@tanstack/react-query` to fetch real, live donor data directly from the PostgreSQL backend via the `GET /api/donors` endpoint.

---

### Styling System

- **TailwindCSS** — utility classes are the primary styling method.
- **Custom tokens** — defined in `tailwind.config.ts` (colors, fonts, animations).
- **shadcn/ui** — components use CSS variables (`--primary`, `--background`, `--border`, etc.) for theming.
- **Glass-card effect** — custom class `.glass-card` with backdrop blur for card components.
- **Glow border** — custom class `.glow-border` adds an animated red glow.
- **Path alias** — `@/` maps to `src/` for clean imports.

---

## 🔗 Backend Integration

The frontend is connected to a **RESTful JSON API** built alongside it in the repository. The complete stack includes:

| Layer | Technology Used |
|-------|---------------------|
| **Runtime** | Node.js (v20+) with Express |
| **Database** | PostgreSQL |
| **Auth** | Custom JWT tokens middleware |
| **ORM** | Prisma v5.x |

---

### API Communication Flow

```
Browser (React App)
       │
       │  HTTP Request (fetch / axios / React Query)
       ▼
  Backend API Server
  ┌────────────────────────────┐
  │  Route Handler             │
  │  (e.g., GET /api/donors)   │
  │           │                │
  │  Service / Controller      │
  │           │                │
  │  ORM / Query Builder       │
  └────────────┬───────────────┘
               │  SQL / NoSQL query
               ▼
         Database Server
    (PostgreSQL / MongoDB)
               │
               │  Result rows / documents
               ▼
  Backend formats JSON response
               │
               ▼
  React Query cache (frontend)
               │
               ▼
  Component re-renders with data
```

---

### Expected REST API Endpoints

> Replace `https://api.yourdomain.com` with your actual backend URL.

#### Donors

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/donors` | List all available donors |
| `GET` | `/api/donors?bloodType=O%2B&city=Mumbai` | Filter donors by query params |
| `GET` | `/api/donors/:id` | Get a single donor profile |
| `POST` | `/api/donors` | Register a new donor |
| `PATCH` | `/api/donors/:id` | Update donor availability or profile |
| `DELETE` | `/api/donors/:id` | Remove a donor profile |

#### Sample Request — Search Donors

```http
GET /api/donors?bloodType=O+&city=Mumbai&available=true
Authorization: Bearer <token>
```

#### Sample Response

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1234",
      "name": "Ananya Sharma",
      "bloodType": "O+",
      "city": "Mumbai",
      "distance": "1.2 km",
      "lastDonation": "2024-10-15",
      "available": true,
      "contact": "+91 98765 43210"
    }
  ],
  "total": 1
}
```

#### Sample Request — Register Donor

```http
POST /api/donors
Content-Type: application/json

{
  "name": "Rahul Verma",
  "bloodType": "A+",
  "contact": "+91 99999 00000",
  "city": "Delhi",
  "lastDonation": "2024-08-01",
  "age": 28,
  "available": true
}
```

---

### Database Schema (General)

#### `donors` Table (Relational — SQL)

```sql
CREATE TABLE donors (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100)    NOT NULL,
  blood_type    VARCHAR(5)      NOT NULL,   -- 'A+', 'O-', 'AB+', etc.
  contact       VARCHAR(20)     NOT NULL,
  city          VARCHAR(100)    NOT NULL,
  latitude      DECIMAL(9,6),               -- for geo-based search
  longitude     DECIMAL(9,6),
  age           SMALLINT        NOT NULL CHECK (age BETWEEN 18 AND 65),
  last_donation DATE,
  available     BOOLEAN         DEFAULT TRUE,
  created_at    TIMESTAMP       DEFAULT NOW(),
  updated_at    TIMESTAMP       DEFAULT NOW()
);
```

#### `blood_requests` Table

```sql
CREATE TABLE blood_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester     VARCHAR(100)    NOT NULL,
  blood_type    VARCHAR(5)      NOT NULL,
  city          VARCHAR(100)    NOT NULL,
  urgency       VARCHAR(10)     NOT NULL,   -- 'critical', 'high', 'normal'
  contact       VARCHAR(20)     NOT NULL,
  fulfilled     BOOLEAN         DEFAULT FALSE,
  created_at    TIMESTAMP       DEFAULT NOW()
);
```



---

### Data Flow Diagram

```
┌──────────────────────────────────┐
│         React Frontend           │
│                                  │
│  SearchPage.tsx                  │
│  ┌──────────────────────────┐    │
│  │ useQuery('donors', ...)  │────┼──► GET /api/donors?bloodType=O+
│  └──────────────────────────┘    │
│                                  │
│  RegisterPage.tsx                │
│  ┌──────────────────────────┐    │
│  │ useMutation(postDonor)   │────┼──► POST /api/donors
│  └──────────────────────────┘    │
└──────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│          Backend Server          │
│  Express / FastAPI / Spring Boot │
│                                  │
│  ┌─────────────────────────┐     │
│  │ /api/donors (GET)       │     │
│  │  → validate query       │     │
│  │  → query DB             │     │
│  │  → return JSON          │     │
│  └─────────────────────────┘     │
│  ┌─────────────────────────┐     │
│  │ /api/donors (POST)      │     │
│  │  → validate body (Zod/  │     │
│  │    Joi / Pydantic)      │     │
│  │  → insert into DB       │     │
│  │  → return created obj   │     │
│  └─────────────────────────┘     │
└──────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│           Database               │
│   PostgreSQL / MongoDB           │
│                                  │
│   donors table / collection      │
│   blood_requests table           │
└──────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** or **bun** package manager
- A running **backend API server** (optional for mock/demo mode)

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/blood-bridge.git
cd blood-bridge
```

2. Setup Backend
```bash
cd blood-donor-backend
npm install
# Configure your PostgreSQL DATABASE_URL in the .env file
npx prisma db push
```

3. Setup Frontend
```bash
cd ../frontend
npm install
```

### Running Locally

You need two terminal windows to run both the frontend and the backend simultaneously.

**Terminal 1 (Backend - Port 3000):**
```bash
cd blood-donor-backend
npm run dev
```

**Terminal 2 (Frontend - Port 8080):**
```bash
cd frontend
npm run dev
```

Open your browser at **http://localhost:8080**

### Running Tests

```bash
# Run tests once
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🌐 Environment Variables

Create a `.env` file in the project root to configure the API base URL and other secrets:

```env
# Backend API Base URL
VITE_API_BASE_URL=https://api.yourdomain.com

# Optional: toggle mock data (true = use mocks, false = call real API)
VITE_USE_MOCK_DATA=true
```

> All environment variables exposed to the frontend **must** be prefixed with `VITE_` (Vite requirement).

---

## 📜 Scripts Reference

| Script | Command | Description |
|--------|---------|-------------|
| **Dev server** | `npm run dev` | Start Vite dev server on port 8080 |
| **Build** | `npm run build` | Production bundle to `dist/` |
| **Build (dev)** | `npm run build:dev` | Development build with source maps |
| **Preview** | `npm run preview` | Preview production build locally |
| **Lint** | `npm run lint` | Run ESLint checks |
| **Test** | `npm run test` | Run all tests with Vitest |
| **Test Watch** | `npm run test:watch` | Run tests in interactive watch mode |

---

## 📄 License

This project is licensed under the **MIT License**.

---

> Built with ❤️ to connect donors and save lives. Every second counts.
