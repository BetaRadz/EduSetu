# EDUSETU — Product, Frontend & Backend Architecture Plan

**Working name:** edusetu  
**Name meaning:** *Setu* means bridge — EduSetu is the bridge between educational institutions, parents, and students.  
**Document type:** Product and technical planning blueprint  
**Planning status:** Pre-development — no implementation code has been written or approved  
**Initial market assumption:** India, with support for schools, colleges, and universities  
**Architecture principle:** Commercial-grade foundations, a manageable first release, and a clear path to scale

---

## 1. Executive vision

EduSetu is a two-sided education reputation and relationship platform. It helps parents and students discover, understand, review, and compare educational institutions. It also gives schools, colleges, and universities a verified space to understand feedback, respond transparently, and build stronger relationships with their communities.

EduSetu is **not** a school ERP, admission agency, or simple review directory. Its primary purpose is to create a trusted bridge between the people who experience education and the institutions that provide it.

### The three main participant groups

1. **Parents and guardians** — discover institutions, compare options, share experiences, ask questions, and communicate with an institution.
2. **Students** — share age-appropriate experiences, discover useful institution information, and participate in permitted feedback and communication features.
3. **Institutions** — claim and maintain official profiles, respond to reviews, understand aggregated feedback, communicate with parents, and subscribe to professional tools.

A fourth role is required to operate the platform safely:

4. **EduSetu platform team** — verify institutions, moderate content, resolve disputes, manage subscriptions, investigate abuse, and maintain platform quality.

### Product promise

> Real experiences. Transparent institutions. Stronger education relationships.

### Non-negotiable trust principle

An institution may pay for software, analytics, communication tools, and additional administrative capabilities. It must **never** be able to buy a higher rating, remove valid criticism, suppress negative reviews, manipulate organic rankings, or identify a reviewer whose identity is meant to remain private.

---

## 2. Product positioning and business model

EduSetu should be a **freemium community platform with a subscription-based institution SaaS layer**.

### Free community access

Parents and students should be able to:

- Search for institutions and view public profiles.
- Read public reviews and rating breakdowns.
- Compare institutions using transparent, consistently calculated metrics.
- Submit eligible reviews and update their own reviews under a clear policy.
- Report suspicious, abusive, or inaccurate content.
- Use the basic parent-to-institution connection channel, subject to account verification and fair-use limits.

Do not charge users to submit a positive review or make negative reviews harder to submit. Do not reward users for giving a particular rating.

### Institution subscription model

Institutions can claim a free basic profile and subscribe to additional capabilities. Exact prices, billing periods, taxes, and plan limits are business decisions to be validated later.

| Plan concept | Intended customer | Potential capabilities |
|---|---|---|
| **Verified Basic** | Individual school or college | Claim profile, verify official details, respond to public reviews, basic profile management |
| **Growth** | Institutions actively managing parent relationships | Enhanced analytics, review trends, parent communication inbox, response-time reporting, feedback surveys, team members |
| **Institution Pro** | Larger schools and colleges | Advanced reports, multiple staff roles, exports, configurable communication workflows, more campuses or departments |
| **Network / University** | Multi-campus institutions and education groups | Multi-campus management, central reporting, delegated campus admins, organization-level analytics, SSO/API options, priority support and negotiated service terms |

Plan names and feature limits are provisional. Do not lock product entitlements to hard-coded UI conditions. Store plans and entitlements in the database so they can be changed without redeploying the application.

### What subscriptions may unlock

- Institution profile management and verified ownership badge.
- Public review-response tools.
- Private parent relationship inbox and case management.
- Aggregated sentiment and category-level analytics.
- Review and communication trends over time.
- Institution benchmarking against comparable public data.
- Multi-campus and multi-user administration.
- Custom reports, exports, integrations, and support levels.

### What subscriptions must never unlock

- Rating boosts or paid placement disguised as organic ranking.
- Review deletion without a policy-based moderation decision.
- Access to a reviewer's private identity or private verification evidence.
- Competitor institutions' private dashboards or confidential metrics.
- The ability to block parents from publishing legitimate feedback.

If sponsored placement is considered later, it must be visibly labelled as advertising and kept separate from organic ratings and search ranking.

---

## 3. The two-way relationship model

The platform should support two-way feedback, but it must not create public reputation scores for individual parents or children. Publicly scoring families could encourage retaliation, discrimination, or the misuse of children's information.

The safer and more useful model is **institution reviews plus interaction-level mutual feedback**:

- A parent or eligible student reviews the institution's overall experience.
- The institution may publish a professional response to that review without being able to change its rating.
- A parent can contact the institution through a verified relationship thread or support request.
- After a support interaction is closed, the parent can rate the institution's response, clarity, and resolution.
- Institution staff may privately record structured feedback about the quality of that specific interaction, such as whether the request was clear or whether the issue was resolved. This must not become a public parent score, a family reputation profile, or a tool for penalising a parent or student.
- Institution management sees aggregated interaction patterns, not an individual family's public reputation score.

### Connection features

- Parent-to-institution inbox.
- Categorised requests: admissions, facilities, academics, safety, transport, fees, general feedback, and other institution-defined topics.
- Conversation status: open, awaiting institution, awaiting parent, resolved, closed, escalated.
- Appointment or callback requests.
- Announcements and event updates from verified institutions.
- Parent satisfaction survey after a resolved request.
- Optional institution-wide surveys with anonymous aggregate results.
- Notification preferences and communication history.

For users under 18, direct communication should be guardian-mediated by default. Do not create unrestricted private messaging between unknown adults and minors. Any future student communication feature requires a separate child-safety design and legal review.

