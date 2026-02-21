# 🩸 Blood Bridge

> **Connecting blood seekers with donors — in minutes, not hours.**

A modern, full-stack web application that helps people in urgent need find compatible blood donors nearby. Built with React/TypeScript frontend and a Node.js/Express backend with PostgreSQL via Prisma ORM.

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Pages & Routing](#-pages--routing)
- [Backend Integration](#-backend-integration)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Scripts Reference](#-scripts-reference)

---

## 🏥 Project Overview

Blood Bridge is a platform with two primary user flows:

| Flow | Description |
|------|-------------|
| **Find a Donor** | Search available blood donors by blood type, city/location, and urgency level |
| **Become a Donor** | Register your profile (name, blood group, contact, city, address, availability) |

The frontend is **fully integrated** with a live Node.js/Express backend utilizing a PostgreSQL database via Prisma ORM. All data displayed in the app (donor cards, map markers, detail sheets) is real data fetched from the database.

---

## ✨ Features

### 🔍 Donor Search
- Search donors by **name, city, or blood type**
- Filter by **blood type** and **urgency level**
- View results as a **List** or **Map** with a toggle switch

### 🗺️ Interactive Map Integration
- **Split Layout** — Donor cards on the left, interactive Leaflet/OpenStreetMap map on the right
- **Custom Markers** — 🔴 Red marker for your location, 🔵 Blue arrow markers for donors
- **Dark-Themed Popups** — Map popups styled to match the project's glassmorphic dark UI
- **"Show Details" Button** — Click a map marker → popup → "Show Details" opens the full donor detail sheet

### 📍 Geolocation & Geocoding
- **"Use My Location"** button uses browser Geolocation API to detect your coordinates
- **Automatic Geocoding** — When a donor registers with an address/city, the app queries the OpenStreetMap Nominatim API to convert it into latitude/longitude, so the donor appears on the map automatically
- **Distance Sorting** — Backend uses the Haversine formula to calculate and sort donors by proximity

### 📋 Donor Detail Sheet
- Premium **iPhone-style slide-up sheet** with spring animation
- **Full-screen glassmorphic overlay** — completely covers the map when opened
- Displays all donor details: name, blood type (large display), city, address, distance, age, last donation date, contact number
- **WhatsApp** quick-action button for instant contact

### 📝 Donor Registration
- Full registration form with fields: Name, Blood Group, Contact, City, Full Address, Age, Last Donation Date, Availability Toggle
- Automatic geocoding on submit — donor coordinates are saved to the database
- Form validation with Zod schema (backend)

### 🌱 Database Seeding
- Included seed script (`prisma/seed.ts`) with **30 realistic donor profiles** across 20+ Indian cities
- Each donor has real coordinates for immediate map visualization

---

## 📁 Project Structure

```
blood-bridge/
│
├── blood-donor-backend/           # Node.js + Express API + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema (Donor, BloodRequest models)
│   │   └── seed.ts                # Seed script with 30 donors
│   ├── src/
│   │   ├── controllers/           # Route handlers (donorController, etc.)
│   │   ├── routes/                # Express route definitions
│   │   ├── schemas/               # Zod validation schemas
│   │   └── index.ts               # Server entry point (port 3000)
│   └── .env                       # DATABASE_URL connection string
│
├── frontend/                      # React + Vite Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx         # Top navigation bar
│   │   │   ├── HeroSection.tsx    # Landing page hero banner
│   │   │   ├── FeaturesSection.tsx# Feature cards section
│   │   │   ├── MapTab.tsx         # Interactive Leaflet map component
│   │   │   ├── DonorDetailSheet.tsx # Slide-up donor details panel
│   │   │   └── ui/               # shadcn/ui primitives (40+ components)
│   │   ├── pages/
│   │   │   ├── Index.tsx          # Home / Landing       [Route: /]
│   │   │   ├── SearchPage.tsx     # Find donors           [Route: /search]
│   │   │   ├── RegisterPage.tsx   # Become a donor        [Route: /register]
│   │   │   └── NotFound.tsx       # 404 fallback          [Route: *]
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── lib/                   # Utility helpers
│   │   ├── index.css              # Global CSS + Tailwind + Leaflet popup overrides
│   │   ├── App.tsx                # Root component + router
│   │   └── main.tsx               # React DOM entry point
│   ├── vite.config.ts             # Vite config (port 8080)
│   └── package.json               # Dependencies
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

| Technology | Role |
|------------|------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **React Router DOM v6** | Client-side routing |
| **TailwindCSS** | Utility-first styling |
| **shadcn/ui + Radix UI** | Accessible component primitives |
| **Framer Motion** | Animations & transitions |
| **TanStack React Query** | Server state & data fetching |
| **Leaflet + react-leaflet** | Interactive maps (OpenStreetMap) |
| **Lucide React** | Icon library |

### Backend

| Technology | Role |
|------------|------|
| **Node.js + Express** | API server |
| **PostgreSQL** | Relational database |
| **Prisma v5** | ORM & database toolkit |
| **Zod** | Request validation |
| **ts-node-dev** | Development hot-reload |

---

## 📄 Pages & Routing

```
/           →  Index.tsx        (Landing page)
/search     →  SearchPage.tsx   (Find donors — List + Map views)
/register   →  RegisterPage.tsx (Become a donor)
*           →  NotFound.tsx     (404 page)
```

---

## 🔗 Backend Integration

### Data Flow

```
React Frontend  →  fetch /api/donors  →  Express Backend  →  Prisma ORM  →  PostgreSQL
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/donors` | List all donors |
| `GET` | `/api/donors?lat=...&lng=...` | List donors sorted by proximity |
| `GET` | `/api/donors?bloodType=O%2B&city=Mumbai` | Filter donors |
| `GET` | `/api/donors/:id` | Get a single donor |
| `POST` | `/api/donors` | Register a new donor |
| `PATCH` | `/api/donors/:id` | Update donor profile |
| `DELETE` | `/api/donors/:id` | Remove a donor |

### Database Schema (Prisma)

```prisma
model Donor {
  id            String    @id @default(uuid())
  name          String
  bloodType     String
  contact       String
  city          String
  address       String?
  latitude      Float?
  longitude     Float?
  age           Int
  lastDonation  DateTime?
  available     Boolean   @default(true)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model BloodRequest {
  id            String    @id @default(uuid())
  requester     String
  bloodType     String
  city          String
  urgency       String
  contact       String
  fulfilled     Boolean   @default(false)
  createdAt     DateTime  @default(now())
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** package manager
- **PostgreSQL** database

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/blood-bridge.git
cd blood-bridge
```

2. **Setup Backend**
```bash
cd blood-donor-backend
npm install
# Configure your PostgreSQL DATABASE_URL in the .env file
npx prisma db push
# (Optional) Seed 30 sample donors
npx ts-node prisma/seed.ts
```

3. **Setup Frontend**
```bash
cd ../frontend
npm install
```

### Running Locally

You need **two terminals** to run both servers simultaneously.

**Terminal 1 — Backend (Port 3000):**
```bash
cd blood-donor-backend
npm run dev
```

**Terminal 2 — Frontend (Port 8080):**
```bash
cd frontend
npm run dev
```

Open your browser at **http://localhost:8080**

---

## 🌐 Environment Variables

### Backend (`blood-donor-backend/.env`)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bloodbridge"
```

### Frontend

The frontend calls `http://localhost:3000` directly for API requests. No `.env` configuration is needed for local development.

---

## 📜 Scripts Reference

### Frontend (`frontend/`)

| Script | Command | Description |
|--------|---------|-------------|
| **Dev server** | `npm run dev` | Start Vite dev server on port 8080 |
| **Build** | `npm run build` | Production bundle to `dist/` |
| **Preview** | `npm run preview` | Preview production build |
| **Lint** | `npm run lint` | Run ESLint checks |

### Backend (`blood-donor-backend/`)

| Script | Command | Description |
|--------|---------|-------------|
| **Dev server** | `npm run dev` | Start Express server with hot-reload on port 3000 |
| **DB Push** | `npx prisma db push` | Sync Prisma schema to database |
| **Seed** | `npx ts-node prisma/seed.ts` | Seed 30 sample donors |
| **Prisma Studio** | `npx prisma studio` | Open database GUI |

---

## 📄 License

This project is licensed under the **MIT License**.

> Built with ❤️ to connect donors and save lives. Every second counts.
