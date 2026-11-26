# EDUSETU
## Commercial Product & Engineering Handoff Brief

**Purpose:** Brief a professional developer / development team to assess, architect, build, test, deploy and maintain EduSetu as a real commercial web platform.  
**Prepared:** 26 November 2026  
**Product name:** EduSetu (working name; brand, domain and trademark clearance remain open)  
**Market assumption:** India  
**Document status:** Product direction and engineering handoff draft — decisions requiring founder approval are listed explicitly.

> **This is a real product initiative, not a school demo, portfolio project or disposable prototype.** The goal is a dependable commercial platform that can handle real institutions, parents and students. The developer is expected to challenge assumptions, identify risks, estimate the work honestly and deliver production-quality engineering. Do not describe the existing code as production-ready.

---

## 1. Executive summary — what EduSetu is

EduSetu is a two-sided **education discovery, reputation and relationship platform** connecting parents / guardians, students, schools, colleges and universities.

Families should be able to discover institutions, understand verified public information, read and contribute fair reviews, compare options and communicate with institutions through structured channels. Institutions should be able to claim and maintain official profiles, respond to reviews, handle parent requests, understand aggregated feedback and subscribe to professional tools.

EduSetu is **not** a school ERP, admission agency, coaching marketplace or simple star-rating directory. Its central purpose is to create a trusted bridge between the people who experience education and the institutions that provide it.

**Product promise:** Real experiences. Transparent institutions. Stronger education relationships.

### The three product pillars

1. **Discover:** institution search, public profiles, verified official details, reviews and transparent comparisons.
2. **Trust:** institution claims and verification, reviewer protection, review integrity, moderation, appeals and public rating rules.
3. **Connect:** structured parent-to-institution requests, conversations, case tracking, announcements, surveys and feedback on how requests were handled.

### The business model

A freemium community platform with a subscription-based institution SaaS layer:

- Core public discovery, reading reviews, basic comparison and eligible community participation should remain free.
- Institutions may pay for profile-management tools, response workflows, team access, parent communication, aggregated analytics, reports, multi-campus administration and support.
- Pricing, taxes, billing periods, limits and final plan names are not yet validated. Keep plans and entitlements configurable in the database rather than hard-coding them into the UI.

**Critical trust rule:** An institution may pay for software, never for a higher rating, removal of valid criticism, favourable organic ranking, reviewer identity or access to a competitor's private data. Sponsored placements, should they ever exist, must be clearly labelled and separated from organic ratings and search results.

---

## 2. Target users, roles and key journeys

### Main participants

- **Visitor:** discovers institutions and reads public information.
- **Parent / guardian:** manages an account, saves and compares institutions, submits eligible reviews, reports content, manages consent and uses institution communication features.
- **Student:** may use age-appropriate discovery and feedback features subject to eligibility, consent and child-safety safeguards.
- **Institution owner:** claims an institution, manages billing, official profile and staff access.
- **Institution admin / staff:** handles reviews, assigned parent requests, profile information and permitted reports.
- **Campus admin:** manages only the campus or campuses assigned to that account.
- **Moderator:** reviews reports and content, records decisions and supports appeals.
- **Verification officer:** checks institution identity, ownership claims and evidence.
- **Billing support:** handles billing cases without unnecessary access to private family or review evidence.
- **Platform super admin:** performs highly privileged platform operations with strong audit controls.

A user can hold more than one role. Use organization-scoped permissions, not one global `isAdmin` flag. All protected access must be authorized by the backend.

### Main user journeys

**Parent / guardian:** visit → search institutions → inspect profile and review context → compare → create account when needed → submit review / report → follow an institution → send a structured request → track response → provide interaction feedback.

**Institution:** find or create institution record → submit claim → provide verification evidence → wait for independent approval → manage approved profile → respond professionally to reviews → handle assigned parent requests → view aggregate analytics → select a plan and manage subscription.

**EduSetu operations:** receive institution claim / content report → verify identity or investigate policy issue → record evidence and decision → notify relevant parties → provide appeal path → retain an audit trail.

