# OatSense America frontend (Precision Ag independent)

**API:** use the **main** `oatmealfarmnetworkbackend` Cloud Run / local unified server —  
not the `precision-ag-independent` backend branch.

Repo: https://github.com/Oatmeal-Farm-Network/Oatsense-america-frontend

## Local run

```bash
npm install
npm run dev:precision
```

Requires main backend on `http://127.0.0.1:8000` (see `.env.precision-ag`).

## Git train

```text
feature/*  →  GCP/frontend-staging  →  GCP/frontend-testing  →  main
```

See [docs/BRANCHING.md](docs/BRANCHING.md). Feature PRs go to staging only.

| Branch | Cloud Run | Workflow |
|--------|-----------|----------|
| `GCP/frontend-staging` | `oatsense-frontend-staging` | `deploy-staging.yml` (fail-closed until `STAGING_*`) |
| `GCP/frontend-testing` | `oatsense-frontend-testing` | `deploy-testing.yml` (fail-closed until `TESTING_*`) |
| `main` | **`oatsense-frontend-usa`** (`animated-flare-421518`) | `deploy-prod.yml` (fail-closed until `PROD_*`) |

## Cloud Build / Cloud Run

`cloudbuild.yaml` remains the production fallback until Actions prod CD is enabled.

```bash
gcloud builds submit --config cloudbuild.yaml .
gcloud run deploy oatsense-frontend-usa \
  --image us-central1-docker.pkg.dev/animated-flare-421518/cloud-run-source-deploy/oatsense-frontend \
  --region us-central1 --platform managed --allow-unauthenticated --port 8080
```

`VITE_PRECISION_AG_ONLY=true` — non–Precision Ag routes redirect into Precision Ag.  
Bake `STAGING_API_URL` / `TESTING_API_URL` / `PROD_API_URL` per hop. Do not mix a non-prod frontend with the production API.

## Field Twin note

This branch does not yet include `src/precision-ag/field-twin` (that lives in the main OFN frontend tree). Merge later if Twin is required on OatSense.
