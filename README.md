# 🩸 Blood Bridge

> **Connecting blood seekers with donors — in minutes, not hours.**

Blood Bridge is a modern, full-stack web application designed to help people in urgent need find compatible blood donors nearby instantly. By leveraging geolocation, live map routing, and an AI scoring engine, the platform cuts out the middleman and reduces the time it takes to find a donor during critical emergencies.

---

## � Live Deployment

| Service | URL |
|---|---|
| 🖥️ **Live App (Vercel)** | [blood-bridge-dusky.vercel.app](https://blood-bridge-dusky.vercel.app) |
| ⚙️ **Backend API (Railway)** | [blood-bridge-production.up.railway.app](https://blood-bridge-production.up.railway.app) |
| 💾 **Database** | Supabase PostgreSQL (Production pool) |

---

## ✨ Core Features

1. **� Smart Geolocation Matchmaking**  
   Click "Use My Location" to auto-detect your city. The backend filters and sorts the database using the **Haversine formula** to display only donors in your coverage area, sorted by proximity.

2. **🗺️ Interactive Map with Live Routing**  
   A split-screen design featuring a Leaflet OpenStreetMap. Clicking a donor calculates a real-time driving polyline and ETA from your location to the donor.

3. **🚨 Emergency WhatsApp Integration**  
   Select from 3 urgency levels (Critical, High, Normal). The app generates a customized, pre-filled WhatsApp message containing the required blood type and your exact reverse-geocoded location for instant communication.

4. **🤖 AI Donor Scoring System**  
   An automated scoring engine evaluates donor eligibility on a 5-point scale (5%, 25%, 55%, 75%, 95%) based primarily on the exact number of days since their last donation, ensuring seekers don't waste time contacting non-eligible donors.

5. **🎨 Premium Glassmorphic UI**  
   Built with TailwindCSS and Framer Motion, featuring Hardware-accelerated CSS animations, floating background blur orbs, and buttery-smooth slide-up panels.

---

## 🛠️ Tech Stack

**Frontend:**
- **React 18** + Vite
- **TypeScript**
- **TailwindCSS** + shadcn/ui + Radix UI
- **TanStack React Query** (Data caching)
- **Leaflet / React Leaflet** + OpenStreetMap & OSRM APIs

**Backend:**
- **Node.js** + Express
- **Prisma ORM** (v5)
- **Zod** (Request validation)
- **Supabase PostgreSQL**

---

## � Quick Start (Local Development)

### 1. Backend Setup
```bash
cd blood-donor-backend
npm install
# Configure your Supabase connection strings in a .env file:
# DATABASE_URL="postgresql://..."
# DIRECT_URL="postgresql://..."

npx prisma db push
npm run dev
# Server runs on http://localhost:3000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:8080
```

---

> Built with ❤️ to connect donors and save lives. Every second counts.
