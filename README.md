# DataQuestAI 🚀 — Production & Pedagogy V2

> **An interactive data-systems laboratory where a learner can learn a concept, construct it, execute it, break it, diagnose it, repair it, observe its behaviour, and prove mastery using real database operations.**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FFrankAsanteVanLaarhoven%2FDataQuestAI)
[![Live Demo](https://img.shields.io/badge/Vercel-db--quest.vercel.app-success?logo=vercel&style=for-the-badge)](https://db-quest.vercel.app)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue?logo=github&style=for-the-badge)](https://github.com/FrankAsanteVanLaarhoven/DataQuestAI)
[![Automated Tests](https://img.shields.io/badge/Tests-17%20Passing-emerald?style=for-the-badge)](scripts/verify-all.mjs)

- **Recommended Short Production Domain**: [https://db-quest.vercel.app](https://db-quest.vercel.app)
- **Ultra-Short Domain Option**: [https://dq-db.vercel.app](https://dq-db.vercel.app)

---

## 🌟 What is DataQuestAI V2?

DataQuestAI transforms the traditional database course from passive reading and simulated buttons into an **empirically observable, instrumented data-systems laboratory**. 

Learners follow the **7-Stage Pedagogical Loop**:
```text
  1. EXPLAIN   ──> Plain words & conceptual definition
  2. SHOW IT   ──> Illustrated animated diagrams
  3. BUILD IT  ──> Drag-and-drop schema architecture
  4. RUN IT    ──> Isolated real SQL execution engine
  5. BREAK IT  ──> Deliberate error & bottleneck injection
  6. FIX IT    ──> Socratic diagnosis & root-cause remediation
  7. PROVE IT  ──> Capstone verification & mastery telemetry
```

---

## 🛠️ Production V2 Architecture & Core Enhancements

### 1. ⚙️ Real Isolated SQL Execution Engine (`SqlLabEngine`)
Replaced pattern-matching simulations with an in-memory SQL execution engine:
- **Full Query Parsing**: `SELECT` with `WHERE`, `ORDER BY`, and `LIMIT`; `INSERT` with column validation; `UPDATE` with arithmetic increments; `DELETE` with conditional filters; `CREATE TABLE`; and `CREATE INDEX`.
- **Constraint Enforcement**: Validates `PRIMARY KEY` uniqueness and `NOT NULL` rules. Duplicate keys are strictly rejected.
- **`EXPLAIN QUERY PLAN` Generator**: Generates physical query plans distinguishing between high-speed `INDEX_SEEK` ($O(\log N)$ on B-Trees) and sequential `TABLE_SCAN` ($O(N)$).
- **Physical Row Mutation**: Running `UPDATE Books SET Copies = 5 WHERE BookID = 'B001'` physically changes the storage record, with instant visual consequence.

### 2. 🔐 Production Authentication & Persistent Platform Database
- **PBKDF2 Password Hashing**: Cryptographic password derivation with 100,000 iterations of SHA-256 and unique 16-byte random salts.
- **Constant-Time Verification**: Mitigates side-channel timing attacks.
- **Strict Login Validation**: No silent account creation on bad logins; invalid credentials return HTTP 401.
- **Session Tokens & RBAC**: Signed session tokens with expiration and Role-Based Access Control (`student`, `teacher`, `architect`, `admin`).
- **Audit Logging**: Write-only audit trail logging security actions, logins, and schema mutations.
- **PostgreSQL / WAL Storage**: Platform database supports PostgreSQL via `DATABASE_URL` with local file persistence and SQLite WAL mode (`PRAGMA journal_mode = WAL`).

### 3. 📊 Genuine Execution Telemetry & Observability
- Student queries emit structured telemetry records capturing `durationMs`, `rowsScanned`, `rowsReturned`, `rowsAffected`, and `indexUsed`.
- Live KPI computation: `totalQueries`, real-time `p95LatencyMs`, cache / index seek ratio, and storage utilization.
- Interactive Query Plan Benchmarker in the Analytics tab comparing sequential table scans (100,000 rows, 18.4ms) against B-Tree index seeks (1 row, 0.8ms).

### 4. 🤖 Grounded Adaptive AI Tutor & Misconception Engine
Replaced canned string hints with a dynamic diagnostic engine:
- **Misconception Taxonomy**:
  - `Entity vs Attribute Confusion`: Diagnoses when learners classify descriptive properties (e.g. *Date of Birth*) as entities; applies the **Independent Existence Test**.
  - `Primary vs Foreign Key Inversion`: Flags pointers placed on the wrong side of relationships.
  - `Direct M:N Relationship`: Diagnoses missing junction/associative entities (e.g., *Student ↔ Loan ↔ Book*).
  - `Missing WHERE Clause`: Warns before unbounded `UPDATE`/`DELETE` queries mutate all rows.
  - `Normalization Violations`: Flags 1NF, 2NF, and 3NF transitive dependencies.
- **Multi-Tiered Socratic Scaffolding**: Tier 1 (Nudge) → Tier 2 (Targeted Hint) → Worked Industry Example → Deep Conceptual Explanation.
- Records error frequencies to the instructor's class telemetry dashboard.

### 5. 🔬 Expanded CSC1033 Information Retrieval & Cloud Curriculum
Dedicated interactive laboratories:
- **Search Engine Pipeline Lab**: Interactive Document Ingestion → Tokenizer → Stop-word Filter → Porter Stemmer → Inverted Index Postings → Ranked Query Search.
- **Query Expansion Lab**: Lexical ontology synsets testing the fundamental precision vs. recall tradeoff (e.g., *car* expanding to *automobile, vehicle, motorcar*).
- **Semantic Web & Linked Data Lab**: Interactive W3C RDF Triple constructor (`Subject` ── `Predicate` ──▶ `Object`) with transitivity inference.
- **Metadata Lab**: Physical separation of raw image pixel payload data from Dublin Core & EXIF descriptive/administrative metadata attributes.
- **Faceted Search Lab**: S.R. Ranganathan multi-attribute faceted classification with dynamic population pruning across brand, price range, color, and storage.
- **Cloud Computing Scalability Lab**: Concurrency slider (100 to 100,000 users) simulating thread contention, allowing students to provision Load Balancers, Read Replicas, Redis Caches, and Message Queues.
- **Vector Database & LLM RAG Lab**: High-dimensional vector embeddings, cosine similarity search, and deliberate retrieval failure injection causing hallucinations.
- **Consequential Data Ethics Lab**: GDPR Article 5 data minimisation challenge: pruning special category medical, religious, and passport records from student promotion views.

### 6. 🎓 Teacher Studio
- **Declarative Mission Builder**: Instructors can author custom database challenges without touching code, specifying allowed components, expected relationships, XP rewards, and diagnostic hints.
- **Class Misconception Analytics**: Visual distribution charts showing cohort error rates across Entity/Attribute confusion (31%), PK/FK (22%), M:N junctions (19%), and missing WHERE clauses (13%).
- **Student Mastery Gradebook**: Real-time tracking of completions, scores, hint dependency, and individual misconception traps.

### 7. 🏛️ Digital University Final Capstone & Chaos Mode
- Unified campus simulation connecting all 10 departments: Admissions, Student SIS, Courses, Library, Payments, Accommodation, Search, OLAP Warehouse, AI RAG, and Privacy Governance.
- **RUN UNIVERSITY**: Streams live student requests through the system.
- **Chaos Mode**: Injects real-world operational incidents:
  - *10,000 students registering simultaneously* (scale with replicas).
  - *Search engine returning noise* (reindex with stop-word filter).
  - *GDPR medical data leak* (enforce column-level security projection).

---

## 🧪 Automated Verification Suite

Run the automated test suite verifying the SQL engine, indexing, authentication, and misconception rules:

```bash
npm test
```

Output:
```text
🧪 Starting DataQuestAI Production V2 Automated Verification...

  ✓ PASS: SELECT query executed successfully
  ✓ PASS: SELECT returned filtered Science books
  ✓ PASS: INSERT query added new row
  ✓ PASS: INSERT recorded 1 row affected
  ✓ PASS: Duplicate PRIMARY KEY insertion rejected
  ✓ PASS: UPDATE query executed
  ✓ PASS: UPDATE affected 1 row
  ✓ PASS: Physical row Copies updated to 5
  ✓ PASS: DELETE query executed
  ✓ PASS: DELETE affected 1 row
  ✓ PASS: EXPLAIN query recognized
  ✓ PASS: EXPLAIN verified INDEX_SEEK on indexed CustomerID
  ✓ PASS: EXPLAIN verified TABLE_SCAN on unindexed Status
  ✓ PASS: PBKDF2 generated 256-bit SHA-256 hash
  ✓ PASS: Constant-time password verification succeeded
  ✓ PASS: Invalid password correctly rejected
  ✓ PASS: Session token generated with prefix and role

📊 Verification Complete: 17 passed, 0 failed.
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ (Node 22+ recommended for native `node:sqlite`)
- npm or yarn

### Local Setup
```bash
git clone https://github.com/FrankAsanteVanLaarhoven/DataQuestAI.git
cd DataQuestAI
npm install
npm test
npm run dev
```

Visit `http://localhost:3008` in your browser.
