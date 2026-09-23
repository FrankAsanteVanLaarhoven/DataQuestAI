# DataQuestAI 🚀

> **CSC1033 Made Simple — Gamified Database & Enterprise Architecture Learning Platform**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFrankAsanteVanLaarhoven%2FDataQuestAI)
[![Live Demo](https://img.shields.io/badge/Vercel-Live%20Demo-success?logo=vercel&style=for-the-badge)](https://temporary-rushing-pearl-9vona5c.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github&style=for-the-badge)](https://github.com/FrankAsanteVanLaarhoven/DataQuestAI)

**Live Application**: [https://temporary-rushing-pearl-9vona5c.vercel.app](https://temporary-rushing-pearl-9vona5c.vercel.app)

DataQuestAI is an interactive, full-stack learning platform designed for computer science students, lecturers, and enterprise data architects. It turns relational database theory, ERD modeling, SQL optimization, and large-scale enterprise system design into an engaging gamified experience.

---

## 🌟 Key Features

- **🎮 Capstone Game: Build a Mini Data Enterprise**:
  - Drag-and-drop Lucid-style canvas for entity-relationship and system topology design.
  - Interactive wire dragging to connect entities, attributes, primary/foreign keys, cache layers, and queues.
  - Live visual feedback: green glowing bubbles for valid architecture rules, red halos with auto-recommendations for anomalies.
  - Instant deletion via click (❌ button), double-click/double-tap, or right-click context menu.
  - Auto-layout button to organize messy diagrams into structured grids.
  - Export DDL to generate clean standard SQL `CREATE TABLE` and constraint statements.
- **⚡ Live Data Streaming & Transaction Feed**:
  - In-memory ACID relational database simulator executing live `INSERT`, `SELECT`, `UPDATE`, and `DELETE` queries.
  - Real-time event log with duration telemetry and detailed transaction inspector.
- **🤖 AI Learning Coach**:
  - Context-aware guidance assistant providing hints, concept breakdowns, SQL code examples, and step-by-step next actions.
- **🔒 Clerk-Style Authentication & SQLite Persistence**:
  - One-click Google and GitHub social logins, guest demo mode, and email/password sign-in.
  - **Custom Avatar Import**: Upload personal profile photos (for LinkedIn, university ID, etc.) or choose from custom avatars.
  - Role selection for **Students**, **Teachers**, and **Enterprise Architects**.
  - Persistent SQLite storage (`dataquest.sqlite`) powered by native `node:sqlite`.
- **🌐 7-Language Internationalization (i18n)**:
  - English (`en`), Español (`es`), Français (`fr`), Deutsch (`de`), 中文 (`zh`), 日本語 (`ja`), and العربية (`ar` with bidirectional `dir="rtl"` layout).
- **🌍 Community Enterprise Showcase**:
  - Publish custom canvas architectures with architectural reasoning and trade-off justifications (+100 XP).
  - Fork community schemas directly into your canvas or upvote designs.
- **🏆 Global Leaderboard & Badges**:
  - Real-time ranking podium and level progression tracking with day streaks and XP milestones.
- **📚 Interactive CSC1033 Curriculum Roadmap**:
  - 6 chapters covering Relational Theory, ERD Modeling, Normalization (1NF–3NF), SQL Query Engine, Indexing & Performance, and NoSQL / NewSQL Architectures.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS + Custom Lucid Grid & Glow Animations
- **Database**: SQLite (`node:sqlite` Native Engine)
- **State Management**: Zustand with `localStorage` rehydration
- **Icons**: Lucide React
- **Audio Synthesizer**: Native Web Audio API (zero audio file dependencies)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ (Node 22+ recommended for native `node:sqlite`)
- npm or yarn

### Installation & Local Setup

```bash
# Clone the repository
git clone https://github.com/FrankAsanteVanLaarhoven/DataQuestAI.git
cd DataQuestAI

# Install dependencies
npm install

# Run the development server
npm run dev

# Open http://localhost:3000 in your browser
```

---

## ☁️ Deployment (Vercel)

DataQuestAI is configured for Vercel deployment with `/tmp` database path fallback for serverless execution:

```bash
npx vercel --prod
```

---

## 📄 License

MIT © 2026 Frank Asante Van Laarhoven
