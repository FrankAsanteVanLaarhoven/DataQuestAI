# DataQuestAI 🚀

> **a data-base course end to end with illustrations, and gamification**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFrankAsanteVanLaarhoven%2FDataQuestAI)
[![Live Demo](https://img.shields.io/badge/Vercel-db--quest.vercel.app-success?logo=vercel&style=for-the-badge)](https://db-quest.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github&style=for-the-badge)](https://github.com/FrankAsanteVanLaarhoven/DataQuestAI)

- **Recommended Short Production Domain**: [https://db-quest.vercel.app](https://db-quest.vercel.app)
- **Ultra-Short Domain Option**: [https://dq-db.vercel.app](https://dq-db.vercel.app)
- **Vercel Domains Settings**: [frank-asante-van-laarhovens-projects/data-quest-ai/settings/domains](https://vercel.com/frank-asante-van-laarhovens-projects/data-quest-ai/settings/domains)

**DataQuestAI** is a complete, production-ready, interactive **database course end to end with illustrations, and gamification**. Built for computer science students (CSC1033), university lecturers, and enterprise software engineers, it teaches foundational data concepts through to high-scale enterprise architectures using hands-on interactive visual diagrams, live SQLite code execution, and gamified challenges.

---

## 📚 End-to-End Course Curriculum (Illustrated & Gamified)

1. **Chapter 1: What Data Is & How Computers Store It**
   - *Visual Illustrations*: Structured (Relational Grid) vs Semi-Structured (JSON/XML Tree) vs Unstructured (Vector Embeddings/BLOBs) + CPU Storage Latency Hierarchy.
   - *Gamification*: +50 XP Chapter Knowledge Check Quiz.
2. **Chapter 2: Database Building Blocks & ERD Modeling**
   - *Visual Illustrations*: Crow’s Foot Relational ERD Diagram (Entities, Attributes, Primary Keys 🔑, Foreign Keys 🔗, 1:1, 1:N, and M:N Junction Tables).
   - *Gamification*: +50 XP Referential Integrity Quiz.
3. **Chapter 3: Relational DBs, SQL Mastery & 3NF Normalisation**
   - *Visual Illustrations*: Normalisation Pipeline (1NF Atomic Values → 2NF Full Functional Dependency → 3NF Transitive Dependency Removal).
   - *Interactive Sandbox*: Live interactive SQL console with real SQLite execution.
   - *Gamification*: +50 XP Normalisation Quiz.
4. **Chapter 4: Search Systems, B-Tree Indexes & Retrieval**
   - *Visual Illustrations*: B-Tree Index Hierarchy Diagram ($O(\log N)$ seeks vs $O(N)$ sequential scans) and Inverted Indexes for full-text search.
   - *Gamification*: +50 XP Indexing Optimization Quiz.
5. **Chapter 5: Transactions, ACID & OLTP vs OLAP**
   - *Visual Illustrations*: ACID Quadrant (Atomicity, Consistency, Isolation, Durability) and Row-Store (OLTP) vs Columnar-Store (OLAP) memory layouts.
   - *Gamification*: +50 XP Transactional Isolation Quiz.
6. **Chapter 6: Big Data, AI Vector DBs & Enterprise Ethics**
   - *Visual Illustrations*: CAP Theorem Triangle (Consistency, Availability, Partition Tolerance) and AI Vector Similarity Space (Cosine similarity for RAG).
   - *Gamification*: +50 XP Distributed Systems Quiz + Certified Database Architect Graduation Credential.

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
