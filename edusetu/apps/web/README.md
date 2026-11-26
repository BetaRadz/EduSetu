# EduSetu Web — Frontend foundation

This is the first Next.js frontend slice in the EduSetu monorepo. It uses Next.js App Router, React, TypeScript, Tailwind CSS v4, TanStack Query, and Lucide icons.

## Pages included

- `/` — public landing page with a live institution preview.
- `/institutions` — searchable verified-institution directory with type, keyword, and city filters plus pagination.
- `/institutions/[slug]` — live institution profile, aggregate rating, published reviews, category scores, and institution responses.
- `/for-institutions` — product explanation for education teams.
- `/pricing` — plan concepts only; pricing is intentionally not represented as a live offer.
- `/trust` — explains rating independence, verification labels, moderation and student-safety boundaries.
- `/sign-in` — explicit authentication setup status.
- `/parent` and `/institution-portal` — role-oriented workspace shells that do not invent private data.
- `/admin` — privileged-console boundary and bootstrap explanation.

## Local development

Requirements: Node.js 22 and npm 10+.

1. From the repository root, copy `apps/web/.env.example` to `apps/web/.env.local`.
2. Ensure the NestJS API is running at `http://localhost:4000` and has a working database.
3. Install all workspace dependencies from the repository root: `npm install`.
4. Start the web app: `npm run dev:web`.
5. Open `http://localhost:3000`.

To create a production build, run `npm run build:web`. To lint the frontend, run `npm run lint:web`.

## API configuration

`NEXT_PUBLIC_API_BASE_URL` must point to the NestJS API base, including `/api/v1`. The default is `http://localhost:4000/api/v1`. The API's `WEB_ORIGIN` must allow the frontend origin (default `http://localhost:3000`).

The app only uses the public endpoints currently implemented by the backend for live directory/profile/review reads. Sign-in, review submission, claiming, inbox, billing checkout and administration mutations are intentionally not simulated. The auth page and workspace shells explain the current configuration status.

## Trust and safety decisions in this slice

- Public institution search only displays records that the API marks as verified.
- Reviews render only from the API's published-review endpoint. Author identity is not displayed.
- The UI offers no student review submission or direct adult-to-minor messaging.
- Protected account actions are gated while OIDC is disabled.
- Pricing cards describe proposed capabilities and explicitly state that prices and checkout are not live.

## Current limitations

The directory and public profiles are live-data driven, but the following are not connected because the corresponding backend workflows do not exist or are not configured: authentication/session management, claim submission from the UI, review submission, parent–institution Connect, notifications, institution profile editing, analytics dashboards, subscriptions, and live payment checkout. These should be added only with matching backend contracts and security tests.
