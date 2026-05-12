# Docinho O Docinho — Confeitaria Premium

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
  - `src/App.tsx` — routing (/, /admin, /admin/dashboard), CartProvider wraps everything
  - `src/pages/home.tsx` — full homepage with all sections
  - `src/pages/admin-login.tsx` — admin login page (/admin)
  - `src/pages/admin-dashboard.tsx` — full admin panel (/admin/dashboard)
  - `src/context/CartContext.tsx` — shopping cart state + WhatsApp message builder
  - `src/components/CartSidebar.tsx` — sliding cart panel
  - `src/components/CartButton.tsx` — floating cart button (unused, navbar has cart)
  - `src/components/effects/` — CustomCursor, RainAnimation
  - `src/components/layout/` — Navbar (with cart icon), Footer (with admin link)
  - `src/components/sections/` — HeroSection (video bg), HighlightsCarousel (MP4 support), SweetsGrid (add to cart), CakesSlider (add to cart), KitsGrid (add to cart), AboutSection, TestimonialsCarousel, ContactSection (WhatsApp checkout)
  - `src/index.css` — theme (rose-gold/lavender palette, Playfair Display + Nunito)
  - `public/videos/hero.mp4` — default hero background video
- `artifacts/api-server/` — Express 5 API server
  - `src/routes/` — settings, sections, sweets, cakes, kits, highlights, testimonials, admin, upload
  - `src/app.ts` — express-session + CORS + static uploads
- `lib/db/src/schema/` — Drizzle ORM schema (7 tables, settings has heroVideoUrl)
- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth, has heroVideoUrl)
- `lib/api-zod/` — generated Zod schemas from OpenAPI
- `lib/api-client-react/` — generated React Query hooks from OpenAPI

## Product

- Full premium confeitaria website for "Docinho O Docinho"
- Brigadeiro custom mouse cursor + entry rain animation (brigadeiros + stars fall from sky, disappear after 3.5s)
- VIDEO BACKGROUND in hero section (default: /videos/hero.mp4, editable from admin)
- Mouse-reactive holographic overlay on hero
- Sections: Destaques (carousel, supports MP4), Docinhos (grid + add-to-cart), Bolos (auto-scroll slider + add-to-cart), Kits (cards + add-to-cart + WhatsApp), Sobre, Depoimentos, Contato
- Shopping cart: sidebar with item list, quantity controls, WhatsApp checkout with full order message
- Floating WhatsApp button + WhatsApp CTAs everywhere
- Admin panel at /admin — login: "docinho doce" / "docinho digital 321"
- Admin link visible in footer ("Área Admin" button)
- Full CRUD for: site settings (incl. logo upload + hero video upload), sweets, cakes, kits, highlights, testimonials
- All galleries accept PNG, JPG, and MP4 uploads

## Architecture decisions

- Contract-first API via OpenAPI → Orval codegen for React Query hooks + Zod schemas
- Session-based auth for admin (express-session, SESSION_SECRET env var)
- Placeholder data fallback in all sections when DB is empty
- Custom cursor forced via `cursor: none !important` on all elements
- Shopping cart is client-side state only (CartContext), no backend needed
- WhatsApp checkout message built from cart items with name, price, quantity
- Upload route accepts: .png .jpg .jpeg .gif .webp .mp4 .mov .webm .ogg
- Hero video served from Vite public folder at /videos/hero.mp4 (default)
- Admin can upload a new video which gets stored in /api/uploads/

## User preferences

- Company name: "Docinho O Docinho" (CORRECT name, not "Docinho & Cia")
- Admin credentials: login = "docinho doce", password = "docinho digital 321"
- Custom brigadeiro emoji cursor (🍫) throughout site
- Rose-gold (#F4A7B9) + lavender (#E8D5F5) + gold (#F4D03F) color palette
- Fonts: Playfair Display (headings) + Nunito (body)

## Gotchas

- The `inArray` import in sections.ts is unused — esbuild strips it silently, no issue
- Admin session uses express-session; CORS must use `credentials: true`
- DB push required after any schema changes: `pnpm --filter @workspace/db run push`
- Static uploads served at `/api/uploads/` via express.static
- After editing openapi.yaml, always run codegen: `pnpm --filter @workspace/api-spec run codegen`
- heroVideoUrl is stored in site_settings table; default video is served from doce-site public folder

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
