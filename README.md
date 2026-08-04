<div align="center">

# 🌙 VESPER

<p align="center">
  <b>The Limitless Visual Workspace — Illuminated.</b><br/>
  <i>Zero Artificial Boundaries. Pure Visual Flow. Offline-First Privacy.</i>
</p>

<p align="center">
  A high-performance visual bookmarking & board management engine.<br/>
  Built with <b>React 19</b>, <b>Vite 8</b>, and <b>Tailwind CSS v4</b>, featuring glassmorphic depth, cursor-reactive ambient lighting, interactive Command Palette, and local-first data architecture.
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
  <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS v4" /></a>
  <a href="https://github.com/oxc-project/oxlint"><img src="https://img.shields.io/badge/Linter-Oxlint-ff69b4?style=for-the-badge" alt="Oxlint" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge" alt="License" /></a>
</p>

</div>

---

## ⚡ The "Why": Reclaiming the Visual Workspace

> *"Basically, I got tired of LoomiList's artificial paywalls, arbitrary list boundaries, and clunky UX constraints—so I engineered my own high-performance, limit-free visual workspace from scratch."*
> — **[OSK0020](https://github.com/OSK0020)**

Most modern bookmarking and link management tools follow a predictable pattern: sleek marketing pages hiding artificial feature caps, forced cloud syncs, paywalled customization, and bloated interfaces. 

**VESPER** was born out of a simple engineering philosophy: **build software without artificial limits**. 

Inspired by the visual core of LoomiList, VESPER completely rebuilds the product experience with total user freedom—offering unlimited boards, custom pages, local-first offline persistence, fine-grained glassmorphic aesthetics, and instant keyboard-driven navigation.

---

## ✨ Core Features & Technical Highlights

### 💾 1. Offline-First Local Architecture & Computer Transfer
* **Zero Telemetry & 100% Privacy**: All bookmarks, custom board order, multi-page layouts, brightness preferences, and glass transparency settings persist locally in real-time (`vesper_bookmarks_data`, `vesper_boards_meta`).
* **Computer Transfer Package**: Export your entire digital workspace state into a single, clean `.json` file (`vesper-workspace-backup-[date].json`). Transfer your workspace across machines in milliseconds.
* **Auto-Reconstruction Engine**: Importing a backup package automatically validates schema, restores custom board accent colors, and reconstructs missing board categories on the fly.
* **5MB Memory Guard**: Integrated input validation and size guard caps file uploads to 5MB, protecting browser memory from overload.

### 🎨 2. Violet & Lumen Design System
* **Warm Void Foundation**: Custom color palette built around `#08070a` (Warm Void), vibrant violet brand identity (`#863bff`), and glowing amber lumen accents (`#f5b942`).
* **Cursor-Reactive Ambient Glow**: Real-time radial light tracking (`--mx`, `--my`) running on hardware-accelerated `requestAnimationFrame` loops.
* **Pointer-Tracked Light-Catch Edges**: Glass card borders dynamically catch and refract ambient light based on cursor position.
* **Micro-Interaction Suite**:
  * `useTilt`: Hardware-accelerated 3D card tilt on mouse movement.
  * `useMagnetic`: Magnetic pull vector calculation on primary call-to-action buttons.
  * `useReveal`: Staggered, non-blocking `IntersectionObserver` scroll animations.
  * `LumenParticles`: Interactive HTML5 Canvas particle system trailing cursor movement.

### ⌨️ 3. Instant Command Palette (`Ctrl+K` / `Cmd+K`)
Global keyboard-driven command hub for friction-free workspace control:
* **Fuzzy Workspace Search**: Instantly query all bookmarks, URLs, and board titles.
* **One-Touch Actions**: Quick triggers for *Add Link*, *Create Board*, *Add Page*, *Export/Import JSON*, *Toggle Privacy Blur*, *Generate Share Card*, and *Cycle Brightness*.

### 🗂️ 4. Bento Grid Board Management & Reordering
* **Drag-and-Drop Board Cards**: Reorder board columns effortlessly across a dynamic 4-column bento layout.
* **Cross-Board Link Movement**: Drag bookmark rows directly between different board cards to reorganize collections.
* **Multi-Page Routing**: Organize links into dedicated pages (`HOME`, `WORK`, `DEV`, `PERSONAL`) with dynamic page extraction.
* **6 Custom Board Accent Themes**: Color-tag boards for instant visual scanning using `#863bff` (Violet), `#f5b942` (Lumen Amber), `#10b981` (Emerald), `#f43f5e` (Rose), `#06b6d4` (Cyan), and `#3b82f6` (Sapphire).

### 🔒 5. Privacy Obfuscation & Display Controls
* **Privacy Blur Mode**: 1-click instant UI blur for sensitive URLs and bookmark titles—ideal for screen sharing and recorded demos.
* **3 Brightness Modes**: Switch between ☀️ *Luminous*, ✨ *Balanced*, and 🌙 *Deep Void*.
* **Glass Transparency Modes**: Toggle between 💎 *Crystal Glass* (ultra transparent), 🧊 *Frosted Glass*, and 🖤 *Solid Obsidian*.

### 📸 6. Canvas Social Share Generator
* **1-Click Share Cards**: Render a crisp 1200×630 HTML5 Canvas graphic summarizing active workspace stats, board previews, and brand identity with instant PNG download.

### ♿ 7. Production-Grade Accessibility
* Unified `useEscapeClose` hook ensuring every modal dismisses predictably on `Escape`.
* Global focus-visible indicator rings (`:focus-visible`).
* `prefers-reduced-motion` compliance disabling ambient animations and light sweeps automatically for users with motion sensitivity.

---

## 🛠️ Tech Stack & Infrastructure

| Layer | Technologies |
| :--- | :--- |
| **Core Framework** | [React 19.2](https://react.dev/) + [Vite 8.1](https://vitejs.dev/) (ES Modules) |
| **Styling & Design** | [Tailwind CSS v4.3](https://tailwindcss.com/) + Native CSS Custom Properties (Tokens) |
| **Icons & Visuals** | [Lucide React](https://lucide.react.dev/) + Custom HTML5 Canvas Particle Engine |
| **Typography** | Space Grotesk (Display), Inter (Body), JetBrains Mono (Data & Status) |
| **Code Quality** | [Oxlint](https://github.com/oxc-project/oxlint) (High-speed Rust-based linter) |
| **Deployment** | [Vercel](https://vercel.com/) ready (`vercel.json`) |

---

## 📂 Project Architecture

```
lumilist-clone/
├── public/                  # Static assets & brand SVG marks
├── src/
│   ├── components/          # Reusable UI & Modal components
│   │   ├── AddBoardModal.jsx
│   │   ├── AddBookmarkModal.jsx
│   │   ├── AddPageModal.jsx
│   │   ├── BoardCard.jsx
│   │   ├── BoardGrid.jsx
│   │   ├── BookmarkItem.jsx
│   │   ├── CommandPalette.jsx
│   │   ├── FloatingRail.jsx
│   │   ├── Hero.jsx
│   │   ├── ImportExportModal.jsx
│   │   ├── LumenParticles.jsx
│   │   ├── Navbar.jsx
│   │   ├── ShareCardModal.jsx
│   │   └── Toast.jsx
│   ├── constants/           # Design system tokens & accent definitions
│   │   └── boardAccents.js
│   ├── data/                # Initial seed workspace state
│   │   └── initialBookmarks.json
│   ├── utils/               # Dependency-free custom React hooks
│   │   ├── favicon.js       # Favicon extraction & SVG fallback generator
│   │   ├── useEscapeClose.js
│   │   ├── useMagnetic.js
│   │   ├── useReveal.js
│   │   └── useTilt.js
│   ├── App.jsx              # Main workspace orchestrator & state manager
│   ├── index.css            # Violet & Lumen design system tokens
│   └── main.jsx             # React DOM root entrypoint
├── index.html               # Semantic HTML5 entry & Open Graph meta tags
├── package.json             # NPM dependencies & build scripts
├── vite.config.js           # Vite server configuration & Tailwind integration
└── vercel.json              # Static deployment configuration
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/OSK0020/lumilist-clone.git vesper
   cd vesper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. **Lint the codebase**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview production build**:
   ```bash
   npm run preview
   ```

---

## 🧠 Engineering Philosophy & Methodology

VESPER was crafted under **[OSK0020](https://github.com/OSK0020)**'s core software engineering methodology: **"Vibe Coding"**.

* **Architectural Mastery**: Directing high-level system boundaries, visual state machines, zero-latency data persistence, and fine-grained UI physics.
* **AI Execution Engine**: Leveraging AI for rapid execution, component iteration, and lint-clean code synthesis.
* **Control & Independence**: Eliminating commercial bloat, paywalls, and telemetry in favor of elegant, self-contained software.

---

<div align="center">
  <sub>VESPER © 2026 • Engineered by <a href="https://github.com/OSK0020">OSK0020</a> • The Limitless Visual Workspace</sub>
</div>