---

## 4. Account types, roles, and permissions

A single user account may have more than one role. For example, a parent could also be an employee of an institution. Access should be based on explicit role and organization membership, not on a single global `isAdmin` flag.

| Role | Main permissions |
|---|---|
| Visitor | Search and view public information |
| Parent / Guardian | Manage own account, verify relationship where needed, submit reviews, connect with institutions, manage consent and privacy |
| Student | Use permitted student features, submit eligible feedback with required safeguards, manage own permitted content |
| Institution Owner | Manage the claimed institution, billing, staff access, and subscription |
| Institution Admin | Manage profile, reviews, responses, communication, and analytics according to granted permissions |
| Institution Staff | Access only assigned communication or profile functions |
| Campus Admin | Manage the assigned campus, not the entire university network unless separately authorized |
| Moderator | Review reports, handle content moderation, request evidence, and record decisions |
| Verification Officer | Review institution and relationship verification cases |
| Billing Support | View billing and subscription records, not private review verification evidence |
| Platform Super Admin | Manage platform configuration and privileged operations with strong audit logging |

### Permission rules

- Apply role-based access control (RBAC), with organization-scoped permissions.
- Enforce authorization on the backend for every protected request.
- A user must never access another institution's private records by changing an ID in a URL or API request.
- Institution employees can access only the institution and campuses to which they are assigned.
- Privileged support access should be time-limited, reason-coded, and audited.
- Platform administrators should not casually browse private messages or identity evidence.

---

## 5. Frontend product structure

The frontend should be responsive, accessible, fast, and consistent. Public institution pages need search-engine visibility; authenticated dashboards need clear role-based navigation.

### A. Public website

**Homepage**

- Clear EduSetu positioning and trust statement.
- Prominent institution search: name, city, locality, institution type, board, or course category.
- Search suggestions and filters.
- Featured or highly reviewed institutions, with transparent ranking labels.
- Recent parent and student experiences.
- How reviews and verification work.
- Parent, student, and institution entry points.
- Institution claim / list-your-institution call to action.
- Pricing link for institutions.
- Trust, moderation, privacy, and review-policy links.

**Search and discovery**

- Search results with institution name, type, location, key attributes, rating, and review count.
- Filters: school / college / university, board or affiliation, location, institution category, facilities, fee range where publicly verified, and other relevant attributes.
- Sort by relevance, review count, rating (with sample-size warning), and distance only when location permission is explicitly granted.
- Clear distinction between organic results and any future sponsored placements.

**Institution profile page**

- Official name, institution type, location, website, and affiliation details where verified.
- Claimed / verified status and date of last verification.
- Description and public facilities information.
- Overall rating with sample size and last-updated label.
- Category rating breakdown: teaching and learning, communication, facilities, safety and wellbeing, administration, student support, transparency, and value.
- Review history with date ranges and recency indicators.
- Parent and student review filters, subject to consent and privacy rules.
- Institution responses.
- Public announcements and contact options.
- Report profile or review action.

**Comparison page**

- Select two or more institutions.
- Compare the same categories and definitions side by side.
- Display sample sizes, review dates, and data limitations.
- Do not present a small review sample as a reliable ranking.
- Compare only public or properly aggregated information; never reveal a competitor's paid dashboard data.

**Other public pages**

- About EduSetu.
- How ratings work.
- Review and moderation policy.
- Institution verification policy.
- Pricing.
- Help centre and contact.
- Privacy policy, terms, cookie notice where applicable, and grievance / complaint route.

### B. Parent and guardian portal

- Parent dashboard with followed institutions and recent updates.
- Submitted reviews and edit history.
- Institution connections and support requests.
- Conversation inbox and status tracking.
- Surveys and interaction feedback.
- Saved institutions and comparison lists.
- Linked child/student relationship management only when necessary and appropriately consented.
- Notification preferences.
- Account security, consent history, privacy requests, and account deletion request.

### C. Student portal

- Age-appropriate dashboard.
- Institution discovery and public information.
- Permitted student experience/review features.
- Clear privacy and reporting controls.
- Guardian consent status and guardian-mediated communication where required.
- No behavioural advertising, manipulative engagement loops, or unnecessary collection of student data.

### D. Institution dashboard

- Overview of public profile health and current rating information.
- Review feed, filters, and professional response workflow.
- Parent communication inbox and request/case management.
- Public profile editor with change review for sensitive official fields.
- Institution staff and role management.
- Aggregated feedback analytics and trends.
- Comparison against comparable public benchmarks.
- Surveys and feedback campaigns with consent and frequency limits.
- Subscription plan, invoices, payment history, renewal and cancellation controls.
- Help centre and support tickets.

### E. EduSetu administration console

- Institution verification queue.
- Institution ownership / claim review.
- Content moderation queue.
- User reports and appeals.
- Suspected fake-review and spam signals.
- Abuse and safety cases.
- Subscription and payment reconciliation view.
- Role and permission administration.
- Data privacy requests and consent audit.
- System health, job failures, and audit events.
- Configurable categories, plans, entitlements, and platform policies.

---

## 6. Recommended technology stack

The stack below is a proposed baseline, not a commitment to use every service on day one. The priority is reliable managed infrastructure, clear separation of responsibilities, and a path to scale without prematurely creating many independent services.

### Frontend