### Connect and child-safety boundary

Connect should be a structured parent-to-institution relationship channel, not open social networking. Requests can be categorised (admissions, academics, facilities, safety, transport, fees, administration, general feedback). Cases need clear states such as open, awaiting institution, awaiting parent, resolved, closed and escalated.

For users under 18, guardian-mediated communication is the default. Do not create unrestricted private messaging between unknown adults and minors. Do not create public reputation scores for parents or children. Institutions may record private, structured feedback about a specific interaction, but it must not become a public family score or a tool to penalise a parent/student.

---

## 3. Product scope — what should actually be built

### Public website

- Homepage explaining purpose, trust principles and user entry points.
- Search by institution name, type, city / locality and relevant attributes.
- Filters for school / college / university, board / affiliation, location, facilities and other verified attributes.
- Stable, SEO-friendly institution profile URLs.
- Institution profiles with official information, verification status, category ratings, review counts, date context, responses and reporting links.
- Review policy, rating methodology, verification policy, trust and safety, help, contact, terms and privacy pages.
- Institution comparison using consistent fields, sample sizes and data limitations.

### Parent / guardian experience

- Account and security settings.
- Saved institutions and comparison lists.
- Review history and edit history.
- Institution connections, requests, cases and conversation history.
- Notification preferences.
- Consent history and privacy-request / account-deletion flows.
- Linked child relationship data only when necessary and lawfully supported.

### Student experience

- Age-appropriate onboarding and interface.
- Discovery and public information.
- Only those feedback actions approved by child-safety and legal review.
- Clear reporting and privacy controls.
- Guardian consent / mediation where required.
- No behavioural advertising, manipulative engagement patterns or unnecessary student-data collection.

### Institution dashboard

- Profile editor and sensitive-field change workflow.
- Claim / verification status.
- Review feed, filters, response workflow and policy-reporting route.
- Parent request inbox, case assignment and status management.
- Staff invitations and role management.
- Aggregated analytics, trends and public-data benchmarks.
- Surveys with consent and frequency controls.
- Subscription plan, invoices, payment history, renewal and cancellation.

### EduSetu operations console

- Institution creation, verification and ownership-claim queues.
- Evidence review and controlled evidence access.
- Content reports, moderation cases and appeals.
- Abuse, impersonation and urgent safety escalation.
- Subscription and payment reconciliation.
- Role administration, audit events and privacy requests.
- Job failures, system health and operational dashboards.

### MVP recommendation

Do not attempt every pillar in one launch. The recommended first usable release is a trustworthy, searchable institution directory with institution verification, public profiles, fair reviews, institution responses and moderation. Connect and commercial subscriptions follow only after the trust, identity and operating workflows are safe and stable.

The initial launch segment and geography are still unresolved. The developer should not silently decide whether the first release is schools only or also includes colleges / universities. This choice affects taxonomy, data model, review questions, discovery filters, sales and verification operations.

---

## 4. Roadmap and release gates

| Phase | Scope | Exit gate — what must be true before moving on |
|---|---|---|
| **0. Product validation and definition** | Confirm first market, institution segment and geography; interview parents and institution teams; validate review categories, verification evidence, Connect boundaries, price hypotheses, trust policies, name/domain/trademark and legal setup. | Founder-approved PRD, user journeys, policies, MVP scope, unresolved decision log, architecture and cost assumptions. |
| **1. Core platform** | Environments, CI, database, auth, roles, institution / campus model, directory, profiles, claims, verification, parent accounts, review submission, published review display, institution responses, reports and moderation. | A real end-to-end institution directory and review workflow works with tenant isolation, audit trail, moderation and production-like tests. |
| **2. EduSetu Connect** | Guardian-safe parent-to-institution inbox, support cases, staff assignment, announcements, notifications, surveys and interaction-level feedback. | Parent and institution can complete a structured request lifecycle safely; notification delivery and access control are tested. |
| **3. Commercial subscriptions** | Configurable plans and entitlements, checkout, subscription lifecycle, signed webhooks, invoices, cancellation, renewal, failed-payment handling and reconciliation. | Payment states and entitlements are server-authoritative, idempotent, reconciled and tested; billing support can resolve disputes. |
| **4. Analytics and comparison** | Rating trends, category summaries, response-time / resolution reports, comparisons, privacy-thresholded benchmarks, exports and scheduled reports. | Metrics are defined, reproducible and privacy-safe; benchmarks do not expose private family or competitor data. |
| **5. Scale and enterprise** | Multi-campus / group administration, measured search upgrades, SSO / integrations, improved fraud controls, localization, accessibility and deeper operational maturity. | Scale work is supported by measured demand, load tests, SLOs, security review and operating-cost evidence. |

