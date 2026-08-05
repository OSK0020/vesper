# VESPER — UI/UX Enhancement Specification
**Prepared for:** Ori Stern / VESPER (Visual Bookmark & Workspace Manager)
**Stack:** React 19 · Vite · Tailwind CSS v4 · Framer Motion
**Target:** `vesper-jet.vercel.app`
**Doc type:** Implementation spec for autonomous AI coding agent (Antigravity IDE)

---

## 0. How to use this document

Every section below is self-contained: problem → fix → exact class string / JSX / motion config. Implement top to bottom. Do not paraphrase class strings — copy them verbatim, then adjust only the values called out as variables (color stops, timing, board accent hue). Where a pattern references a named library (React Bits, Aceternity, Magic UI), the JSX given is a VESPER-native reimplementation in the app's own component style — not a copy-pasted import — so it inherits the existing design tokens instead of introducing a second design language.

---

## 1. Design Token Layer

Add these as CSS custom properties in `src/index.css` (Tailwind v4 `@theme` block), so every component below can reference them instead of hardcoding values. This is the single source of truth the rest of the spec depends on.

```css
@theme {
  /* Surface levels — glass depth system */
  --color-surface-0: #08070a;        /* app background */
  --color-surface-1: #0c120e;        /* board/card base, 80% opacity via /80 */
  --color-surface-2: #12181a;        /* elevated card / hover state */
  --color-surface-3: #171d1f;        /* modal / command palette */

  /* Borders — glass edges */
  --color-border-subtle: rgb(255 255 255 / 0.06);
  --color-border-default: rgb(255 255 255 / 0.10);
  --color-border-strong: rgb(255 255 255 / 0.16);

  /* Accent — board-assignable hue, default emerald per current brand */
  --color-accent-500: #34d399;
  --color-accent-glow: rgb(52 211 153 / 0.35);

  /* Text */
  --color-text-primary: #f5f5f4;
  --color-text-secondary: #a3a3a3;
  --color-text-tertiary: #6b7280;

  /* Radii */
  --radius-card: 1rem;      /* 16px */
  --radius-pill: 9999px;
  --radius-modal: 1.25rem;  /* 20px */

  /* Blur scale */
  --blur-surface: 20px;   /* backdrop-blur-xl equivalent */
  --blur-modal: 40px;     /* backdrop-blur-2xl equivalent */

  /* Motion */
  --ease-vesper: cubic-bezier(0.16, 1, 0.3, 1); /* expo-out, Linear/Vercel signature ease */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 400ms;
}
```

**Rule going forward:** any new `bg-[#0c120e]/80` in the codebase should become `bg-surface-1/80` once the token is registered as a Tailwind color (`--color-surface-1` auto-generates `bg-surface-1`, `border-surface-1`, `text-surface-1` utilities in v4). This removes the drift risk of five slightly-different "near-black" values across components, which is the #1 cause of glass surfaces looking inconsistent at scale.

---

## 2. Hero Section

### 2.1 Problems identified
- Flat white or single-tone title text reads as a placeholder, not a crafted brand mark — needs the metallic gradient treatment Linear/Vercel use on headline copy.
- No ambient light source behind the hero — the composition feels front-lit/flat instead of having the "illuminated" quality the tagline promises.
- Status pill (if present) likely lacks the pulsing-LED affordance that signals "live/active" state at a glance (Vercel deployment badges, Raycast status dots).

### 2.2 Metallic gradient headline

```jsx
<h1 className="
  bg-gradient-to-b from-white via-neutral-200 to-neutral-500
  bg-clip-text text-transparent
  text-5xl sm:text-6xl lg:text-7xl
  font-semibold tracking-tight leading-[1.05]
  [text-wrap:balance]
">
  Your Digital Space, Illuminated
</h1>
```

