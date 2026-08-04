<div align="center">

# ⚡ OriList — Personal Visual Workspace

<p align="center">
  <b>A high-performance, personal visual bookmark dashboard built by Ori Stern.</b><br/>
  Featuring glassmorphic depth, cursor-reactive ambient lighting, bento grid layout, and an interactive Command Palette.
</p>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Author](https://img.shields.io/badge/Author-Ori%20Stern-863BFF?style=for-the-badge)](https://github.com/OSK0020)

</div>

---

> ### 💬 Note from the Developer
> *"סך הכל היה נמאס לי מהמגבלות של לומי ליסט, אז יצרתי אחת משלי לשימוש הפרטי כדי לא לפגוע בהם."*  
> 
> *"Basically, I got tired of LumiList's artificial limitations and restrictions, so I built my own high-performance visual workspace from scratch for private productivity without interfering with their platform."*  
> — **Ori Stern**

---

## ✨ Features Overview

### 🎨 1. Violet & Lumen Design Architecture
Grounded in a bespoke dark glassmorphic palette:
- **Warm Void (`#08070a`)** base background with subtle radial violet (`#863bff`) and lumen amber (`#f5b942`) aurora glows.
- **Cursor-Reactive Lighting**: Radial light sweep follows cursor movement in real time.
- **Interactive Light Particles**: Dynamic canvas micro-particles trailing pointer interaction.

### ⌨️ 2. Instant Command Palette (`Ctrl+K` / `Cmd+K`)
Global keyboard-driven popup menu to navigate your entire workspace effortlessly:
- Search through all bookmarks, URLs, and boards with fuzzy matching.
- Execute quick actions: *Add Link, Create Board, Add Page, Export JSON, Toggle Privacy Blur, Generate Share Card*.

### 🗂️ 3. Bento Grid & Drag-and-Drop Reordering
- **Board Reordering**: Grab board handles to reorder columns seamlessly across a 4-column bento layout.
- **Bookmark Moving**: Drag individual bookmark links from one board card directly onto another.

### 🎨 4. Custom Board Accent Color Themes
Assign custom brand color tags to boards for instant visual scanning:
- 💜 `Violet (#863bff)`
- 💛 `Lumen Amber (#f5b942)`
- 💚 `Emerald (#10b981)`
- 🩷 `Rose (#f43f5e)`
- 🩵 `Cyan (#06b6d4)`
- 💙 `Sapphire (#3b82f6)`

### 📸 5. Built-in Social Share Card Generator
Generates a crisp 1200x630 HTML5 Canvas graphic showcasing your active workspace, stats, and board previews with 1-click PNG download.

### 🔒 6. Privacy Blur Mode & Portability
- **Privacy Blur**: Toggle privacy mode (`Ctrl+Shift+P` / rail button) to obscure sensitive links during presentations or screen shares.
- **Portability**: 1-click JSON import/export for instant local backups.

---

## 🛠️ Tech Stack & Architecture

- **Core Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling & Design System**: Tailwind CSS v4 + Vanilla CSS Custom Variables
- **Icons**: [Lucide React](https://lucide.react.dev/)
- **Typography**: Space Grotesk (Display), Inter (Body), JetBrains Mono (Data & Status)
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites
- Node.js `18.x` or higher
- npm / yarn / pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/OSK0020/lumilist-clone.git orilist

# Navigate to project directory
cd orilist

# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 👨‍💻 Author

Crafted with care by **Ori Stern**
- GitHub: [@OSK0020](https://github.com/OSK0020)

---

<div align="center">
  <sub>OriList © 2026. Personal productivity workspace built by Ori Stern.</sub>
</div>