Each phase needs an agreed statement of work, acceptance criteria, estimated effort, dependencies, owner, test evidence and release decision. Do not accept “page is finished” as a phase exit criterion.

---

## 5. Proposed technical architecture

The planning baseline is deliberately practical for a small team: a **modular monolith** first, with clear domain boundaries and a separate worker process where required. Avoid premature microservices.

### Proposed stack (subject to developer review)

| Layer | Proposed technology | Notes |
|---|---|---|
| Web frontend | Next.js + React + TypeScript | Public SEO pages and authenticated role-based dashboards. |
| UI / styling | Tailwind CSS + accessible component primitives (e.g. shadcn/ui / Radix) | Shared design system, responsive and keyboard accessible. |
| Forms / validation | React Hook Form + Zod; server-side DTO validation | Client validation improves UX; the server remains authoritative. |
| Frontend data | TanStack Query; generated OpenAPI TypeScript types | Keep API contracts aligned and avoid hand-maintained duplicate models. |
| Backend | NestJS + TypeScript | Modular REST API, domain services and authorization guards. |
| API contract | REST, versioned `/api/v1`, OpenAPI / Swagger | Contract-first or contract-generated client types. |
| Database | PostgreSQL | Primary system of record. |
| ORM / migrations | Prisma | Versioned migrations reviewed in source control. |
| Cache / jobs | Redis + BullMQ | Notifications, emails, reports, background work and distributed throttling. |
| File storage | Private S3-compatible object storage | Verification documents and permitted attachments; public and private media must be separated. |
| Authentication | Managed OIDC identity provider | Cognito was one candidate; compare cost, data processing, UX, MFA and recovery before selection. |
| Search | PostgreSQL full-text / trigram initially | Add a dedicated search service only when measured needs justify it. |
| Payments | Razorpay Subscriptions candidate for India | Must be validated with provider, adult/legal entity, finance and legal support before commitment. |
| Hosting | AWS was the proposed baseline | Mumbai region (`ap-south-1`) was suggested; verify service availability, total cost and data-processing terms. |
| Observability | Sentry + CloudWatch or equivalent | Centralized logs, metrics, tracing where appropriate, alerts and error tracking. |
| Delivery | GitHub Actions + Terraform | Automated tests, reviewed deployments and infrastructure as code. |

These are proposed choices, not contracts. The developer should produce a short architecture decision record for each major vendor choice, including monthly cost assumptions, lock-in, security, region and exit/migration path.

### Logical system layout

- `apps/web`: Next.js frontend.
- `apps/api`: NestJS REST API.
- `apps/worker`: background job runner (to be added when needed).
- PostgreSQL: transactional business data.
- Redis: queue backing, cache and distributed rate-limit state.
- Private object storage: verification evidence and controlled attachments.
- OIDC provider: authentication and account recovery.
- Payment provider: subscription collection and provider event delivery.
- Monitoring / secrets / backups / CDN / WAF: managed operational services.

### Backend domains to plan for

Identity and authentication; users; role / permission management; institutions; campuses; organization memberships; institution claims and verification; parent/student affiliation verification; reviews and rating methodology; institution responses; reporting and moderation; appeals; Connect conversations and cases; notifications; search; comparison; plans and entitlements; subscriptions, invoices, refunds and payment events; analytics; privacy requests and consent; audit logs; platform administration.