Use `bg-gradient-to-b` (vertical), not `to-r` — vertical metallic gradients read as light hitting brushed metal from above; horizontal gradients read as a rainbow/brand-color sweep, which undersells the "premium developer tool" register the rest of the site is going for.

### 2.3 Ambient backdrop glow (ties into "Illuminated")

Place this as a sibling of the hero content, absolutely positioned behind it:

```jsx
<div className="absolute inset-x-0 top-0 h-[600px] -z-10 pointer-events-none overflow-hidden">
  <div className="
    absolute left-1/2 top-[-200px] -translate-x-1/2
    w-[900px] h-[500px]
    bg-[radial-gradient(ellipse_at_center,_var(--color-accent-glow)_0%,_transparent_65%)]
    opacity-40 blur-3xl
  " />
  <div className="
    absolute left-1/2 top-0 -translate-x-1/2
    w-[500px] h-[300px]
    bg-[radial-gradient(ellipse_at_center,_rgb(255_255_255_/_0.08)_0%,_transparent_70%)]
    blur-2xl
  " />
</div>
```

Two overlapping radial gradients, not one: a wide dim accent-colored glow plus a tighter white "hot spot" near the top. Single-glow hero backgrounds (the common Aceternity "Lamp" pattern) look correct on a full-viewport dark page but flatten out once real UI content (nav, pills, cards) sits inside the same viewport — the second white core keeps a visible light source even with content on top.

### 2.4 Status pill with pulsing LED

```jsx
<div className="
  inline-flex items-center gap-2
  px-3 py-1.5
  rounded-full
  bg-white/[0.04] border border-white/10
  backdrop-blur-sm
  text-xs font-medium text-neutral-300
">
  <span className="relative flex h-2 w-2">
    <span className="
      absolute inline-flex h-full w-full rounded-full
      bg-accent-500 opacity-75 animate-ping
    " />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
  </span>
  Private workspace · live sync
</div>
```

