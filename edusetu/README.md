# EduSetu — Full-stack foundation

This repository contains the first implementation slices of the EduSetu product plan: a **NestJS modular-monolith API** and a **Next.js public frontend**, with PostgreSQL, Prisma, organization-scoped RBAC, verified institution discovery, published-review display and moderation-oriented review states.

> This is an initial development foundation, not a production-ready commercial launch. Authentication is deliberately disabled until a managed OIDC provider is selected and configured. Payment processing is not connected. The billing tables are a data-model foundation only; no checkout or webhook is live. Do not put real student, parent, identity, or payment data into this environment.

## Architecture in this slice

- `apps/api`: NestJS + TypeScript API, REST under `/api/v1`.
- `apps/web`: Next.js App Router frontend with live public directory/profile views and role-oriented workspace shells.
- PostgreSQL: primary system of record.
- Prisma: schema, relations, constraints, and migrations.
- Billing data model: plans, dynamic entitlements, subscription state, invoice snapshots, refunds, and idempotent provider-event records; checkout/webhooks are not connected yet.
- Redis: local infrastructure placeholder for the planned queues/cache layer.
- OIDC JWT validation: optional, issuer/JWKS/audience driven; disabled by default.
- Swagger: `/api/v1/docs`.

## Implemented API surface

| Method | Route | Access | Purpose |
|---|---|---|---|
| GET | `/api/v1/health` | Public | API + database readiness |
| GET | `/api/v1/institutions` | Public | Search verified institutions |
| GET | `/api/v1/institutions/:slug` | Public | Public institution profile and aggregate rating |
| POST | `/api/v1/institutions/:institutionId/claims` | Authenticated | Submit an institution ownership claim |
| GET | `/api/v1/institutions/:institutionId/reviews` | Public | List published reviews |
| POST | `/api/v1/institutions/:institutionId/reviews` | Authenticated | Submit a review into `PENDING` moderation state |
| POST | `/api/v1/reviews/:reviewId/reports` | Authenticated | Report a published review |
| GET | `/api/v1/moderation/reviews` | Platform moderator | Review moderation queue |
| GET | `/api/v1/moderation/cases` | Platform moderator | Open moderation/report cases |
| PATCH | `/api/v1/moderation/reviews/:reviewId/decision` | Platform moderator | Publish, reject, hide, or restore with audit record |
| POST | `/api/v1/verification/institutions` | Verification officer | Create an institution pending verification |
| PATCH | `/api/v1/verification/institutions/:id/status` | Verification officer | Verify, suspend, or archive an institution |
| GET | `/api/v1/verification/claims` | Verification officer | Review institution ownership claims |
| PATCH | `/api/v1/verification/claims/:claimId/decision` | Verification officer | Approve/reject a claim; approval grants institution owner membership |
| POST | `/api/v1/institutions/:institutionId/reviews/:reviewId/response` | Institution permission | Publish/update institution response |
| GET | `/api/v1/users/me` | Authenticated | Provision/read the signed-in account |

All routes are rate-limited per API process. DTO validation rejects unknown fields. Public queries only expose verified institution records and published reviews. The default throttler store is process-local; configure shared Redis-backed throttling before multi-instance production deployment.

## Local setup

Prerequisites: Node.js 22+, npm 10+, Docker Desktop or Docker Engine.

1. Copy `apps/api/.env.example` to `apps/api/.env`. (The root `.env.example` is also kept as a reference.)
2. Start local infrastructure:

   ```bash
   docker compose up -d
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Generate Prisma Client and apply the first migration:

   ```bash
   npm run db:generate
   npm run db:migrate -- --name init
   npm run db:seed
   npm run build:api
   npm run test:api
   ```

5. (Optional, after configuring OIDC) Bootstrap the first platform administrator by setting the exact issuer and subject for the intended admin identity in `apps/api/.env`, then run:

   ```bash
   npm run db:bootstrap-admin
   ```

   Treat the bootstrap subject as a privileged value. Do not expose this operation through a public endpoint.

6. Start the API:

   ```bash
   npm run dev:api
   ```

7. Check `http://localhost:4000/api/v1/health` and open `http://localhost:4000/api/v1/docs`.

The API, Prisma CLI, seed, and bootstrap scripts all use `apps/api/.env` when launched through the workspace scripts.


## Frontend local setup

