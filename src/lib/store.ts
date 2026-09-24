import { create } from 'zustand';
import {
  CanvasNode,
  CanvasEdge,
  Mission,
  CrudOperation,
  DataFeedEvent,
  ActivityItem,
  Badge,
  CommunityDesign,
  LeaderboardUser,
  ConceptType,
} from './types';
import { sound } from './audio';
import { dbSimulator } from './db-engine';
import { SupportedLanguage } from './i18n';
import { DECLARATIVE_MISSIONS } from './missions/declarative-missions';
import { tutorEngine } from './tutor-engine';
import { telemetryService } from './telemetry';
import { voiceEngine, VoiceProfileId } from './voice-engine';

export interface CompetencyBadge {
  id: string;
  title: string;
  tier: number;
  description: string;
  unlocked: boolean;
  requiredSkillProof: string;
  icon: string;
}

export const INITIAL_COMPETENCIES: CompetencyBadge[] = [
  {
    id: 'comp_data_explorer',
    title: 'DATA EXPLORER',
    tier: 1,
    description: 'Differentiate structured relational tables, semi-structured JSON documents, and unstructured payloads.',
    unlocked: true,
    requiredSkillProof: 'Inspect structured vs unstructured data formats in Chapter 1.',
    icon: '🧭',
  },
  {
    id: 'comp_table_builder',
    title: 'TABLE BUILDER',
    tier: 2,
    description: 'Model independent entities with primary keys and data types, passing the Independent Existence Test.',
    unlocked: true,
    requiredSkillProof: 'Construct an entity node with designated Primary Key in the Canvas.',
    icon: '🏗️',
  },
  {
    id: 'comp_relationship_builder',
    title: 'RELATIONSHIP BUILDER',
    tier: 3,
    description: 'Resolve Many-to-Many cardinality traps by constructing associative junction tables with foreign keys.',
    unlocked: true,
    requiredSkillProof: 'Complete Mission 2 (University Course Registry Junction).',
    icon: '🔗',
  },
  {
    id: 'comp_sql_operator',
    title: 'SQL OPERATOR',
    tier: 4,
    description: 'Execute genuine SELECT, INSERT, UPDATE, and DELETE queries modifying platform memory state.',
    unlocked: true,
    requiredSkillProof: 'Run physical mutation queries in the Live SQL Lab Sandbox.',
    icon: '⚡',
  },
  {
    id: 'comp_database_engineer',
    title: 'DATABASE ENGINEER',
    tier: 5,
    description: 'Enforce relational constraints: NOT NULL columns, Primary Key uniqueness, and Foreign Key referential integrity.',
    unlocked: false,
    requiredSkillProof: 'Trigger and remediate a Foreign Key constraint rejection in SQL Lab.',
    icon: '🛡️',
  },
  {
    id: 'comp_query_optimiser',
    title: 'QUERY OPTIMISER',
    tier: 6,
    description: 'Analyse execution plans and eliminate sequential table scans by engineering B-Tree indexes.',
    unlocked: false,
    requiredSkillProof: 'Execute CREATE INDEX and reduce a 100k-row scan to an index seek.',
    icon: '🚀',
  },
  {
    id: 'comp_data_architect',
    title: 'DATA ARCHITECT',
    tier: 7,
    description: 'Design distributed architectures with Redis caching, read-replicas, and message queues under load.',
    unlocked: false,
    requiredSkillProof: 'Provision scaling tiers in the Cloud Scalability Simulation Lab.',
    icon: '🏛️',
  },
  {
    id: 'comp_enterprise_architect',
    title: 'ENTERPRISE DATA ARCHITECT',
    tier: 8,
    description: 'Diagnose and remediate live architectural failures, privacy disclosures, and incidents in Chaos Mode.',
    unlocked: false,
    requiredSkillProof: 'Successfully mitigate an active incident in the Digital University simulation.',
    icon: '👑',
  },
];

