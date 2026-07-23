# PipelineOS

Modern AI-powered sales pipeline dashboard built with Next.js, TypeScript,
Tailwind CSS, Supabase, Recharts, Framer Motion, React Hook Form, and Zod.

PipelineOS is designed as a focused revenue workspace rather than a generic
admin template. It includes authenticated, owner-isolated data; normalized CRM
entities; optimistic deal workflows; global search; responsive analytics; and
server-side PostgreSQL aggregation.

## Product surfaces

- Dashboard with revenue, pipeline, win-rate, and activity signals
- Companies, contacts, deals, and activities workspaces
- Deal creation, editing, deletion, filtering, sorting, and pagination UI
- Server-aggregated analytics and AI forecast briefing surface
- Global command menu (`⌘K` / `Ctrl+K`)
- Email/password authentication
- Responsive navigation, keyboard focus, reduced-motion support, loading and
  empty states
- User settings and data export affordances

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project and set the project URL and anonymous key.
4. Apply files in `supabase/migrations/` in timestamp order.
5. For local Supabase, run the seed in `supabase/seed.sql`.
6. Start the app with `npm run dev`.

Without Supabase environment values the interface runs in a read-only demo
configuration with realistic sample data. Production CRUD uses the
authenticated repositories in `lib/data/service.ts`.

## Demo accounts

The local seed creates two accounts for RLS verification:

- `alex@pipelineos.demo`
- `sam@pipelineos.demo`
- Password: `PipelineOS-demo-2026!`

Do not use the demo credentials in a public production project.

## Scripts

- `npm run dev` — local development
- `npm run build` — production build
- `npm run lint` — static analysis
- `npm test` — build and rendered HTML checks

## Documentation

- [Database and relationships](docs/DATABASE.md)
- [Entity relationship diagram](docs/ERD.md)
- [Architecture](docs/ARCHITECTURE.md)
- [RLS two-account test](docs/SECURITY_TEST.md)
- [Deployment guide](docs/DEPLOYMENT.md)

## Security model

Every persisted entity carries `owner_id`. All seven tables have RLS enabled
with explicit select, insert, update, and delete policies. Relationship
validation triggers prevent cross-owner foreign-key references. Analytics views
use `security_invoker`, and the dashboard RPC is executable only by the
`authenticated` role.
