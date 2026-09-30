# OatmealFarmNetwork — Frontend

## Purpose
Frontend for oatmealfarmnetwork.com. Displays farm data, crop information, event registration, marketplace, and community features. Hosts the Saige + Thaiyme + Lavendir AI agent widgets.

## Tech Stack
React 18 + Vite + React Router + Tailwind. PWA (manifest + service worker `public/sw.js`).
Production deploy: Cloud Run via `cloudbuild.yaml` (project `animated-flare-421518`, region `us-central1`).

## Related Repos
- **oatmealfarmnetworkbackend** (`../oatmealfarmnetworkbackend/`): main API — auth, marketplace, events, notifications, accounting, sponsorship, leads, COI, floor plan, booth services
- **CropMonitoringBackend** (sibling of `../oatmealfarmnetworkbackend/`): satellite agronomy — fields, analyses, raster, zones, NDVI series. Mounted at `/cm` in the local unified backend
- **oatmealfarmnetworkbackend/saige/**: Saige LangGraph agent + push API. Mounted at `/saige` in the local unified backend
- **Backend/saige/**: legacy location — actually only holds `.env` files now (the code lives in `../oatmealfarmnetworkbackend/saige/`)

## API Contracts
- **Local dev (one process):** `server_all.py` mounts everything at `http://localhost:8000` — main at root, `/saige/*`, `/cm/*`. See [memory/project_unified_local_backend.md].
- **Production (three services):** main backend, Saige, and CropMonitor each get their own Cloud Run URL. Frontend uses `VITE_*` env vars (`.env.development`, `.env.production`) to route per-service.
- **Auth flow:** `/auth/login` on main backend returns JWT in localStorage `access_token`; subsequent calls include `Authorization: Bearer …`.

## Key Files
- `src/main.jsx` — router, lazy-loaded routes, registers SW, mounts InstallPrompt
- `src/precisionAgUtils.js` — `API_URL`, `CROP_API_URL`, shared hooks (`useFields`, `useAnalyses`, `useRaster`, `useFloorPlan`)
- `src/SaigeWidget.jsx`, `src/ThaiymeChat.jsx` — floating AI chat widgets
- `src/EventAdminMenu.jsx` — sidebar nav for event organizer pages (sponsorship, leads, floor plan, etc.)
- `public/sw.js` — service worker (precache + runtime cache + bg-sync + push)
- `src/offlineQueue.js` — `queuedFetch()` helper for SW-backed offline POST queueing

## Dev Setup
```bash
cd OatmealFarmNetwork
npm install            # first time only
npm run dev            # vite on http://localhost:5173

# In a separate shell, run the unified backend (one process for everything):
cd ../oatmealfarmnetworkbackend
../venv/Scripts/python.exe -m uvicorn server_all:app --reload --port 8000
```
Vite proxies all API calls to `http://localhost:8000` (see `VITE_API_URL` in `.env.development`).

## Do Not Touch
- `EventRegistration/` — legacy ASP scripts kept for reference; do not modify or import
- The split `Backend/saige/.env` location (legacy); env vars belong here, not next to `../oatmealfarmnetworkbackend/saige/.env`
