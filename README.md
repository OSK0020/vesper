# ✨ LumiList — Visual Bookmarks Workspace & Dashboard

> A high-performance, dark glassmorphism clone of **LumiList**. Transform your browser bookmarks into organized, visual boards and pages with automatic site logos, instant live search, local persistence, and JSON backup/restore.

![LumiList Preview](https://img.shields.io/badge/LumiList-v1.0.0-6366f1?style=for-the-badge&logo=react&logoColor=white)
![Vercel Ready](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![License](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)

---

## 🌟 Features

- 🎨 **Modern Dark Glassmorphism UI:** Built with glowing ambient gradients, backdrop blurs, and smooth micro-animations.
- 🖼️ **Automatic Favicons & Logos:** Next to every link, site logos and favicons are automatically fetched using Google S2 Favicon API with fallbacks.
- 📑 **Pages & Boards Navigation:** Group your bookmarks into Pages (e.g. `HOME`, `WORK`) and Boards (e.g. `DAILY ROUTINE`, `SHOPPING & RETAIL`, `STUDIES & EDUCATION`).
- ➕ **Dynamic Link & Board Management:** Add, edit, or remove links and custom boards with real-time feedback.
- 🔍 **Instant Fuzzy Search (`Ctrl + K`):** Filter your bookmarks live by title, URL, or board category.
- 💾 **100% Client-Side LocalStorage Persistence:** All changes persist locally across browser sessions.
- 🔄 **LumiList Portability (Import / Export):** Export your entire collection as a `.json` file or import official LumiList backups.
- 🚀 **Vercel & Static Host Ready:** Zero server dependencies, instant static build deployment.

---

## 📁 Repository Structure

```
FAKE LUMILIST/
├── public/                  # Static assets
├── src/
│   ├── components/          # Modular React components
│   │   ├── Navbar.jsx       # Header, page tabs, search, action buttons
│   │   ├── BoardGrid.jsx    # Column layout manager for boards
│   │   ├── BoardCard.jsx    # Individual board container with category icons
│   │   ├── BookmarkItem.jsx # Link item with logo & hover actions
│   │   ├── AddBookmarkModal.jsx  # Add & edit link modal
│   │   ├── AddBoardModal.jsx     # Add board modal
│   │   ├── AddPageModal.jsx      # Add page modal
│   │   └── ImportExportModal.jsx # Backup & restore modal
│   ├── data/
│   │   └── initialBookmarks.json # 182 preloaded bookmarks dataset
│   ├── utils/
│   │   └── favicon.js       # Favicon parser & fallback utilities
│   ├── App.jsx              # Main workspace state & logic
│   ├── main.jsx             # React DOM entrypoint
│   └── index.css            # Design system & glassmorphism CSS
├── package.json             # Project metadata & dependencies
├── vite.config.js           # Vite build configuration
├── vercel.json              # Vercel deployment configuration
└── README.md                # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/lumilist-clone.git
   cd lumilist-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start local dev server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📦 Deployment to Vercel

1. Push your repository to GitHub.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Framework Preset will automatically detect **Vite**.
5. Click **"Deploy"** — your live dashboard will be online in seconds!

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
