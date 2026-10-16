# SystemZero

**Cloudflare-native tactical operations console** · React 19 · TypeScript · Vite · Cloudflare Workers · GitHub Actions

SystemZero is a responsive operations workspace with an edge-health API, example network topology, locally editable operations board, JSON export, and demo analytics. It requires no paid API, database, third-party authentication, or subscription.

> **Data accuracy:** Only the status returned by GET /api/health is live. The topology and signal series are demo/reference data. Operations are kept in browser localStorage and are not synchronized across devices.

## Features

- Responsive Overview, Network, Operations, and Analytics views.
- Genuine Cloudflare Worker health endpoint: response time, timestamp, and Cloudflare colo (when available).
- Create, search, filter, advance, delete, and locally persist operations.
- Export a JSON snapshot of local operations.
- Explore a clickable, explicitly simulated reference topology.
- Inspect example charts alongside actual local task counts.
- Same-origin, no-key edge API and strict security headers.
- GitHub Actions: tests, TypeScript validation, production build, and main-branch deployment.

## Run locally

Requires Node.js 22 or newer.

~~~bash
npm ci
npm run dev
~~~

Open http://localhost:3000. The UI runs in **LOCAL PREVIEW** without the deployed Cloudflare Worker; local operations still work.

To run a local Worker with real edge-health API behavior (without a paid Cloudflare account):

~~~bash
npm run dev:edge
~~~

To run tests and build:

~~~bash
npm test
npm run build
~~~

The legacy lockfile is missing React type declarations. To run TypeScript checks locally, install them without modifying the lockfile, then typecheck:

~~~bash
npm install --no-save --package-lock=false @types/react@19 @types/react-dom@19
npm run typecheck
~~~

GitHub Actions performs these steps automatically.

## Deploy with GitHub Actions to Cloudflare Workers Free

1. Sign in to a free Cloudflare account.
2. Create an API token scoped to that account with **Workers Scripts: Edit** permission.
3. In GitHub repository **Settings → Secrets and variables → Actions**, add two repository secrets: **CLOUDFLARE_API_TOKEN** and **CLOUDFLARE_ACCOUNT_ID**.
4. Merge the restoration PR to main. Every push to main validates the code and deploys the Worker and its static assets using Wrangler.
5. Find the workers.dev URL in the GitHub Actions deployment logs.

Cloudflare serves the frontend and GET /api/health from **one Worker**. No GitHub Pages, custom domain, D1, KV, R2, or paid AI service is necessary.

**Costs:** The application targets free operation within Cloudflare Workers Free and GitHub Actions allowances. Free quotas are limited; unbounded traffic is not guaranteed to remain free.

## Commands

| Command | Purpose |
| --- | --- |
| npm run dev | Vite local development |
| npm run dev:edge | Build and start local Cloudflare Worker |
| npm test | Worker endpoint tests |
| npm run typecheck | TypeScript check (see type declaration step above) |
| npm run build | Build production frontend to dist |
| npm run preview | Preview frontend without Worker API |

## Architecture

~~~text
GitHub main → GitHub Actions → checks + build → Wrangler deploy
                                         │
                                         ▼
                              Cloudflare Worker (Free)
                              ├── Static SPA assets
                              └── GET /api/health
                                         │
Browser localStorage ←→ React operations workspace
~~~

## Security and data boundaries

There is intentionally no login or shared database. Do not store sensitive information or production secrets in the operations board. It is a local demo, not an audited system of record. The sample topology is not a network discovery feature; health checks verify only the Cloudflare Worker, not third-party systems.

Project dependencies retain their respective third-party licenses.
