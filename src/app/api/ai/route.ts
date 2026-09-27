import { NextResponse } from 'next/server';
import {
  callOpenRouter,
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_MODELS,
  OpenRouterMessage,
} from '@/lib/openrouter';
import { extractBearerToken } from '@/lib/auth';

export async function GET() {
  const hasServerKey = Boolean(
    process.env.OPENROUTER_API_KEY || process.env.OPEN_ROUTER_API_KEY
  );

  return NextResponse.json({
    status: 'online',
    hasServerKey,
    defaultModel: DEFAULT_OPENROUTER_MODEL,
    availableModels: OPENROUTER_MODELS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      action = 'chat',
      prompt,
      model = DEFAULT_OPENROUTER_MODEL,
      apiKey, // Optional client-side override if learner brings their own key
      messages = [],
      context = {},
    } = body;

    // 1. GENERAL SOCRATIC CHAT & DATABASE TUTOR
    if (action === 'chat') {
      if (!prompt && (!messages || messages.length === 0)) {
        return NextResponse.json({ error: 'Prompt or message history is required.' }, { status: 400 });
      }

      const systemPrompt = `You are DataQuestAI's Master Database Architect and Socratic Tutor.
Your mission is to guide learners through relational database systems, Peter Chen ERD modeling, Codd's Relational Algebra, B-Tree query execution planning (Index Seek vs Table Scan), 3NF/BCNF Normalization, ACID transactions, and distributed systems architecture.
Style guidelines:
- Be clear, technically rigorous, encouraging, and concise.
- Use Socratic scaffolding: explain the "why" and first principles before giving code.
- Format SQL with syntax highlighting and explain time complexity ($O(1)$, $O(\\log N)$, $O(N)$) where relevant.
- Context provided: ${JSON.stringify(context.currentMission || context.activeTab || 'General Database Laboratory')}`;

      const conversationMessages: OpenRouterMessage[] = [
        { role: 'system', content: systemPrompt },
        ...(messages.length > 0
          ? messages
          : [{ role: 'user', content: prompt } as OpenRouterMessage]),
      ];

      const result = await callOpenRouter({
        model,
        messages: conversationMessages,
        apiKey,
        temperature: 0.4,
      });

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error,
          modelUsed: result.modelUsed,
          fallbackContent: getLocalFallbackChat(prompt),
        }, { status: result.isMockFallback ? 200 : 502 });
      }

      return NextResponse.json({
        success: true,
        content: result.content,
        modelUsed: result.modelUsed,
        tokensUsed: result.tokensUsed,
      });
    }

    // 2. SYNTHESIZE COMPLETE ERD / ARCHITECTURE FROM NATURAL LANGUAGE
    if (action === 'generate_schema') {
      if (!prompt) {
        return NextResponse.json({ error: 'Specification prompt is required to synthesize schema.' }, { status: 400 });
      }

      const systemPrompt = `You are an expert Relational Database and Systems Architect.
Your task is to take a user's natural language scenario and synthesize an optimal, 3NF-compliant relational database schema with entities, attributes, primary keys, foreign keys, and relationships.

You MUST respond strictly with valid JSON conforming to this schema (no markdown fences, raw JSON only):
{
  "title": "Short descriptive architecture title",
  "domain": "e.g. Healthcare, E-Commerce, Banking, EdTech",
  "summary": "Brief 1-2 sentence architectural rationale",
  "entities": [
    {
      "id": "entity_1",
      "name": "TableName",
      "stereotype": "<<entity>>",
      "comment": "Purpose of this table",
      "attributes": [
        {
          "name": "id",
          "dataType": "UUID or INT or VARCHAR(100)",
          "isPrimaryKey": true,
          "isNullable": false
        },
        {
          "name": "foreign_key_id",
          "dataType": "UUID or INT",
          "isForeignKey": true,
          "isNullable": false
        },
        {
          "name": "descriptive_attribute",
          "dataType": "VARCHAR(255)",
          "isPrimaryKey": false,
          "isForeignKey": false,
          "isNullable": true
        }
      ]
    }
  ],
  "relationships": [
    {
      "fromEntityName": "ParentTable",
      "fromAttributeName": "id",
      "toEntityName": "ChildTable",
      "toAttributeName": "parent_id",
      "cardinality": "1:N",
      "name": "Has many",
      "onDelete": "CASCADE"
    }
  ]
}`;

      const result = await callOpenRouter({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Design a production database schema for: ${prompt}` },
        ],
        apiKey,
        temperature: 0.2,
      });

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: result.error,
          modelUsed: result.modelUsed,
        }, { status: 502 });
      }

      try {
        // Strip any markdown codeblock backticks if present
        let cleaned = result.content.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
        }
        const parsedSchema = JSON.parse(cleaned);
        return NextResponse.json({
          success: true,
          schema: parsedSchema,
          modelUsed: result.modelUsed,
        });
      } catch (parseErr) {
        return NextResponse.json({
          success: false,
          error: 'Model output could not be parsed as structured JSON schema.',
          rawContent: result.content,
        }, { status: 502 });
      }
    }

    // 3. AUDIT ARCHITECTURE & 3NF NORMALIZATION
    if (action === 'audit_schema') {
      const { entities = [], relationships = [] } = context;

      const systemPrompt = `You are a Principal Database Administrator and Academic Database Auditor.
Inspect the following database schema provided by the student and perform a rigorous audit:
1. Normalization Review: Check 1NF (atomic attributes), 2NF (partial dependencies on composite keys), 3NF (transitive dependencies), and BCNF.
2. Referential Integrity & Foreign Keys: Are foreign keys properly placed on the child entity? Are any orphaned relationships present?
3. Performance & Index Recommendations: Which columns urgently need B-Tree indexes to prevent sequential TABLE SCANS on JOINs?
4. Concrete Socratic Remediation: Give clear, prioritized action steps.

Entities: ${JSON.stringify(entities, null, 2)}
Relationships: ${JSON.stringify(relationships, null, 2)}`;

      const result = await callOpenRouter({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt || 'Audit my database design for 3NF normalization violations, indexing gaps, and referential integrity.' },
        ],
        apiKey,
        temperature: 0.2,
      });

      return NextResponse.json({
        success: result.success,
        content: result.content,
        modelUsed: result.modelUsed,
        error: result.error,
      });
    }

    // 4. NATURAL LANGUAGE TO SQL (Text-to-SQL)
    if (action === 'text_to_sql') {
      const schemaDescription = context.schemaSummary || 'Tables: Customers (CustomerID, Name, Email), Orders (OrderID, CustomerID, OrderDate, TotalAmount, Status), OrderItems (OrderItemID, OrderID, ProductID, Quantity, UnitPrice), Products (ProductID, ProductName, Category, Price, Stock)';

      const systemPrompt = `You are an expert SQL Query Optimizer.
Convert the user's natural language request into standard ANSI SQL compatible with PostgreSQL and SQLite.
Schema context:
${schemaDescription}

Return your answer strictly in this format:
SQL:
\`\`\`sql
-- Generated query
SELECT ...
\`\`\`

Explanation:
- Physical Query Plan: (Explain whether this will use INDEX_SEEK or TABLE_SCAN and which B-Tree index is recommended)
- Complexity: $O(\\log N)$ or $O(N)$
- Normalization note: (Any relevant schema constraint)`;

      const result = await callOpenRouter({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        apiKey,
        temperature: 0.2,
      });

      return NextResponse.json({
        success: result.success,
        content: result.content,
        modelUsed: result.modelUsed,
        error: result.error,
      });
    }

    // 5. LIVE RAG SYNTHESIS (Used by VectorAiLab)
    if (action === 'test_rag') {
      const { documentText, isBroken } = context;

      const systemPrompt = isBroken
        ? `You are a language model with strict context grounding. You MUST ONLY use the provided text chunk to answer the user question. If the provided text does not contain the answer, hallucinate an incorrect statement based purely on the unrelated text to demonstrate a retrieval failure.`
        : `You are an accurate educational AI assistant grounded strictly in the provided document chunk. Provide a concise, factual answer based exclusively on the given text.`;

      const result = await callOpenRouter({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Context:\n"""\n${documentText}\n"""\n\nQuestion: ${prompt}` },
        ],
        apiKey,
        temperature: isBroken ? 0.8 : 0.1,
      });

      return NextResponse.json({
        success: result.success,
        content: result.content,
        modelUsed: result.modelUsed,
        error: result.error,
      });
    }

    return NextResponse.json({ error: 'Invalid AI action specified.' }, { status: 400 });
  } catch (err: any) {
    console.error('OpenRouter AI Route Error:', err.message);
    return NextResponse.json({ error: 'Failed to process AI inference request.' }, { status: 500 });
  }
}

function getLocalFallbackChat(prompt: string): string {
  const lower = prompt.toLowerCase();
  if (lower.includes('3nf') || lower.includes('normalization')) {
    return 'Third Normal Form (3NF) requires two conditions:\n1. The relation is already in 2NF (no partial functional dependencies on composite keys).\n2. No non-prime attribute is transitively dependent on the primary key (every non-key attribute must depend on nothing but the key).\n\nIf A → B and B → C (where A is the PK), attribute C must be decoupled into its own independent entity.';
  }
  if (lower.includes('join') || lower.includes('index')) {
    return 'In relational query planning:\n• B-Tree Index Seek operates in O(log N) time by traversing the balanced tree height directly to target leaf pointers.\n• Table Scan operates in O(N) by sequentially inspecting every physical block on disk or in the buffer pool.\n• On JOIN operations, ensure foreign key columns have indexes to enable Hash Join or Index Nested Loop Join rather than Cartesian scans.';
  }
  return 'DataQuestAI Socratic Assistant: Connect an OpenRouter API key to activate live multi-model reasoning across Claude 3.5 Sonnet, GPT-4o, DeepSeek R1, and Llama 3.3.';
}