---

## 6. API requirements — what the developer needs to know

The API is the contract between the web application, backend, future mobile apps and any approved integrations. It must be designed as a stable product interface, not a collection of ad-hoc endpoints.

### Current API direction

- REST API under `/api/v1`.
- Swagger / OpenAPI documentation.
- OIDC bearer-token authentication foundation (currently disabled by default).
- Explicit request DTOs and validation.
- Backend authorization using database roles and organization memberships.
- Public endpoints return explicit public response DTOs only; do not serialize full ORM models.

### API surface present in the current source archive

The following route handlers are present in the generated source. **They have not been proven by a successful full build or integration test yet.**

| Method | Route | Intended access / purpose |
|---|---|---|
| GET | `/api/v1/health` | Public service / database readiness check. |
| GET | `/api/v1/institutions` | Public search of verified institutions. |
| GET | `/api/v1/institutions/:slug` | Public verified institution profile. |
| POST | `/api/v1/institutions/:institutionId/claims` | Authenticated institution ownership claim. |
| GET | `/api/v1/institutions/:institutionId/reviews` | Public published reviews. |
| POST | `/api/v1/institutions/:institutionId/reviews` | Authenticated review submission into moderation. |
| POST | `/api/v1/reviews/:reviewId/reports` | Authenticated review report. |
| POST | `/api/v1/institutions/:institutionId/reviews/:reviewId/response` | Authorized institution response. |
| GET | `/api/v1/moderation/reviews` | Moderator queue. |
| GET | `/api/v1/moderation/cases` | Moderator cases. |
| PATCH | `/api/v1/moderation/reviews/:reviewId/decision` | Moderator publish / reject / hide / restore action. |
| POST | `/api/v1/verification/institutions` | Verification officer creates pending institution record. |
| PATCH | `/api/v1/verification/institutions/:id/status` | Verification officer updates institution status. |
| GET | `/api/v1/verification/claims` | Verification claim queue. |
| PATCH | `/api/v1/verification/claims/:claimId/decision` | Claim approval / rejection. |
| GET | `/api/v1/users/me` | Authenticated current-user profile / provisioning. |

### API domains still required by the product plan

- `/auth/*`, `/users/*`, `/institutions/*`, `/campuses/*`
- `/verification/*`, `/relationships/*`, `/reviews/*`, `/moderation/*`
- `/conversations/*`, `/cases/*`, `/notifications/*`
- `/search/*`, `/compare/*`
- `/plans/*`, `/subscriptions/*`, `/invoices/*`, `/webhooks/payments/*`
- `/analytics/*`, `/privacy/*`, `/admin/*`

The final endpoint names and request / response schemas must be documented in OpenAPI and approved before frontend integration.

### API engineering standards

- Define pagination, filtering, sorting and maximum page sizes consistently.
- Use consistent error responses and HTTP status codes; never leak stack traces or internal database details.
- Validate every request on the server, including enums, lengths, IDs, file metadata and cross-field rules.
- Enforce authorization on every protected object (object-level / tenant-level authorization). A changed ID in a URL must never expose another institution's data.
- Use idempotency keys where clients may safely retry state-changing operations, especially billing and case creation.
- Rate-limit login, OTP, review submission, reports, uploads and high-risk operations; use a shared store when horizontally scaled.
- Add correlation / request IDs, structured logs, audit events and traceable state transitions.
- Keep API versioning and backward-compatibility policy explicit.
- Generate frontend API types from OpenAPI where possible; do not manually duplicate backend DTOs.
- Keep webhooks isolated from normal browser-session assumptions. Verify provider signatures against the raw request body, persist event IDs, handle duplicate and out-of-order events, and reconcile provider state.

---

## 7. Data model and integrity expectations

