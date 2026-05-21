# IT Asset Inventory System

A web-based IT asset management system for tracking hardware assets, monitoring status changes, and maintaining a complete audit trail.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/it-assets run dev` — run the frontend (port 24531)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4 + shadcn/ui + wouter
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Auth: Supabase (frontend login via @supabase/supabase-js)
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/` — Drizzle schema: assets.ts, history.ts, notes.ts
- `artifacts/api-server/src/routes/` — Express route handlers: assets, history, notes, dashboard
- `artifacts/it-assets/src/pages/` — React pages: Login, Dashboard, AssetList, AssetForm, AssetDetail
- `artifacts/it-assets/src/components/` — Shared components: Layout, StatusBadge, CategoryIcon
- `artifacts/it-assets/src/lib/supabase.ts` — Supabase client
- `artifacts/it-assets/src/hooks/useAuth.ts` — Auth hook

## Architecture decisions

- Supabase is used for authentication only; all asset data lives in the Replit PostgreSQL database via Drizzle ORM
- Frontend reads Supabase credentials via VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (Vite env vars)
- All asset mutations automatically create change history entries server-side
- wouter handles client-side routing with a BASE_URL-aware router for proxy compatibility

## Product

- Login: Supabase email/password authentication
- Dashboard: KPI cards (total, active, maintenance, recently added), status breakdown, category breakdown, recent activity feed
- Asset List: searchable/filterable table with status badges, category icons, quick actions
- Asset Registration: full form for all 10 asset fields
- Asset Detail: asset info panel, inline notes (add/delete), complete change history
- Change History: auto-recorded on every create/update with field-level diff

## User preferences

- Technologies: Next.js / React / Tailwind / Supabase (using React+Vite in monorepo, Supabase for auth)
- Design: Modern ERP-style, dark sidebar, responsive

## Gotchas

- `current_user` is a reserved word in PostgreSQL — always quote it as `"current_user"` in raw SQL
- Supabase credentials must be VITE_-prefixed to be available in the Vite frontend (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- After each OpenAPI spec change, run `pnpm --filter @workspace/api-spec run codegen` before editing routes or frontend

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