interface AppState {
  // Navigation & User
  activeTab: 'capstone' | 'missions' | 'learn' | 'analytics' | 'community' | 'leaderboard' | 'teacher' | 'university';
  setActiveTab: (tab: AppState['activeTab']) => void;
  hintCount?: number;
  user: {
    id?: string;
    email?: string;
    name: string;
    avatar: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    streak: number;
    role: 'student' | 'teacher' | 'architect' | 'admin';
  };
  setUser: (user: Partial<AppState['user']>) => void;
  theme: 'vibrant' | 'dark' | 'system';
  setTheme: (theme: 'vibrant' | 'dark' | 'system') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  hasEnteredConsole: boolean;
  setHasEnteredConsole: (open: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  voiceProfile: VoiceProfileId;
  setVoiceProfile: (profile: VoiceProfileId) => void;
  speakCoachMessage: () => void;
  stopSpeaking: () => void;
  toggleRole: () => void;
  awardXp: (amount: number, reason: string) => void;

  // Dual-Layer Explanation Mode (Simple / Child-Friendly vs Engineer / Formal CS)
  explanationMode: 'simple' | 'engineer';
  setExplanationMode: (mode: 'simple' | 'engineer') => void;
  toggleExplanationMode: () => void;

  // Competency-Based Mastery Progression
  competencies: CompetencyBadge[];
  unlockCompetency: (id: string) => void;

  // Missions
  missions: Mission[];
  activeMissionId: string;
  selectMission: (id: string) => void;
  resetMissionCanvas: () => void;

  // Canvas
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  selectedNodeId: string | null;
  setSelectedNodeId: (id: string | null) => void;
  updateNodePosition: (id: string, x: number, y: number) => void;
  changeNodeType: (id: string, newType: ConceptType) => void;
  addNodeToCanvas: (type: ConceptType, label?: string, x?: number, y?: number) => void;
  removeNode: (id: string) => void;
  removeEdge: (id: string) => void;
  disconnectNode: (nodeId: string) => void;
  connectNodes: (fromId: string, toId: string) => void;
  checkSolution: () => { correct: number; total: number; allValid: boolean };
  autoLayoutCanvas: () => void;

  // CRUD Builder
  crudOperations: CrudOperation[];
  executeCrud: (op: CrudOperation) => void;
  addCustomCrud: (op: Omit<CrudOperation, 'id'>) => void;

  // Live Data Feed
  isLiveFeedRunning: boolean;
  toggleLiveFeed: () => void;
  dataFeedEvents: DataFeedEvent[];
  addFeedEvent: (event: DataFeedEvent) => void;

  // Activity Timeline
  activityTimeline: ActivityItem[];
  addActivity: (message: string, xpAward?: number, type?: ActivityItem['type']) => void;

  // AI Learning Coach
  aiCoachText: string;
  setAiCoachText: (msg: string) => void;
  coachAction: (actionType: 'hint' | 'explain' | 'example' | 'next') => void;

  // Badges & Gamification
  badges: Badge[];

  // Community & Custom Design
  communityDesigns: CommunityDesign[];
  fetchCommunityDesigns: () => Promise<void>;
  publishCustomDesign: (design: {
    title: string;
    domain: string;
    description: string;
    reasoning: string;
    tags: string[];
  }) => void;
  upvoteDesign: (id: string) => void;
  forkDesign: (designId: string) => void;

  // Leaderboard
  leaderboard: LeaderboardUser[];
}

export const initialMissions: Mission[] = DECLARATIVE_MISSIONS;

export const legacyMissions: Mission[] = [
  {
    id: 'mission-1',
    number: 1,
    title: 'E-Commerce & Checkout Fulfillment Engine',
    description: 'Architect a high-concurrency transactional database powering retail checkouts, order line items, and payment reconciliation.',
    level: 'Beginner',
    xpReward: 250,
    progress: 75,
    unlocked: true,
    completed: false,
    iconName: 'ShoppingCart',
    systemGoal: 'Establish 3NF normalized tables: Customer, Order, OrderItem, and Payment with primary/foreign keys and fix the misplaced attribute.',
    instructions: [
      'Live Setting: High-volume transactional checkout pipeline (Shopify / Stripe).',
      'Convert "Date of Birth" from an Entity into an Attribute on the Customer table.',
      'Ensure "Customer", "Order", and "Payment" are configured as core Entities.',
      'Verify "customer_id", "order_id", and "payment_id" serve as Primary Keys.',
      'Connect Customer (1) to Order (N), and Order (1) to Payment (1).',
    ],
    initialNodes: [
      {
        id: 'node-cust',
        type: 'entity',
        label: 'Customer',
        x: 60,
        y: 60,
        status: 'correct',
        feedback: 'Customer is a core 3NF entity storing verified buyer profiles.',
      },
      {
        id: 'node-rel-places',
        type: 'relationship',
        label: 'Places',
        x: 230,
        y: 60,
        status: 'correct',
        feedback: 'Valid 1-to-N relationship between Customer and Order.',
      },
      {
        id: 'node-order',
        type: 'entity',
        label: 'Order',
        x: 400,
        y: 60,
        status: 'idle',
      },
      {
        id: 'node-rel-pays',
        type: 'relationship',
        label: 'Settles',
        x: 570,
        y: 60,
        status: 'correct',
        feedback: 'Valid 1-to-1 relationship between Order and Payment.',
      },
      {
        id: 'node-payment',
        type: 'entity',
        label: 'Payment',
        x: 740,
        y: 60,
        status: 'idle',
      },
      {
        id: 'node-pk1',
        type: 'primaryKey',
        label: 'customer_id',
        x: 50,
        y: 200,
        status: 'correct',
        feedback: 'customer_id is the primary key for Customer.',
      },
      {
        id: 'node-dob',
        type: 'entity',
        label: 'Date of Birth',
        x: 200,
        y: 200,
        status: 'wrong',
        expectedType: 'attribute',
        feedback: 'Date of Birth is an attribute describing Customer, not an independent entity!',
        recommendation: 'Change "Date of Birth" card type to Attribute.',
      },
      {
        id: 'node-pk2',
        type: 'primaryKey',
        label: 'order_id',
        x: 380,
        y: 200,
        status: 'correct',
        feedback: 'order_id is the primary key for Order.',
      },
      {
        id: 'node-total',
        type: 'attribute',
        label: 'Total Amount',
        x: 520,
        y: 200,
        status: 'idle',
      },
      {
        id: 'node-pk3',
        type: 'primaryKey',
        label: 'payment_id',
        x: 730,
        y: 200,
        status: 'idle',
      },
    ],
    initialEdges: [
      { id: 'edge-1', fromId: 'node-cust', toId: 'node-rel-places', label: '1' },
      { id: 'edge-2', fromId: 'node-rel-places', toId: 'node-order', label: 'N' },
      { id: 'edge-3', fromId: 'node-cust', toId: 'node-pk1' },
      { id: 'edge-4', fromId: 'node-cust', toId: 'node-dob' },
      { id: 'edge-5', fromId: 'node-order', toId: 'node-pk2' },
      { id: 'edge-6', fromId: 'node-order', toId: 'node-total' },
      { id: 'edge-7', fromId: 'node-order', toId: 'node-rel-pays', label: '1' },
      { id: 'edge-8', fromId: 'node-rel-pays', toId: 'node-payment', label: '1' },
      { id: 'edge-9', fromId: 'node-payment', toId: 'node-pk3' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'Customer', validTypes: ['entity'] },
        { label: 'Order', validTypes: ['entity'] },
        { label: 'Payment', validTypes: ['entity'] },
        { label: 'Places', validTypes: ['relationship'] },
        { label: 'Settles', validTypes: ['relationship'] },
        { label: 'Date of Birth', validTypes: ['attribute'] },
        { label: 'Total Amount', validTypes: ['attribute', 'kpi'] },
        { label: 'customer_id', validTypes: ['primaryKey', 'foreignKey'] },
        { label: 'order_id', validTypes: ['primaryKey', 'foreignKey'] },
        { label: 'payment_id', validTypes: ['primaryKey'] },
      ],
      requiredRelationships: [
        { from: 'Customer', to: 'Order' },
        { from: 'Order', to: 'Payment' },
      ],
    },
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'Healthcare EHR & Clinical Data Infrastructure',
    description: 'Model HIPAA-compliant clinical systems linking Patients, Clinicians, Appointments, and Medical Prescriptions.',
    level: 'Intermediate',
    xpReward: 350,
    progress: 30,
    unlocked: true,
    completed: false,
    iconName: 'BookOpen',
    systemGoal: 'Structure patient encounter schemas ensuring doctor consultation histories and pharmaceutical dosages adhere to strict relational integrity.',
    instructions: [
      'Live Setting: Hospital EHR network & electronic prescribing (Epic Systems / HIPAA).',
      'Set "Patient" and "Clinician" as primary Entities with primary keys (patient_id, doctor_id).',
      'Classify "Dosage" as an Attribute on prescriptions (not an independent Entity).',
      'Set "Appointment" as an encounter Entity linked between Patient and Clinician.',
      'Verify "Diagnosis Code" acts as a clinical attribute.',
    ],
    initialNodes: [
      { id: 'node-pat', type: 'entity', label: 'Patient', x: 60, y: 60, status: 'idle' },
      { id: 'node-rel-sched', type: 'relationship', label: 'Schedules', x: 230, y: 60, status: 'idle' },
      { id: 'node-appt', type: 'entity', label: 'Appointment', x: 400, y: 60, status: 'idle' },
      { id: 'node-rel-att', type: 'relationship', label: 'Attends', x: 570, y: 60, status: 'idle' },
      { id: 'node-doc', type: 'entity', label: 'Clinician', x: 740, y: 60, status: 'idle' },
      { id: 'node-pat-pk', type: 'primaryKey', label: 'patient_id', x: 50, y: 200, status: 'idle' },
      {
        id: 'node-dosage',
        type: 'entity',
        label: 'Dosage',
        x: 200,
        y: 200,
        status: 'wrong',
        expectedType: 'attribute',
        feedback: 'Dosage is a prescription quantity (e.g. 500mg) and belongs as an attribute, not an independent entity!',
        recommendation: 'Change "Dosage" card type to Attribute.',
      },
      { id: 'node-appt-pk', type: 'primaryKey', label: 'appointment_id', x: 380, y: 200, status: 'idle' },
      { id: 'node-diag', type: 'attribute', label: 'Diagnosis Code', x: 530, y: 200, status: 'idle' },
      { id: 'node-doc-pk', type: 'primaryKey', label: 'doctor_id', x: 730, y: 200, status: 'idle' },
    ],
    initialEdges: [
      { id: 'e2-1', fromId: 'node-pat', toId: 'node-rel-sched', label: '1' },
      { id: 'e2-2', fromId: 'node-rel-sched', toId: 'node-appt', label: 'N' },
      { id: 'e2-3', fromId: 'node-doc', toId: 'node-rel-att', label: '1' },
      { id: 'e2-4', fromId: 'node-rel-att', toId: 'node-appt', label: 'N' },
      { id: 'e2-5', fromId: 'node-pat', toId: 'node-pat-pk' },
      { id: 'e2-6', fromId: 'node-appt', toId: 'node-appt-pk' },
      { id: 'e2-7', fromId: 'node-appt', toId: 'node-diag' },
      { id: 'e2-8', fromId: 'node-appt', toId: 'node-dosage' },
      { id: 'e2-9', fromId: 'node-doc', toId: 'node-doc-pk' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'Patient', validTypes: ['entity'] },
        { label: 'Clinician', validTypes: ['entity'] },
        { label: 'Appointment', validTypes: ['entity'] },
        { label: 'Schedules', validTypes: ['relationship'] },
        { label: 'Attends', validTypes: ['relationship'] },
        { label: 'Dosage', validTypes: ['attribute'] },
        { label: 'Diagnosis Code', validTypes: ['attribute'] },
        { label: 'patient_id', validTypes: ['primaryKey', 'foreignKey'] },
        { label: 'appointment_id', validTypes: ['primaryKey'] },
        { label: 'doctor_id', validTypes: ['primaryKey'] },
      ],
      requiredRelationships: [
        { from: 'Patient', to: 'Appointment' },
        { from: 'Clinician', to: 'Appointment' },
      ],
    },
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'Global Media Streaming Telemetry & Search Engine',
    description: 'Build the data architecture for real-time video streaming sessions, media metadata catalogs, and inverted search indexes.',
    level: 'Advanced',
    xpReward: 400,
    progress: 15,
    unlocked: true,
    completed: false,
    iconName: 'Search',
    systemGoal: 'Architect an inverted search index coupled with streaming session telemetry to deliver sub-10ms search lookups and playback logs.',
    instructions: [
      'Live Setting: High-throughput media streaming & recommendation graph (Netflix / Spotify).',
      'Establish "MediaAsset" and "UserAccount" as core catalog and audience Entities.',
      'Configure "Search Index" as a dedicated Search Primitive for title indexing.',
      'Fix "Bitrate Kbps" from an Entity into an Attribute or KPI metric.',
      'Connect UserAccount to StreamSession (1-to-N) and StreamSession to MediaAsset.',
    ],
    initialNodes: [
      { id: 'node-user', type: 'entity', label: 'UserAccount', x: 60, y: 60, status: 'idle' },
      { id: 'node-rel-streams', type: 'relationship', label: 'Streams', x: 230, y: 60, status: 'idle' },
      { id: 'node-session', type: 'entity', label: 'StreamSession', x: 400, y: 60, status: 'idle' },
      { id: 'node-rel-plays', type: 'relationship', label: 'Plays', x: 570, y: 60, status: 'idle' },
      { id: 'node-media', type: 'entity', label: 'MediaAsset', x: 740, y: 60, status: 'idle' },
      { id: 'node-user-pk', type: 'primaryKey', label: 'user_id', x: 50, y: 200, status: 'idle' },
      {
        id: 'node-bitrate',
        type: 'entity',
        label: 'Bitrate Kbps',
        x: 200,
        y: 200,
        status: 'wrong',
        expectedType: 'attribute',
        feedback: 'Bitrate is a telemetry performance metric measuring streaming quality, not a relational entity!',
        recommendation: 'Change "Bitrate Kbps" card type to Attribute or KPI.',
      },
      { id: 'node-sess-pk', type: 'primaryKey', label: 'session_id', x: 380, y: 200, status: 'idle' },
      { id: 'node-search', type: 'search', label: 'Search Index', x: 550, y: 200, status: 'correct', feedback: 'Search Index delivers sub-10ms inverted full-text lookups.' },
      { id: 'node-asset-pk', type: 'primaryKey', label: 'asset_id', x: 730, y: 200, status: 'idle' },
    ],
    initialEdges: [
      { id: 'e3-1', fromId: 'node-user', toId: 'node-rel-streams', label: '1' },
      { id: 'e3-2', fromId: 'node-rel-streams', toId: 'node-session', label: 'N' },
      { id: 'e3-3', fromId: 'node-session', toId: 'node-rel-plays', label: 'N' },
      { id: 'e3-4', fromId: 'node-rel-plays', toId: 'node-media', label: '1' },
      { id: 'e3-5', fromId: 'node-user', toId: 'node-user-pk' },
      { id: 'e3-6', fromId: 'node-session', toId: 'node-sess-pk' },
      { id: 'e3-7', fromId: 'node-session', toId: 'node-bitrate' },
      { id: 'e3-8', fromId: 'node-media', toId: 'node-search' },
      { id: 'e3-9', fromId: 'node-media', toId: 'node-asset-pk' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'UserAccount', validTypes: ['entity'] },
        { label: 'StreamSession', validTypes: ['entity'] },
        { label: 'MediaAsset', validTypes: ['entity'] },
        { label: 'Streams', validTypes: ['relationship'] },
        { label: 'Plays', validTypes: ['relationship'] },
        { label: 'Search Index', validTypes: ['search', 'retrieval'] },
        { label: 'Bitrate Kbps', validTypes: ['attribute', 'kpi'] },
        { label: 'user_id', validTypes: ['primaryKey', 'foreignKey'] },
        { label: 'session_id', validTypes: ['primaryKey'] },
        { label: 'asset_id', validTypes: ['primaryKey'] },
      ],
      requiredRelationships: [
        { from: 'UserAccount', to: 'StreamSession' },
        { from: 'StreamSession', to: 'MediaAsset' },
      ],
    },
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'Financial Warehouse & OLAP Dimensional Star Schema',
    description: 'Construct an enterprise dimensional model (Kimball methodology) optimizing analytical query performance across millions of transactions.',
    level: 'Advanced',
    xpReward: 450,
    progress: 10,
    unlocked: true,
    completed: false,
    iconName: 'BarChart2',
    systemGoal: 'Design a Kimball-compliant Star Schema centering on FactSales with surrogate keys connected to DimCustomer, DimProduct, and DimDate.',
    instructions: [
      'Live Setting: Enterprise OLAP Financial Analytics Warehouse (Snowflake / BigQuery).',
      'Establish "FactSales" as the central Fact Entity storing numerical transaction measures.',
      'Surround FactSales with Conformed Dimension Entities: "DimCustomer", "DimProduct", and "DimDate".',
      'Convert "Gross Margin %" from an Entity into a KPI Metric or Attribute.',
      'Ensure "sale_id" acts as Fact primary key and surrogate foreign keys link to dimensions.',
    ],
    initialNodes: [
      { id: 'node-dim-cust', type: 'entity', label: 'DimCustomer', x: 60, y: 60, status: 'idle' },
      { id: 'node-dim-prod', type: 'entity', label: 'DimProduct', x: 390, y: 60, status: 'idle' },
      { id: 'node-dim-date', type: 'entity', label: 'DimDate', x: 720, y: 60, status: 'idle' },
      {
        id: 'node-margin',
        type: 'entity',
        label: 'Gross Margin %',
        x: 60,
        y: 190,
        status: 'wrong',
        expectedType: 'kpi',
        feedback: 'Gross Margin % is a computed financial measure for OLAP aggregation, not an independent dimension!',
        recommendation: 'Change "Gross Margin %" card type to KPI Metric.',
      },
      {
        id: 'node-fact',
        type: 'entity',
        label: 'FactSales',
        x: 390,
        y: 190,
        status: 'correct',
        feedback: 'FactSales is the central fact table containing numerical measures.',
      },
      { id: 'node-dash', type: 'dashboard', label: 'Executive Dash', x: 720, y: 190, status: 'correct' },
      { id: 'node-sale-pk', type: 'primaryKey', label: 'sale_id', x: 220, y: 310, status: 'idle' },
      { id: 'node-cust-sk', type: 'foreignKey', label: 'customer_sk', x: 380, y: 310, status: 'idle' },
      { id: 'node-prod-sk', type: 'foreignKey', label: 'product_sk', x: 540, y: 310, status: 'idle' },
    ],
    initialEdges: [
      { id: 'e4-1', fromId: 'node-dim-cust', toId: 'node-fact' },
      { id: 'e4-2', fromId: 'node-dim-prod', toId: 'node-fact' },
      { id: 'e4-3', fromId: 'node-dim-date', toId: 'node-fact' },
      { id: 'e4-4', fromId: 'node-fact', toId: 'node-margin' },
      { id: 'e4-5', fromId: 'node-fact', toId: 'node-dash' },
      { id: 'e4-6', fromId: 'node-fact', toId: 'node-sale-pk' },
      { id: 'e4-7', fromId: 'node-fact', toId: 'node-cust-sk' },
      { id: 'e4-8', fromId: 'node-fact', toId: 'node-prod-sk' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'FactSales', validTypes: ['entity'] },
        { label: 'DimCustomer', validTypes: ['entity'] },
        { label: 'DimProduct', validTypes: ['entity'] },
        { label: 'DimDate', validTypes: ['entity'] },
        { label: 'Gross Margin %', validTypes: ['kpi', 'attribute'] },
        { label: 'sale_id', validTypes: ['primaryKey'] },
        { label: 'customer_sk', validTypes: ['foreignKey', 'primaryKey'] },
        { label: 'product_sk', validTypes: ['foreignKey', 'primaryKey'] },
        { label: 'Executive Dash', validTypes: ['dashboard', 'kpi'] },
      ],
      requiredRelationships: [
        { from: 'DimCustomer', to: 'FactSales' },
        { from: 'DimProduct', to: 'FactSales' },
        { from: 'DimDate', to: 'FactSales' },
      ],
    },
  },
];

