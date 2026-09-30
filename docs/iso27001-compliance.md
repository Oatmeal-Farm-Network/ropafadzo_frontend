# ISO 27001 Information Security Management — Compliance Framework

**Prepared for:** OatmealFarmNetwork (OFN) Platform  
**Standard:** ISO/IEC 27001:2022  
**Status:** In Progress — Pre-Certification Assessment  
**Date:** 2026-05-20

---

## 1. Scope

The OFN Information Security Management System (ISMS) covers:

- **OFN main backend** (FastAPI on Google Cloud Run) — auth, marketplace, events, accounting, RBAC, audit log
- **Saige AI Agent** (LangGraph + push API on Cloud Run)
- **CropMonitoring Backend** (satellite agronomy on Cloud Run)
- **Frontend** (React/Vite PWA on Cloud Run)
- **Database** (Azure SQL / SQL Server) — all business, people, financial, and farm data
- **Firebase** (push notifications, some real-time features)
- **Developer workstations and CI/CD pipeline** (GitHub → Google Cloud Build → Cloud Run)

---

## 2. Information Security Policy

OFN is committed to protecting the confidentiality, integrity, and availability of all information entrusted to it by farm businesses, event organizers, consumers, and staff. The following policies apply:

| Area | Policy |
|------|--------|
| Access control | Role-based (Owner / Manager / Field Supervisor / Worker / View Only); principle of least privilege |
| Authentication | JWT bearer tokens; bcrypt password hashing; planned MFA for Owner role |
| Data in transit | TLS 1.2+ enforced on all Cloud Run endpoints and database connections |
| Data at rest | Azure SQL Transparent Data Encryption (TDE) enabled |
| Audit logging | All create / update / delete / login events written to `AuditLog` table |
| Change management | PRs reviewed and merged via GitHub; Cloud Build deploys only from `main` |
| Incident response | 24-hour notification target to affected businesses; documented in Section 9 |
| Third-party risk | Stripe (PCI-DSS compliant), Firebase (SOC 2), Azure SQL (ISO 27001 certified) |

---

## 3. Asset Inventory (Clause 8.1)

| Asset | Classification | Owner | Location |
|-------|---------------|-------|----------|
| User PII (name, email, phone) | Confidential | Platform team | Azure SQL |
| Financial records (invoices, payouts) | Restricted | Platform team | Azure SQL |
| Farm field/crop data | Internal | Business owner | Azure SQL |
| JWT signing secret | Secret | Platform team | Cloud Run env var |
| Database credentials | Secret | Platform team | Cloud Run env var |
| API source code | Internal | Development team | GitHub (private) |
| AI agent conversation history | Confidential | Business owner | Azure SQL |
| Push notification tokens | Confidential | Platform team | Azure SQL |
| Satellite imagery / NDVI rasters | Internal | Business owner | Cloud Storage |

---

## 4. Access Control (Clause 8.2 / Annex A 5.15–5.18)

### 4.1 Authentication

- Passwords hashed with **bcrypt** (cost factor ≥ 12).
- JWTs signed with **HS256**; 24-hour expiry for standard users, 1-hour for admin operations.
- Tokens transmitted in `Authorization: Bearer …` header only; never in URLs or cookies.
- Forgot-password flow generates a time-limited signed reset token (1 hour).

### 4.2 Authorization Model

```
BusinessUserRole  ─── RoleID ──►  BusinessRole
                                       │
                                       └──► BusinessRolePermission
                                                  (FeatureKey, CanView, CanEdit, CanDelete)
```

- Every API endpoint requiring business data validates `BusinessID` membership before returning data.
- `require_accounting_access()` dependency checks `AccessLevelID ≥ 3` for financial operations.
- Admin / platform-level operations require `LKMAccessLevel ≥ 1` on the `People` record.

### 4.3 Roles (Default Set)

| Role | Description |
|------|-------------|
| Owner | Full access to all features and settings |
| Manager | Operations, reports, team management |
| Field Supervisor | Work orders, field crews, crop records |
| Worker | Log work, view assigned tasks |
| View Only | Read-only access to all data |

---

## 5. Cryptography (Annex A 8.24)

| Item | Algorithm / Practice |
|------|---------------------|
| Password storage | bcrypt (salted, cost ≥ 12) |
| Token signing | HMAC-SHA256 (JWT) |
| Transport security | TLS 1.2+ (enforced by Cloud Run / Azure SQL) |
| Database encryption | Azure SQL TDE (AES-256) |
| File uploads | Cloud Storage default encryption (AES-256) |

**Gap:** Signing key rotation policy not yet documented. **Action:** Define quarterly rotation schedule for JWT signing secret.

---

## 6. Secure Development (Annex A 8.25–8.31)

### Controls in place

- **Input validation:** All API parameters type-checked by FastAPI/Pydantic. Raw SQL uses parameterized queries (`text()` with bound params) throughout — no string interpolation.
- **SQL injection:** Mitigated via SQLAlchemy `text()` parameterization on all queries.
- **XSS:** React escapes all rendered content by default; no `dangerouslySetInnerHTML` usage.
- **CORS:** Enforced by `DynamicCORSMiddleware`; only allowlisted origins accepted.
- **Dependency management:** `requirements.txt` pinned; `package.json` devDependencies separated from production.
- **Secrets management:** All credentials in Cloud Run environment variables; no secrets in source code or git history.
- **Code review:** All changes via pull request; at least one reviewer required before merge.