The Next.js frontend lives in `apps/web`. It uses the current stable Next.js 16 line, React 19, Tailwind CSS v4 and TanStack Query. The Next.js installation guidance requires Node.js 20.9 or newer; this repository is pinned to Node.js 22 via `.nvmrc`.

1. Copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Ensure the API is running at `http://localhost:4000` and its `WEB_ORIGIN` allows `http://localhost:3000`.
3. From the repository root, run `npm install` once for all workspaces.
4. Start the frontend with `npm run dev:web`.
5. Open `http://localhost:3000`.

Other frontend commands: `npm run build:web` and `npm run lint:web`. See `apps/web/README.md` for routes, API mapping and current frontend limitations.

## Authentication setup

`AUTH_ENABLED=false` is intentional. Public directory/profile/review reads and the health route work without login; protected routes return `401` until a provider is configured.

Before enabling auth:

- Select and create the managed OIDC tenant/user pool.
- Configure `AUTH_ENABLED=true`, `OIDC_ISSUER`, `OIDC_JWKS_URL`, and `OIDC_AUDIENCE`.
- Use access tokens intended for this API; the validator checks issuer, signature, expiry, and the configured audience (or the `client_id` claim used by some providers such as Cognito). Provider-specific token behaviour must still be integration-tested.
- Test token rotation, revocation/session policy, MFA for institution staff/admins, and account recovery.
- Ensure the provider's data-processing terms and region are acceptable for the launch.

The API maps an OIDC `(iss, sub)` pair to `User.externalIssuer` and `User.externalSubject`. A user record is created/updated on `/users/me` or first authenticated write. User roles and institution memberships are not inferred from token-supplied role claims; permissions are resolved from PostgreSQL.

## Database and permissions

The schema includes explicit user, institution, campus, claim, role, permission, organization membership, review, category score, review revision, institution response, report, moderation case/action, audit-log, plan, dynamic entitlement, subscription, payment-event, invoice, and refund models. Payment event storage must use a reviewed allow-list of provider fields; never persist card numbers, CVV, or raw payment credentials.

Run the seed script to create review categories, institution roles, global platform roles, and permission records. Institution owners/admins/staff receive only institution-scoped permissions. A membership must be `ACTIVE`; changing an ID in a URL does not grant access. The first platform administrator must be assigned explicitly with the one-time bootstrap script after OIDC is configured.

## Important product rules enforced in this slice

- New reviews are `PENDING`; they are not public until a moderation workflow publishes them. Student-perspective reviews are blocked until guardian-consent and age-safety workflows exist.
- A database uniqueness constraint currently limits each account to one review per institution; concurrent duplicate submissions are mapped to a conflict response.
- Institution team members are blocked from reviewing their own institution.
- Institutions may respond to a published review but cannot change its rating or review body.
- A reviewer is not publicly identified by this API; the public review DTO does not expose author identity.
- Institution claim requests are recorded as pending workflow items; they do not automatically verify or grant access to an institution.
- Moderation decisions are restricted to global platform roles, resolve open cases for the review, create a moderation action, and write an audit record.
- Paid plans and entitlements do not affect public rating logic. Billing is not yet implemented.

## Not implemented yet

1. Review editing, appeal workflow, moderator assignment, case disposition, and expanded audit-event coverage.
2. Claim appeals, full institution verification evidence handling, safe document upload, and ownership transfer workflow.
3. Parent/student guardian-consent and relationship verification workflows.
4. Connect inbox, support cases, notifications, and background workers.
5. Subscription catalogue, Razorpay integration, signed webhooks, reconciliation, invoices, and entitlement checks.
6. Institution analytics, comparison, search relevance improvements, and full-text/trigram indexes.
7. Production infrastructure, Terraform, deployment pipeline, observability dashboards, backups, restore drills, and security testing.

## Critical production gates

Do not launch to the public or process real users' personal data until the team has completed the missing workflows, selected and configured the identity provider, reviewed the threat model, tested tenant isolation, enabled backups and restore drills, completed an independent security assessment, and obtained qualified Indian legal review of privacy, child safety, user-generated content, subscriptions, tax, and grievance obligations. A working local server is not proof of production security or legal compliance.

Because EduSetu is intended to process information relating to minors, the product owner must arrange adult/legal-owner oversight for company setup, contracts, payment-provider KYC, bank accounts, and legal decisions.