The initial schema already contains a useful foundation for users, roles, permissions, role assignments, institutions, campuses, organization memberships, institution claims, review categories, reviews, category scores, review revisions, institution responses, reports, moderation cases / actions, audit logs, plans, entitlements, subscriptions, payment events, invoices and refunds.

The production data design still needs review and extension for consent records, guardian relationships, student eligibility, affiliation evidence and retention, Connect threads / messages / cases, notification delivery, upload metadata, privacy requests, billing reconciliation, support operations and analytics aggregation.

### Data ownership principles

- PostgreSQL is the authoritative system of record for platform business state.
- Institution records, campuses and staff memberships are separate concepts.
- A user may belong to multiple institutions; every membership is scoped and revocable.
- Public reviewer identity must be separated from private verification evidence.
- Institutions must not see a reviewer's private identity merely because they subscribe.
- Student and guardian links must be explicit, purpose-limited and consent-aware.
- Analytics should be aggregated with minimum sample thresholds to reduce re-identification risk.
- Maintain revision history for sensitive and disputed user-generated content.
- Every moderation, verification, privileged access, billing and permission change should create an audit record.
- Apply retention and deletion rules by data category; do not retain evidence forever by default.

### Review integrity rules

- Publish the rating formula and category definitions.
- Display review count, date context and sample-size limitations next to aggregate ratings.
- Avoid presenting a tiny sample as a reliable ranking.
- Keep verified affiliation distinct from whether an opinion is factually proven.
- Do not silently erase older criticism; use transparent policy-based status / recency rules.
- An institution may respond and report alleged policy violations but cannot directly delete or edit a review.
- Independent moderators decide disputes under a published policy with documented appeal routes.
- Prevent duplicate / coordinated manipulation and staff self-review.

---

## 8. Security, privacy, child safety and legal readiness

This product handles user-generated reviews, institution claims, private messages / cases, identity evidence and potentially minors' personal data. Security and safety are core product requirements, not later polish.

### Minimum security engineering

- Threat model and abuse-case review before public launch.
- Managed authentication; secure account recovery; MFA for privileged institution and platform accounts.
- Backend RBAC with organization / campus scoping and object-level authorization tests.
- Secure cookies / session policy where applicable; CSRF protection for cookie-authenticated writes; appropriate CSP, HSTS, security headers and CORS allow-list.
- Rate limits and abuse controls; bot / spam protections proportionate to risk.
- Secrets manager; no production secrets in source control or frontend bundles.
- TLS in transit and managed encryption at rest; key rotation and restricted key access.
- Private evidence storage, signed short-lived access URLs, file type / size validation, malware scanning and access logging.
- Audit logs for privileged operations, moderation, verification, access grants, payment state and privacy requests.
- Dependency, secret and container scanning; patch management; security testing and independent assessment before launch.
- Backups, tested restore procedures, incident response and breach-response playbooks.

### Minors and guardian safeguards

- Age-aware onboarding and eligibility rules.
- Verifiable guardian consent where required by current law and the designed processing purpose.
- Guardian-mediated communication as the default for minors.
- No unrestricted private adult-to-minor messaging.
- Do not publicly display a minor's full name, contact information, class / section, timetable or other identifying details by default.
- Collect only data necessary for the feature; avoid exact date of birth, home address and unrelated personal details unless justified.
- Do not use behavioural advertising or sell children's data.
- Moderation and reporting for harassment, threats, personal information, bullying and impersonation.
- Clear safeguarding escalation route, moderator training, evidence access limits and retention policy.

### India legal and business review

The original plan identifies India's Digital Personal Data Protection Act, 2023 and DPDP Rules, 2025 as key starting points. The developer must not treat an engineering checklist as legal compliance. Before processing real users' data or launching publicly, obtain qualified Indian legal advice on current commencement / applicability, notices and consent, children's data, rights and grievances, retention, breach response, intermediary / user-generated-content duties, consumer and contract terms, subscriptions, GST / invoicing and other applicable requirements.

