# Oatmeal Farm Network — Frontend

This is the web frontend for [Oatmeal Farm Network](https://oatmealfarmnetwork.com). For the full system overview and how to run frontend + backend together locally, see the backend repo's **[docs/SYSTEM.md](https://github.com/Oatmeal-Farm-Network/oatmealfarmnetworkbackend/blob/main/docs/SYSTEM.md)**.

## What This Repo Does

A **React 19** single-page application built with **Vite 7** and **Tailwind CSS 4**. It is the primary user interface for OFN — marketplace, events, supply chain, livestock management, precision agriculture, AI chat (Saige), website builder, and dozens of other farm-operations features.

The app talks to the Python FastAPI backend via `VITE_API_URL`. In development, Vite proxies API paths to the backend so you avoid CORS issues.

## Prerequisites

- Node.js 18+
- A running backend in the sibling repo `../oatmealfarmnetworkbackend` on port 8000 (see [backend README](https://github.com/Oatmeal-Farm-Network/oatmealfarmnetworkbackend/blob/main/README.md))

## Setup

```powershell
npm install
```

Environment files are checked in for local and production targets:

| File | Used when |
|------|-----------|
| `.env.development` | `npm run dev` |
| `.env.production` | `npm run build` |

### Environment variables

```env
# Primary API (main backend)
VITE_API_URL=http://localhost:8000

# Saige AI chat endpoints
VITE_SAIGE_API_URL=http://localhost:8000/saige

# Crop Monitor (optional in dev — defaults to VITE_API_URL/cm via proxy)
# VITE_CROP_API_URL=http://localhost:8000/cm

# News feed (can point at main API or external source)
VITE_NEWS_API_URL=http://localhost:8000

# Contact form recipient
VITE_CONTACT_RECIPIENT_EMAIL=your-email@example.com

# OTF admin nav config (optional legacy Node API)
VITE_OTF_API_URL=http://localhost:3001
```

In development, `VITE_API_URL=http://localhost:8000` is usually enough. Vite's dev-server proxy forwards `/auth`, `/api`, `/saige`, and `/cm` to that host (see `vite.config.js`).

## Running

```powershell
# Development server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview

# Lint
npm run lint
```

Start the backend before using the app. Login, marketplace, and most pages require a valid API connection and database.

## Dev Proxy

`vite.config.js` proxies these paths to `http://127.0.0.1:8000` during `npm run dev`:

| Path | Backend route |
|------|---------------|
| `/auth` | Main backend auth |
| `/api` | Main backend APIs |
| `/saige` | Saige AI |
| `/cm` | Crop Monitor |

This means you can leave `VITE_API_URL` empty in some components and use relative paths, or set it to `http://localhost:8000` for absolute URLs — both patterns exist in the codebase.

## Project Layout

```
oatmealfarmnetwork/
├── src/                 # React components and pages
├── public/              # Static assets (images, locales)
├── index.html
├── vite.config.js
├── package.json
├── .env.development
├── .env.production
└── README.md
```

## Deployment

Promotion train (feature PRs go to staging only):

```text
feature/*  →  GCP/frontend-staging  →  GCP/frontend-testing  →  main
```

See [docs/BRANCHING.md](docs/BRANCHING.md) and [docs/FRONTEND_STAGING_DEPLOY.md](docs/FRONTEND_STAGING_DEPLOY.md).

### Staging (Cloud Run)

Branch **`GCP/frontend-staging`** → GitHub Actions **Deploy Frontend Staging**.

- Service: `oatmeal-frontend-staging` (`oatmeal-farm-staging`)
- Build bakes staging `VITE_API_URL` → staging backend (not `.env.production`)

Requires GitHub secrets `STAGING_GCP_PROJECT_ID`, `STAGING_GCP_SERVICE_ACCOUNT`, `STAGING_GCP_WORKLOAD_IDENTITY_PROVIDER` on **this** repo, and WIF trust for `Oatmeal-Farm-Network/oatmealfarmnetwork`.

### Testing (Cloud Run)

Branch **`GCP/frontend-testing`** → **Deploy Frontend Testing** (`oatmeal-frontend-testing`). Fail-closed until `TESTING_*` vars point at testing APIs.

### Production

Branch **`main`** → **Deploy Frontend Production** (fail-closed until `PROD_*`). `cloudbuild.yaml` remains a manual fallback until the first successful Actions prod deploy. `.env.production` is not used by Actions bake vars.

## Related Documentation

- **[System overview](https://github.com/Oatmeal-Farm-Network/oatmealfarmnetworkbackend/blob/main/docs/SYSTEM.md)** — architecture, ports, run everything together
- **[Backend README](https://github.com/Oatmeal-Farm-Network/oatmealfarmnetworkbackend/blob/main/README.md)** — API setup, env vars, `server_all.py`
- **[Saige README](https://github.com/Oatmeal-Farm-Network/oatmealfarmnetworkbackend/blob/main/saige/README.md)** — AI chat API and configuration
