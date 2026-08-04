# Lumi List — Redesign Report

## 0. Starting point

Before touching anything, I inspected the actual codebase (React 19 + Vite + Tailwind v4) rather than
just the live URL. One detail changed the whole direction: the real `favicon.svg` shipped in `/public`
is a **violet lightning-bolt mark** (`#863bff`) — but the UI itself was styled in the generic
"near-black background + acid emerald-green accent" look, which doesn't match the mark at all, and is
also the single most common default an AI (or a rushed dev) reaches for. The name "Lumi List" is a
light pun that wasn't being used anywhere.

So the brief became concrete: **build the identity the favicon already promised** — violet as the true
brand color, and warm light/glow as the literal "Lumi" motif — instead of reskinning with another
default dark+neon palette.

## 1. 🎨 Design Audit & Visual Strategy

**Palette** — grounded in the shipped brand mark, not invented:
| Token | Hex | Role |
|---|---|---|
| `--void` | `#08070a` | Base background (warm-neutral black, not green-tinted) |
| `--violet` / `--violet-soft` | `#863bff` / `#a970ff` | Brand identity — active states, primary CTA, links |
| `--lumen` / `--lumen-soft` | `#f5b942` / `#ffd27a` | The "light" motif — cursor glow, counts, favicons, beam sweep |
| `--surface` | `rgba(18,16,22,.72)` | Glass card surfaces |
| `--ink` | `#f6f4f1` | Warm-white text |

**Typography** — three-role system instead of one flat font:
- **Space Grotesk** (display) for the wordmark and board titles — geometric, a little unusual, reads as a product rather than a template.
- **Inter** (body) for everything readable-at-small-sizes.
- **JetBrains Mono** (data) for counts, the status readout, and the eyebrow label — reinforces that this is a workspace tool, not a landing page.

**Signature element** — a literal "Lumen": a soft radial glow tracks the cursor across the whole page
(`--mx`/`--my` custom properties updated on `pointermove`, throttled via `requestAnimationFrame`), and
each board card has a matching gradient ring that only appears on hover, positioned at the pointer —
so glass cards look like they're "catching light" as you move across the grid. The hero title runs a
slow violet→amber beam sweep across the wordmark. This one idea is reused in three places instead of
bolting on three unrelated effects, per the "spend your boldness in one place" principle.

**Layout** — kept the real LumiList 4-column masonry board grid (it's a legitimate, workable bento
layout already), but gave it a reason to exist: a masthead above it with a live mono-font status line
(`HOME · 6 boards · 42 links · 2 pages`) instead of a generic 3-card stat row.

## 2. ✨ Key Enhancements Made

- **Masthead (`Hero.jsx`, new)** — wordmark, one-line description, live board/link/page counts.
- **Floating dock navbar** — brand mark added, sticky glass pill, magnetic pull on the primary "Add Link" button (`useMagnetic`).
- **Board cards** — pointer-tracked light-catch edge + very subtle 3D tilt (`useTilt`), staggered scroll-reveal so cards fade/slide in column-by-column, row-by-row instead of popping in at once (`useReveal`, `IntersectionObserver`-based, no scroll-jank).
- **Bookmark rows** — favicon scale-in and row nudge on hover instead of a flat background swap.
- **Floating action rail** — magnetic hover on both buttons, recolored to the violet/lumen system.
- **Toasts & modals** — spring-eased entrances, glass modal surface, focus ring on inputs.
- **Accessibility** — visible `:focus-visible` outline added globally (was missing entirely), `Escape` now closes every modal (`useEscapeClose`, new — previously only the backdrop/✕ button worked), `prefers-reduced-motion` disables the beam sweep, aurora drift, and pulse dot.
- **Bug fix** — `.action-btn` / `.action-btn-primary` / `.animate-modal` were referenced across all four modals but **never defined in CSS**, so every Cancel/Save/Create button in every modal was rendering unstyled. These are now defined as part of the design system.
- **Code cleanup** — removed dead leftovers from the original Vite template (`App.css`, `src/assets/react.svg`, `vite.svg`, unused `hero.png`), removed an unused import, consolidated one-off inline color classes (`emerald-400`, `sky-400`, `purple-400` scattered per-component) into the shared CSS custom properties so the palette is edited in one place.
- **Meta/SEO** — added `theme-color`, Open Graph and Twitter card tags, fixed the favicon link (was an inline base64 emoji SVG overriding the real brand mark in `/public/favicon.svg`).

## 3. 💻 Refactored Code

All changes are in the project files (not a separate snippet dump) so you can `npm install && npm run dev` immediately:

- `src/index.css` — full design-system rewrite (tokens, aurora background, dock/nav, board/card, modal, motion).
- `src/components/Hero.jsx` — new.
- `src/utils/useMagnetic.js`, `useTilt.js`, `useReveal.js`, `useEscapeClose.js` — new, dependency-free hooks (~15–30 lines each).
- `src/components/{Navbar,BoardCard,BoardGrid,BookmarkItem,FloatingRail,Toast}.jsx` — updated to the new system and hooks.
- `src/components/{AddBookmarkModal,AddBoardModal,AddPageModal,ImportExportModal}.jsx` — recolored + `Escape`-to-close.
- `index.html` — meta/OG/theme-color/favicon fixes.
- Verified with `npm run build` — builds clean, no new lint errors introduced.

## 4. 🚀 Further Upgrades (optional next steps)

- **Drag-and-drop reordering** of boards/bookmarks (e.g. `@dnd-kit`) — the data model already tracks `boardOrder`/`columnIndex`/`bookmarkOrder`, so the UI is the only missing piece.
- **Command palette** (`Ctrl+K` already focuses search — could extend to a full fuzzy command menu for "add link", "switch page", "new board").
- **Real og:image** — generate a static 1200×630 share card (the meta tags are wired up but intentionally left without a placeholder image to avoid a dead link).
- **WebGL**: a shader-based version of the cursor glow (a genuine light-refraction/caustics fragment shader behind the glass cards) would push the "Lumi" signature further, at the cost of a Three.js/OGL dependency — worth doing only if this becomes a marketing/landing page rather than the working app itself.
- **Board color-coding**: let users tag a board with an accent hue, drawn from the violet/lumen family, so heavily-used boards are scannable at a glance.