Check whether the name `EduSetu`, domain and relevant trademarks are available. Existing education-related uses of the name were noted in the planning document; formal IP clearance is required before significant brand investment.

**Founder / contracting note:** where the project owner is not legally able to sign binding agreements, an eligible adult and appropriate legal entity must handle vendor contracts, company / bank arrangements, payment-provider KYC and formal legal decisions with professional advice.

---

## 9. Payments and commercial SaaS requirements

Razorpay Subscriptions is the initial India-focused candidate, not an implemented integration or a final vendor decision.

The subscription model needs:

- Configurable plans, features, limits, billing intervals, trials and entitlement rules.
- Institution checkout and clear terms before purchase.
- Server-side subscription lifecycle state machine: pending, active, past due / grace, paused or halted where supported, cancellation, expiry and refund states.
- Raw-body webhook signature verification and provider event allow-list.
- Idempotent event processing, duplicate handling, out-of-order event handling, retries and reconciliation.
- Server-authoritative paid-feature entitlements. Never unlock paid features based only on a browser redirect or frontend success state.
- Invoices, payment history, renewal notices, failed-payment recovery, cancellation and refund process.
- Audit trail and billing-support tools.
- No storage of card numbers, CVV or raw payment credentials.
- Tax and invoice requirements validated with an Indian accountant / tax professional and payment provider.

Paid subscriptions must never influence public rating calculation, review publication decisions or organic ranking.

---

## 10. Deployment, operations and non-functional requirements

### Environments

- **Local:** synthetic test data and development credentials only.
- **Staging:** production-like setup with synthetic / anonymized data; used for acceptance testing.
- **Production:** restricted access, reviewed release process, monitoring, backups, incident ownership and documented rollback.

Never copy real student, parent, verification or payment data into an unprotected developer laptop or staging environment.

### Production infrastructure baseline

- DNS, TLS, CDN and WAF.
- Web frontend and API runtime with private networking where appropriate.
- PostgreSQL with backup / restore plan.
- Redis / background workers when queue workflows are activated.
- Private object storage and controlled media delivery.
- Secrets manager and key management.
- Centralized logs, metrics, alerts and application error reporting.
- CI/CD with approvals and rollback strategy.
- Terraform or another reviewed infrastructure-as-code approach.

### Quality attributes to define and measure

- Mobile-first performance on ordinary Indian mobile connections.
- Accessibility: keyboard navigation, semantic structure, labels, contrast and focus visibility.
- SEO for public institution pages; private dashboard routes should not be indexed.
- Reliability: health checks, retries, idempotency, safe degradation and recovery procedures.
- Maintainability: reviewed migrations, domain boundaries, API documentation, architecture decisions and automated tests.
- Scalability: paginate lists, avoid N+1 queries, cache carefully and use background jobs for heavy work.
- Observability: product and system metrics that help diagnose issues without exposing personal information.

The team should propose measurable service-level objectives, availability target, backup RPO / RTO, support hours and incident severity levels before launch. Do not invent targets without discussing budget and service criticality.

---

## 11. Testing and launch acceptance criteria

Testing must validate business rules and adversarial cases, not only whether pages render.

Required test layers:

1. Unit tests: rating calculations, permission evaluation, consent / eligibility rules, subscription state transitions and validation.
2. Database integration tests: institution claims, unique reviews, moderation transitions, memberships and tenant isolation.
3. API tests: authentication, authorization, pagination, validation, rate limits, errors and webhook handling.
4. End-to-end tests: parent signup, search, review submission, moderation, institution response, claim approval, Connect case lifecycle, subscription upgrade / renewal / cancellation.
5. Security tests: broken object-level authorization, cross-tenant access, privilege escalation, injection, XSS, CSRF, upload validation, webhook forgery and secret exposure.
6. Load tests: search, profiles, review lists, authentication bursts and expected peak events.
7. Recovery tests: restore database backups and recover billing / review records.
8. Moderation simulations: fake reviews, coordinated abuse, doxxing, threats, impersonation and unfair takedown demands.

### Minimum production go-live gate