### Gaps / Actions

| Gap | Action | Target |
|-----|--------|--------|
| No SAST pipeline step | Add `bandit` (Python) + `eslint-plugin-security` (JS) to Cloud Build | Q3 2026 |
| No dependency vulnerability scan | Add `pip-audit` + `npm audit` to CI | Q3 2026 |
| JWT secret not rotated | Implement 90-day rotation schedule | Q4 2026 |
| No penetration test conducted | Engage third-party pen tester | Q1 2027 |

---

## 7. Operations Security (Annex A 8.6–8.15)

### 7.1 Logging and Monitoring

All user-initiated create / update / delete / login actions are recorded in the `AuditLog` table:

```sql
AuditLog (LogID, BusinessID, PeopleID, ActorName, Action, Resource,
          ResourceID, Details, IPAddress, CreatedAt)
```

Log retention: **2 years** (enforced by scheduled cleanup job — **action required:** implement).

### 7.2 Backup and Recovery

| Component | Backup method | RPO | RTO |
|-----------|--------------|-----|-----|
| Azure SQL | Azure automated backup (LRS) | 1 hour | 4 hours |
| Cloud Run services | Stateless; re-deploy from source | 0 | 30 min |
| Cloud Storage (media) | Multi-region redundancy | 0 | minutes |

### 7.3 Capacity Management

- Cloud Run auto-scales to 0 on no traffic; max instances capped to prevent runaway spend.
- Database connection pooling via SQLAlchemy (`pool_size=5`, `max_overflow=10`).

---

## 8. Incident Management (Clause 6.1 / Annex A 5.24–5.28)

### 8.1 Incident Response Procedure

1. **Detect** — automated error logging; business owner or staff reports via support channel.
2. **Contain** — disable affected account / feature; revoke compromised tokens.
3. **Assess** — determine data affected, scope, and root cause.
4. **Notify** — affected businesses notified within **24 hours**; regulatory notification (GDPR/CCPA) within 72 hours if PII involved.
5. **Recover** — restore from backup if needed; patch root cause; re-test.
6. **Review** — post-incident review within 5 business days; update controls.

### 8.2 Incident Register

Maintained in a private GitHub issue with label `security-incident`. Reviewed quarterly.

---

## 9. Business Continuity (Annex A 5.29–5.30)

- All compute is on Cloud Run (serverless, managed by Google); single-region deployment `us-central1`.
- **Gap:** No multi-region failover yet. **Action:** Evaluate Cloud SQL regional replica for DR by Q4 2026.
- Runbooks for manual re-deploy stored in internal wiki (action: create and link).

---

## 10. Supplier Relationships (Annex A 5.19–5.22)

| Supplier | ISO/SOC certification | Data processed |
|----------|-----------------------|----------------|
| Google Cloud (Cloud Run, Cloud Build, Cloud Storage) | ISO 27001, SOC 2 Type II | All application compute |
| Microsoft Azure (SQL Database) | ISO 27001, SOC 2 Type II | All persistent business + user data |
| Stripe | PCI DSS Level 1 | Payment card data |
| Firebase (Google) | SOC 2 | Push notifications, auth tokens |
| SendGrid / SMTP provider | SOC 2 | Transactional email |

---

## 11. Compliance and Legal (Annex A 5.31–5.36)

| Requirement | Status |
|-------------|--------|
| CCPA (California) — right to access / delete | Delete-account endpoint implemented |
| GDPR (if EU users present) | Privacy policy exists; DPA with Google/Azure in place via their standard DPA |
| USDA organic certification records | Export-compliance module retains traceability records |
| FSMA produce safety records | Lot tracking, FIFO/FEFO, audit log cover record-keeping requirements |

---

## 12. Risk Register (Clause 6.1.2)

| Risk | Likelihood | Impact | Controls | Residual |
|------|-----------|--------|----------|----------|
| SQL injection | Low | Critical | Parameterized queries throughout | Low |
| Compromised JWT secret | Low | Critical | Env-var storage; no git exposure | Low |
| Unauthorized data access (multi-tenant leak) | Low | Critical | BusinessID scoping on every query | Low |
| Third-party breach (Stripe, Azure) | Low | High | PCI-DSS / ISO 27001 suppliers | Low |
| Insider threat | Medium | High | RBAC; audit log; access reviews | Medium |
| Phishing / account takeover | Medium | High | bcrypt passwords; planned MFA | Medium |
| Data loss (DB failure) | Low | High | Azure automated backups | Low |
| Service unavailability | Low | Medium | Cloud Run auto-scaling | Low |

---

## 13. Statement of Applicability (SoA) — Summary

Controls fully implemented: **A.5.1–5.10**, **A.6.1**, **A.8.2–8.5**, **A.8.24**, **A.8.25–8.28**  
Controls partially implemented: **A.5.24–5.28** (incident mgmt), **A.8.6** (malware), **A.8.15** (log retention)  
Controls not yet applicable: **A.7** (physical security — cloud-native, no on-premises assets)  
Controls planned: SAST pipeline, penetration test, MFA, log retention automation

---

## 14. Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-05-20 | OFN Platform Team | Initial draft |

Next review: **2026-11-20**

---

*This document is internal and confidential. Do not distribute outside the organization.*
