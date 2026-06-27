# OneClick — The Internet's Toolbox

31+ free client-side tools for text, code, design, math, and more — no sign-up required.

## Run & Operate

- `pnpm run dev` — start dev server at port 3000
- `pnpm run build` — production build → `dist/`
- `pnpm run preview` — preview the production build locally
- `pnpm run typecheck` — TypeScript check

## Stack

- React 19 + Vite 7 + TypeScript 5
- Tailwind CSS v4 + shadcn/ui (New York style)
- wouter (client-side routing)
- framer-motion (animations)
- lucide-react (icons)
- All tools are 100% client-side — no backend

## Where things live

- `src/App.tsx` — routing (wouter)
- `src/data/tools.ts` — tool definitions (title, slug, description, category)
- `src/data/categories.ts` — category definitions with icons
- `src/data/toolComponents.tsx` — lazy-load registry mapping slugs → components
- `src/tools/<slug>/index.tsx` — individual tool implementations (31 tools)
- `src/pages/` — Home, Tools, ToolPage, Categories, CategoryPage, About
- `src/components/layout/` — Navbar, Footer
- `src/components/ui/` — shadcn/ui primitives
- `src/components/theme-provider.tsx` — dark mode (useTheme hook)
- `src/index.css` — Tailwind + CSS custom properties (HSL color tokens)
- `public/` — static assets (favicon.svg, opengraph.jpg, robots.txt)

## Deploy on Vercel

1. Push this repository to GitHub
2. Import in Vercel — framework preset: **Vite**
3. Build command: `npm run build` (or `pnpm run build`)
4. Output directory: `dist`
5. No environment variables required

`vercel.json` already handles SPA routing (rewrites all paths to `index.html`).

## Architecture decisions

- All 31 tools are lazy-loaded via `React.lazy()` — only the active tool's bundle is fetched
- Dark mode uses a custom `ThemeProvider` + `useTheme` hook (not next-themes directly)
- `@/` path alias maps to `src/` for clean imports throughout

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Adding a new tool requires updates in three places: `src/data/tools.ts`, `src/data/toolComponents.tsx`, and a new file at `src/tools/<slug>/index.tsx`
- `useTheme` must be imported from `@/components/theme-provider` (not any external package)