export const initialCrudOperations: CrudOperation[] = [
  {
    id: 'crud-c1',
    type: 'C',
    title: 'Insert a new customer',
    description: 'Add a new verified enterprise customer profile.',
    table: 'Customers',
    sql: "INSERT INTO Customers VALUES ('C004', 'Sarah Chen', 'sarah@ai.org', '128 High Street')",
  },
  {
    id: 'crud-c2',
    type: 'C',
    title: 'Add a new product',
    description: 'Publish a new textbook or hardware kit.',
    table: 'Products',
    sql: "INSERT INTO Products VALUES ('P105', 'High-Performance PostgreSQL', 54.00, 30)",
  },
  {
    id: 'crud-c3',
    type: 'C',
    title: 'Create an order',
    description: 'Initiate a transaction for Order #1045.',
    table: 'Orders',
    sql: "INSERT INTO Orders VALUES ('#1045', 'C001', '2026-09-23', 89.90, 'Pending')",
  },
  {
    id: 'crud-r1',
    type: 'R',
    title: 'Get customer details',
    description: 'Retrieve profile and contact info for C001.',
    table: 'Customers',
    sql: "SELECT * FROM Customers WHERE CustomerID = 'C001'",
  },
  {
    id: 'crud-r2',
    type: 'R',
    title: 'Search products',
    description: 'Find products with stock greater than 10.',
    table: 'Products',
    sql: 'SELECT * FROM Products WHERE Stock > 10',
  },
  {
    id: 'crud-r3',
    type: 'R',
    title: 'View order history',
    description: 'List recent transactions and timestamps.',
    table: 'Orders',
    sql: 'SELECT * FROM Orders ORDER BY OrderDate DESC LIMIT 5',
  },
  {
    id: 'crud-u1',
    type: 'U',
    title: 'Update customer info',
    description: "Modify Alex's shipping address.",
    table: 'Customers',
    sql: "UPDATE Customers SET Address = '900 Silicon Blvd' WHERE CustomerID = 'C001'",
  },
  {
    id: 'crud-u2',
    type: 'U',
    title: 'Change product stock',
    description: 'Deduct inventory after checkout.',
    table: 'Products',
    sql: 'UPDATE Products SET Stock = Stock - 1 WHERE ProductID = \'P101\'',
  },
  {
    id: 'crud-u3',
    type: 'U',
    title: 'Modify order status',
    description: "Mark Order #1042 as 'Completed'.",
    table: 'Orders',
    sql: "UPDATE Orders SET Status = 'Completed' WHERE OrderID = '#1042'",
  },
  {
    id: 'crud-d1',
    type: 'D',
    title: 'Remove a customer',
    description: 'GDPR right-to-be-forgotten deletion.',
    table: 'Customers',
    sql: "DELETE FROM Customers WHERE CustomerID = 'C003'",
  },
  {
    id: 'crud-d2',
    type: 'D',
    title: 'Delete a product',
    description: 'Retire an obsolete hardware bundle.',
    table: 'Products',
    sql: "DELETE FROM Products WHERE ProductID = 'P104'",
  },
  {
    id: 'crud-d3',
    type: 'D',
    title: 'Cancel an order',
    description: 'Revoke and void unfulfilled purchase #1044.',
    table: 'Orders',
    sql: "DELETE FROM Orders WHERE OrderID = '#1044'",
  },
];

