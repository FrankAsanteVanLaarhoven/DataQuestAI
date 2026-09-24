import { NextResponse } from 'next/server';
import { getPlatformDb } from '@/lib/platform-db';
import { extractBearerToken, validateSessionToken } from '@/lib/auth';

export async function GET() {
  try {
    const db = getPlatformDb();

    // Check count and seed initial 4 community designs if table empty
    const countRow: any = db.prepare('SELECT COUNT(*) as count FROM designs').get();
    if (countRow && countRow.count === 0) {
      const initialDesigns = [
        {
          id: 'des_starter_1',
          user_id: 'usr_alex_demo',
          title: 'HyperScale Global E-Commerce Core',
          domain: 'E-Commerce / Retail',
          description: 'A read-replica optimized schema with Redis cache layer and strict 3NF for order lines and payments.',
          reasoning: 'Separated active cart items into temporary Redis memory to avoid locking the relational Orders table during flash sales. Implemented composite primary keys on OrderItems (order_id, product_id) to eliminate duplicate rows.',
          nodes_json: JSON.stringify([
            { id: '1', title: 'Customers', type: 'entity', x: 80, y: 120 },
            { id: '2', title: 'Orders', type: 'entity', x: 340, y: 120 },
            { id: '3', title: 'Products', type: 'entity', x: 600, y: 120 },
            { id: '4', title: 'Redis Cache', type: 'cache', x: 340, y: 320 }
          ]),
          edges_json: JSON.stringify([
            { id: 'e1-2', source: '1', target: '2', label: 'Places 1:N' },
            { id: 'e2-3', source: '2', target: '3', label: 'Contains N:M' }
          ]),
          tags_json: JSON.stringify(['PostgreSQL', '3NF', 'Redis Caching', 'Read-Replicas']),
          upvotes: 48,
          forks: 19
        },
        {
          id: 'des_starter_2',
          user_id: 'usr_sarah_cloud',
          title: 'HIPAA-Compliant Patient Telehealth EHR',
          domain: 'Healthcare / HIPAA',
          description: 'Encrypted patient records, immutable audit trail tables, and medical device streaming ingest.',
          reasoning: 'Strict regulatory requirement: Patient PII must be segregated from medical observations. Audit logs are write-only append tables with cryptographic hash chaining.',
          nodes_json: JSON.stringify([
            { id: '1', title: 'Patients', type: 'entity', x: 100, y: 100 },
            { id: '2', title: 'Appointments', type: 'entity', x: 360, y: 100 },
            { id: '3', title: 'AuditTrail', type: 'entity', x: 360, y: 300 }
          ]),
          edges_json: JSON.stringify([
            { id: 'e1-2', source: '1', target: '2', label: 'Books 1:N' },
            { id: 'e2-3', source: '2', target: '3', label: 'Logs to' }
          ]),
          tags_json: JSON.stringify(['HIPAA', 'Audit Logging', 'PostgreSQL', 'Security']),
          upvotes: 35,
          forks: 12
        },
        {
          id: 'des_starter_3',
          user_id: 'usr_marcus_fin',
          title: 'Double-Entry Ledger & Real-Time Settlement',
          domain: 'FinTech / Banking',
          description: 'ACID transactional banking core guaranteeing zero phantom withdrawals and instantaneous settlement balance.',
          reasoning: 'Every transaction creates equal and opposite debit and credit entries. Never use UPDATE on balance columns directly; calculate balances via indexed ledger snapshots.',
          nodes_json: JSON.stringify([
            { id: '1', title: 'Accounts', type: 'entity', x: 120, y: 120 },
            { id: '2', title: 'LedgerEntries', type: 'entity', x: 380, y: 120 },
            { id: '3', title: 'Kafka Queue', type: 'queue', x: 640, y: 120 }
          ]),
          edges_json: JSON.stringify([
            { id: 'e1-2', source: '1', target: '2', label: 'Debits/Credits' },
            { id: 'e2-3', source: '2', target: '3', label: 'Publishes' }
          ]),
          tags_json: JSON.stringify(['ACID', 'Double-Entry', 'Kafka', 'Banking Grade']),
          upvotes: 62,
          forks: 27
        }
      ];

      const stmt = db.prepare(`
        INSERT INTO designs (id, user_id, title, domain, description, reasoning, nodes_json, edges_json, tags_json, upvotes, forks)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const d of initialDesigns) {
        stmt.run(d.id, d.user_id, d.title, d.domain, d.description, d.reasoning, d.nodes_json, d.edges_json, d.tags_json, d.upvotes, d.forks);
      }
    }

    const rows = db.prepare('SELECT * FROM designs ORDER BY upvotes DESC, created_at DESC').all();

    // Map rows to parse JSON strings
    const designs = rows.map((r: any) => ({
      ...r,
      nodes: r.nodes_json ? JSON.parse(r.nodes_json) : [],
      edges: r.edges_json ? JSON.parse(r.edges_json) : [],
      tags: r.tags_json ? JSON.parse(r.tags_json) : [],
    }));

    return NextResponse.json({ success: true, designs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const db = getPlatformDb();
    const token = extractBearerToken(request);
    const authCheck = validateSessionToken(token, db);

    if (!authCheck.valid || !authCheck.user) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in to publish architectures to the community.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, title, domain, description, reasoning, nodes, edges, tags } = body;

    const designId = id || 'des_' + Math.random().toString(36).substring(2, 9);
    const userId = authCheck.user.id;

    db.prepare(`
      INSERT INTO designs (id, user_id, title, domain, description, reasoning, nodes_json, edges_json, tags_json, upvotes, forks)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0)
    `).run(
      designId,
      userId,
      title || 'Untitled Architecture',
      domain || 'General Database',
      description || 'Architectural schema design',
      reasoning || 'Default architectural tradeoffs explained.',
      JSON.stringify(nodes || []),
      JSON.stringify(edges || []),
      JSON.stringify(tags || ['SQL', 'Relational'])
    );

    const saved: any = db.prepare('SELECT * FROM designs WHERE id = ?').get(designId);
    return NextResponse.json({
      success: true,
      design: {
        ...saved,
        nodes: JSON.parse(saved.nodes_json || '[]'),
        edges: JSON.parse(saved.edges_json || '[]'),
        tags: JSON.parse(saved.tags_json || '[]'),
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const db = getPlatformDb();
    const body = await request.json();
    const { id, action } = body;

    if (action === 'upvote') {
      db.prepare('UPDATE designs SET upvotes = upvotes + 1 WHERE id = ?').run(id);
    } else if (action === 'fork') {
      db.prepare('UPDATE designs SET forks = forks + 1 WHERE id = ?').run(id);
    }

    const updated: any = db.prepare('SELECT * FROM designs WHERE id = ?').get(id);
    return NextResponse.json({ success: true, design: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
