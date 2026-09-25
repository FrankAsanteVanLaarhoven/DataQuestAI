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
  role: 'student' | 'teacher' | 'architect' | 'admin' | 'super_admin';
  level: number;
  xp: number;
  streak: number;
  badgesCount: number;
  solvedCapstones: number;
}

// ---------------------------------------------------------------------------
// Entity-Relationship Diagram (ERD) Domain Model (CSC1033 Course Aligned)
// ---------------------------------------------------------------------------

export type ErdCardinality = '1:1' | '1:N' | 'N:1' | 'M:N';
export type ErdModality = 'mandatory' | 'optional';
export type ErdNotation = 'crows_foot' | 'chen' | 'uml';

export type DiagramNodeType =
  | 'entity'
  | 'uml_class'
  | 'microservice'
  | 'gateway'
  | 'queue'
  | 'database'
  | 'cache'
  | 'external';

export type RoutingStyle = 'orthogonal' | 'curved' | 'straight';
export type LineStyle = 'solid' | 'dashed' | 'dotted';
export type ArrowheadType =
  | 'crows_foot'
  | 'uml_arrow'
  | 'diamond_filled'
  | 'diamond_open'
  | 'async_arrow'
  | 'none';

export interface ERDWaypoint {
  id: string;
  x: number;
  y: number;
}

export interface ERDMethod {
  id: string;
  name: string;
  returnType: string;
  visibility: '+' | '-' | '#';
  parameters?: string;
}

export interface ERDAttribute {
  id: string;
  name: string;
  dataType:
    | 'INT'
    | 'BIGINT'
    | 'VARCHAR(100)'
    | 'VARCHAR(255)'
    | 'TEXT'
    | 'BOOLEAN'
    | 'DECIMAL(10,2)'
    | 'DATE'
    | 'TIMESTAMP'
    | 'UUID'
    | string;
  isPrimaryKey: boolean;
  isForeignKey?: boolean;
  isNullable: boolean;
  isUnique: boolean;
  comment?: string;
  references?: {
    entityId: string;
    attributeId: string;
    tableName?: string;
    columnName?: string;
  };
}

export interface ERDEntity {
  id: string;
  name: string;
  comment?: string;
  x: number;
  y: number;
  color?: string;
  isWeak?: boolean;
  attributes: ERDAttribute[];
  // Advanced UML & Distributed Systems
  nodeType?: DiagramNodeType;
  stereotype?: string; // e.g. '<<interface>>', '<<service>>', '<<kafka>>'
  methods?: ERDMethod[]; // For UML Class diagrams
  techBadge?: string; // e.g. 'Go', 'Kafka', 'Redis', 'Postgres', 'gRPC'
  metrics?: {
    rps?: string;
    latency?: string;
    status?: 'healthy' | 'degraded' | 'syncing';
  };
}

export interface ERDRelationship {
  id: string;
  name: string;
  fromEntityId: string;
  fromAttributeId: string;
  toEntityId: string;
  toAttributeId: string;
  cardinality: ErdCardinality;
  fromModality?: ErdModality;
  toModality?: ErdModality;
  isIdentifying?: boolean;
  onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
  onUpdate?: 'CASCADE' | 'RESTRICT';
  // Routing, Splines & Waypoints
  waypoints?: ERDWaypoint[];
  routingStyle?: RoutingStyle;
  lineStyle?: LineStyle;
  arrowhead?: ArrowheadType;
  label?: string;
  protocol?: string; // e.g. 'REST (HTTPS)', 'gRPC', 'Async Event (Kafka)', 'SQL Query'
  color?: string;
}