| Area | Recommended tool | Purpose |
|---|---|---|
| Web application | **Next.js + React + TypeScript** | Public SEO pages, server rendering, dashboards, reusable components |
| Styling | **Tailwind CSS** | Consistent responsive design system |
| UI components | **shadcn/ui + Radix UI** | Accessible dialogs, menus, forms, dropdowns, tabs, and dashboard primitives |
| Forms | **React Hook Form + Zod** | Form state and client-side schema validation; server validation remains mandatory |
| Server-state fetching | **TanStack Query** | Cache and synchronize API data in interactive dashboards |
| Charts | **Recharts** | Institution analytics and comparison visuals |
| Client-side local state | React state; Zustand only if a real shared-state need appears | Avoid unnecessary state-management complexity |
| API types | OpenAPI-generated TypeScript types | Keep frontend and backend contracts aligned |

### Backend

| Area | Recommended tool | Purpose |
|---|---|---|
| Backend framework | **NestJS + TypeScript** | Structured, modular API with dependency injection and clear domain boundaries |
| API style | **REST API, versioned `/api/v1`** | Predictable contracts for web, mobile, and future integrations |
| API documentation | **OpenAPI / Swagger** | Published API contract and developer documentation |
| ORM / database access | **Prisma** | Typed database access and migrations for PostgreSQL |
| Validation | DTO validation plus shared schemas where practical | Validate every incoming request on the server |
| Background jobs | **BullMQ** | Email, notifications, report generation, moderation tasks, and billing reconciliation |
| Realtime updates | WebSockets or server-sent events when needed | New messages, inbox status, and notifications; not required for the first public directory release |

### Data and infrastructure

| Area | Recommended tool | Purpose |
|---|---|---|
| Primary database | **PostgreSQL on AWS RDS** | Users, institutions, reviews, memberships, billing records, consent, and audit data |
| Cache / queue backing | **Redis / Amazon ElastiCache** | Rate limiting, short-lived cache, and job queue support |
| File storage | **Amazon S3** | Institution documents, profile images, and permitted attachments |
| Media delivery | **Amazon CloudFront** | CDN delivery for public images and assets |
| Initial search | PostgreSQL full-text search and trigram indexes | Institution and review search without adding another database too early |
| Later search option | OpenSearch, only when measured search needs justify it | Larger-scale faceted discovery and relevance tuning |
| Authentication | **Amazon Cognito** or another managed OIDC identity provider selected after a cost, UX, and data-processing review | Managed sign-in, email/phone verification, and stronger institution/admin authentication |
| Email | Amazon SES or an established transactional email provider | Verification, notifications, invoices, and support messages |
| SMS / OTP | An approved provider selected after delivery, price, and regulatory checks | Phone verification and essential alerts; avoid using SMS as the only security factor for privileged users |
| Payments | **Razorpay Subscriptions** as the initial India-focused candidate | Institution recurring subscriptions and payment collection |
| Error monitoring | Sentry | Frontend and backend error visibility |
| Infrastructure monitoring | AWS CloudWatch | Logs, metrics, alarms, and service health |
| Infrastructure as code | **Terraform** | Reproducible cloud infrastructure |
| CI/CD | **GitHub Actions** | Automated checks and controlled deployments |

### Why a modular monolith first

Start with one NestJS backend application divided into strong domain modules and one background worker process. This is a better first commercial architecture than immediately creating many microservices.

Benefits:

- Easier deployment and debugging for a small team.
- Transactions across reviews, subscriptions, and institution memberships remain manageable.
- Clear module boundaries make later extraction possible.
- Fewer services, secrets, networks, queues, and failure modes to operate.

Do not split into microservices until traffic, team ownership, deployment independence, or reliability requirements provide a measurable reason.

---

## 7. Backend modules and responsibilities

The backend should be organized around business domains. Each module owns its rules, validation, permissions, and data operations.

### 1. Identity and authentication module

- Registration and login.
- Email and phone verification.
- Password reset or secure passwordless flow.
- Session and token lifecycle.
- MFA for institution owners, staff, moderators, and platform administrators.
- Suspicious login detection and session revocation.

### 2. User and profile module

- Basic account profile.
- Account preferences and notification settings.
- Parent, guardian, or student profile type where necessary.
- Consent and privacy settings.
- Account export and deletion request workflow.

### 3. Institution directory module

- Institution records and type classifications.
- Institution groups and parent organizations.
- Campuses and departments.
- Public profile and searchable attributes.
- Institution lifecycle status: draft, pending verification, verified, suspended, archived.

### 4. Institution claim and verification module

- Claim request submission.
- Official email/domain verification where available.
- Evidence/document review workflow.
- Human verification for unclear or high-risk claims.
- Ownership transfer and staff authorization.
- Periodic re-verification and audit history.

### 5. Relationship verification module

- Parent/guardian-to-institution relationship request.
- Institution-issued invite or verification code.
- Optional document-based review where genuinely necessary.
- Verification outcome and evidence-retention policy.
- Guardian-to-student association, with age and consent safeguards.

Do not store raw identity or school documents indefinitely. Limit who can access evidence, encrypt it, record access, and delete it according to a documented retention schedule once it is no longer needed.

### 6. Reviews and ratings module

- Review submission and editing.
- Category ratings and written feedback.
- Review eligibility and one-account abuse controls.
- Verified affiliation indicator, separately from the review's subjective content.
- Review history and revision records.
- Institution response workflow.
- Public aggregate rating calculation.
- Recency and minimum-sample rules.

### 7. Moderation and trust module

- User reports.
- Automated spam and abuse signals.
- Human moderation queue.
- Policy-based content decisions.
- Reviewer and institution appeals.
- Evidence and reason codes.
- Transparent moderation event history.

