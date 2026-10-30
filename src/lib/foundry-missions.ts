/**
 * Foundry Missions & Architecture Challenges Registry
 * Matches challenges shown in the Newcastle Architecture Studio:
 * - Freeform Full Systems Architecture Lab
 * - CSC2031 Challenge 1: Shield the Naked Database
 * - CSC2035 Challenge 2: The Three-Tier Architecture
 * - CSC2033 Challenge 3: The Automated Andon Cord Pipeline
 * - CSC3131 Challenge 4: The 10:00 AM Ticket Surge
 * - CSC3131 Challenge 5: The 02:14 AM Observability Alert
 * - CSC3131 Challenge 6: The Status Request
 */

export type WireStyle = 'curve' | 'elbow' | 'straight' | 'plain' | 'bezier' | 'manhattan' | 'bus';

export type NodeType =
  | 'client'
  | 'gateway'
  | 'auth'
  | 'compute'
  | 'cache'
  | 'database'
  | 'queue'
  | 'ci'
  | 'telemetry'
  | 'text'
  | 'box'
  | 'ellipse'
  | 'diamond'
  | 'cylinder'
  | 'cloud'
  | 'note';

export interface SystemNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  z?: number;
  health: 'healthy' | 'degraded' | 'down';
  latency: number;
  capacity: number;
  rps: number;
  role: string;
  industryTool: string;
}

export interface Connection {
  id: string;
  from: string;
  to: string;
  status: 'idle' | 'active' | 'error';
  protocol?: string;
  style?: WireStyle;
}

export type ChallengeId = 'freeform' | 'c1_security' | 'c2_design' | 'c3_cicd' | 'c4_scale' | 'c5_observability' | 'c6_status';

export interface Challenge {
  id: ChallengeId;
  course: 'CSC2031' | 'CSC2035' | 'CSC2033' | 'CSC3131' | 'SANDBOX';
  courseTitle: string;
  badge: string;
  title: string;
  goal: string;
  hint: string;
  initialNodes: SystemNode[];
  initialConnections: Connection[];
  checkSuccess: (nodes: SystemNode[], conns: Connection[]) => boolean;
}

