# Frontend Staging Deployment

**Repo:** [Oatmeal-Farm-Network/oatmealfarmnetwork](https://github.com/Oatmeal-Farm-Network/oatmealfarmnetwork)  
**Staging/testing GCP project:** `oatmeal-farm-staging` (`1087130530284`)  
**Production GCP project:** `animated-flare-421518` (Oatmeal AI, `802455386518`)  
**Region:** `us-central1`  
**Branches:** `GCP/frontend-staging` → `GCP/frontend-testing` → `main`  
**Workflows:** `deploy-staging.yml`, `deploy-testing.yml`, `deploy-prod.yml`  
**Last updated:** 9 September 2026 evening

---

Git train: see [BRANCHING.md](./BRANCHING.md). Feature PRs target `GCP/frontend-staging` only.

## What this deploys

| Git branch | Cloud Run | GCP project | Workflow | GitHub Environment |
|------------|-----------|-------------|----------|--------------------|
| `GCP/frontend-staging` | `oatmeal-frontend-staging` | `oatmeal-farm-staging` | `deploy-staging.yml` | `staging` |
| `GCP/frontend-testing` | `oatmeal-frontend-testing` | `oatmeal-farm-staging` | `deploy-testing.yml` | `testing` |
| `main` | **`oatmealfarmnetwork`** | `animated-flare-421518` | `deploy-prod.yml` | `production` |

Official OFN production Cloud Run is **`oatmealfarmnetwork`**. There is no `oatmeal-frontend-prod`. Do not deploy this repo onto `oatmeal-main` or `oatmeal-social-frontend`.

Staging image: `us-central1-docker.pkg.dev/oatmeal-farm-staging/oatmeal-farm-registry/frontend:<short-sha>`  
Staging runtime SA: `frontend-sa@oatmeal-farm-staging.iam.gserviceaccount.com`

Testing and production stay **fail-closed** until `TESTING_*` / `PROD_*` are set. Do not copy production credentials into testing. Do not fill `PROD_*` just to green a workflow. `cloudbuild.yaml` remains a manual production fallback.

---

## How CD works

```text
push to GCP/frontend-staging
        │
        ├─ docs/README only? ──► skip
        │
        ▼
GitHub Actions: Deploy Frontend Staging
        │
        ├─ WIF auth (STAGING_GCP_* secrets)
        ├─ docker build with staging VITE_* build-args
        ├─ push → Artifact Registry
        └─ gcloud run deploy oatmeal-frontend-staging
```

**Triggers:** push to `GCP/frontend-staging` (non-docs) + `workflow_dispatch`.

---

## Staging API wiring

Vite embeds env at **build time**. Staging CD passes:

| Build arg | Default |
|-----------|---------|
| `VITE_API_URL` | `https://oatmeal-backend-staging-1087130530284.us-central1.run.app` |
| `VITE_SAIGE_API_URL` | `https://oatmeal-saige-staging-lrviw4iujq-uc.a.run.app` |
| `VITE_CROP_API_URL` | staging backend `/cm` |
| `VITE_NEWS_API_URL` | staging backend |
| `VITE_CONTACT_RECIPIENT_EMAIL` | placeholder / var |
| `VITE_OTF_API_URL` | empty unless var set |

Override defaults with GitHub **Actions variables** on this repo: `STAGING_BACKEND_URL`, `STAGING_SAIGE_URL`, etc.

Do **not** rely on `.env.production` for staging — those URLs are production.

Backend CORS must allow this frontend origin (done on `GCP/backend-staging`).

**Platform hostnames:** Cloud Run hosts must be treated as OFN, not farm custom domains. `src/main.jsx` and `src/WebsitePublic.jsx` match `oatmeal-frontend-staging*`, `oatmeal-frontend-testing*`, and `oatmealfarmnetwork-*` (the real prod Cloud Run host). Otherwise the app shows “Site Not Found”.

---

## GitHub secrets (this frontend repo)

Configure the same staging WIF secrets used by the backend repo:

| Secret | Purpose |
|--------|---------|
| `STAGING_GCP_PROJECT_ID` | `oatmeal-farm-staging` |
| `STAGING_GCP_SERVICE_ACCOUNT` | Deployer SA email |
| `STAGING_GCP_WORKLOAD_IDENTITY_PROVIDER` | WIF provider resource name |

The deployer SA needs permission to push Artifact Registry images and deploy `oatmeal-frontend-staging` in the staging project. WIF must trust this GitHub repo (`oatmealfarmnetwork`).

### Testing secrets / variables

Create `oatmeal-frontend-testing` and backend `*-testing` services first. Same GCP project as staging is OK.

| Name | Type | Notes |
|------|------|--------|
| `TESTING_GCP_PROJECT_ID` | secret | **Must be** `oatmeal-farm-staging` |
| `TESTING_GCP_SERVICE_ACCOUNT` | secret | Deployer SA |
| `TESTING_GCP_WORKLOAD_IDENTITY_PROVIDER` | secret | WIF |
| `TESTING_FRONTEND_RUNTIME_SA` | var | **Required** |
| `TESTING_BACKEND_URL` | var | **Required** — `oatmeal-backend-testing` |
| `TESTING_SAIGE_URL` | var | **Required** — `oatmeal-saige-testing` |
| `TESTING_CROP_API_URL` | var | Testing backend `/cm` |
| `TESTING_NEWS_API_URL` | var | Optional |
| `TESTING_CONTACT_EMAIL` | var | Optional |

Backend CORS: allow the testing frontend origin before the first testing deploy.

### Production secrets / variables

Fail-closed until these exist. Do not set them until testing has been used and Environment `production` has reviewers.

| Name | Type | Notes |
|------|------|-------|
| `PROD_GCP_PROJECT_ID` | secret | **Must be** `animated-flare-421518` |
| `PROD_GCP_SERVICE_ACCOUNT` | secret | Prod WIF deployer |
| `PROD_GCP_WORKLOAD_IDENTITY_PROVIDER` | secret | Prod WIF only |
| `PROD_FRONTEND_RUNTIME_SA` | var | Required |
| `PROD_BACKEND_URL` | var | Official backend: `oatmealfarmnewtorkbackend` |
| `PROD_SAIGE_URL` | var | Required (bake only; Saige is not an official prod Cloud Run surface) |
| `PROD_FRONTEND_SERVICE_NAME` | var | Optional; default **`oatmealfarmnetwork`**. Do not set `oatmeal-frontend-prod`. |

---

## Operator process

1. Cut features from `GCP/frontend-staging`. PR into staging only.
2. Staging merge deploys `oatmeal-frontend-staging`.
3. Promote staging → `GCP/frontend-testing` by PR after staging looks right.
4. After QA sign-off, PR testing → `main`. Production Actions stay blocked until `PROD_*` exist; `cloudbuild.yaml` is the fallback.

```bash
gcloud run services describe oatmeal-frontend-staging \
  --project=oatmeal-farm-staging --region=us-central1 \
  --format='yaml(status.url,spec.template.spec.containers[0].image)'
```

In the browser, verify Network calls go to the **matching** backend host for that hop (not a different environment).

---

## Related

- Backend staging: backend repo `docs/staging/BACKEND_STAGING_DEPLOY.md`
- Backend CORS / `FRONTEND_URL`: backend `GCP/backend-staging`
- Saige staging: backend repo `docs/staging/SAIGE_STAGING_DEPLOY.md`
