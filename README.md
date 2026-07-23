# Alba Assessment Projects

This repository is organised as a small monorepo: each assessment deliverable is isolated in its own deployable folder.

| Folder | Deliverable | Status |
| --- | --- | --- |
| [`01-web-app`](./01-web-app) | **Signal** — public-data company intelligence web app | Ready to deploy |
| [`02-dashboard`](./02-dashboard) | Dashboard task | Reserved |
| [`03-n8n-workflow`](./03-n8n-workflow) | n8n workflow task | Reserved |

## Deploying Signal

In Vercel, import this repository and set **Root Directory** to `01-web-app`. Vercel will then detect the Next.js app, install its own dependencies, and run its own build independently of the other assessment folders.

Add the variables listed in [`01-web-app/.env.example`](./01-web-app/.env.example), then set:

- `NEXT_PUBLIC_APP_URL` to the deployed Vercel URL
- `NEXT_PUBLIC_SOURCE_URL` to this public repository URL

See [`01-web-app/README.md`](./01-web-app/README.md) for Signal's architecture, API notes, testing commands, and deployment smoke-test checklist.