export const initialBadges: Badge[] = [
  { id: 'b1', name: 'Data Modeler', description: 'Placed your first 5 entities and keys correctly.', icon: 'Award', unlocked: true, unlockedAt: '10:12 AM' },
  { id: 'b2', name: 'Schema Master', description: 'Completed a 3NF normalized schema with zero redundancies.', icon: 'Database', unlocked: true, unlockedAt: 'Yesterday' },
  { id: 'b3', name: 'CRUD Ninja', description: 'Successfully executed all 4 CRUD operation types.', icon: 'Zap', unlocked: true, unlockedAt: '2 days ago' },
  { id: 'b4', name: 'Query Optimizer', description: 'Reduced execution latency using targeted indexes.', icon: 'TrendingUp', unlocked: false },
  { id: 'b5', name: 'Enterprise Architect', description: 'Published a custom high-scale schema to community.', icon: 'Layers', unlocked: false },
  { id: 'b6', name: 'Capstone Champion', description: 'Mastered all 4 enterprise learning capstones.', icon: 'Trophy', unlocked: false },
];

export const initialFeedEvents: DataFeedEvent[] = [
  { id: 'e1', time: '10:24:03', event: 'INSERT', table: 'Orders', details: 'Order #1042', success: true },
  { id: 'e2', time: '10:24:02', event: 'SELECT', table: 'Customers', details: '1 row returned', success: true },
  { id: 'e3', time: '10:24:01', event: 'UPDATE', table: 'Products', details: 'Stock - 1', success: true },
  { id: 'e4', time: '10:24:00', event: 'INSERT', table: 'Customers', details: 'New customer', success: true },
  { id: 'e5', time: '10:23:59', event: 'SELECT', table: 'Orders', details: '5 rows returned', success: true },
  { id: 'e6', time: '10:23:58', event: 'DELETE', table: 'Cart', details: 'Item removed', success: true },
  { id: 'e7', time: '10:23:57', event: 'INSERT', table: 'Reviews', details: 'New review', success: true },
  { id: 'e8', time: '10:23:56', event: 'SELECT', table: 'Products', details: '24 rows returned', success: true },
];