- No unresolved critical / high severity security findings.
- Auth provider selected, configured and integration-tested.
- Tenant and object-level authorization verified by tests.
- Guardian / consent / student flows reviewed by qualified legal and child-safety specialists before any student feature is enabled.
- Review, verification, moderation, appeal and audit flows operational.
- Payment webhooks, reconciliation and entitlements tested before charging institutions.
- Privacy notice, terms, review policy, moderation policy, institution terms and grievance route approved by qualified counsel.
- Backup restore and incident-response drills completed.
- Monitoring, support ownership, rollback and release process documented.
- Founder / product owner has accepted the deployed build against agreed acceptance criteria.

---

## 12. Current work completed — honest status as of this handoff

The project is **past the idea-only stage**, because an initial written blueprint and code foundation exist. However, it is still at an early engineering-foundation stage. It is **not a finished MVP, not a verified working deployment and not production-ready**.

### A. Product / planning work completed

- A detailed product and architecture blueprint exists (1,037 lines), covering product vision, business model, roles, user journeys, frontend structure, backend domains, data model, API domain map, infrastructure, legal / child-safety considerations, review integrity, testing and phased roadmap.
- Core product principles and the no-paid-rating rule are documented.
- The principal launch decisions are listed but remain open: first institution segment / geography, student eligibility, verification evidence, moderation staffing, Connect boundaries, subscription pricing and legal / company setup.

### B. Backend foundation generated

The existing full-stack archive contains a NestJS / TypeScript modular-monolith API foundation and Prisma / PostgreSQL schema. The source includes:

- Core schema models for users, roles, permissions, institutions, campuses, claims, memberships, reviews, moderation and early billing records.
- Generic OIDC JWT validation foundation, intentionally disabled by default until a real provider is selected and configured.
- Database-backed global and institution-scoped role / permission foundation.
- Public institution search / profile and published review read handlers.
- Review submission into a pending moderation state, review reporting and institution response handlers.
- Moderation queue and decision handlers.
- Institution record / claim verification handlers.
- Request DTO validation, Swagger setup, health check, security headers, CORS allow-list and process-local rate limiting.
- Small DTO validation test suite in source.

### C. Frontend foundation generated

The archive includes a Next.js App Router / React / TypeScript / Tailwind frontend with page foundations for:

- Home / landing page.
- Institution directory and institution profile.
- Institution information / product page.
- Pricing concept page.
- Trust page.
- Sign-in configuration state.
- Parent, institution and admin workspace shells.

The frontend calls the current public institution / profile / published-review API routes where available. Protected workflows are not fully wired. Student review and messaging flows are intentionally not exposed in this foundation.

### D. What has NOT been completed or verified

- No successful full dependency installation, backend build, frontend build, lint run or end-to-end test result is recorded in the build notes.
- The earlier environment could not reach the npm registry (`EAI_AGAIN`); Docker was unavailable there, so PostgreSQL / Redis containers and Prisma migrations were not run.
- Current archive has no production identity-provider tenant, configured secrets or enabled authentication.
- No live payment checkout, signed webhook processing, reconciliation, invoice delivery or paid-entitlement enforcement.
- No guardian consent, student relationship verification, Connect inbox / cases or notification worker.
- No complete evidence upload / retention / appeals workflows.
- No production cloud deployment, Terraform, CI/CD, monitoring dashboards, backup restore drills or independent security testing.
- No legal review, trademark clearance, pricing validation or commercial launch approval is evidenced.
- The handoff archive does not include Git history / a remote repository; source control ownership and a proper private repository should be set up by the development team.

**Status in one sentence:** Product blueprint and partial frontend/backend scaffolding exist; the next developer must audit, install, validate, complete and harden them before this can be called a working product.

---

## 13. Immediate developer onboarding tasks

The first paid engineering milestone should be a short **technical audit and foundation-validation milestone**, not a promise to launch everything immediately.