A review should not be removed merely because an institution dislikes its rating. Moderators should distinguish policy violations from negative opinions and maintain a documented appeal path.

### 8. Parent–institution Connect module

- Verified contact threads.
- Support requests and categories.
- Assignment to institution staff.
- Internal notes, separate from parent-visible messages.
- Status changes and resolution tracking.
- Interaction-level feedback.
- Escalation and closure.

### 9. Notifications module

- Email and in-app notifications.
- SMS only for essential or explicitly opted-in events.
- Notification preferences and frequency controls.
- Queue-based delivery and retry handling.
- Delivery status and failure tracking.

### 10. Search and comparison module

- Institution search and filtering.
- Search suggestions.
- Comparison sets.
- Comparable-institution rules.
- Public ranking and sorting logic.
- Minimum review-count and confidence labels.

### 11. Subscription and billing module

- Plan catalogue.
- Entitlement definitions.
- Trial rules, if offered.
- Subscription lifecycle.
- Payment records and provider references.
- Invoices and tax details.
- Renewal, cancellation, pause, failed payment, and grace-period states.
- Refund and dispute records where supported.
- Reconciliation jobs and billing audit history.

### 12. Analytics module

- Rating trends.
- Category-level sentiment and score trends.
- Institution response and resolution metrics.
- Parent feedback summaries.
- Comparable public benchmarks.
- Aggregation and privacy thresholds.

Analytics must not expose identifiable family-level behaviour or reveal small groups through filters. Use minimum cohort thresholds and aggregation safeguards.

### 13. Audit and platform administration module

- Privileged action logs.
- Policy and configuration changes.
- Moderation and verification decisions.
- Subscription entitlement changes.
- Admin access history.
- Incident investigation support.

---

## 8. Database architecture

Use PostgreSQL as the system of record. Design a relational model with explicit foreign keys, unique constraints, indexes, transaction boundaries, and soft-delete or retention rules only where justified.

### Main entity groups

**Identity and access**

- `users`
- `user_profiles`
- `auth_identities` or managed identity-provider references
- `sessions` (only if application-managed session tracking is needed)
- `roles`
- `permissions`
- `user_role_assignments`
- `organization_memberships`

**Institutions**

- `institutions`
- `institution_groups`
- `campuses`
- `institution_affiliations`
- `institution_claims`
- `institution_verifications`
- `institution_profile_revisions`

**Parent and student relationships**

- `guardian_student_links`
- `institution_relationships`
- `relationship_verification_events`
- `consent_records`

**Reviews and trust**

- `reviews`
- `review_categories`
- `review_category_scores`
- `review_revisions`
- `institution_responses`
- `review_reports`
- `moderation_cases`
- `moderation_actions`
- `appeals`

**Connect and communication**

- `conversation_threads`
- `conversation_participants`
- `messages`
- `support_cases`
- `case_events`
- `interaction_feedback`
- `announcements`
- `notifications`
- `notification_deliveries`

**Commercial and billing**

- `plans`
- `plan_entitlements`
- `subscriptions`
- `subscription_items` where needed
- `payment_events`
- `invoices`
- `refunds`
- `webhook_events`

**Platform operations**

- `file_assets`
- `audit_logs`
- `privacy_requests`
- `data_retention_jobs`
- `analytics_snapshots`
- `feature_flags`

### Important data rules

- Store provider payment IDs and statuses; do not store card numbers or CVV.
- Keep identity verification evidence separate from public profile and review data.
- Use random, non-guessable public identifiers where exposing sequential database IDs would create risk.
- Add unique constraints for relationships such as a user's active review eligibility, and enforce review rules in backend business logic.
- Store UTC timestamps; display them in the user's local time zone.
- Record consent version, purpose, timestamp, and withdrawal status.
- Record review revisions and moderation decisions rather than silently overwriting history.
- Separate public profile fields from private operational fields.
- Use database migrations with review and rollback procedures.
- Define backup, restore, retention, archival, and deletion procedures before launch.

---

## 9. Payment and subscription architecture

Razorpay Subscriptions is the recommended first provider to evaluate for India-based institutional recurring billing. Its documentation includes APIs for plan creation, subscription creation, subscription updates, cancellation, pausing, resuming, and invoice retrieval. Provider capabilities, recurring payment methods, merchant eligibility, fees, and current rules must be confirmed during onboarding.

### Required payment flow

1. Institution owner selects a plan in the EduSetu dashboard.
2. The backend checks the institution's permissions and current subscription state.
3. The backend creates or retrieves the provider-side plan/subscription using secret credentials.
4. The frontend receives only the checkout information it needs.
5. The institution completes payment authorization through the provider's secure checkout.
6. The payment provider sends a signed webhook to EduSetu.
7. The backend verifies the webhook signature using the raw request body and configured secret.
8. The backend stores the event and processes it idempotently, so retries do not duplicate subscription changes.
9. EduSetu fetches or verifies the provider-side subscription/payment state when required.
10. The subscription module updates status and entitlements only after a trusted server-side confirmation.
11. The institution dashboard displays the confirmed plan and invoice status.

### Billing states to support

- Pending checkout.
- Pending authorization.
- Active.
- Payment due / past due.
- Grace period.
- Halted or failed renewal.
- Paused.
- Cancelled at period end.
- Cancelled.
- Expired.
- Refund pending / refunded, where applicable.

### Payment safety requirements