export const initialCommunityDesigns: CommunityDesign[] = [
  {
    id: 'cd-1',
    title: 'Ultra-Scale E-Commerce & Flash Sale Architecture',
    author: 'Elena Rostova',
    authorRole: 'Principal Data Engineer',
    domain: 'E-Commerce / Retail',
    description: 'Designed to handle 100,000 req/sec during Black Friday with read-replicas and inventory reservation locks.',
    reasoning:
      'We separated Orders from OrderItems to achieve strict 3NF. Added Redis key-value cache for product inventory counts to prevent write-locking the master PostgreSQL database during checkouts.',
    upvotes: 428,
    forks: 89,
    publishedDate: '2026-09-20',
    tags: ['PostgreSQL', 'OLTP', 'High-Concurrency', '3NF'],
    nodes: [
      { id: 'c1', type: 'entity', label: 'User', x: 60, y: 70, status: 'correct' },
      { id: 'c2', type: 'relationship', label: 'Places', x: 210, y: 70, status: 'correct' },
      { id: 'c3', type: 'entity', label: 'OrderHeader', x: 360, y: 70, status: 'correct' },
      { id: 'c4', type: 'relationship', label: 'Contains', x: 500, y: 70, status: 'correct' },
      { id: 'c5', type: 'entity', label: 'OrderItem', x: 640, y: 70, status: 'correct' },
    ],
    edges: [],
  },
  {
    id: 'cd-2',
    title: 'Hospital Clinical EHR & Patient Tracking System',
    author: 'Marcus Vance',
    authorRole: 'HealthTech Systems Architect',
    domain: 'Healthcare / HIPAA',
    description: 'HIPAA-compliant relational model with immutable audit trails and doctor-patient assignment tables.',
    reasoning:
      'Doctor and Patient have a Many-to-Many relationship resolved through Appointments and CareTeams. AuditLog table captures all read and update mutations with cryptographic hashes for regulatory compliance.',
    upvotes: 312,
    forks: 54,
    publishedDate: '2026-09-18',
    tags: ['Healthcare', 'HIPAA', 'Audit-Logging', 'Security'],
    nodes: [
      { id: 'h1', type: 'entity', label: 'Patient', x: 80, y: 80, status: 'correct' },
      { id: 'h2', type: 'entity', label: 'Doctor', x: 360, y: 80, status: 'correct' },
      { id: 'h3', type: 'relationship', label: 'Consults', x: 220, y: 80, status: 'correct' },
      { id: 'h4', type: 'entity', label: 'MedicalRecord', x: 220, y: 220, status: 'correct' },
    ],
    edges: [],
  },
  {
    id: 'cd-3',
    title: 'Global Social Graph & Real-Time Notification Mesh',
    author: 'Priya Sharma',
    authorRole: 'CS Senior & Graph Enthusiast',
    domain: 'Social Media / Graphs',
    description: 'Hybrid relational and graph schema for fast follower queries, post timelines, and instant notifications.',
    reasoning:
      'Used relational tables for UserAuth and billing, combined with bidirectional graph edges for Follows and Mentions to avoid recursive expensive JOIN queries.',
    upvotes: 275,
    forks: 67,
    publishedDate: '2026-09-15',
    tags: ['GraphDB', 'Social', 'Neo4j', 'Hybrid-Model'],
    nodes: [
      { id: 's1', type: 'entity', label: 'Account', x: 70, y: 70, status: 'correct' },
      { id: 's2', type: 'relationship', label: 'Follows', x: 230, y: 70, status: 'correct' },
      { id: 's3', type: 'entity', label: 'Post', x: 390, y: 70, status: 'correct' },
    ],
    edges: [],
  },
];