This is the standard two-layer ping pattern (Tailwind's built-in `animate-ping` on an absolutely-positioned duplicate), which is what Vercel's own deployment-status badges use — do not attempt a custom `@keyframes` for this, the built-in utility already handles the scale+fade correctly.

---

## 3. Bento Board Grid

### 3.1 Problems identified
- Grid gap likely uses a single uniform value (`gap-4` or `gap-6` everywhere) — bento layouts read as "designed" only when row-gap and column-gap are tuned independently, and when the grid has at least one asymmetric span (a 2×1 or 2×2 featured card) to break the monotony of equal-sized tiles.
- Card hover elevation is probably `hover:scale-105` with a plain shadow, which is the single most overused, most template-looking hover effect in Tailwind UI work in 2024–2026. It needs to be replaced with the combination below.

### 3.2 Grid container

```jsx
<div className="
  grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4
  auto-rows-[180px]
  gap-x-4 gap-y-4
  p-6 sm:p-8
">
  {/* featured board card spans 2 cols x 2 rows */}
  <BoardCard className="col-span-2 row-span-2" featured />
  <BoardCard />
  <BoardCard />
  {/* ... */}
</div>
```

### 3.3 Board card — glass surface + border beam + elevation

```jsx
function BoardCard({ board, featured = false, className = "" }) {
  return (
    <motion.div
      className={`
        group relative overflow-hidden
        rounded-2xl
        bg-surface-1/80 backdrop-blur-xl
        border border-white/10
        p-5
        ${className}
      `}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* border beam — animated gradient traveling around the card edge on hover */}
      <div className="
        absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        pointer-events-none
      ">
        <div className="
          absolute inset-0 rounded-2xl
          [background:conic-gradient(from_var(--beam-angle),transparent_0deg,var(--color-accent-500)_20deg,transparent_40deg)]
          animate-[spin_3s_linear_infinite]
          [mask:linear-gradient(#000_0_0)_content-box,linear-gradient(#000_0_0)]
          [mask-composite:exclude]
          p-px
        " style={{ '--beam-angle': '0deg' }} />
      </div>

      {/* static border, sits above the beam mask so the card edge stays crisp */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-white/[0.14] transition-colors pointer-events-none" />

      {/* ambient glow that follows elevation, not cursor — cheaper than a mousemove spotlight and reads just as premium at card scale */}
      <div className="
        absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100
        transition-opacity duration-300
        bg-[radial-gradient(120px_circle_at_50%_0%,var(--color-accent-glow),transparent_70%)]
        pointer-events-none -z-10
      " />

      <div className="relative z-10">
        {/* card content */}
      </div>
    </motion.div>
  );
}
```

**Why this combination, specifically:**
- `whileHover={{ y: -4 }}` (translate, not scale) for elevation — `scale-105` distorts the card's internal grid/typography and looks cheap at anything above 400px card width; a 4px lift with a matching shadow reads as physical elevation instead.
- The conic-gradient "border beam" (Magic UI's signature pattern) is implemented with `mask-composite: exclude` so only a 1px ring of the conic gradient is visible — the raw conic-gradient block, unmasked, is a common implementation mistake that fills the whole card in a rotating rainbow instead of tracing the edge.
- The glow underlay is anchored to the card's top-center, not the cursor. A true cursor-tracking spotlight (React Bits' `SpotlightCard`) needs a `mousemove` listener per card, which is meaningfully more expensive at bento-grid scale (12–30 cards on screen) than a CSS-only hover glow, and the visual difference is marginal at card sizes under ~300px.

### 3.4 Featured card accent border

For the `featured` (2×2) card, add a persistent (not hover-only) 1px gradient border using the board's assigned accent color, so the eye lands there first:

```jsx
className="
  ...
  ring-1 ring-inset ring-accent-500/20
  shadow-[0_0_40px_-12px_var(--color-accent-glow)]
"
```

---

## 4. Bookmark Link Item Row

### 4.1 Problems identified
- Favicon likely sits flush against the title with no defined bounding box, so misaligns vertically the moment a favicon fails to load (broken image icon at native size instead of a fallback).
- Title and URL probably share the same weight/color, giving no scan hierarchy in a dense list.
- Row hover is likely a flat background change with no affordance for the action buttons (open, edit, delete) that should only appear on hover to keep the row calm at rest.

### 4.2 Row structure

```jsx
<motion.a
  href={link.url}
  target="_blank"
  rel="noopener noreferrer"
  className="
    group relative flex items-center gap-3
    px-3 py-2.5 rounded-lg
    transition-colors duration-150
    hover:bg-white/[0.06]
  "
  whileTap={{ scale: 0.99 }}
>
  {/* favicon — fixed box, fallback ring, never collapses layout */}
  <div className="
    flex-none w-7 h-7 rounded-md
    bg-white/5 border border-white/10
    flex items-center justify-center
    overflow-hidden
  ">
    {link.favicon ? (
      <img src={link.favicon} alt="" className="w-4 h-4 object-contain" loading="lazy" />
    ) : (
      <Globe className="w-3.5 h-3.5 text-neutral-500" />
    )}
  </div>

  {/* title / url stack */}
  <div className="min-w-0 flex-1">
    <p className="text-sm font-medium text-neutral-100 truncate leading-tight">
      {link.title}
    </p>
    <p className="text-xs text-neutral-500 truncate leading-tight mt-0.5">
      {link.displayUrl}
    </p>
  </div>

  {/* quick actions — hidden until row hover, fade+slide in from the right */}
  <div className="
    flex-none flex items-center gap-1
    opacity-0 -translate-x-1
    group-hover:opacity-100 group-hover:translate-x-0
    transition-all duration-150
  ">
    <IconButton icon={Pencil} label="Edit" />
    <IconButton icon={Trash2} label="Delete" />
  </div>
</motion.a>
```

`IconButton` (shared primitive, reused in modal footers too):

```jsx
function IconButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="
        p-1.5 rounded-md
        text-neutral-500 hover:text-neutral-200
        hover:bg-white/10
        transition-colors duration-150
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50
      "
    >
      <Icon className="w-3.5 h-3.5" />
    </button>
  );
}
```

Note the `whileTap={{ scale: 0.99 }}` on the row itself, not just the buttons — a subtle tap-down on the whole row gives external links a physical "launching" feel on click, which matters more than it sounds like given this is the single most-repeated interaction in the entire app.

---

## 5. Modals & Command Palette

### 5.1 Problems identified
- Backdrop is likely a flat `bg-black/50` with no blur, which lets background content stay legible and competes with the modal for attention — command palettes specifically need the background to visually recede.
- Padding is probably inconsistent between modal variants (add-link modal vs. settings modal vs. command palette), which is the kind of inconsistency users register as "unpolished" without being able to say why.

### 5.2 Backdrop

```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
  className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl"
  onClick={onClose}
/>
```

### 5.3 Modal container

```jsx
<motion.div
  initial={{ opacity: 0, scale: 0.96, y: 8 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.98, y: 4 }}
  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
  className="
    relative z-10
    w-full max-w-lg
    rounded-3xl
    bg-surface-3/95 backdrop-blur-xl
    border border-white/10
    shadow-[0_24px_80px_-16px_rgb(0_0_0_/_0.6)]
    p-8 sm:p-10
  "
  role="dialog"
  aria-modal="true"
>
  {children}
</motion.div>
```

`scale` starts at `0.96`, not `0.9` — a larger initial delta reads as "bouncy/toy-like"; 0.94–0.97 combined with a small `y` offset is the range Linear and Vercel both sit in for dialog entrances, because it's felt as a settle rather than a pop.

### 5.4 Command palette input

```jsx
<div className="border-b border-white/10 px-5">
  <div className="flex items-center gap-3 py-4">
    <Search className="w-4 h-4 text-neutral-500 flex-none" />
    <input
      autoFocus
      placeholder="Search boards, links, or type a command…"
      className="
        flex-1 bg-transparent
        text-sm text-neutral-100 placeholder:text-neutral-500
        outline-none
      "
    />
    <kbd className="
      flex-none px-1.5 py-0.5 rounded
      bg-white/5 border border-white/10
      text-[10px] font-mono text-neutral-500
    ">
      ESC
    </kbd>
  </div>
</div>
```

Note: no visible focus ring on the input itself — in a command palette the entire container is the focus target conceptually, so a ring on the `<input>` duplicates the modal's own border and looks like a rendering glitch. Reserve `focus-visible:ring-2 ring-accent-500/50` for standalone form fields (settings forms, add-link forms) where the input is one of several competing elements, per §5.5.

### 5.5 Standard form input (non-palette)

```jsx
<input
  className="
    w-full px-3.5 py-2.5
    rounded-lg
    bg-white/[0.03] border border-white/10
    text-sm text-neutral-100 placeholder:text-neutral-500
    outline-none
    transition-colors duration-150
    focus:border-accent-500/50 focus:bg-white/[0.05]
    focus-visible:ring-2 focus-visible:ring-accent-500/20
  "
/>
```

### 5.6 Floating footer bar (modal actions)

```jsx
<div className="
  flex items-center justify-between
  mt-8 pt-6
  border-t border-white/10
">
  <p className="text-xs text-neutral-500">
    Press <kbd className="px-1 py-0.5 rounded bg-white/5 text-neutral-400">⌘ Enter</kbd> to save
  </p>
  <div className="flex items-center gap-2">
    <button className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-neutral-200 transition-colors">
      Cancel
    </button>
    <button className="
      px-4 py-2 rounded-lg
      bg-accent-500 text-black text-sm font-medium
      hover:bg-accent-500/90
      transition-colors
      shadow-[0_0_20px_-4px_var(--color-accent-glow)]
    ">
      Save
    </button>
  </div>
</div>
```

---

## 6. Stats Counter Pills

### 6.1 Problems identified
Likely rendered as plain text ("24 links · 6 boards") with no visual container — pills need a defined chip boundary to read as data rather than a caption.

### 6.2 Pill structure with count-up

```jsx
<div className="flex items-center gap-2">
  <StatPill icon={Link2} value={linkCount} label="links" />
  <StatPill icon={LayoutGrid} value={boardCount} label="boards" />
</div>
```

```jsx
function StatPill({ icon: Icon, value, label }) {
  const spring = useSpring(0, { stiffness: 100, damping: 20 });
  const display = useTransform(spring, (v) => Math.round(v));
  useEffect(() => { spring.set(value); }, [value]);

  return (
    <div className="
      inline-flex items-center gap-1.5
      px-2.5 py-1 rounded-full
      bg-white/[0.04] border border-white/10
      text-xs text-neutral-400
    ">
      <Icon className="w-3 h-3" />
      <motion.span className="text-neutral-200 font-medium tabular-nums">
        {display}
      </motion.span>
      {label}
    </div>
  );
}
```

`useSpring` + `useTransform` from Framer Motion drives the count-up on mount or on value change (e.g. after adding a link) — this is a two-line addition over a static number and is disproportionately noticed by users because it's a "living data" signal, similar to Vercel's deployment counters.

---

## 7. Motion System — shared variants

Centralize these in `src/lib/motion.ts` so every component above imports the same easing curve instead of redefining `[0.16, 1, 0.3, 1]` inline five times:

```ts
export const easeVesper = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 4 },
  transition: { duration: 0.25, ease: easeVesper },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.98, y: 4 },
  transition: { duration: 0.2, ease: easeVesper },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.04 } },
};
```

Apply `staggerContainer` to the bento grid's parent and `fadeUp` to each `BoardCard` as its `variants` prop — this is what makes a grid of cards feel like it "arrives" on load instead of popping in as one flat block, at negligible implementation cost.

---

## 8. Implementation Checklist (for the coding agent)

Execute in this order — later sections depend on the token layer from §1:

1. [ ] Add `@theme` token block to `src/index.css` (§1).
2. [ ] Register `easeVesper` and shared motion variants in `src/lib/motion.ts` (§7).
3. [ ] Update Hero component: gradient headline, ambient glow layer, status pill (§2).
4. [ ] Update bento grid container: asymmetric span for one featured card, independent `gap-x`/`gap-y` (§3.2).
5. [ ] Rewrite `BoardCard`: replace `scale-105` hover with `y`-translate + border-beam + anchored glow (§3.3–3.4).
6. [ ] Rewrite bookmark row: fixed favicon box with fallback, hover-revealed `IconButton` actions (§4).
7. [ ] Rewrite modal backdrop + container to `backdrop-blur-2xl` / `p-8 sm:p-10` standard (§5.2–5.3).
8. [ ] Differentiate command-palette input (no ring) from standard form inputs (ring on focus) (§5.4–5.5).
9. [ ] Add `StatPill` with spring count-up, replace any plain-text stats (§6).
10. [ ] Apply `staggerContainer`/`fadeUp` to bento grid mount animation (§7).
11. [ ] Sweep codebase for hardcoded `#0c120e`, `border-white/10`, etc. and replace with the token utilities from §1 for future-proofing.

---

## 9. Explicit non-goals

To keep this scoped and prevent the agent from over-building:
- Do not add cursor-tracking spotlight effects to every card (§3.3 explains why the anchored-glow approach is used instead at this card density).
- Do not introduce a second accent color system — the featured-card treatment (§3.4) reuses the board's existing accent token, it does not add a new global "brand gradient."
- Do not replace Framer Motion with a new animation library to achieve any effect above — every pattern here is achievable with the existing stack (Framer Motion + Tailwind v4 arbitrary values).