- Never activate a paid entitlement only because the browser says payment succeeded.
- Verify webhook signatures.
- Store provider event IDs and enforce idempotency.
- Handle duplicate, delayed, and out-of-order webhook events.
- Run scheduled reconciliation against provider records.
- Keep payment provider secrets only in a managed secrets store.
- Maintain clear cancellation, renewal, refund, invoice, and customer-support flows.
- Make plan entitlement checks server-side on every paid action.
- Keep an auditable record of subscription changes.
- Display the applicable amount, billing interval, taxes, renewal terms, and cancellation terms before checkout.

Do not announce exact subscription prices until provider fees, tax treatment, support cost, institution willingness to pay, and plan limits have been researched.

---

## 10. Security architecture

Security is a system requirement, not a final development task. Build it into architecture, acceptance criteria, and deployment from the beginning.

### Authentication and sessions

- Use a managed identity provider where practical.
- Require MFA for privileged accounts and institution administrators.
- Use secure, HttpOnly, SameSite cookies for browser sessions where applicable.
- Rotate and revoke sessions safely.
- Rate-limit login, OTP, password-reset, and verification attempts.
- Avoid revealing whether an email address or phone number already has an account.

### Authorization

- Enforce RBAC and organization scoping on the server.
- Apply object-level authorization on every resource access.
- Use least privilege for staff and support roles.
- Prevent mass assignment and property-level data exposure.
- Protect admin routes with stronger authentication and audit trails.

### Application and API security

- Validate all requests on the server.
- Use parameterized database access through the ORM.
- Apply output encoding and safe rendering to user-generated content.
- Add CSRF protection for cookie-authenticated state changes.
- Configure Content Security Policy and security headers.
- Apply CORS only to the required trusted origins.
- Rate-limit sensitive actions and expensive search or reporting routes.
- Validate uploaded files by type, size, and content; scan attachments before making them available.
- Protect against SQL injection, XSS, CSRF, SSRF, IDOR/BOLA, broken authentication, and abuse of sensitive business flows.
- Keep an inventory of API routes and versions.

### Infrastructure security

- Separate development, staging, and production environments.
- Use private networking for the database and Redis.
- Encrypt data in transit and at rest.
- Use KMS-backed key management and a managed secrets store.
- Use WAF and DDoS protections appropriate to expected traffic.
- Restrict cloud IAM permissions and rotate credentials.
- Patch dependencies and container images.
- Back up databases automatically and test restoration.
- Keep security logs, audit logs, and alerts.

### Review platform abuse controls

- Rate limits for review submission, reports, signups, and institution claims.
- Detection for duplicate text, coordinated rating bursts, suspicious account creation, and conflicts of interest.
- Do not automatically treat a negative review as fraudulent.
- Keep moderation decisions explainable and appealable.
- Prevent institution staff from reviewing their own institution as ordinary users without clear disclosure and policy controls.
- Prevent paid institutions from accessing private reviewer identity data.

### Security assurance

Use OWASP ASVS as a verification checklist and OWASP API Security Top 10 as a threat-model input. Before a real public launch, complete independent security testing appropriate to the data and platform risk. A security audit is not a substitute for fixing issues and retesting.

---

## 11. Privacy, child safety, and legal readiness

EduSetu may process personal information about parents, guardians, and students, including minors. Privacy and safety must therefore shape registration, reviews, messaging, analytics, and marketing.

### India-focused privacy planning

The Digital Personal Data Protection Act, 2023 and the DPDP Rules, 2025 are central legal references for an India launch. The Rules were notified in November 2025 and use a phased commencement schedule. The Act defines a child as someone who has not completed 18 years and includes requirements around verifiable parental consent for processing a child's personal data, as well as restrictions relating to detrimental processing, tracking/behavioural monitoring, and targeted advertising to children. The platform should be designed for these safeguards from the start, rather than waiting for a compliance deadline.

Before launch, obtain qualified Indian legal advice on the then-current commencement dates, applicable exemptions, notice and consent language, retention, user rights, breach response, grievance handling, and whether any obligations under the IT Act / IT Rules or other laws apply to a user-generated review platform.

### Child and student protections

- Apply an age-aware onboarding flow.
- Obtain verifiable parent or guardian consent where required before processing a minor's personal data.
- Do not use behavioural advertising or tracking-based marketing for children.
- Do not collect exact date of birth, home address, personal schedules, or other details unless genuinely required.
- Do not show a minor's full name, contact details, class/section, or other identifying details on public reviews by default.
- Use pseudonymous public display names where appropriate while keeping private verification separate.
- Provide guardian-mediated communication as the default for minors.
- Provide clear report, block, and safety escalation pathways.
- Moderate threats, harassment, personal information, bullying, and identifying details before publication.
- Do not allow institutions to identify anonymous reviewers through paid tools or analytics filters.
- Do not sell children's personal data or use it for unrelated marketing.

The DPDP Act and Rules contain specific provisions and schedules that need legal interpretation in context. Do not assume that an exemption available to an educational institution automatically applies to EduSetu as a third-party platform.

### Privacy-by-design requirements

- Collect the minimum data needed for each feature.
- State each purpose clearly at the point of collection.
- Keep consent records with version, purpose, time, and withdrawal status.
- Provide access, correction, grievance, and deletion request workflows as required by applicable law.
- Define retention schedules for account data, messages, verification evidence, reviews, payment records, and audit logs.
- Use aggregation thresholds in analytics to reduce re-identification risk.
- Maintain a vendor/subprocessor register and review data processing terms.
- Publish a clear privacy contact and grievance route.
- Prepare a personal data breach response procedure.

This section is a product and engineering checklist, not legal advice or a claim of compliance.

---

## 12. Review integrity and rating methodology

