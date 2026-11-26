# Build notes — first backend implementation slice

## What is in this build

- Backend-first NestJS modular monolith; no microservices.
- PostgreSQL schema with Prisma: users, institutions, campuses, claims, memberships, roles/permissions, reviews, category scores, revisions, institution responses, reports, moderation, audit events, plans, entitlements, subscriptions, payment events, invoices, and refunds.
- Generic OIDC JWT validation using issuer + JWKS + audience/client ID checks. Authentication is disabled by default until the provider is selected and configured.
- Database-backed global and institution-scoped RBAC. Token role claims are not treated as authorization.
- Public institution search/profile and published review reads.
- Review submission into `PENDING`, one review per account/institution, staff self-review prevention, and student-perspective submission blocked until guardian-consent safeguards exist.
- Moderation queue and publish/reject/hide/restore actions with case updates and audit records.
- Institution creation, verification status changes, ownership claim review, owner membership assignment, and audit records.
- DTO validation, security headers, CORS allow-list, Swagger, health check, and process-local rate limiting.
- A small DTO validation test suite.

## What is deliberately not live

- No production identity-provider tenant or secrets.
- No real users, student records, identity evidence, or payment data.
- No Razorpay checkout, signed webhook endpoint, webhook reconciliation worker, invoice delivery, or paid-entitlement enforcement.
- No Redis-backed queue or distributed rate-limit store; Redis is present in local Docker Compose for the next backend slice.
- No production cloud deployment, Terraform, CI/CD, external security assessment, or launch approval.

## Verification status in this environment

- Project files and JSON configuration were generated and inspected.
- TypeScript parsing was attempted, but a real type-check/build could not complete because workspace dependencies were not installed.
- `npm install` could not reach `registry.npmjs.org` in this environment (`EAI_AGAIN` DNS/network error).
- Docker is not installed in this environment, so PostgreSQL/Redis containers and Prisma migrations were not run.
- Prisma schema validation, generated-client validation, Nest build, and Jest execution remain to be run on a machine with npm registry and Docker access.

## Next engineering tasks

1. Install dependencies; run Prisma format/validate, generate the client, create/review the first migration, and execute the unit tests.
2. Add database integration tests for institution public filters, review uniqueness, moderation transitions, claim approval, and cross-tenant permission denial.
3. Select the OIDC provider and integration-test its actual access-token claims, MFA policies, sign-out/revocation, and account recovery.
4. Build review editing and appeals, claim appeals, document evidence storage/retention, and ownership transfer workflows.
5. Build guardian consent and student relationship verification before enabling student features.
6. Build Connect, notification jobs, Redis-backed workers, and distributed rate limiting.
7. Implement Razorpay Subscriptions with raw-body signature verification, idempotent webhook event ingestion, state reconciliation, invoice lifecycle, and server-side entitlement enforcement.
8. Add CI, dependency/secret scanning, backups, restore drills, observability, deployment infrastructure, and independent security testing.

## Open product decisions retained from the plan

- Launch institution segment and geography.
- Exact student eligibility and guardian-consent model.
- Institution relationship verification evidence and retention policy.
- Moderation staffing, escalation, appeal handling, and response-time targets.
- Subscription plan names, limits, pricing, tax treatment, and merchant/provider onboarding.


## Frontend foundation — 2026-11-09

Created `apps/web` as a Next.js App Router workspace using TypeScript, Tailwind CSS v4, TanStack Query and Lucide icons. Included a responsive public landing page, verified institution directory with filters and pagination, public institution profile and published review display, institution product and plan-concept pages, explicit sign-in/configuration status, parent and institution workspace shells, and a privileged admin boundary page.

The frontend reads only the public institution, profile and published-review API routes currently present in `apps/api`. Protected workflows are not simulated: authentication is disabled in the API until OIDC is configured; claims, review submission, Connect, billing and moderation UI actions are not wired to unavailable backend workflows. No student-facing review/messaging flow is exposed in this build.

The environment has no installed workspace dependencies and package registry access was unavailable in the preceding API build attempt. Frontend TypeScript compilation, lint and browser QA have therefore not been run yet. Run `npm install`, then `npm run lint:web` and `npm run build:web` from the repository root in a network-enabled development environment.