1. Review the full product blueprint, current source archive, schema, routes and build notes.
2. Create or transfer the project into a private Git repository under the product owner's control; establish main / development branches, pull-request reviews and secret-handling rules.
3. Reproduce the project locally using the documented Node.js 22 / npm workspace setup; install dependencies and run Prisma format / validate / generate, migration, seed, API build, API tests, web lint and web build.
4. Produce a concise audit: build failures, code quality, missing modules, security concerns, schema issues, dependency risks and any architecture changes recommended.
5. Confirm the MVP segment and geography with the product owner before finalizing estimates.
6. Produce a milestone plan with deliverables, acceptance criteria, dependencies, estimates, budget, staffing assumptions and ongoing operating costs.
7. Do not enable real authentication, real personal data, public student features or live payments until the relevant design and legal / operational gates are complete.

### Expected first developer deliverables

- Working local development setup and reproducible runbook.
- Build / lint / test report with actual command output.
- Code and architecture audit.
- Approved MVP PRD and page / workflow inventory.
- Updated architecture diagram and decision records.
- Database ERD, migrations strategy and data ownership / retention matrix.
- OpenAPI contract and role / permission matrix.
- Threat model, abuse-case assessment and child-safety / privacy action plan.
- Milestone-level estimate, delivery plan and cost assumptions.

---

## 14. Decisions the product owner must approve

Do not silently choose these on behalf of the product owner:

1. First launch geography and institution segment.
2. Whether launch covers schools only or also colleges / universities.
3. Who can review: parent / guardian, current student, alumni; minimum age and exact guardian workflow.
4. How affiliation is verified, what evidence is accepted and how long it is retained.
5. Public reviewer display name / pseudonym policy.
6. Review categories, score calculation, minimum sample thresholds and recency rules.
7. Connect request categories, service hours, escalation and response expectations.
8. Moderation team ownership, turnaround targets, appeal policy and emergency escalation.
9. Subscription plans, prices, features, trial, billing interval and refund rules.
10. Payment provider, hosting provider, email / SMS providers and data-processing terms.
11. Final legal entity, adult authorized signatory, privacy contact / grievance owner and contract ownership.
12. Brand clearance, domain choice and trademark strategy.

---

## 15. Commercial working expectations

The developer / agency should be engaged through a written scope of work. Agree on the deliverables, timeline, payment milestones, acceptance criteria, support period, defect warranty, change-request process and what happens if a milestone fails.

The product owner should retain control of the source repository, domain, cloud account, database account, authentication tenant, payment-provider account, email provider and production secrets. Developers should receive role-limited access, not personal ownership of critical infrastructure. Every production secret and vendor account must have a documented owner and recovery path.

The engagement should clarify source-code ownership / IP assignment, use of third-party and open-source dependencies, confidentiality, subcontractors, documentation, deployment responsibility, backups, incident response, maintenance pricing and exit / handover assistance. Do not let a single contractor become the only person who can deploy or recover the platform.

Require a staging review before production. Require written release notes and test evidence for each milestone. Feature-complete is not the same as secure, legally reviewed or launch-ready.

---

## 16. Source and existing handoff files

The developer should receive and review these files together:

- `edusetu_product_and_backend_plan(1).md` — the original detailed product and architecture blueprint.
- `edusetu_fullstack_foundation.zip` — current combined API + frontend source foundation.
- `edusetu_backend_foundation.zip` — backend foundation archive.
- `edusetu_frontend_source.zip` — frontend source archive.
- `README.md` and `BUILD_NOTES.md` inside the full-stack archive — setup guidance, current route summary, limitations and recorded verification status.

The detailed product blueprint is the source for product intent. This handoff brief summarizes it for a developer and adds a current-status / engineering-engagement view. Where this brief marks a choice as open, the developer must obtain product-owner approval instead of assuming it is settled.

---

## Final instruction to the developer

Treat EduSetu as a commercial platform. Build privacy, security, fair reviews, safe communication and reliability in from day one. Prove critical workflows with tests; never fake integrations or claim unfinished work is production-ready.