A review platform is only valuable when users can trust its ratings. Rating rules should be public, understandable, and applied consistently.

### Review format

A review can include:

- Overall experience rating.
- Category ratings.
- Written description of the experience.
- Experience period or academic year, without unnecessarily exposing student details.
- Parent or student perspective label, subject to consent and privacy rules.
- Verified affiliation indicator, when evidence supports it.

### Verification language

Use careful labels:

- **Verified institution:** the institution's identity or authorized representative has been checked.
- **Verified affiliation:** the reviewer has met EduSetu's evidence standard for a relationship with the institution.
- **Review:** a user's reported experience and opinion.

Verification of affiliation does not mean that EduSetu has independently proven every statement in the review.

### Rating policy

- Publish the rating calculation and category definitions.
- Show the number of reviews beside every aggregate rating.
- Show when ratings were last updated.
- Use a minimum sample threshold before highlighting a rating as a reliable comparative signal.
- Consider recency, but do not silently erase older reviews.
- Prevent one account from repeatedly inflating or lowering an institution's score.
- Preserve edit history and indicate when a review has been updated.
- Clearly separate verified affiliation from positive/negative sentiment.
- Do not let subscriptions affect calculation or ordering.

### Institution response and dispute policy

Institutions can respond professionally and report content they believe violates a published policy. They cannot remove a review directly. EduSetu moderators decide whether content violates policy, and both the institution and reviewer should have a documented appeal route.

---

## 13. API domain map

The API should be versioned and organized by domain. The following is a planning map, not a finalized endpoint contract.

| Domain | Example route family | Main consumers |
|---|---|---|
| Authentication | `/api/v1/auth/*` | All account types |
| Users | `/api/v1/users/*` | Parents, students, staff |
| Institutions | `/api/v1/institutions/*` | Public site, institution dashboard |
| Campuses | `/api/v1/campuses/*` | Institution admins |
| Claims and verification | `/api/v1/verification/*` | Institutions, verification team |
| Relationships | `/api/v1/relationships/*` | Parents/guardians, institutions |
| Reviews | `/api/v1/reviews/*` | Public site, parents, students |
| Responses | `/api/v1/reviews/*/responses` | Institution users |
| Moderation | `/api/v1/moderation/*` | Moderators and platform admins |
| Connect | `/api/v1/conversations/*`, `/api/v1/cases/*` | Parents and institution staff |
| Notifications | `/api/v1/notifications/*` | All account types |
| Search | `/api/v1/search/*` | Public site |
| Comparison | `/api/v1/compare/*` | Public site, dashboards |
| Plans and billing | `/api/v1/plans/*`, `/api/v1/subscriptions/*` | Institution owners |
| Payment webhooks | `/api/v1/webhooks/payments/*` | Payment provider only |
| Analytics | `/api/v1/analytics/*` | Institution admins, platform admins |
| Privacy requests | `/api/v1/privacy/*` | Account owners and compliance team |
| Administration | `/api/v1/admin/*` | Authorized platform team |

Public API responses should use explicit response DTOs. Never return entire database records or private relationships by default.

---

## 14. Deployment and operations architecture

### Proposed production cloud layout

Use AWS as the initial infrastructure candidate, with the primary application environment in the Mumbai region (`ap-south-1`) where service availability and subprocessor terms permit. This is an operational choice, not a claim that every data type is legally required to remain in India.

**Public edge**

- DNS and TLS.
- CloudFront CDN.
- AWS WAF and rate-limiting protections.

**Application layer**

- Next.js web application container or supported managed hosting configuration.
- NestJS API container on ECS Fargate.
- Separate background worker process for queued jobs.
- Load balancer and private service networking.

**Data layer**

- Amazon RDS PostgreSQL.
- Amazon ElastiCache Redis.
- Private S3 buckets for uploads and verification evidence.
- CloudFront for approved public media only.

**Operations**

- CloudWatch logs, metrics, and alarms.
- Sentry for application errors.
- AWS Secrets Manager and KMS.
- Automated database backups and recovery tests.
- Terraform-managed infrastructure.
- GitHub Actions deployment pipeline.

The final hosting choice should be costed against expected user volume and team operations. A lower-cost managed launch environment may be appropriate for a closed pilot, provided private data, backups, secrets, access control, and migration plans remain sound.

### Environments

- **Local development:** isolated test data and development credentials.
- **Staging:** production-like infrastructure with synthetic or properly anonymized data.
- **Production:** restricted access, monitoring, backups, change control, and incident response.

Never copy real student or parent personal data into an unprotected development environment.

---

## 15. Non-functional requirements

These targets should be converted into measurable service-level objectives before launch.

### Performance

- Fast initial page load on ordinary mobile connections.
- SEO-friendly public pages and stable institution URLs.
- Paginated review lists and search results.
- Cached public data with safe invalidation.
- Background processing for email, reports, and heavy aggregation.

### Reliability

- Health checks for web, API, database, and job workers.
- Retry handling for transient external provider failures.
- Idempotent payment and notification processing.
- Backups with tested restore procedures.
- Graceful degradation if analytics or notification providers are temporarily unavailable.

### Accessibility

- Keyboard navigation.
- Semantic page structure.
- Screen-reader labels.
- Sufficient color contrast.
- Visible focus states.
- Accessible forms, validation, and dialogs.

### Maintainability

- TypeScript across frontend and backend.
- Documented domain modules.
- Database migrations reviewed in version control.
- API contract documentation.
- Automated tests and deployment checks.
- Architecture decision records for major choices.

---

