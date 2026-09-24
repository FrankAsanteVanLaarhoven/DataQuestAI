/**
 * CSC1033: Complete Database Systems & Information Retrieval Curriculum
 * Accredited Syllabus Specification with Academic References & Enterprise Benchmarks.
 * Organized in standard 12-Week Semester Sequence.
 */

export interface WeekCurriculum {
  week: number;
  title: string;
  badge: string;
  tagline: string;
  accreditedSpec: string;
  referencePoint: {
    academic: string;
    standard: string;
    enterprise: string;
  };
  pedagogy: {
    simple: string;
    engineer: string;
  };
  narration: string;
  capstone: {
    id: string;
    title: string;
    description: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const CSC1033_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Data Foundations & Physical Representation',
    badge: 'Foundations',
    tagline: 'How computers store, serialize, and represent structured, semi-structured, and unstructured data',
    accreditedSpec: 'CSC1033 Specification: Topic 1.1 — Data vs Information, Bits, Bytes, and Schema Topologies',
    referencePoint: {
      academic: 'Elmasri, R. & Navathe, S.B. (2015). Fundamentals of Database Systems (7th Ed.), Chapter 1: Databases and Database Users. Pearson.',
      standard: 'ISO/IEC 11179: Information Technology — Metadata Registries (MDR Specification for Data Elements).',
      enterprise: 'PostgreSQL Heap Tuple storage format vs Amazon S3 raw binary payloads & JSON documents.',
    },
    pedagogy: {
      simple: 'Data is information recorded so we can store it, search it, and use it later. Inside the computer, everything is represented as tiny electrical switches called bits (0 or 1). Structured data fits in tidy tables with columns; semi-structured data uses tags like JSON; and unstructured data is raw media like photos or audio.',
      engineer: 'A bit represents a single binary digit. Eight bits form an octet (byte). Relational DBMS architectures map structured records into fixed-width or variable-width slotted-page heap blocks on disk, contrasting with schema-less semi-structured serialized representations (JSON/BSON/XML) and unparsed byte streams (BLOBs).',
    },
    narration: 'Welcome to Week 1. In this module, we examine how computers represent facts as digital data, moving from electrical bits and bytes to structured relational tables, self-describing JSON documents, and raw binary media.',
    capstone: {
      id: 'cap_data_inspector',
      title: 'Interactive Multi-Format Data Inspector & Bitstream Transformer',
      description: 'Inspect real data payloads across Structured (Tabular), Semi-Structured (JSON), and Unstructured (Raw Binary) formats with live bitstream transformations.',
    },
    quiz: {
      question: 'Which of the following best characterizes semi-structured data?',
      options: [
        'A rigid relational table with fixed column types and no nested attributes',
        'Data containing internal markers and self-describing tags (such as JSON or XML) without a rigid pre-declared tabular schema',
        'Raw, unparsed video frames and audio waveform samples',
        'A paper ledger filed physically in an office cabinet',
      ],
      correctIndex: 1,
      explanation: 'Semi-structured data contains self-describing tags or key-value pairs (like JSON, YAML, or XML) that allow structural variance without requiring a fixed database schema definition.',
    },
  },
  {
    week: 2,
    title: 'Conceptual Modeling & Entity-Relationship Diagrams (ERDs)',
    badge: 'Conceptual Design',
    tagline: 'Entities, attributes, relationships, and resolving Many-to-Many cardinality traps',
    accreditedSpec: 'CSC1033 Specification: Topic 1.2 — Entity-Relationship Modeling & Crow’s Foot Notation',
    referencePoint: {
      academic: 'Chen, P.P. (1976). The Entity-Relationship Model: Toward a Unified View of Data. ACM Transactions on Database Systems (TODS), 1(1), pp. 9–36.',
      standard: 'Crow’s Foot ERD Notation Specification (Barker, R., CASE*Method Entity Relationship Modelling, Addison-Wesley).',
      enterprise: 'Enterprise Data Architecture models: Salesforce CRM & Workday ERP relational schema foundations.',
    },
    pedagogy: {
      simple: 'An Entity is a real-world thing you care about (like a Student or a Book). An Attribute is a fact that describes it (like Name or Price). A Relationship connects them (Students borrow Books). When many students can borrow many books, we resolve the tangle by building a bridge table called a Junction Table!',
      engineer: 'An Entity possesses independent existence in the domain and is uniquely identified by a Primary Key (PK). When an M:N cardinality occurs, it violates first-order relational storage and must be decomposed into two 1:N binary relationships via an associative junction entity containing foreign key references.',
    },
    narration: 'In Week 2, we transition from raw data to conceptual design. We apply Peter Chen’s Entity-Relationship framework and Crow’s Foot notation to construct robust data models that prevent cardinality traps.',
    capstone: {
      id: 'cap_erd_builder',
      title: 'Interactive Crow’s Foot ERD Junction Builder & Existence Tester',
      description: 'Construct relational entity nodes, designate Primary and Foreign Keys, and resolve M:N relationships using associative junction tables.',
    },
    quiz: {
      question: 'What is the primary role of a Foreign Key (FK) in relational database modeling?',
      options: [
        'To encrypt table contents to prevent unauthorized read access',
        'To establish a referential link pointing to a Primary Key in another table, enforcing referential integrity',
        'To automatically calculate arithmetic sums across all rows in a column',
        'To render all rows in the referenced table strictly read-only',
      ],
      correctIndex: 1,
      explanation: 'A Foreign Key points to the Primary Key of another table, guaranteeing referential integrity so child rows cannot point to non-existent parent records.',
    },
  },
  {
    week: 3,
    title: 'The Relational Model & Relational Algebra',
    badge: 'Formal CS Theory',
    tagline: 'Relations, tuples, candidate keys, and mathematical relational operators (σ, π, ×, ⨝)',
    accreditedSpec: 'CSC1033 Specification: Topic 2.1 — Codd’s Relational Model & Formal Algebraic Operators',
    referencePoint: {
      academic: 'Codd, E.F. (1970). A Relational Model of Data for Large Shared Data Banks. Communications of the ACM (CACM), 13(6), pp. 377–387.',
      standard: 'Relational Algebra Mathematical Foundation (Date, C.J., An Introduction to Database Systems, 8th Ed.).',
      enterprise: 'Google F1 / CockroachDB distributed relational query planners translating SQL into relational algebraic trees.',
    },
    pedagogy: {
      simple: 'Think of relational algebra like high school math, but for tables instead of numbers! Selection (σ) filters rows like a sieve. Projection (π) chooses columns. Cartesian Product (×) pairs up every row from one table with every row of another.',
      engineer: 'A relation R is a mathematical subset of the Cartesian product of n domains D1 × D2 × ... × Dn. Operators are closed: every operation takes relations as input and yields a relation as output. Fundamental operations include Selection (σ_condition), Projection (π_attributes), Cartesian Product (×), and Natural Join (⨝).',
    },
    narration: 'Week 3 introduces the theoretical crown jewel of computer science: Edgar F. Codd’s 1970 relational model. We explore how set theory and relational algebra provide the formal foundation for all modern relational engines.',
    capstone: {
      id: 'cap_relational_algebra',
      title: 'Relational Algebra Query Sandbox & Tuple Projection Matrix',
      description: 'Execute formal Selection (σ), Projection (π), and Cross Product (×) operations on physical tables and inspect output relation sets.',
    },
    quiz: {
      question: 'In formal Relational Algebra, what is the exact function of the Selection operator (σ)?',
      options: [
        'It selects specific vertical columns from the table, discarding all other columns',
        'It filters horizontal tuples (rows) that satisfy a specified predicate condition',
        'It creates a new database table and deletes the previous table',
        'It sorts all records alphabetically by primary key',
      ],
      correctIndex: 1,
      explanation: 'Selection (denoted by Greek letter σ) filters rows (tuples) based on a Boolean condition, whereas Projection (π) filters vertical columns (attributes).',
    },
  },
  {
    week: 4,
    title: 'SQL Data Definition (DDL) & Data Manipulation (DML)',
    badge: 'SQL Engineering',
    tagline: 'CREATE TABLE, column types, integrity constraints (NOT NULL, PK, FK), and physical mutations',
    accreditedSpec: 'CSC1033 Specification: Topic 2.2 — SQL Syntax, Table Construction, Constraints, & Mutations',
    referencePoint: {
      academic: 'Chamberlin, D.D. & Boyce, R.F. (1974). SEQUEL: A Structured English Query Language. ACM SIGFIDET Workshop, pp. 249–264.',
      standard: 'ISO/IEC 9075:2023 — Information Technology — Database Languages — SQL (SQL Foundation Specification).',
      enterprise: 'SQLite 3.45 / PostgreSQL 16 DDL constraint validator engine.',
    },
    pedagogy: {
      simple: 'SQL has two main jobs: DDL builds the structure (like blueprinting a house with CREATE TABLE and rules like NOT NULL), while DML moves the furniture in and out (INSERT new items, UPDATE values, DELETE old rows, and SELECT to find them).',
      engineer: 'Data Definition Language (DDL) alters the database catalog schema and catalog tables, establishing domain integrity (CHECK, NOT NULL, DEFAULT) and referential constraints (FOREIGN KEY ON DELETE/UPDATE). Data Manipulation Language (DML) manages tuple lifecycles with declarative transactional semantics.',
    },
    narration: 'In Week 4, we put theory into practice with SQL. We write Data Definition statements to establish physical tables with strict constraints, followed by Data Manipulation queries to execute physical mutations.',
    capstone: {
      id: 'cap_sql_mutations',
      title: 'In-Memory AST SQL Mutation Lab & Constraint Enforcer',
      description: 'Execute physical CREATE TABLE, INSERT, UPDATE, and DELETE commands in an isolated AST engine and test constraint rejections.',
    },
    quiz: {
      question: 'What happens when an INSERT query attempts to add a row with a Duplicate Primary Key in an ACID-compliant SQL engine?',
      options: [
        'The engine overwrites the existing row silently without notifying the user',
        'The transaction rejects the insertion and throws a Primary Key Uniqueness violation error',
        'The engine creates a second copy with the same ID and adds a suffix',
        'The entire database shuts down permanently',
      ],
      correctIndex: 1,
      explanation: 'Primary Keys require strict entity uniqueness. Inserting a duplicate PK causes the relational engine to reject the operation and raise a unique constraint violation.',
    },
  },
  {
    week: 5,
    title: 'Relational Joins & Query Execution Plans',
    badge: 'Query Optimization',
    tagline: 'INNER, LEFT, RIGHT, FULL, and CROSS joins, Hash Join mechanics, and plan explanations',
    accreditedSpec: 'CSC1033 Specification: Topic 3.1 — Multi-Table Relational Joins & Execution Algorithms',
    referencePoint: {
      academic: 'Graefe, G. (1993). Query Evaluation Techniques for Large Databases. ACM Computing Surveys (CSUR), 25(2), pp. 73–170.',
      standard: 'ANSI SQL:1992 Explicit Join Syntax Specification (JOIN ... ON).',
      enterprise: 'PostgreSQL Hash Join vs Nested Loop Join vs Merge Join optimizer heuristics.',
    },
    pedagogy: {
      simple: 'When information lives across multiple tables, Joins piece them together like puzzle pieces! An INNER JOIN gives you rows where both sides match. A LEFT JOIN keeps everything from the left table, even if the right table has no match (filling missing parts with NULL).',
      engineer: 'A Join combines tuples from two relations based on join predicates. The database query optimizer builds execution trees choosing among Nested Loop (O(M × N)), Sort-Merge (O(M log M + N log N)), or In-Memory Hash Join (O(M + N)). EXPLAIN reveals the planner’s selected physical operator.',
    },
    narration: 'Week 5 explores relational joins and query execution. We analyze how database query planners choose between Nested Loops and Hash Joins to combine millions of rows across foreign key relationships in milliseconds.',
    capstone: {
      id: 'cap_relational_joins',
      title: 'Interactive Multi-Table Join Sandbox & Hash Join Plan Explainer',
      description: 'Run live INNER JOIN, LEFT JOIN, and 3-way chained joins, and inspect how EXPLAIN QUERY PLAN constructs Hash Join operators.',
    },
    quiz: {
      question: 'What is the output behavior of a LEFT OUTER JOIN when a row in the left table has zero matching rows in the right table?',
      options: [
        'The row from the left table is omitted completely from the output',
        'The row from the left table is retained, and all right-table columns are populated with NULL values',
        'The query aborts with a runtime syntax error',
        'The engine picks a random row from the right table to fill the gap',
      ],
      correctIndex: 1,
      explanation: 'A LEFT OUTER JOIN preserves all tuples from the left relation. If no tuple in the right relation satisfies the join condition, right-side projected columns are extended with NULL.',
    },
  },
  {
    week: 6,
    title: 'Database Normalization & Design Quality',
    badge: 'Relational Theory',
    tagline: 'Eliminating insertion, update, and deletion anomalies through 1NF, 2NF, 3NF, and BCNF',
    accreditedSpec: 'CSC1033 Specification: Topic 3.2 — Normalization Theory, Functional Dependencies, & 3NF',
    referencePoint: {
      academic: 'Codd, E.F. (1972). Further Normalization of the Data Base Relational Model. In Data Base Systems, Courant Computer Science Symposia Series 6, Prentice-Hall, pp. 33–64.',
      standard: 'Boyce-Codd Normal Form (BCNF) Formulation (Boyce, R.F. & Codd, E.F., 1974).',
      enterprise: 'Stripe Ledger core relational schema: strict 3NF enforcement for double-entry financial balances.',
    },
    pedagogy: {
      simple: 'Imagine writing someone’s address in ten different rows. If they move, you have to update all ten rows! If you forget one, your data is corrupted (Update Anomaly). Normalization is the process of organizing tables so every fact is recorded in exactly ONE place.',
      engineer: 'A table is in 1NF if all domain values are atomic. It is in 2NF if in 1NF and no non-prime attribute is partially dependent on any candidate key. It is in 3NF if in 2NF and no non-prime attribute is transitively dependent on the primary key (X → Y requires X to be a superkey or Y to be prime).',
    },
    narration: 'In Week 6, we master database normalization. We study functional dependencies and decompose unnormalized schemas step-by-step into First, Second, and Third Normal Form to permanently eliminate data redundancy and anomalies.',
    capstone: {
      id: 'cap_normalization_splitter',
      title: 'Interactive 3NF Normalization Decomposer & Anomaly Simulator',
      description: 'Deconstruct a denormalized customer order table with transitive dependencies into 3NF relation schemas and test anomaly prevention.',
    },
    quiz: {
      question: 'Which condition is strictly required for a table to achieve Third Normal Form (3NF)?',
      options: [
        'The database must run across at least three physical server clusters',
        'The table must be in 2NF and have zero transitive functional dependencies (no non-key attribute depends on another non-key attribute)',
        'Every column must store multiple comma-separated values in each cell',
        'Every table must contain at least three primary keys',
      ],
      correctIndex: 1,
      explanation: '3NF requires that the relation is in 2NF and that no non-prime attribute is transitively dependent on the primary key. In Codd’s phrase: every attribute must depend on the key, the whole key, and nothing but the key.',
    },
  },
  {
    week: 7,
    title: 'Physical Storage, B-Tree Indexes & Query Optimization',
    badge: 'Systems & Performance',
    tagline: 'Clustered vs non-clustered indexes, B-Tree O(log N) seeks vs O(N) table scans, and EXPLAIN plans',
    accreditedSpec: 'CSC1033 Specification: Topic 4.1 — Storage Structures, B-Tree Indexes, & Access Path Selection',
    referencePoint: {
      academic: 'Bayer, R. & McCreight, E. (1972). Organization and Maintenance of Large Ordered Indexes. Acta Informatica, 1(3), pp. 173–189.',
      standard: 'B-Tree & B+ Tree balanced search structure specification.',
      enterprise: 'Oracle & Microsoft SQL Server clustered B+ Tree index engines vs MySQL InnoDB primary leaf pages.',
    },
    pedagogy: {
      simple: 'Imagine looking for a word in an encyclopedia. Without an index, you would have to flip through every page from start to finish (a slow Table Scan). With a B-Tree index at the back, you jump straight to the exact page in 3 quick hops, even if the book has a million pages!',
      engineer: 'A B-Tree maintains balanced multi-way search nodes stored on contiguous disk pages. While a sequential full-table scan requires O(N) I/O operations, a B-Tree index seek reduces the access path to O(log_B N) where B is the page branch factor. EXPLAIN QUERY PLAN contrasts INDEX SEEK with TABLE SCAN.',
    },
    narration: 'Week 7 explores physical database performance. We study the B-Tree data structure invented by Bayer and McCreight, demonstrating how balanced indexes eliminate sequential table scans and accelerate searches from seconds to microseconds.',
    capstone: {
      id: 'cap_btree_analyzer',
      title: 'Live B-Tree Query Plan Benchmarker & 100k-Row Scan vs Seek Lab',
      description: 'Analyze query execution plans on indexed vs unindexed columns, compare O(N) sequential scans with O(log N) B-Tree seeks, and measure disk reads.',
    },
    quiz: {
      question: 'Why do production databases use B-Tree indexes for primary keys instead of sequential table scans?',
      options: [
        'B-Trees reduce search lookup cost from O(N) linear scan to O(log N) tree navigation',
        'B-Trees prevent students from querying the database outside office hours',
        'B-Trees remove all negative numbers from the database automatically',
        'B-Trees compress the database so it can fit on magnetic tape',
      ],
      correctIndex: 0,
      explanation: 'A B-Tree maintains sorted keys across balanced nodes, enabling point lookups and range scans in O(log N) time rather than scanning all N rows sequentially.',
    },
  },
  {
    week: 8,
    title: 'Transaction Management & ACID Guarantees',
    badge: 'Reliability & ACID',
    tagline: 'Atomicity, Consistency, Isolation, Durability, Write-Ahead Logging (WAL), and locking',
    accreditedSpec: 'CSC1033 Specification: Topic 4.2 — Transaction Processing, ACID Model, & Concurrency Control',
    referencePoint: {
      academic: 'Gray, J. (1981). The Transaction Concept: Virtues and Limitations. Proceedings of the 7th International Conference on Very Large Data Bases (VLDB), pp. 144–154.',
      standard: 'Two-Phase Locking (2PL) & ARIES Recovery Algorithm (Mohan et al., 1992, ACM TODS).',
      enterprise: 'PostgreSQL Write-Ahead Logging (WAL) & Multi-Version Concurrency Control (MVCC) isolation engine.',
    },
    pedagogy: {
      simple: 'Imagine transferring money between two bank accounts. If the app crashes halfway through, money might vanish into thin air! ACID guarantees that either the whole transfer completes successfully (Commit), or everything is completely undone back to how it was (Rollback).',
      engineer: 'A transaction is an atomic unit of execution satisfying ACID: Atomicity (all-or-nothing rollback), Consistency (valid state transitions), Isolation (serializability without dirty or phantom reads via 2PL/MVCC), and Durability (persistence guaranteed across crashes via synchronous Write-Ahead Log flushing).',
    },
    narration: 'In Week 8, we dive into Jim Gray’s transaction concept. We explore the four ACID guarantees and investigate how database engines use Write-Ahead Logging and concurrency control to guarantee zero financial corruption under crash conditions.',
    capstone: {
      id: 'cap_acid_simulator',
      title: 'All-or-Nothing Financial Transaction Simulator & WAL Rollback Lab',
      description: 'Trigger multi-statement financial balance transfers, simulate unexpected crashes during execution, and inspect automatic Write-Ahead Log rollbacks.',
    },
    quiz: {
      question: 'Under ACID properties, what does "Atomicity" guarantee for a database transaction?',
      options: [
        'Data values must be stored on microscopic atomic particles',
        'All statements in the transaction must execute successfully, or the entire transaction rolls back completely (All-or-Nothing)',
        'Multiple transactions can inspect and modify uncommitted dirty data simultaneously',
        'Queries are automatically converted from SQL to Python in background threads',
      ],
      correctIndex: 1,
      explanation: 'Atomicity guarantees that a transaction is indivisible: either all changes are permanently committed, or if any step fails, the entire transaction is rolled back with zero partial changes applied.',
    },
  },
  {
    week: 9,
    title: 'Information Retrieval & Search Engine Architecture',
    badge: 'Information Retrieval',
    tagline: 'Document ingestion, tokenization, stop-word elimination, stemming, and inverted indexes',
    accreditedSpec: 'CSC1033 Specification: Topic 5.1 — Text Processing, Inverted Index Construction, & IR Metrics',
    referencePoint: {
      academic: 'Manning, C.D., Raghavan, P., & Schütze, H. (2008). Introduction to Information Retrieval. Cambridge University Press.',
      standard: 'Porter Stemmer Algorithm (Porter, M.F., 1980, Program, 14(3), pp. 130–137).',
      enterprise: 'Apache Lucene / Elasticsearch core inverted index postings engine & TF-IDF relevance scoring.',
    },
    pedagogy: {
      simple: 'How does Google find a web page in a fraction of a second among billions of documents? It flips the text inside out! Instead of reading every book when you search for "relational", it keeps an index of every word with a list of pages where that word appears (an Inverted Index).',
      engineer: 'Information Retrieval pipelines ingest corpus documents, apply lexical tokenization, filter high-frequency stop-words, normalize morphological variants via stemming (Porter/Snowball), and construct dictionary term indices mapped to inverted postings lists with term frequency (TF) and inverse document frequency (IDF) weights.',
    },
    narration: 'Week 9 bridges relational databases and unstructured text search. We study the core Information Retrieval algorithms behind Google and Elasticsearch, building an inverted index with tokenization, stop-word filtering, and suffix stemming.',
    capstone: {
      id: 'cap_search_engine',
      title: 'Live Document Inverted Index Search Engine Laboratory',
      description: 'Ingest raw documents, run real-time tokenization and stop-word filtering, construct inverted posting lists, and execute ranked boolean queries.',
    },
    quiz: {
      question: 'Why do modern search engines (like Lucene and Elasticsearch) build Inverted Indexes rather than scanning document text directly?',
      options: [
        'Scanning documents one-by-one is O(N) and takes minutes, whereas an Inverted Index allows immediate O(1) dictionary lookups into sorted document posting lists',
        'Inverted indexes convert all English text into hexadecimal numbers to save disk space',
        'Inverted indexes delete all documents that contain more than 100 words',
        'Direct document scanning is forbidden by internet web standards',
      ],
      correctIndex: 0,
      explanation: 'An inverted index maps terms directly to their posting lists of document IDs, providing sub-millisecond keyword retrieval rather than performing a prohibitive sequential scan across the corpus.',
    },
  },
  {
    week: 10,
    title: 'Advanced IR, Metadata Architecture & Semantic Web',
    badge: 'Semantic Web & IR',
    tagline: 'Dublin Core, EXIF payload separation, faceted search pruning, and W3C RDF triples',
    accreditedSpec: 'CSC1033 Specification: Topic 5.2 — Metadata Architecture, Faceted Search, & Semantic Linked Data',
    referencePoint: {
      academic: 'Berners-Lee, T., Hendler, J., & Lassila, O. (2001). The Semantic Web. Scientific American, 284(5), pp. 34–43.',
      standard: 'W3C Resource Description Framework (RDF 1.1 Specification); ISO 15836: Dublin Core Metadata Element Set.',
      enterprise: 'Wikidata Knowledge Graph & Amazon eCommerce multi-attribute faceted navigation.',
    },
    pedagogy: {
      simple: 'Metadata is data about data! When you take a photo, the image pixels are the payload, while the camera type, GPS location, and timestamp are metadata. On shopping websites, faceted search lets you click Brand, Price, and Color to quickly narrow down choices.',
      engineer: 'Metadata separates descriptive, structural, and administrative attributes (Dublin Core, EXIF) from binary payloads. Faceted search implements S.R. Ranganathan’s multi-dimensional classification with dynamic cardinality pruning. The Semantic Web models knowledge using W3C RDF Triples: (Subject ── Predicate ──▶ Object).',
    },
    narration: 'In Week 10, we explore metadata standards, faceted eCommerce classification, and Tim Berners-Lee’s vision of the Semantic Web. We construct RDF knowledge triples and examine how graph-linked data powers modern search engines.',
    capstone: {
      id: 'cap_metadata_semantic',
      title: 'Interactive Quad-Laboratory Suite: Metadata, Facets, Expansion & Semantic Triples',
      description: 'Explore EXIF vs payload separation in MetadataLab, multi-attribute faceted pruning in FacetedSearchLab, synonym graphs in QueryExpansionLab, and W3C RDF Triples in SemanticWebLab.',
    },
    quiz: {
      question: 'In the W3C Semantic Web and Resource Description Framework (RDF), what are the three components of an RDF Triple?',
      options: [
        'HTML, CSS, and JavaScript',
        'Subject, Predicate, and Object',
        'Input, Process, and Output',
        'Host, Port, and Protocol',
      ],
      correctIndex: 1,
      explanation: 'An RDF Triple models linked data as a directed graph node statement: (Subject ── Predicate ──▶ Object), e.g., (DataQuest ── teaches ──▶ RelationalDatabases).',
    },
  },
  {
    week: 11,
    title: 'Distributed Systems, NoSQL & Cloud Scalability',
    badge: 'Cloud & Distributed',
    tagline: 'Scale-Up vs Scale-Out, the CAP Theorem, read-replicas, Redis caching, and sharding',
    accreditedSpec: 'CSC1033 Specification: Topic 6.1 — Distributed Architecture, CAP Theorem, & High-Concurrency Scaling',
    referencePoint: {
      academic: 'Brewer, E.A. (2000). Towards Robust Distributed Systems. ACM Symposium on Principles of Distributed Computing (PODC), keynote.',
      standard: 'DeCandia et al. (2007). Dynamo: Amazon’s Highly Available Key-value Store. ACM SOSP, pp. 205–220.',
      enterprise: 'Amazon DynamoDB (AP) vs Google Cloud Spanner (CP) global consensus architecture.',
    },
    pedagogy: {
      simple: 'When a million people visit your app at the same time, a single computer will crash under load! Cloud scalability lets you add Read Replicas (extra helper databases to handle reads) and Redis Caching (fast memory storage for frequent answers) to handle immense traffic without slowing down.',
      engineer: 'Scaling strategies divide into Vertical (Scale-Up) and Horizontal (Scale-Out). The CAP Theorem states that during a network partition (P), a distributed data store must choose between Consistency (CP) and Availability (AP). Architectures employ In-Memory Caching (Redis), Read Replicas, and Sharding to decouple throughput.',
    },
    narration: 'Week 11 tackles high-concurrency cloud scalability. We analyze Eric Brewer’s CAP Theorem, testing how read replicas, Redis memory caches, and message queues allow database clusters to survive over 100,000 requests per second.',
    capstone: {
      id: 'cap_cloud_scaling',
      title: 'Live Cloud Concurrency Scalability Simulator (100 to 100,000 QPS)',
      description: 'Slide concurrency to 100k requests/sec, observe database thread saturation and latency spikes, and provision Load Balancers, Read Replicas, and Redis Caches to stabilize the cluster.',
    },
    quiz: {
      question: 'According to the CAP Theorem, when an unavoidable network partition (P) occurs between distributed nodes, what trade-off must be made?',
      options: [
        'The system can provide 100% Consistency and 100% Availability simultaneously with zero delay',
        'The system must choose between guaranteeing immediate Consistency (CP) OR responding to all requests with Availability (AP)',
        'The system must automatically convert all databases into single-user spreadsheets',
        'Both Consistency and Availability are immediately lost permanently',
      ],
      correctIndex: 1,
      explanation: 'The CAP Theorem proves that a distributed system cannot guarantee both Consistency (all nodes see the latest write) and Availability (every request receives a response) simultaneously during an active network partition (P).',
    },
  },
  {
    week: 12,
    title: 'Data Governance, Ethics & Next-Gen AI Vector Databases',
    badge: 'Ethics & AI Horizons',
    tagline: 'UK GDPR compliance, Article 5/9 data minimization, high-dimensional vector embeddings, and RAG',
    accreditedSpec: 'CSC1033 Specification: Topic 6.2 — Data Ethics, Regulatory Governance, & AI Vector Search',
    referencePoint: {
      academic: 'Vaswani, A. et al. (2017). Attention Is All You Need. Advances in Neural Information Processing Systems (NeurIPS), 30, pp. 5998–6008.',
      standard: 'UK General Data Protection Regulation (UK GDPR) / Data Protection Act 2018 (Article 5 Principles & Article 9 Special Category).',
      enterprise: 'Pinecone / Milvus / pgvector high-dimensional cosine similarity indexers for Generative AI applications.',
    },
    pedagogy: {
      simple: 'With great data power comes great responsibility! The UK GDPR law says you should only collect the data you truly need (Data Minimization) and protect sensitive things like medical history (Article 9). Meanwhile, modern AI uses Vector Databases to turn sentences into numbers and find related ideas by measuring angles!',
      engineer: 'Data architects have legal and ethical fiduciary obligations under UK GDPR Article 5(1)(c) (Data Minimisation) and Article 9 (Special Category Data prohibition without explicit consent). In AI engineering, vector databases index dense float32 embeddings using HNSW graphs to perform Cosine Similarity retrieval for Retrieval-Augmented Generation (RAG).',
    },
    narration: 'Our final week bridges data protection laws and the frontier of AI. We audit database schemas against UK GDPR Article 5 and 9 compliance, then explore how high-dimensional vector databases and cosine similarity empower Large Language Models.',
    capstone: {
      id: 'cap_ethics_vector',
      title: 'Dual Capstone Suite: GDPR Compliance Auditor & AI Vector Embedding Lab',
      description: 'Audit databases for UK GDPR compliance in DataEthicsLab, and compute real vector cosine similarities for semantic retrieval in VectorAiLab.',
    },
    quiz: {
      question: 'Under UK GDPR Article 9, how is data concerning health, genetic records, or religious beliefs classified?',
      options: [
        'Standard public domain information that can be shared freely with advertisers',
        'Special Category Data requiring enhanced protection, strict safeguards, and explicit lawful basis for processing',
        'Unstructured image data that is exempt from privacy regulations',
        'Data that must be permanently deleted every 24 hours',
      ],
      correctIndex: 1,
      explanation: 'Under UK GDPR Article 9, health data, racial/ethnic origin, and religious beliefs are designated as Special Category Data and are prohibited from processing unless explicit conditions (such as explicit consent) are met.',
    },
  },
];
