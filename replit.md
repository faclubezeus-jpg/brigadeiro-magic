# Docinho & Cia — Confeitaria Premium

Site completo para confeitaria artesanal premium com painel administrativo.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080, proxied at /api)
- `pnpm --filter @workspace/doce-site run dev` — run the Vite frontend (port dynamic)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — Express session secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS v4, Framer Motion, Wouter (routing)
- API: Express 5 + express-session
- DB: PostgreSQL + Drizzle ORM (7 tables)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/doce-site/` — React + Vite frontend
  - `src/App.tsx` — routing (/, /admin, /admin/dashboard)
  - `src/pages/home.tsx` — full homepage with all sections
  - `src/pages/admin-login.tsx` — admin login page (/admin)
  - `src/pages/admin-dashboard.tsx` — full admin panel (/admin/dashboard)
  - `src/components/effects/` — CustomCursor, RainAnimation
  - `src/components/layout/` — Navbar, Footer
  - `src/components/sections/` — HeroSection, HighlightsCarousel, SweetsGrid, CakesSlider, KitsGrid, AboutSection, TestimonialsCarousel, ContactSection
  - `src/index.css` — theme (rose-gold/lavender palette, Playfair Display + Nunito)
- `artifacts/api-server/` — Express 5 API server
  - `src/routes/` — settings, sections, sweets, cakes, kits, highlights, testimonials, admin, upload
  - `src/app.ts` — express-session + CORS + static uploads
- `lib/db/src/schema/` — Drizzle ORM schema (7 tables)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth for API contract)
- `lib/api-zod/` — generated Zod schemas from OpenAPI
- `lib/api-client-react/` — generated React Query hooks from OpenAPI

## Product

- Full premium confeitaria website for "Docinho & Cia"
- Brigadeiro custom mouse cursor + entry rain animation
- Parallax hero with interactive mouse-driven holographic background
- Sections: Destaques (carousel), Docinhos (grid), Bolos (auto-scroll slider), Kits (cards + WhatsApp), Sobre (animated toggle), Depoimentos (carousel), Contato
- Floating WhatsApp button + WhatsApp CTAs everywhere
- Admin panel at /admin — login: "docinho doce" / "docinho digital 321"
- Full CRUD for: site settings, sweets, cakes, kits, highlights, testimonials

## Architecture decisions

- Contract-first API via OpenAPI → Orval codegen for React Query hooks + Zod schemas
- Session-based auth for admin (express-session, SESSION_SECRET env var)
- Placeholder data fallback in all sections when DB is empty
- Custom cursor forced via `cursor: none !important` on all elements
- Holographic BG uses CSS animation + mouse-reactive JS transforms

## User preferences

- Admin credentials: login = "docinho doce", password = "docinho digital 321"
- Custom brigadeiro emoji cursor (🍫) throughout site
- Rose-gold (#F4A7B9) + lavender (#E8D5F5) + gold (#F4D03F) color palette
- Fonts: Playfair Display (headings) + Nunito (body)

## Gotchas

- The `inArray` import in sections.ts is unused — esbuild strips it silently, no issue
- Admin session uses express-session; CORS must use `credentials: true`
- DB push required after any schema changes: `pnpm --filter @workspace/db run push`
- Static uploads served at `/api/uploads/` via express.static

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