## 16. Testing and quality plan

Testing must cover business rules and abuse cases, not only whether pages render.

### Required test layers

1. **Unit tests:** rating calculation, permissions, consent rules, subscription states, and validation.
2. **Integration tests:** database transactions, institution claims, review submission, moderation, and billing workflows.
3. **API tests:** authentication, authorization, input validation, pagination, rate limits, and error handling.
4. **End-to-end tests:** parent signup, student-safe onboarding, search, review submission, institution response, Connect workflow, upgrade, renewal, and cancellation.
5. **Security tests:** object-level authorization, cross-tenant access, privilege escalation, injection, XSS, CSRF, upload validation, webhook forgery, and secret exposure.
6. **Load tests:** search, profile traffic, review lists, login bursts, and report-card-season-like traffic spikes if relevant.
7. **Recovery tests:** backup restoration and recovery of important billing and review records.
8. **Moderation simulations:** fake reviews, coordinated abuse, doxxing, threats, impersonation, and unfair review-removal requests.

### Launch acceptance requirements

- No unresolved critical or high-severity security findings.
- Institution and parent data are tenant-isolated correctly.
- Payment entitlements are changed only by trusted server-side payment state.
- Review ratings cannot be edited by institution users.
- Reports, appeals, and moderation actions are auditable.
- Child and guardian flows have passed legal and safety review.
- Backup restore has been tested.
- Privacy policy, terms, review policy, and institution subscription terms have been reviewed by qualified counsel.

---

## 17. Development roadmap

This is the recommended order for planning and implementation. It is deliberately phased so that core trust and backend foundations arrive before advanced analytics or marketing features.

### Phase 0 — Product definition and validation

- Confirm the exact launch segment: schools, colleges, universities, or a limited subset.
- Select a pilot geography and institution categories.
- Interview parents, students, and institution administrators.
- Validate the review taxonomy and the Connect workflow.
- Validate the business model and institution willingness to pay.
- Check the EduSetu name, domain availability, and trademark conflicts before branding investment.
- Obtain legal advice on company structure, privacy, child safety, content moderation, payment, and tax requirements.

**Exit:** approved product requirements, trust policies, pricing hypotheses, and architecture decisions.

### Phase 1 — Core platform foundation

- Environments, deployment pipeline, monitoring, database, and authentication.
- Users, roles, institutions, campuses, and memberships.
- Institution search and public profiles.
- Institution claim and verification workflow.
- Parent account and permitted relationship verification.
- Review submission, category scores, public display, and institution responses.
- Initial moderation and reporting tools.

**Exit:** a trustworthy searchable institution directory with functioning reviews and moderation.

### Phase 2 — EduSetu Connect

- Parent-to-institution inbox.
- Support cases and status tracking.
- Institution staff assignment and roles.
- Announcements and notifications.
- Interaction-level feedback.
- Guardian-mediated rules for minors.

**Exit:** parents and institutions can use the platform for structured two-way communication.

### Phase 3 — Commercial subscriptions

- Plan and entitlement management.
- Institution checkout and subscription lifecycle.
- Razorpay integration and signed webhooks.
- Invoices, cancellation, renewal, failed-payment handling, and reconciliation.
- Institution billing dashboard.
- Server-side feature entitlement enforcement.

**Exit:** institutions can subscribe and access paid features reliably.

### Phase 4 — Analytics and comparison

- Rating trend reports.
- Category-level feedback summaries.
- Response-time and resolution reporting.
- Institution comparison.
- Public benchmarks with minimum sample and privacy thresholds.
- Exports and scheduled reports for eligible plans.

**Exit:** institutions gain decision-useful insight without access to private family data.

### Phase 5 — Scale and enterprise capabilities

- Multi-campus and institution-group administration.
- More advanced search if needed.
- SSO and selected integrations.
- Advanced fraud signals and moderation support.
- Improved localization and accessibility.
- Independent security assessment and operational maturity improvements.

**Exit:** the platform can support larger institutional customers and higher traffic with measurable reliability.

---

## 18. Decisions to finalize before implementation

These are product decisions, not coding questions. They should be resolved in the planning workshop.

1. **Launch market:** Which state/cities and institution categories should be onboarded first?
2. **Initial institution scope:** Schools only at launch, or schools plus colleges and universities from day one?
3. **Review verification:** Institution-issued invite, parent-provided evidence, manual review, or a combination?
4. **Student participation:** Which student age groups can contribute, and what guardian consent process is required?
5. **Public identity:** Should all reviewers use public pseudonyms, or can verified adults choose a display name?
6. **Connect boundaries:** Which categories of parent requests are supported, and which are handled outside the platform?
7. **Institution subscription:** Which features belong in Basic, Growth, Pro, and Network plans?
8. **Billing:** Monthly, annual, or both? Will a free trial be offered?
9. **Comparison rules:** Which attributes are comparable across different boards, institution types, and regions?
10. **Moderation operations:** Who handles moderation, appeals, institution disputes, and urgent safety issues?
11. **Brand clearance:** Is `edusetu` available for the intended software and education-services classes, and is a suitable domain available?
12. **Company and payment onboarding:** Which eligible legal entity and authorized adult signatory will handle business registration, bank arrangements, contracts, and payment-provider KYC where required?

---

## 19. Master prompt for the future product and engineering work

Use this prompt when handing the plan to a product architect, design team, or AI engineering assistant. It deliberately prohibits premature coding until the architecture and product decisions have been reviewed.