export const CHALLENGES: Challenge[] = [
  {
    id: 'freeform',
    course: 'SANDBOX',
    courseTitle: 'Open Systems Foundry',
    badge: 'Freeform',
    title: 'Full Systems Architecture Lab',
    goal: 'Design, connect, and simulate any multi-tier cloud topology. Stress-test under traffic spikes and chaos engineering.',
    hint: 'Use the component palette to add nodes. Drag wire endpoints or use Connect Arrow tool to wire them.',
    initialNodes: [],
    initialConnections: [],
    checkSuccess: () => true,
  },
  {
    id: 'c1_security',
    course: 'CSC2031',
    courseTitle: 'Security Programming',
    badge: 'CSC2031',
    title: 'Challenge 1: Shield the Naked Database',
    goal: 'Vulnerability detected! The client is querying the Database directly. Add an Auth Guard and an App Logic Server between them so unauthenticated users cannot tamper with records.',
    hint: 'Add an "Auth & Security Guard" or "API Gateway", and an "App Logic Tier". Reconnect the flow: Client -> Auth -> App -> DB.',
    initialNodes: [
      { id: 'client-sec', type: 'client', label: 'Untrusted Client', x: 80, y: 180, health: 'healthy', latency: 20, capacity: 100, rps: 50, role: 'Public Browser', industryTool: 'Browser' },
      { id: 'db-sec', type: 'database', label: 'Vulnerable DB', x: 620, y: 180, health: 'degraded', latency: 40, capacity: 200, rps: 50, role: 'Directly Exposed Database', industryTool: 'PostgreSQL' },
    ],
    initialConnections: [
      { id: 'c-bad', from: 'client-sec', to: 'db-sec', status: 'error', protocol: 'DIRECT TCP (DANGEROUS)' },
    ],
    checkSuccess: (nodes, conns) => {
      const hasAuth = nodes.some((n) => n.type === 'auth' || n.type === 'gateway');
      const hasApp = nodes.some((n) => n.type === 'compute');
      const directDbConn = conns.some((c) => {
        const fromNode = nodes.find((n) => n.id === c.from);
        const toNode = nodes.find((n) => n.id === c.to);
        return fromNode?.type === 'client' && toNode?.type === 'database';
      });
      return hasAuth && hasApp && !directDbConn;
    },
  },
  {
    id: 'c2_design',
    course: 'CSC2035',
    courseTitle: 'Software Systems Design & Implementation',
    badge: 'CSC2035',
    title: 'Challenge 2: The Three-Tier Architecture',
    goal: 'Enforce separation of concerns: Room 1 (Client), Room 2 (App Logic), Room 3 (Database). Ensure rules and validation live strictly in the middle tier.',
    hint: 'Build a chain: Client -> App Logic Tier -> Authoritative Database.',
    initialNodes: [
      { id: 'c2-client', type: 'client', label: 'Clinic Reception', x: 80, y: 180, health: 'healthy', latency: 15, capacity: 300, rps: 50, role: 'Presentation Room', industryTool: 'Desktop Client' },
      { id: 'c2-db', type: 'database', label: 'Patient Booking DB', x: 680, y: 180, health: 'healthy', latency: 50, capacity: 500, rps: 50, role: 'Persistence Room', industryTool: 'PostgreSQL' },
    ],
    initialConnections: [],
    checkSuccess: (nodes, conns) => {
      const hasApp = nodes.some((n) => n.type === 'compute');
      const clientToApp = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === 'client' && t?.type === 'compute';
      });
      const appToDb = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === 'compute' && t?.type === 'database';
      });
      return hasApp && clientToApp && appToDb;
    },
  },
  {
    id: 'c3_cicd',
    course: 'CSC2033',
    courseTitle: 'Software Engineering Team Project',
    badge: 'CSC2033',
    title: 'Challenge 3: The Automated Andon Cord Pipeline',
    goal: 'Connect a Continuous Integration pipeline so that code changes pass through automated tests and secret scanning before joining the Production App.',
    hint: 'Wire Client/Developer -> CI Pipeline Runner -> App Server. Test what happens when you simulate a failing test.',
    initialNodes: [
      { id: 'c3-dev', type: 'client', label: 'Developer Laptop', x: 80, y: 180, health: 'healthy', latency: 10, capacity: 50, rps: 10, role: 'Workbench', industryTool: 'Git Workspace' },
      { id: 'c3-app', type: 'compute', label: 'Production Roster App', x: 680, y: 180, health: 'healthy', latency: 25, capacity: 1000, rps: 10, role: 'Live Service', industryTool: 'Kubernetes Pod' },
    ],
    initialConnections: [],
    checkSuccess: (nodes, conns) => {
      const hasCi = nodes.some((n) => n.type === 'ci');
      const devToCi = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === 'client' && t?.type === 'ci';
      });
      const ciToApp = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === 'ci' && t?.type === 'compute';
      });
      return hasCi && devToCi && ciToApp;
    },
  },
  {
    id: 'c4_scale',
    course: 'CSC3131',
    courseTitle: 'Development & Operations of Systems',
    badge: 'CSC3131',
    title: 'Challenge 4: The 10:00 AM Ticket Surge',
    goal: 'A massive rush of 10,000 requests/second is about to hit! The database can only handle 800 rps. Add a Distributed Cache (for reads) and a Queue (for async orders) to absorb the flood.',
    hint: 'Add both a "Distributed Cache" and a "Message Broker / Queue" connected to your App Logic Tier.',
    initialNodes: [
      { id: 'c4-client', type: 'client', label: '10:00 AM Crowd', x: 80, y: 180, health: 'healthy', latency: 15, capacity: 10000, rps: 1200, role: 'Traffic Surge', industryTool: 'Web Browsers' },
      { id: 'c4-app', type: 'compute', label: 'Festival Ticketing API', x: 380, y: 180, health: 'degraded', latency: 180, capacity: 1500, rps: 1200, role: 'API Backend', industryTool: 'Node.js Pod' },
      { id: 'c4-db', type: 'database', label: 'Ticket Database', x: 740, y: 180, health: 'down', latency: 500, capacity: 500, rps: 1200, role: 'Persistence (Crashed)', industryTool: 'PostgreSQL' },
    ],
    initialConnections: [
      { id: 'c4-1', from: 'c4-client', to: 'c4-app', status: 'active' },
      { id: 'c4-2', from: 'c4-app', to: 'c4-db', status: 'error' },
    ],
    checkSuccess: (nodes, conns) => {
      const hasCache = nodes.some((n) => n.type === 'cache');
      const hasQueue = nodes.some((n) => n.type === 'queue');
      const appConnectedToCache = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return (f?.type === 'compute' && t?.type === 'cache') || (f?.type === 'cache' && t?.type === 'compute');
      });
      return hasCache && hasQueue && appConnectedToCache;
    },
  },
  {
    id: 'c5_observability',
    course: 'CSC3131',
    courseTitle: 'Development & Operations of Systems',
    badge: 'CSC3131',
    title: 'Challenge 5: The 02:14 AM Observability Alert',
    goal: 'An intermittent crash is stranding night couriers! Add a Telemetry & SRE Agent so the system logs every trace and alerts on-call staff with the exact failing request before users report it.',
    hint: 'Place a "Telemetry & SRE Agent" and link it to the App Logic Tier or Gateway.',
    initialNodes: [
      { id: 'c5-client', type: 'client', label: 'Night Courier App', x: 80, y: 180, health: 'healthy', latency: 20, capacity: 400, rps: 100, role: 'Driver Handheld', industryTool: 'Mobile App' },
      { id: 'c5-app', type: 'compute', label: 'Dispatch Gateway', x: 400, y: 180, health: 'degraded', latency: 90, capacity: 800, rps: 100, role: 'Dispatch Logic', industryTool: 'Microservice' },
      { id: 'c5-db', type: 'database', label: 'GPS Tracking Store', x: 720, y: 180, health: 'healthy', latency: 30, capacity: 600, rps: 100, role: 'Location DB', industryTool: 'PostgreSQL' },
    ],
    initialConnections: [
      { id: 'c5-1', from: 'c5-client', to: 'c5-app', status: 'active' },
      { id: 'c5-2', from: 'c5-app', to: 'c5-db', status: 'active' },
    ],
    checkSuccess: (nodes, conns) => {
      const hasTelemetry = nodes.some((n) => n.type === 'telemetry');
      const linked = conns.some((c) => {
        const f = nodes.find((n) => n.id === c.from);
        const t = nodes.find((n) => n.id === c.to);
        return f?.type === 'telemetry' || t?.type === 'telemetry';
      });
      return hasTelemetry && linked;
    },
  },
  {
    id: 'c6_status',
    course: 'CSC3131',
    courseTitle: 'Development & Operations of Systems',
    badge: 'CSC3131',
    title: 'Challenge 6: The Status Request',
    goal: 'The payments desk asks for /status. The browser must not touch the ledger. Put a gateway between the desk and the application, and keep the database behind the application.',
    hint: 'Wire Client -> Gateway -> App, and App -> Database. There must be no wire from the client to the database.',
    initialNodes: [
      { id: 'c6-desk', type: 'client', label: 'Payments Desk', x: 80, y: 180, health: 'healthy', latency: 12, capacity: 200, rps: 20, role: 'Status Page', industryTool: 'Browser' },
      { id: 'c6-db', type: 'database', label: 'Ledger', x: 760, y: 180, health: 'healthy', latency: 40, capacity: 400, rps: 0, role: 'Key and Records', industryTool: 'PostgreSQL' },
    ],
    initialConnections: [],
    checkSuccess: (nodes, conns) => {
      const hasGateway = nodes.some((n) => n.type === 'gateway');
      const hasApp = nodes.some((n) => n.type === 'compute');
      const linked = (from: string, to: string) =>
        conns.some((c) => {
          const f = nodes.find((n) => n.id === c.from);
          const t = nodes.find((n) => n.id === c.to);
          return f?.type === from && t?.type === to;
        });
      const clientToDb = linked('client', 'database') || linked('database', 'client');
      return hasGateway && hasApp && linked('client', 'gateway') && linked('gateway', 'compute') && linked('compute', 'database') && !clientToDb;
    },
  },
];
