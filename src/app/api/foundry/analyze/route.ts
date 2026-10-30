import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface AnalysisNode {
  id: string;
  type: string;
  label: string;
  health: string;
  capacity?: number;
  latency?: number;
}

interface AnalysisConnection {
  from: string;
  to: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nodes: AnalysisNode[] = Array.isArray(body.nodes) ? body.nodes : [];
    const connections: AnalysisConnection[] = Array.isArray(body.connections) ? body.connections : [];
    const challengeTitle = body.challengeTitle || 'Systems Architecture Lab';
    const challengeGoal = body.challengeGoal || 'Build a reliable, secure multi-tier system topology.';

    const hasDirectDb = connections.some((c) => {
      const f = nodes.find((n) => n.id === c.from);
      const t = nodes.find((n) => n.id === c.to);
      return f?.type === 'client' && t?.type === 'database';
    });
    const hasCompute = nodes.some((n) => n.type === 'compute');
    const hasAuth = nodes.some((n) => n.type === 'auth' || n.type === 'gateway');
    const hasCache = nodes.some((n) => n.type === 'cache');
    const hasDown = nodes.some((n) => n.health === 'down');

    let issue = 'The components are present. Verify that each tier enforces separation of concerns.';
    let why = 'Client requests must traverse security and application logic tiers before reaching persistence.';
    const steps: string[] = [];

    if (hasDirectDb) {
      issue = 'Vulnerability Detected: Untrusted client connects directly to the database without authentication or middleware.';
      why = 'Anyone with network access can bypass business logic, inspect sensitive records, or drop tables.';
      steps.push('Remove the direct wire between the client and the database.');
      steps.push('Insert an Auth Guard / API Gateway and an Application Logic Tier.');
      steps.push('Wire the sequence: Client -> Gateway/Auth -> Application Server -> Database.');
    } else if (!hasCompute && nodes.length > 2) {
      issue = 'Missing Middle Tier: Client connects to downstream services without an Application Logic server.';
      why = 'Validation rules placed client-side can be tampered with by users.';
      steps.push('Add an Application Logic Server (Compute tier).');
      steps.push('Route client requests through the application server to enforce business invariants.');
    } else if (hasDown) {
      issue = 'Degraded Infrastructure: A component in the request path is marked down.';
      why = 'Traffic stops at the offline component, producing 503 Service Unavailable errors.';
      steps.push('Restore health or add a fallback path / message queue.');
    } else {
      issue = 'Architecture verified: Clean separation of presentation, business rules, and storage.';
      why = 'System complies with enterprise multi-tier isolation and least-privilege principles.';
    }

    const reply = [
      `STATUS: ${hasDirectDb ? 'Flaw Detected' : 'Architecture Analysis Complete'}`,
      `WHAT IS WRONG:\n${issue}`,
      `WHY IT MATTERS:\n${why}`,
      `STEP-BY-STEP GUIDANCE:`,
      ...steps.map((s, i) => `${i + 1}. ${s}`),
    ].join('\n\n');

    return NextResponse.json({
      reply,
      directDb: hasDirectDb,
      hasCompute,
      hasAuth,
      hasCache,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze architecture' }, { status: 500 });
  }
}