> **Act as the principal product architect, SaaS backend architect, security architect, and product strategist for EduSetu.**
>
> EduSetu (working name; `setu` means bridge) is a commercial education relationship platform connecting parents, students, schools, colleges, and universities. Its purpose is to help families discover and compare institutions, share authentic experiences, and communicate with institutions. Institutions can claim verified profiles, respond to reviews, manage parent communication, view aggregated analytics, benchmark against public data, and subscribe to paid SaaS plans.
>
> This is intended to become a real commercial product, not a dummy, mockup, or disposable prototype. Treat database design, payment correctness, privacy, security, moderation, observability, backups, and operational reliability as first-class requirements.
>
> **Work in planning mode first. Do not write implementation code, scaffold a project, generate components, or create placeholder integrations until explicitly asked.**
>
> Use this architecture as the proposed baseline: Next.js, React, TypeScript, Tailwind CSS, and accessible UI primitives for the frontend; NestJS with TypeScript and a versioned REST API for the backend; PostgreSQL as the system of record; Prisma for database access and migrations; Redis and BullMQ for caching and background jobs; managed authentication; S3-compatible private object storage; Razorpay Subscriptions as the first India-focused payment provider to evaluate; and a managed cloud deployment with CI/CD, monitoring, secrets management, backups, and infrastructure as code. Validate every provider and service before locking the decision.
>
> Prefer a modular monolith with clear domain boundaries over premature microservices. Design modules for identity, authorization, users, institutions, campuses, institution verification, parent/student relationship verification, reviews, ratings, moderation, institution responses, parent–institution Connect, notifications, search, comparison, subscriptions, billing, analytics, audit logs, and platform administration.
>
> Design for three core user groups: parents/guardians, students, and institution teams. Include an EduSetu platform-admin role for verification, moderation, billing support, trust and safety, and operations. Use organization-scoped roles and enforce access control on the backend for every protected object.
>
> The core community experience should remain free. Institutions may pay for tools and services, but payment must never buy higher ratings, review removal, ranking manipulation, or access to private reviewer identities. Keep public ratings independent from commercial entitlements.
>
> Support two-way relationships through institution responses, parent communication, case tracking, surveys, and interaction-level feedback. Do not create public reputation scores for individual parents or children. Do not enable unrestricted adult-to-minor private messaging; use guardian-mediated communication by default.
>
> Build review integrity into the design: verified affiliation labels, clear rating methodology, review history, sample-size warnings, anti-spam controls, independent moderation, institution response rights, reviewer protection, and appeals. Verification of affiliation must not be presented as proof that every subjective statement is objectively true.
>
> Treat minors' data as a high-risk design area. Design age-aware onboarding, verifiable guardian consent where required, data minimization, pseudonymous public display, limited evidence retention, safe messaging, moderation, privacy rights, and a documented breach process. Review India's current DPDP Act and Rules, applicable IT Rules, consumer and contract requirements, and tax/payment obligations with qualified counsel before launch. Never claim legal compliance merely because a checklist has been implemented.
>
> For subscriptions, design server-authoritative entitlements, signed webhook verification, idempotent event handling, duplicate/out-of-order event handling, reconciliation, invoices, renewal and cancellation states, and audit records. Do not activate paid features based only on a browser redirect or client-side success message. Never store card numbers or CVV.
>
> **Your first deliverables must be planning documents only:**
> 1. Product requirements document and user journeys.
> 2. Final frontend information architecture and page inventory.
> 3. Backend module map and system architecture diagram.
> 4. Database entity relationship design and data ownership rules.
> 5. API contract outline and authorization matrix.
> 6. Payment/subscription lifecycle design.
> 7. Security threat model and privacy/child-safety checklist.
> 8. Moderation, verification, and dispute workflows.
> 9. Deployment, monitoring, backup, and disaster-recovery plan.
> 10. Phased implementation roadmap, acceptance criteria, and realistic operating-cost assumptions.
>
> Identify assumptions, risks, vendor lock-in, cost drivers, and unresolved decisions. Ask only the most important clarification when a decision blocks the architecture. Keep the plan practical for a small initial team while preserving commercial-grade design principles. Do not silently invent requirements or claim that any feature, payment, security control, or legal obligation is complete until it has been implemented and tested.

---

## 20. Reference links and planning notes

These sources were consulted for the initial architecture and legal/payment planning. They are starting points for verification, not a substitute for current professional advice.

- Government of India, Press Information Bureau — [DPDP Rules, 2025 notified](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2190655&lang=2&reg=48).
- Ministry of Electronics and Information Technology — [Digital Personal Data Protection Act, 2023](https://www.meity.gov.in/writereaddata/files/Digital%20Personal%20Data%20Protection%20Act%202023.pdf).
- Ministry of Electronics and Information Technology — [Digital Personal Data Protection Rules, 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025).
- Razorpay — [Subscriptions APIs](https://tfs.np.razorpay.in/docs/payments/subscriptions/apis) and [subscription webhooks](https://tfs.np.razorpay.in/docs/payments/subscriptions/subscribe-to-webhooks).
- OWASP — [API Security Project and API Security Top 10](https://owasp.org/projects/api-security-project/).
- OWASP — [Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/).
- Existing use of the name EduSetu was found in education-related products and organizations. Conduct a formal [IP India trademark search](https://ipindia.gov.in/) and domain check before committing to the brand.

---

## Final principle

**Build trust before growth. Build the backend around clear ownership of data and permissions. Build payments around verified server-side events. Build reviews around independence. Build Connect around respectful communication.**

EduSetu succeeds only if parents trust the platform, students are protected, and institutions believe the feedback system is fair enough to participate in.