export const initialLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Sora Takahashi', avatar: '🌸', role: 'architect', level: 9, xp: 8420, streak: 34, badgesCount: 16, solvedCapstones: 12 },
  { rank: 2, name: 'Devon Miles', avatar: '🚀', role: 'architect', level: 8, xp: 7100, streak: 28, badgesCount: 14, solvedCapstones: 10 },
  { rank: 3, name: 'Alex Mercer (You)', avatar: '👩‍💻', role: 'student', level: 5, xp: 2350, streak: 12, badgesCount: 6, solvedCapstones: 3 },
  { rank: 4, name: 'Lucas Rossi', avatar: '⚡', role: 'student', level: 5, xp: 2210, streak: 9, badgesCount: 5, solvedCapstones: 3 },
  { rank: 5, name: 'Amara Okafor', avatar: '🎨', role: 'student', level: 4, xp: 1980, streak: 15, badgesCount: 5, solvedCapstones: 2 },
  { rank: 6, name: 'Chloe Dubois', avatar: '🔬', role: 'student', level: 4, xp: 1850, streak: 6, badgesCount: 4, solvedCapstones: 2 },
  { rank: 7, name: 'Zack Taylor', avatar: '👾', role: 'student', level: 3, xp: 1420, streak: 4, badgesCount: 3, solvedCapstones: 1 },
];

