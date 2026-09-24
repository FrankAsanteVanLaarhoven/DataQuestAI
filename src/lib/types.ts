export type ConceptType =
  | 'entity'
  | 'attribute'
  | 'relationship'
  | 'primaryKey'
  | 'foreignKey'
  | 'sql'
  | 'nosql'
  | 'storage'
  | 'retrieval'
  | 'search'
  | 'ethics'
  | 'kpi'
  | 'crud'
  | 'graphs'
  | 'dashboard';

export interface ConceptItem {
  id: string;
  type: ConceptType;
  label: string;
  iconName: string;
  category: 'core' | 'keys' | 'engine' | 'operations' | 'analytics';
  description: string;
}

export interface CanvasNode {
  id: string;
  type: ConceptType;
  label: string;
  x: number;
  y: number;
  status: 'idle' | 'correct' | 'wrong';
  feedback?: string;
  recommendation?: string;
  expectedType?: ConceptType;
  iconName?: string;
  metadata?: {
    dataType?: string;
    targetEntity?: string;
    isNullable?: boolean;
    defaultValue?: string;
  };
}

export interface CanvasEdge {
  id: string;
  fromId: string;
  toId: string;
  label?: string;
  cardinality?: '1:1' | '1:N' | 'M:N';
  activePulse?: boolean;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  progress: number;
  unlocked: boolean;
  completed: boolean;
  iconName: string;
  systemGoal: string;
  instructions: string[];
  initialNodes: CanvasNode[];
  initialEdges: CanvasEdge[];
  expectedRules: {
    correctNodes: { label: string; validTypes: ConceptType[] }[];
    requiredRelationships: { from: string; to: string }[];
  };
}

export interface CrudOperation {
  id: string;
  type: 'C' | 'R' | 'U' | 'D';
  title: string;
  description: string;
  table: string;
  sql: string;
  payload?: any;
}

export interface DataFeedEvent {
  id: string;
  time: string;
  event: 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE';
  table: string;
  details: string;
  durationMs?: number;
  success: boolean;
}

export interface ActivityItem {
  id: string;
  time: string;
  message: string;
  xpAward?: number;
  type: 'success' | 'hint' | 'badge' | 'error' | 'mission';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CommunityDesign {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  domain: string;
  description: string;
  reasoning: string;
  upvotes: number;
  forks: number;
  publishedDate: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  tags: string[];
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  role: 'student' | 'teacher' | 'architect' | 'admin';
  level: number;
  xp: number;
  streak: number;
  badgesCount: number;
  solvedCapstones: number;
}
