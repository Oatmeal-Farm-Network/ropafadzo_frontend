## Hop

<!-- Pick one. Feature PRs may only target staging. -->

- [ ] Feature / fix → `GCP/frontend-staging` (staging Cloud Run)
- [ ] `GCP/frontend-staging` → `GCP/frontend-testing` (testing Cloud Run)
- [ ] `GCP/frontend-testing` → `main` (production)

Do **not** open a feature PR into testing or `main`.

## Summary

-

## Tickets / scope in this promotion

-

## Checks

- [ ] CI is green (`npm ci`, lint, `vite build`)
- [ ] Baked `VITE_*` targets match this hop (staging / testing / prod APIs — no mix)
- [ ] Backend CORS updated if this hop adds a frontend origin
- [ ] `OFN_HOSTS` includes the Cloud Run hostname prefix for this environment
- [ ] Migrations / data notes (or N/A)

## Testing hop only

- [ ] Staging URL was exercised
- [ ] QA / product sign-off on the testing environment (name + date):

## Production hop only

- [ ] Testing URL was signed off
- [ ] GitHub Environment `production` approval required
- [ ] `PROD_*` secrets are intentionally set (do not fill them just to green a workflow)
