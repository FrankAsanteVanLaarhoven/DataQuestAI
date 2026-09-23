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

interface AppState {
  // Navigation & User
  activeTab: 'capstone' | 'missions' | 'learn' | 'analytics' | 'community' | 'leaderboard';
  setActiveTab: (tab: AppState['activeTab']) => void;
  user: {
    id?: string;
    email?: string;
    name: string;
    avatar: string;
    level: number;
    xp: number;
    nextLevelXp: number;
    streak: number;
    role: 'student' | 'teacher' | 'architect';
  };
  setUser: (user: Partial<AppState['user']>) => void;
  theme: 'vibrant' | 'dark' | 'system';
  setTheme: (theme: 'vibrant' | 'dark' | 'system') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  toggleRole: () => void;
  awardXp: (amount: number, reason: string) => void;

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

export const initialMissions: Mission[] = [
  {
    id: 'mission-1',
    number: 1,
    title: 'Design a school library database',
    description: 'Model books, members, and loans for a school library.',
    level: 'Beginner',
    xpReward: 250,
    progress: 80,
    unlocked: true,
    completed: false,
    iconName: 'BookOpen',
    systemGoal: 'Establish the core entities (Books, Members, Loans) and primary keys.',
    instructions: [
      'Identify the main entities: Member, Book, Loan.',
      'Place Primary Keys (member_id, book_id, loan_id) under their respective tables.',
      'Define the borrowing relationship between Members and Books.',
    ],
    initialNodes: [
      {
        id: 'node-cust',
        type: 'entity',
        label: 'Customer',
        x: 60,
        y: 80,
        status: 'correct',
        feedback: 'Customer is an entity. Well done!',
      },
      {
        id: 'node-rel',
        type: 'relationship',
        label: 'Places',
        x: 230,
        y: 80,
        status: 'correct',
        feedback: 'Valid relationship between Customer and Order.',
      },
      {
        id: 'node-order',
        type: 'entity',
        label: 'Order',
        x: 410,
        y: 80,
        status: 'idle',
      },
      {
        id: 'node-pk1',
        type: 'primaryKey',
        label: 'customer_id',
        x: 50,
        y: 220,
        status: 'correct',
        feedback: 'customer_id is the primary key for Customer.',
      },
      {
        id: 'node-dob',
        type: 'entity',
        label: 'Date of Birth',
        x: 210,
        y: 220,
        status: 'wrong',
        expectedType: 'attribute',
        feedback: 'Date of Birth is not an entity!',
        recommendation: 'Try moving "Date of Birth" to Attributes.',
      },
      {
        id: 'node-pk2',
        type: 'primaryKey',
        label: 'order_id',
        x: 370,
        y: 220,
        status: 'correct',
        feedback: 'order_id is the primary key for Order.',
      },
      {
        id: 'node-fk1',
        type: 'foreignKey',
        label: 'customer_id',
        x: 520,
        y: 220,
        status: 'correct',
        feedback: 'customer_id references Customer(customer_id).',
      },
    ],
    initialEdges: [
      { id: 'edge-1', fromId: 'node-cust', toId: 'node-rel', label: '1' },
      { id: 'edge-2', fromId: 'node-rel', toId: 'node-order', label: 'N' },
      { id: 'edge-3', fromId: 'node-cust', toId: 'node-pk1' },
      { id: 'edge-4', fromId: 'node-cust', toId: 'node-dob' },
      { id: 'edge-5', fromId: 'node-order', toId: 'node-pk2' },
      { id: 'edge-6', fromId: 'node-order', toId: 'node-fk1' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'Customer', validTypes: ['entity'] },
        { label: 'Order', validTypes: ['entity'] },
        { label: 'Date of Birth', validTypes: ['attribute'] },
        { label: 'customer_id', validTypes: ['primaryKey', 'foreignKey'] },
        { label: 'order_id', validTypes: ['primaryKey'] },
      ],
      requiredRelationships: [{ from: 'Customer', to: 'Order' }],
    },
  },
  {
    id: 'mission-2',
    number: 2,
    title: 'Create an online shop schema',
    description: 'Model products, customers and orders with inventory stock.',
    level: 'Intermediate',
    xpReward: 300,
    progress: 40,
    unlocked: true,
    completed: false,
    iconName: 'ShoppingCart',
    systemGoal: 'Prevent redundant product rows by creating an OrderItems join table.',
    instructions: [
      'Connect Orders and Products through an OrderItems linking table.',
      'Enforce Foreign Keys pointing to Products(product_id) and Orders(order_id).',
    ],
    initialNodes: [
      { id: 'n2-1', type: 'entity', label: 'Product', x: 80, y: 100, status: 'idle' },
      { id: 'n2-2', type: 'entity', label: 'Customer', x: 260, y: 100, status: 'idle' },
      { id: 'n2-3', type: 'entity', label: 'Order', x: 440, y: 100, status: 'idle' },
      { id: 'n2-4', type: 'primaryKey', label: 'product_id', x: 80, y: 220, status: 'idle' },
      { id: 'n2-5', type: 'attribute', label: 'Price', x: 180, y: 220, status: 'idle' },
    ],
    initialEdges: [],
    expectedRules: {
      correctNodes: [
        { label: 'Product', validTypes: ['entity'] },
        { label: 'Order', validTypes: ['entity'] },
      ],
      requiredRelationships: [],
    },
  },
  {
    id: 'mission-3',
    number: 3,
    title: 'Build a search system for a digital archive',
    description: 'Index and search documents, images and metadata.',
    level: 'Advanced',
    xpReward: 400,
    progress: 25,
    unlocked: true,
    completed: false,
    iconName: 'Search',
    systemGoal: 'Connect Inverted Index tables with Document metadata for fast querying.',
    instructions: ['Build inverted indexes with term frequency counters.'],
    initialNodes: [],
    initialEdges: [],
    expectedRules: { correctNodes: [], requiredRelationships: [] },
  },
  {
    id: 'mission-4',
    number: 4,
    title: 'Design a dashboard using warehouse data',
    description: 'Analyze trends with an interactive dashboard and star schema.',
    level: 'Advanced',
    xpReward: 400,
    progress: 10,
    unlocked: false,
    completed: false,
    iconName: 'BarChart2',
    systemGoal: 'Create fact and dimension tables for high-performance OLAP analytics.',
    instructions: ['Link FactSales to DimTime, DimProduct, and DimStore.'],
    initialNodes: [],
    initialEdges: [],
    expectedRules: { correctNodes: [], requiredRelationships: [] },
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

    soundEnabled: true,
    toggleSound: () => {
      const next = !get().soundEnabled;
      sound.setMuted(!next);
      set({ soundEnabled: next });
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
        const updated = state.nodes.map((n) => {
          if (n.id !== id) return n;

          // Check if this fix resolved a known mistake (e.g. Date of Birth -> attribute)
          let status: CanvasNode['status'] = 'idle';
          let feedback = '';
          let recommendation = '';

          if (n.label === 'Date of Birth') {
            if (newType === 'attribute') {
              status = 'correct';
              feedback = 'Great job! Date of Birth is an attribute describing an entity.';
            } else {
              status = 'wrong';
              feedback = 'Date of Birth should be an attribute.';
              recommendation = 'Try moving "Date of Birth" to Attributes.';
            }
          } else if (n.label === 'Customer' || n.label === 'Order' || n.label === 'Product') {
            if (newType === 'entity') {
              status = 'correct';
              feedback = `${n.label} is an entity. Well done!`;
            } else {
              status = 'wrong';
              recommendation = `Set ${n.label} type back to Entity.`;
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

      // Award XP if fixed
      const target = get().nodes.find((n) => n.id === id);
      if (target?.label === 'Date of Birth' && newType === 'attribute') {
        get().awardXp(15, 'You fixed the Date of Birth attribute!');
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
      let correct = 0;
      let wrong = 0;

      const updated = nodes.map((node) => {
        if (node.label === 'Customer') {
          if (node.type === 'entity') {
            correct++;
            return { ...node, status: 'correct' as const, feedback: 'Customer is an entity. Well done!' };
          }
          wrong++;
          return { ...node, status: 'wrong' as const, recommendation: 'Change Customer to Entity.' };
        }
        if (node.label === 'Date of Birth') {
          if (node.type === 'attribute') {
            correct++;
            return { ...node, status: 'correct' as const, feedback: 'Date of Birth is an attribute. Perfect!' };
          }
          wrong++;
          return {
            ...node,
            status: 'wrong' as const,
            feedback: 'Date of Birth is not an entity!',
            recommendation: 'Try moving "Date of Birth" to Attributes.',
          };
        }
        if (node.label === 'Order') {
          if (node.type === 'entity') {
            correct++;
            return { ...node, status: 'correct' as const, feedback: 'Order is an entity.' };
          }
          wrong++;
          return { ...node, status: 'wrong' as const, recommendation: 'Order should be an Entity.' };
        }
        if (node.label === 'customer_id') {
          correct++;
          return { ...node, status: 'correct' as const, feedback: 'Valid primary/foreign key.' };
        }
        if (node.label === 'order_id') {
          correct++;
          return { ...node, status: 'correct' as const, feedback: 'Valid primary key.' };
        }
        correct++;
        return { ...node, status: 'correct' as const };
      });

      set({ nodes: updated });

      const allValid = wrong === 0;
      if (allValid) {
        sound.playSuccess();
        get().awardXp(50, 'Capstone challenge validated!');
        set((state) => ({
          missions: state.missions.map((m) =>
            m.id === state.activeMissionId ? { ...m, progress: 100, completed: true } : m
          ),
          aiCoachText:
            'Outstanding work! All entities, attributes, and relationships in this schema are 100% verified. You earned +50 XP and unlocked Capstone Champion progress!',
        }));
      } else {
        sound.playError();
        get().addActivity(`Found ${wrong} issues in schema design`, undefined, 'error');
        set({
          aiCoachText:
            'Almost there! Check the highlighted red cards on your canvas. Look at "Date of Birth" — is a birth date a standalone entity or an attribute describing a person?',
        });
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
      { id: 'act-2', time: '10:22', message: 'Hint used: What is an attribute?', type: 'hint' },
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
      if (actionType === 'hint') {
        get().addActivity('Hint used: Moving attributes', undefined, 'hint');
        set({
          aiCoachText:
            '💡 Hint: Click on the "Date of Birth" card on the canvas or open its type selector, then change its category to "Attribute"!',
        });
      } else if (actionType === 'explain') {
        set({
          aiCoachText:
            '📖 Concept Breakdown:\n• Entity: A real-world noun (Student, Order, Book) that has an independent existence.\n• Attribute: A specific property or field that describes an entity (e.g., Title, Price, Date of Birth).\n• Relationship: How two entities interact (e.g., Customer PLACES Order).',
        });
      } else if (actionType === 'example') {
        set({
          aiCoachText:
            '</> Real-World Example:\nIn Amazon\'s database:\n- "Customer" is an Entity (has customer_id, name, email).\n- "Order" is an Entity (has order_id, order_date, total).\n- "Places" is the Relationship linking them (1 Customer to Many Orders).',
        });
      } else if (actionType === 'next') {
        set({
          aiCoachText:
            '➡️ Next Step: Once "Date of Birth" is placed as an Attribute, link it to the Customer entity, then click "Check Solution" to verify your architecture!',
        });
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