export const useAppStore = create<AppState>((set, get) => {
  // Listen to simulated DB queries
  if (typeof window !== 'undefined') {
    dbSimulator.onEvent((event) => {
      get().addFeedEvent(event);
    });
  }

  return {
    activeTab: 'capstone',
    setActiveTab: (tab) => {
      sound.playClick();
      set({ activeTab: tab });
    },

    user: {
      id: 'usr_alex_demo',
      email: 'alex@dataquest.org',
      name: 'Alex Mercer',
      avatar: '👩‍💻',
      level: 5,
      xp: 2350,
      nextLevelXp: 3000,
      streak: 12,
      role: 'student',
    },
    setUser: (newUser) => {
      set((state) => {
        const merged = { ...state.user, ...newUser };
        if (typeof window !== 'undefined') {
          localStorage.setItem('dataquest_user', JSON.stringify(merged));
        }
        return { user: merged };
      });
    },

    theme: 'dark',
    setTheme: (theme) => {
      sound.playClick();
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('dataquest_theme', theme);
        } catch {}
      }
      set({ theme });
    },

    language: 'en',
    setLanguage: (lang) => {
      sound.playClick();
      set({ language: lang });
    },

    isAuthModalOpen: false,
    setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),

    hasEnteredConsole: false,
    setHasEnteredConsole: (open) => {
      set({ hasEnteredConsole: open });
    },

    soundEnabled: true,
    toggleSound: () => {
      const next = !get().soundEnabled;
      sound.setMuted(!next);
      set({ soundEnabled: next });
    },

    voiceEnabled: true,
    toggleVoice: () => {
      sound.playClick();
      const next = !get().voiceEnabled;
      voiceEngine.setMuted(!next);
      set({ voiceEnabled: next });
    },
    voiceProfile: 'mentor',
    setVoiceProfile: (profile) => {
      sound.playClick();
      voiceEngine.setProfile(profile);
      set({ voiceProfile: profile });
    },
    speakCoachMessage: () => {
      const text = get().aiCoachText;
      if (!text || !get().voiceEnabled) return;
      voiceEngine.speak(text, { profile: get().voiceProfile });
    },
    stopSpeaking: () => {
      voiceEngine.stop();
    },

    toggleRole: () => {
      sound.playClick();
      const current = get().user.role;
      const next = current === 'student' ? 'teacher' : current === 'teacher' ? 'architect' : 'student';
      set((state) => ({ user: { ...state.user, role: next } }));
    },

    awardXp: (amount, reason) => {
      sound.playSuccess();
      set((state) => {
        const newXp = state.user.xp + amount;
        let newLevel = state.user.level;
        let newNext = state.user.nextLevelXp;
        if (newXp >= state.user.nextLevelXp) {
          newLevel += 1;
          newNext = state.user.nextLevelXp + 1000;
          sound.playLevelUp();
        }
        return {
          user: {
            ...state.user,
            xp: newXp,
            level: newLevel,
            nextLevelXp: newNext,
          },
        };
      });
      get().addActivity(reason, amount, 'success');
    },

    explanationMode: 'simple',
    setExplanationMode: (mode) => {
      sound.playClick();
      set({ explanationMode: mode });
    },
    toggleExplanationMode: () => {
      sound.playClick();
      set((state) => ({ explanationMode: state.explanationMode === 'simple' ? 'engineer' : 'simple' }));
    },

    competencies: INITIAL_COMPETENCIES,
    unlockCompetency: (id) => {
      sound.playSuccess();
      set((state) => ({
        competencies: state.competencies.map((c) => (c.id === id ? { ...c, unlocked: true } : c)),
      }));
    },

    missions: initialMissions,
    activeMissionId: 'mission-1',
    selectMission: (id) => {
      sound.playClick();
      const mission = get().missions.find((m) => m.id === id);
      if (!mission) return;
      set({
        activeMissionId: id,
        nodes: JSON.parse(JSON.stringify(mission.initialNodes)),
        edges: JSON.parse(JSON.stringify(mission.initialEdges)),
        selectedNodeId: null,
      });
      get().addActivity(`Loaded mission: ${mission.title}`, undefined, 'mission');
    },

    resetMissionCanvas: () => {
      sound.playSnap();
      const mission = get().missions.find((m) => m.id === get().activeMissionId);
      if (mission) {
        set({
          nodes: JSON.parse(JSON.stringify(mission.initialNodes)),
          edges: JSON.parse(JSON.stringify(mission.initialEdges)),
          selectedNodeId: null,
        });
      }
    },

    nodes: JSON.parse(JSON.stringify(initialMissions[0].initialNodes)),
    edges: JSON.parse(JSON.stringify(initialMissions[0].initialEdges)),
    selectedNodeId: null,
    setSelectedNodeId: (id) => set({ selectedNodeId: id }),

    updateNodePosition: (id, x, y) => {
      set((state) => ({
        nodes: state.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
      }));
    },

    changeNodeType: (id, newType) => {
      sound.playSnap();
      set((state) => {
        const mission = state.missions.find((m) => m.id === state.activeMissionId);
        const updated = state.nodes.map((n) => {
          if (n.id !== id) return n;

          let status: CanvasNode['status'] = 'idle';
          let feedback = '';
          let recommendation = '';

          // Look up against active mission's expected rules
          const rule = mission?.expectedRules.correctNodes.find(
            (r) => r.label.toLowerCase() === n.label.toLowerCase()
          );

          if (rule) {
            if (rule.validTypes.includes(newType)) {
              status = 'correct';
              feedback = `Great job! "${n.label}" is verified as a valid ${newType}.`;
            } else {
              status = 'wrong';
              feedback = `"${n.label}" cannot be a ${newType} in this schema.`;
              recommendation = `Set "${n.label}" to ${rule.validTypes[0]}.`;
            }
          } else {
            // General rules for dynamically placed cards
            if (newType === 'primaryKey' || newType === 'foreignKey') {
              status = 'correct';
              feedback = `Key identifier verified for "${n.label}".`;
            } else {
              status = 'correct';
            }
          }

          return {
            ...n,
            type: newType,
            status,
            feedback,
            recommendation,
          };
        });

        return { nodes: updated };
      });

      // Award XP if user resolved a known schema flaw
      const target = get().nodes.find((n) => n.id === id);
      const mission = get().missions.find((m) => m.id === get().activeMissionId);
      const rule = mission?.expectedRules.correctNodes.find(
        (r) => r.label.toLowerCase() === target?.label.toLowerCase()
      );
      if (rule && rule.validTypes.includes(newType) && target?.expectedType) {
        get().awardXp(25, `Resolved schema flaw: "${target.label}" is now ${newType}!`);
      }
    },

    addNodeToCanvas: (type, customLabel, x = 200, y = 150) => {
      sound.playSnap();
      const label = customLabel || type.charAt(0).toUpperCase() + type.slice(1);
      const newNode: CanvasNode = {
        id: 'node_' + Math.random().toString(36).substring(2, 7),
        type,
        label,
        x,
        y,
        status: 'idle',
      };
      set((state) => ({
        nodes: [...state.nodes, newNode],
        selectedNodeId: newNode.id,
      }));
      get().addActivity(`Placed card: ${label}`, 5, 'success');
    },

    removeNode: (id) => {
      sound.playSnap();
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== id),
        edges: state.edges.filter((e) => e.fromId !== id && e.toId !== id),
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      }));
    },

    removeEdge: (id) => {
      sound.playSnap();
      set((state) => ({
        edges: state.edges.filter((e) => e.id !== id),
      }));
    },

    disconnectNode: (nodeId) => {
      sound.playSnap();
      set((state) => ({
        edges: state.edges.filter((e) => e.fromId !== nodeId && e.toId !== nodeId),
      }));
    },

    connectNodes: (fromId, toId) => {
      if (fromId === toId) return;
      sound.playSnap();
      const exists = get().edges.some((e) => (e.fromId === fromId && e.toId === toId) || (e.fromId === toId && e.toId === fromId));
      if (exists) return;

      const newEdge: CanvasEdge = {
        id: 'edge_' + Math.random().toString(36).substring(2, 7),
        fromId,
        toId,
        activePulse: true,
      };
      set((state) => ({
        edges: [...state.edges, newEdge],
      }));
      get().awardXp(10, 'Connected relationship!');
    },

    checkSolution: () => {
      const nodes = get().nodes;
      const mission = get().missions.find((m) => m.id === get().activeMissionId);
      let correct = 0;
      let wrong = 0;
      const issues: string[] = [];

      const updated = nodes.map((node) => {
        const rule = mission?.expectedRules.correctNodes.find(
          (r) => r.label.toLowerCase() === node.label.toLowerCase()
        );

        if (rule) {
          if (rule.validTypes.includes(node.type)) {
            correct++;
            return {
              ...node,
              status: 'correct' as const,
              feedback: `Verified: "${node.label}" is properly configured as ${node.type}.`,
              recommendation: undefined,
            };
          }
          wrong++;
          issues.push(`"${node.label}" should be ${rule.validTypes[0]}`);
          return {
            ...node,
            status: 'wrong' as const,
            feedback: `"${node.label}" is not a valid ${node.type} in this schema.`,
            recommendation: `Try changing "${node.label}" to ${rule.validTypes[0]}.`,
          };
        }

        // Heuristics for custom cards
        if (node.label.endsWith('_id') || node.label.endsWith('_sk')) {
          if (node.type === 'primaryKey' || node.type === 'foreignKey') {
            correct++;
            return { ...node, status: 'correct' as const, feedback: 'Valid key identifier.' };
          }
          wrong++;
          issues.push(`"${node.label}" should be a Primary or Foreign Key`);
          return { ...node, status: 'wrong' as const, recommendation: 'Change to Primary Key or Foreign Key.' };
        }

        correct++;
        return { ...node, status: 'correct' as const };
      });

      set({ nodes: updated });

      const allValid = wrong === 0;
      const progressPercent = Math.min(100, Math.round((correct / Math.max(nodes.length, 1)) * 100));

      if (allValid) {
        sound.playSuccess();
        const xpEarned = mission?.xpReward || 50;
        get().awardXp(xpEarned, `${mission?.title || 'Capstone'} verified!`);
        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === state.activeMissionId ? { ...m, progress: 100, completed: true } : m
          ),
          aiCoachText: `Outstanding architectural work! All entities, keys, and relational attributes in "${mission?.title}" are 100% verified to enterprise standards. You earned +${xpEarned} XP and unlocked Capstone Champion progress!`,
        }));
      } else {
        sound.playError();
        get().addActivity(`Found ${wrong} schema issue(s) in ${mission?.title}`, undefined, 'error');
        const diagnosis = tutorEngine.diagnoseCanvas(updated, get().edges, mission);
        const feedbackMsg = diagnosis
          ? `❌ Verification Incomplete: ${diagnosis.studentMistake}\n\n💡 Remediation: ${diagnosis.remediationRule}`
          : `Architectural review found ${wrong} item(s) to fix: ${issues.slice(0, 2).join('; ')}. Check the highlighted red cards on your canvas!`;

        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === state.activeMissionId ? { ...m, progress: progressPercent } : m
          ),
          aiCoachText: feedbackMsg,
        }));
      }

      return { correct, total: nodes.length, allValid };
    },

    autoLayoutCanvas: () => {
      sound.playSnap();
      set((state) => {
        const arranged = state.nodes.map((node, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          return {
            ...node,
            x: 80 + col * 200,
            y: 70 + row * 140,
          };
        });
        return { nodes: arranged };
      });
    },

    crudOperations: initialCrudOperations,

    executeCrud: (op) => {
      sound.playSuccess();
      const res = dbSimulator.executeCustomSql(op.sql);
      if (res.event) {
        get().addFeedEvent(res.event);
      }
      if (res.executionResult) {
        telemetryService.logExecution({
          eventType: res.executionResult.commandType as any,
          queryText: op.sql,
          tableName: op.table,
          durationMs: res.executionResult.metrics.durationMs,
          rowsScanned: res.executionResult.metrics.rowsScanned,
          rowsReturned: res.executionResult.metrics.rowsReturned,
          rowsAffected: res.executionResult.metrics.rowsAffected,
          indexUsed: res.executionResult.metrics.indexUsed,
          success: res.success,
        });
      }
      get().awardXp(10, `Executed CRUD: ${op.title}`);
    },

    addCustomCrud: (op) => {
      sound.playSnap();
      const newOp: CrudOperation = {
        ...op,
        id: 'crud_' + Math.random().toString(36).substring(2, 7),
      };
      set((state) => ({ crudOperations: [...state.crudOperations, newOp] }));
      get().awardXp(15, `Created custom operation: ${op.title}`);

      // Safety check: warn if mutation lacks WHERE clause
      if ((op.type === 'U' || op.type === 'D') && !op.sql.toUpperCase().includes('WHERE')) {
        telemetryService.recordMisconception('missing_where_clause');
        set({
          aiCoachText: `⚠️ Database Safety Warning: Your ${op.type === 'U' ? 'UPDATE' : 'DELETE'} statement has no WHERE clause! This will mutate EVERY row in the ${op.table} table. In production systems, always specify target primary keys.`,
        });
      }
    },

    isLiveFeedRunning: true,
    toggleLiveFeed: () => {
      sound.playClick();
      set((state) => ({ isLiveFeedRunning: !state.isLiveFeedRunning }));
    },

    dataFeedEvents: initialFeedEvents,
    addFeedEvent: (event) => {
      if (!get().isLiveFeedRunning) return;
      set((state) => ({
        dataFeedEvents: [event, ...state.dataFeedEvents.slice(0, 40)],
      }));
    },

    activityTimeline: [
      { id: 'act-1', time: '10:24', message: 'You placed: Customer in the correct spot!', xpAward: 10, type: 'success' },
      { id: 'act-2', time: '10:22', message: 'Hint used: Moving attributes', type: 'hint' },
      { id: 'act-3', time: '10:18', message: 'You fixed the relationship!', xpAward: 10, type: 'success' },
      { id: 'act-4', time: '10:12', message: 'New badge unlocked: Data Modeler', type: 'badge' },
    ],
    addActivity: (message, xpAward, type = 'success') => {
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      const item: ActivityItem = {
        id: 'act_' + Math.random().toString(36).substring(2, 7),
        time,
        message,
        xpAward,
        type,
      };
      set((state) => ({
        activityTimeline: [item, ...state.activityTimeline.slice(0, 30)],
      }));
    },

    aiCoachText:
      'Great progress! Customer is correctly placed as an entity. Next, move "Date of Birth" to Attributes.\n\nAttributes describe properties of an entity (e.g., name, email, date of birth, address).',
    setAiCoachText: (msg) => set({ aiCoachText: msg }),

    coachAction: (actionType) => {
      sound.playClick();
      const currentHintCount = get().hintCount || 0;
      const nextHintCount = actionType === 'hint' ? currentHintCount + 1 : currentHintCount;
      const activeMission = get().missions.find((m) => m.id === get().activeMissionId);
      const tutorMsg = tutorEngine.generateTutorMessage(
        get().nodes,
        get().edges,
        activeMission,
        actionType,
        nextHintCount
      );

      if (actionType === 'hint') {
        get().addActivity(`Hint used (Tier ${nextHintCount})`, undefined, 'hint');
        set({ aiCoachText: tutorMsg, hintCount: nextHintCount });
      } else {
        set({ aiCoachText: tutorMsg });
      }
    },

    badges: initialBadges,

    communityDesigns: initialCommunityDesigns,
    fetchCommunityDesigns: async () => {
      try {
        const res = await fetch('/api/designs');
        if (res.ok) {
          const data = await res.json();
          if (data.designs && Array.isArray(data.designs) && data.designs.length > 0) {
            set({
              communityDesigns: data.designs.map((d: any) => ({
                id: d.id,
                title: d.title,
                author: d.author || 'Data Architect',
                authorRole: d.author_role || 'Enterprise Architect',
                domain: d.domain,
                description: d.description,
                reasoning: d.reasoning,
                upvotes: d.upvotes,
                forks: d.forks,
                publishedDate: d.created_at ? d.created_at.split('T')[0] : '2026-09-23',
                nodes: d.nodes || [],
                edges: d.edges || [],
                tags: d.tags || ['SQL', 'Relational'],
              })),
            });
          }
        }
      } catch (err) {
        console.error('Failed to load SQLite designs, using cache', err);
      }
    },
    publishCustomDesign: (design) => {
      sound.playSuccess();
      const newDesign: CommunityDesign = {
        id: 'cd_' + Math.random().toString(36).substring(2, 7),
        title: design.title,
        author: get().user.name,
        authorRole: get().user.role === 'student' ? 'Data Apprentice' : 'Enterprise Architect',
        domain: design.domain,
        description: design.description,
        reasoning: design.reasoning,
        upvotes: 1,
        forks: 0,
        publishedDate: new Date().toISOString().split('T')[0],
        nodes: JSON.parse(JSON.stringify(get().nodes)),
        edges: JSON.parse(JSON.stringify(get().edges)),
        tags: design.tags,
      };
      set((state) => ({
        communityDesigns: [newDesign, ...state.communityDesigns],
      }));
      get().awardXp(100, `Published architecture design: ${design.title}`);

      // Persist to SQLite in background
      fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newDesign.id,
          user_id: get().user.name.toLowerCase().replace(/\s+/g, '_'),
          title: newDesign.title,
          domain: newDesign.domain,
          description: newDesign.description,
          reasoning: newDesign.reasoning,
          nodes: newDesign.nodes,
          edges: newDesign.edges,
          tags: newDesign.tags,
        }),
      }).catch((e) => console.error('Error persisting design to SQLite:', e));
    },

    upvoteDesign: (id) => {
      sound.playClick();
      set((state) => ({
        communityDesigns: state.communityDesigns.map((d) => (d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d)),
      }));
      fetch('/api/designs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'upvote' }),
      }).catch((e) => console.error('Error updating upvote in SQLite:', e));
    },

    forkDesign: (designId) => {
      sound.playSuccess();
      const design = get().communityDesigns.find((d) => d.id === designId);
      if (!design) return;
      set({
        activeTab: 'capstone',
        nodes: JSON.parse(JSON.stringify(design.nodes)),
        edges: JSON.parse(JSON.stringify(design.edges)),
        aiCoachText: `Forked "${design.title}"! You are now editing this enterprise schema in your live canvas.`,
      });
      get().addActivity(`Forked template: ${design.title}`, 20, 'success');
      fetch('/api/designs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: designId, action: 'fork' }),
      }).catch((e) => console.error('Error updating fork in SQLite:', e));
    },

    leaderboard: initialLeaderboard,
  };
});
