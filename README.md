<div align="center">

# 🌙 VESPER

<p align="center">
  <b>Your Digital Space, Illuminated.</b><br/>
  <i>Zero Friction. Pure Visual Flow.</i>
</p>

<p align="center">
  A high-performance visual workspace.<br/>
  Featuring glassmorphic depth, cursor-reactive ambient lighting, bento grid layout, and an interactive Command Palette.
</p>

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4.3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

</div>

---

> ### 💬 Origin Note
> *"סך הכל היה נמאס לי מהמגבלות של לומי ליסט, אז יצרתי אחת משלי לשימוש הפרטי כדי לא לפגוע בהם."*  
> 
> *"Basically, I got tired of LumiList's artificial limitations and restrictions, so I built my own high-performance visual workspace from scratch for private productivity without interfering with their platform."*

---

## ✨ Features Overview

### 💾 1. Local Storage Persistence & Computer Transfer
- **Local Storage Persistence**: All your bookmarks, custom column boards, pages, accent colors, brightness settings, and glass transparency preferences are automatically saved in real time to LocalStorage (`vesper_bookmarks_data`, `vesper_boards_meta`).
- **Computer Transfer Package**: Export your entire workspace state into a single JSON package (`vesper-workspace-backup-[date].json`). Easily move your links, boards, and layout to a new computer in seconds.
- **Auto-Board & Table Generation**: Importing a backup file automatically parses all pages, reconstructs missing board tables, and restores custom accent colors.
- **5MB File Safety Guard**: Built-in file size validation ensures backup files stay under 5MB to guarantee instant parsing and zero memory overload.

### 🎨 2. Violet & Lumen Design Architecture
- **Warm Void (`#08070a`)** base background with subtle radial violet (`#863bff`) and lumen amber (`#f5b942`) aurora glows.
- **Cursor-Reactive Lighting**: Radial light sweep follows cursor movement in real time.
- **Interactive Light Particles**: Dynamic canvas micro-particles trailing pointer interaction.
- **Glass Transparency Modes**: Switch between 💎 *Crystal Glass* (ultra transparent), 🧊 *Frosted Glass*, and 🖤 *Solid Obsidian*.
- **Brightness Modes**: Switch between ☀️ *Luminous*, ✨ *Balanced*, and 🌙 *Deep Void*.

### ⌨️ 3. Instant Command Palette (`Ctrl+K` / `Cmd+K`)
Global keyboard-driven popup menu to navigate your entire workspace effortlessly:
- Search through all bookmarks, URLs, and boards with fuzzy matching.
- Execute quick actions: *Add Link, Create Board, Add Page, Export JSON, Toggle Privacy Blur, Generate Share Card*.

### 🗂️ 4. Bento Grid & Drag-and-Drop Reordering
- **Board Reordering**: Grab board handles to reorder columns seamlessly across a 4-column bento layout.
- **Bookmark Moving**: Drag individual bookmark links from one board card directly onto another.

### 🎨 5. Custom Board Accent Color Themes
Assign custom brand color tags to boards for instant visual scanning:
- 💜 `Violet (#863bff)`
- 💛 `Lumen Amber (#f5b942)`
- 💚 `Emerald (#10b981)`
- 🩷 `Rose (#f43f5e)`
- 🩵 `Cyan (#06b6d4)`
- 💙 `Sapphire (#3b82f6)`

### 📸 6. Built-in Social Share Card Generator
Generates a crisp 1200x630 HTML5 Canvas graphic showcasing your active workspace, stats, and board previews with 1-click PNG download.

---

## 🛠️ Tech Stack

- **Core Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Styling & Design Tokens**: Tailwind CSS v4 + Custom CSS Properties
- **Icons**: [Lucide React](https://lucide.react.dev/)
- **Typography**: Space Grotesk (Display), Inter (Body), JetBrains Mono (Data & Status)
- **Deployment**: Vercel

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/OSK0020/lumilist-clone.git vesper

# Navigate to project directory
cd vesper

# Install dependencies
npm install

# Start local development server
npm run dev
```

---

<div align="center">
  <sub>VESPER © 2026. Your Digital Space, Illuminated.</sub>
</div>
