/**
 * DataQuestAI - Isolated In-Memory SQL Lab Engine
 * Provides genuine SQL parsing, constraint checking, indexing,
 * EXPLAIN QUERY PLAN generation, and transaction execution metrics.
 */

export interface SqlColumnDef {
  name: string;
  type: 'TEXT' | 'INTEGER' | 'REAL' | 'BOOLEAN';
  primaryKey?: boolean;
  notNull?: boolean;
  foreignKey?: { table: string; column: string };
}

export interface SqlTableSchema {
  name: string;
  columns: SqlColumnDef[];
  indexes: Record<string, string[]>; // indexName -> columnNames
}

export interface QueryPlanStep {
  id: number;
  operation:
    | 'TABLE_SCAN'
    | 'INDEX_SEEK'
    | 'FILTER'
    | 'INSERT_ROW'
    | 'UPDATE_ROW'
    | 'DELETE_ROW'
    | 'HASH_JOIN'
    | 'NESTED_LOOP_JOIN'
    | 'INDEX_JOIN';
  table: string;
  indexUsed?: string;
  condition?: string;
  estimatedCost: number;
  rowsScanned: number;
  rowsReturned: number;
  detail: string;
}

export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';

export interface ParsedJoin {
  type: JoinType;
  tableName: string;
  alias: string;
  onCondition?: string;
}

export interface ParsedFromClause {
  baseTable: string;
  baseAlias: string;
  joins: ParsedJoin[];
}

export interface ProjectedColumnExpr {
  sourceExpr: string;
  alias?: string;
  displayName: string;
}

export interface SqlExecutionMetrics {
  durationMs: number;
  rowsScanned: number;
  rowsReturned: number;
  rowsAffected: number;
  indexUsed?: string;
  queryPlan: QueryPlanStep[];
}

export interface SqlExecutionResult {
  success: boolean;
  message: string;
  columns?: string[];
  rows?: any[];
  metrics: SqlExecutionMetrics;
  commandType: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE' | 'CREATE_TABLE' | 'CREATE_INDEX' | 'EXPLAIN' | 'UNKNOWN';
  targetTable?: string;
}

export class SqlLabEngine {
  private tables: Map<string, any[]> = new Map();
  private schemas: Map<string, SqlTableSchema> = new Map();
  private indexes: Map<string, Map<any, any[]>> = new Map(); // "table.col" -> Map(val -> rows)

  constructor() {
    this.seedInitialDatabase();
  }

  public seedInitialDatabase() {
    this.tables.clear();
    this.schemas.clear();
    this.indexes.clear();

    // 1. Books Table
    this.createTable({
      name: 'Books',
      columns: [
        { name: 'BookID', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'Title', type: 'TEXT', notNull: true },
        { name: 'Author', type: 'TEXT' },
        { name: 'Copies', type: 'INTEGER', notNull: true },
        { name: 'Category', type: 'TEXT' },
      ],
      indexes: {},
    });

    this.bulkInsert('Books', [
      { BookID: 'B001', Title: 'Clean Code', Author: 'Robert C. Martin', Copies: 4, Category: 'Science' },
      { BookID: 'B002', Title: 'Python Data Systems', Author: 'Wes McKinney', Copies: 7, Category: 'Technology' },
      { BookID: 'B003', Title: 'Database Internals', Author: 'Alex Petrov', Copies: 3, Category: 'Science' },
      { BookID: 'B004', Title: 'Designing Data-Intensive Apps', Author: 'Martin Kleppmann', Copies: 5, Category: 'Technology' },
      { BookID: 'B005', Title: 'Algorithms Unlocked', Author: 'Thomas Cormen', Copies: 2, Category: 'Science' },
    ]);

    // 2. Students Table
    this.createTable({
      name: 'Students',
      columns: [
        { name: 'StudentID', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'Name', type: 'TEXT', notNull: true },
        { name: 'Email', type: 'TEXT', notNull: true },
        { name: 'DateOfBirth', type: 'TEXT' },
        { name: 'Department', type: 'TEXT' },
      ],
      indexes: {},
    });

    this.bulkInsert('Students', [
      { StudentID: 'S001', Name: 'Alice Johnson', Email: 'alice@university.ac.uk', DateOfBirth: '2003-04-12', Department: 'Computing' },
      { StudentID: 'S002', Name: 'Ben Davis', Email: 'ben@university.ac.uk', DateOfBirth: '2002-11-28', Department: 'Mathematics' },
      { StudentID: 'S003', Name: 'Cara Williams', Email: 'cara@university.ac.uk', DateOfBirth: '2003-08-04', Department: 'Computing' },
      { StudentID: 'S004', Name: 'David Lee', Email: 'david@university.ac.uk', DateOfBirth: '2004-01-19', Department: 'Engineering' },
    ]);

    // 3. Loans Table (Junction between Students and Books)
    this.createTable({
      name: 'Loans',
      columns: [
        { name: 'LoanID', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'StudentID', type: 'TEXT', notNull: true, foreignKey: { table: 'Students', column: 'StudentID' } },
        { name: 'BookID', type: 'TEXT', notNull: true, foreignKey: { table: 'Books', column: 'BookID' } },
        { name: 'BorrowDate', type: 'TEXT', notNull: true },
        { name: 'DueDate', type: 'TEXT', notNull: true },
        { name: 'Status', type: 'TEXT' },
      ],
      indexes: {},
    });

    this.bulkInsert('Loans', [
      { LoanID: 'L101', StudentID: 'S001', BookID: 'B001', BorrowDate: '2026-09-10', DueDate: '2026-09-24', Status: 'Active' },
      { LoanID: 'L102', StudentID: 'S002', BookID: 'B003', BorrowDate: '2026-09-12', DueDate: '2026-09-26', Status: 'Active' },
      { LoanID: 'L103', StudentID: 'S001', BookID: 'B004', BorrowDate: '2026-09-15', DueDate: '2026-09-29', Status: 'Active' },
    ]);

    // 4. Customers Table (E-commerce / Retail)
    this.createTable({
      name: 'Customers',
      columns: [
        { name: 'CustomerID', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'Name', type: 'TEXT', notNull: true },
        { name: 'Email', type: 'TEXT', notNull: true },
        { name: 'Address', type: 'TEXT' },
      ],
      indexes: {},
    });

    this.bulkInsert('Customers', [
      { CustomerID: 'C001', Name: 'Alex Mercer', Email: 'alex@enterprise.com', Address: '742 Evergreen Terr' },
      { CustomerID: 'C002', Name: 'Elena Rostova', Email: 'elena@dataquest.org', Address: '10 Baker Street' },
      { CustomerID: 'C003', Name: 'Devon Miles', Email: 'devon@cloudvault.io', Address: '500 Technology Way' },
    ]);

    // 5. Orders Table
    this.createTable({
      name: 'Orders',
      columns: [
        { name: 'OrderID', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'CustomerID', type: 'TEXT', notNull: true, foreignKey: { table: 'Customers', column: 'CustomerID' } },
        { name: 'OrderDate', type: 'TEXT', notNull: true },
        { name: 'Total', type: 'REAL', notNull: true },
        { name: 'Status', type: 'TEXT' },
      ],
      indexes: {},
    });

    this.bulkInsert('Orders', [
      { OrderID: '#1042', CustomerID: 'C001', OrderDate: '2026-09-23', Total: 189.5, Status: 'Delivered' },
      { OrderID: '#1043', CustomerID: 'C002', OrderDate: '2026-09-23', Total: 45.0, Status: 'Processing' },
      { OrderID: '#1044', CustomerID: 'C003', OrderDate: '2026-09-22', Total: 312.2, Status: 'Shipped' },
    ]);

    // 6. Products Table
    this.createTable({
      name: 'Products',
      columns: [
        { name: 'ProductID', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'Name', type: 'TEXT', notNull: true },
        { name: 'Price', type: 'REAL', notNull: true },
        { name: 'Stock', type: 'INTEGER', notNull: true },
        { name: 'Category', type: 'TEXT' },
      ],
      indexes: {},
    });

    this.bulkInsert('Products', [
      { ProductID: 'P101', Name: 'Database Mastery Handbook', Price: 49.99, Stock: 24, Category: 'Books' },
      { ProductID: 'P102', Name: 'SQL Query Tuning Guide', Price: 29.99, Stock: 15, Category: 'Books' },
      { ProductID: 'P103', Name: 'Enterprise ERD Canvas Mat', Price: 19.99, Stock: 42, Category: 'Hardware' },
      { ProductID: 'P104', Name: 'Cloud Cluster Access Key', Price: 99.0, Stock: 8, Category: 'Cloud' },
    ]);

    // 7. Cart Table
    this.createTable({
      name: 'Cart',
      columns: [
        { name: 'CartID', type: 'TEXT', primaryKey: true, notNull: true },
        { name: 'CustomerID', type: 'TEXT', notNull: true },
        { name: 'ProductID', type: 'TEXT', notNull: true },
        { name: 'Quantity', type: 'INTEGER', notNull: true },
      ],
      indexes: {},
    });

    this.bulkInsert('Cart', [
      { CartID: 'CR01', CustomerID: 'C001', ProductID: 'P101', Quantity: 1 },
    ]);

    // Build default index on Orders(CustomerID) and Books(BookID)
    this.createIndex('idx_orders_customer', 'Orders', 'CustomerID');
    this.createIndex('idx_books_pk', 'Books', 'BookID');
  }

  public createTable(schema: SqlTableSchema) {
    this.schemas.set(schema.name.toLowerCase(), schema);
    if (!this.tables.has(schema.name.toLowerCase())) {
      this.tables.set(schema.name.toLowerCase(), []);
    }
  }

  public bulkInsert(tableName: string, rows: any[]) {
    const key = tableName.toLowerCase();
    const existing = this.tables.get(key) || [];
    existing.push(...rows.map((r) => ({ ...r })));
    this.tables.set(key, existing);
    this.rebuildIndexes(tableName);
  }

  public createIndex(indexName: string, tableName: string, columnName: string): boolean {
    const tableKey = tableName.toLowerCase();
    const schema = this.schemas.get(tableKey);
    if (!schema) return false;

    schema.indexes[indexName] = [columnName];
    this.rebuildIndexes(tableName);
    return true;
  }

  private rebuildIndexes(tableName: string) {
    const tableKey = tableName.toLowerCase();
    const rows = this.tables.get(tableKey) || [];
    const schema = this.schemas.get(tableKey);
    if (!schema) return;

    for (const [idxName, cols] of Object.entries(schema.indexes)) {
      const col = cols[0];
      const indexMapKey = `${tableKey}.${col.toLowerCase()}`;
      const map = new Map<any, any[]>();
      for (const row of rows) {
        const val = row[col];
        if (!map.has(val)) map.set(val, []);
        map.get(val)!.push(row);
      }
      this.indexes.set(indexMapKey, map);
    }
  }

  public getTableNames(): string[] {
    return Array.from(this.schemas.values()).map((s) => s.name);
  }

  public getTableRows(tableName: string): any[] {
    const tableKey = tableName.toLowerCase();
    const rows = this.tables.get(tableKey) || [];
    return rows.map((r) => ({ ...r }));
  }

  public getTableSchema(tableName: string): SqlTableSchema | undefined {
    return this.schemas.get(tableName.toLowerCase());
  }

  /**
   * Genuine SQL Execution
   */
  public execute(sql: string): SqlExecutionResult {
    const start = performance.now();
    const trimmed = sql.trim();
    if (!trimmed) {
      return {
        success: false,
        message: 'Empty SQL query',
        metrics: { durationMs: 0, rowsScanned: 0, rowsReturned: 0, rowsAffected: 0, queryPlan: [] },
        commandType: 'UNKNOWN',
      };
    }

    const isExplain = trimmed.toUpperCase().startsWith('EXPLAIN');
    const statementToRun = isExplain
      ? trimmed.replace(/^EXPLAIN\s+(QUERY\s+PLAN\s+)?/i, '').trim()
      : trimmed;

    const upper = statementToRun.toUpperCase();

    try {
      if (upper.startsWith('SELECT')) {
        return this.executeSelect(statementToRun, isExplain, start);
      } else if (upper.startsWith('INSERT')) {
        return this.executeInsert(statementToRun, start);
      } else if (upper.startsWith('UPDATE')) {
        return this.executeUpdate(statementToRun, start);
      } else if (upper.startsWith('DELETE')) {
        return this.executeDelete(statementToRun, start);
      } else if (upper.startsWith('CREATE INDEX')) {
        return this.executeCreateIndex(statementToRun, start);
      } else if (upper.startsWith('CREATE TABLE')) {
        return this.executeCreateTable(statementToRun, start);
      } else {
        throw new Error(`Unsupported SQL command: '${trimmed.split(' ')[0]}'. Supported commands: SELECT, INSERT, UPDATE, DELETE, CREATE INDEX, CREATE TABLE, EXPLAIN.`);
      }
    } catch (err: any) {
      const durationMs = Math.round((performance.now() - start) * 100) / 100;
      return {
        success: false,
        message: `SQL Error: ${err.message}`,
        metrics: {
          durationMs,
          rowsScanned: 0,
          rowsReturned: 0,
          rowsAffected: 0,
          queryPlan: [
            {
              id: 1,
              operation: 'FILTER',
              table: 'unknown',
              estimatedCost: 0,
              rowsScanned: 0,
              rowsReturned: 0,
              detail: `Execution aborted: ${err.message}`,
            },
          ],
        },
        commandType: 'UNKNOWN',
      };
    }
  }

  private executeSelect(sql: string, isExplain: boolean, start: number): SqlExecutionResult {
    // Parse SELECT [cols] FROM [fromClause] [WHERE condition] [ORDER BY col [ASC|DESC]] [LIMIT n]
    const parsedClauses = this.parseSelectClauses(sql);
    const { colsStr, fromClause, whereClause, orderByClause, limitClause } = parsedClauses;

    const parsedFrom = this.parseFromClause(fromClause);
    const baseTableKey = parsedFrom.baseTable.toLowerCase();
    const baseRows = this.tables.get(baseTableKey);

    if (!baseRows) {
      throw new Error(`Table '${parsedFrom.baseTable}' does not exist.`);
    }

    const baseSchema = this.schemas.get(baseTableKey);
    let totalRowsScanned = 0;
    let indexUsed: string | undefined;
    const queryPlanSteps: QueryPlanStep[] = [];

    // Step 1: Scan base table (or Index Seek if simple WHERE without joins)
    let currentRows: any[] = [];
    let usedBaseIndex = false;

    if (parsedFrom.joins.length === 0 && whereClause) {
      const eqMatch = whereClause.match(/^([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?$/i);
      if (eqMatch) {
        const colName = eqMatch[1];
        const val = this.parseValue(eqMatch[2]);
        const indexKey = `${baseTableKey}.${colName.toLowerCase()}`;

        if (this.indexes.has(indexKey)) {
          usedBaseIndex = true;
          indexUsed = `idx_${baseTableKey}_${colName.toLowerCase()}`;
          const indexMap = this.indexes.get(indexKey)!;
          const found = indexMap.get(val) || [];
          const scanned = found.length;
          totalRowsScanned += scanned;
          currentRows = found.map((r) => this.wrapBaseRow(r, parsedFrom.baseTable, parsedFrom.baseAlias));

          queryPlanSteps.push({
            id: 1,
            operation: 'INDEX_SEEK',
            table: parsedFrom.baseTable,
            indexUsed,
            condition: `${colName} = ${JSON.stringify(val)}`,
            estimatedCost: 1.2,
            rowsScanned: scanned,
            rowsReturned: currentRows.length,
            detail: `Index Seek on ${parsedFrom.baseTable} using ${indexUsed} (scanned ${scanned} indexed entries)`,
          });
        }
      }
    }

    if (!usedBaseIndex) {
      const scanned = baseRows.length;
      totalRowsScanned += scanned;
      currentRows = baseRows.map((r) => this.wrapBaseRow(r, parsedFrom.baseTable, parsedFrom.baseAlias));

      queryPlanSteps.push({
        id: 1,
        operation: 'TABLE_SCAN',
        table: parsedFrom.baseTable,
        condition: parsedFrom.joins.length === 0 && whereClause ? whereClause : 'NONE',
        estimatedCost: scanned * 1.5,
        rowsScanned: scanned,
        rowsReturned: currentRows.length,
        detail: `Table Scan on ${parsedFrom.baseTable} (scanned ${scanned} rows)`,
      });
    }

    // Step 2: Process JOINs sequentially
    let cumulativeTableLabel = parsedFrom.baseTable;

    for (let jIdx = 0; jIdx < parsedFrom.joins.length; jIdx++) {
      const join = parsedFrom.joins[jIdx];
      const targetTableKey = join.tableName.toLowerCase();
      const targetRows = this.tables.get(targetTableKey);
      const targetSchema = this.schemas.get(targetTableKey);

      if (!targetRows) {
        throw new Error(`Joined table '${join.tableName}' does not exist.`);
      }

      totalRowsScanned += targetRows.length;
      const prevCount = currentRows.length;
      const joinedRows = this.performJoin(currentRows, targetRows, join, targetSchema);
      currentRows = joinedRows;

      const isHashJoinPossible = join.onCondition && /=\s*/.test(join.onCondition);
      const operation: 'HASH_JOIN' | 'NESTED_LOOP_JOIN' = isHashJoinPossible ? 'HASH_JOIN' : 'NESTED_LOOP_JOIN';
      const joinLabel = `${cumulativeTableLabel} ⨝ ${join.tableName}`;
      cumulativeTableLabel = `(${joinLabel})`;

      queryPlanSteps.push({
        id: queryPlanSteps.length + 1,
        operation,
        table: joinLabel,
        condition: join.onCondition || 'CROSS JOIN',
        estimatedCost: Math.round((prevCount + targetRows.length) * 1.6 * 10) / 10,
        rowsScanned: prevCount + targetRows.length,
        rowsReturned: currentRows.length,
        detail: `${join.type} ${operation === 'HASH_JOIN' ? 'Hash Join' : 'Nested Loop Join'} on ${join.tableName} (${join.onCondition || 'CROSS PRODUCT'})`,
      });
    }

    // Step 3: WHERE clause filtering
    let matchingRows = currentRows;
    if (whereClause && (parsedFrom.joins.length > 0 || !usedBaseIndex)) {
      const beforeFilter = matchingRows.length;
      matchingRows = matchingRows.filter((r) => this.evaluateCondition(r, whereClause));

      if (parsedFrom.joins.length > 0) {
        queryPlanSteps.push({
          id: queryPlanSteps.length + 1,
          operation: 'FILTER',
          table: cumulativeTableLabel,
          condition: whereClause,
          estimatedCost: Math.round(beforeFilter * 0.8 * 10) / 10,
          rowsScanned: beforeFilter,
          rowsReturned: matchingRows.length,
          detail: `Filter joined relation on WHERE condition (${whereClause})`,
        });
      }
    }

    // Step 4: ORDER BY
    if (orderByClause) {
      const parts = orderByClause.trim().split(/\s+/);
      const orderCol = parts[0];
      const isDesc = parts[1] && parts[1].toUpperCase() === 'DESC';

      matchingRows.sort((a, b) => {
        const valA = this.resolveColumnValue(a, orderCol);
        const valB = this.resolveColumnValue(b, orderCol);
        if (valA === valB) return 0;
        if (valA === null || valA === undefined) return 1;
        if (valB === null || valB === undefined) return -1;
        if (valA > valB) return isDesc ? -1 : 1;
        return isDesc ? 1 : -1;
      });
    }

    // Step 5: LIMIT
    if (limitClause) {
      const lim = parseInt(limitClause, 10);
      matchingRows = matchingRows.slice(0, lim);
    }

    // Step 6: Column projection
    let finalColumns: string[] = [];
    let projectedRows: any[] = [];

    const isWildcard = colsStr.trim() === '*';
    if (isWildcard) {
      if (parsedFrom.joins.length === 0 && baseSchema) {
        finalColumns = baseSchema.columns.map((c) => c.name);
        projectedRows = matchingRows.map((r) => {
          const proj: any = {};
          for (const col of finalColumns) {
            proj[col] = this.resolveColumnValue(r, col) ?? null;
          }
          return proj;
        });
      } else {
        const colSet: string[] = [];
        if (baseSchema) {
          for (const c of baseSchema.columns) colSet.push(c.name);
        }
        for (const j of parsedFrom.joins) {
          const s = this.schemas.get(j.tableName.toLowerCase());
          if (s) {
            for (const c of s.columns) {
              if (colSet.includes(c.name)) {
                colSet.push(`${j.tableName}.${c.name}`);
              } else {
                colSet.push(c.name);
              }
            }
          }
        }
        finalColumns = colSet.length > 0 ? colSet : Object.keys(matchingRows[0] || {});
        projectedRows = matchingRows.map((r) => {
          const proj: any = {};
          for (const col of finalColumns) {
            proj[col] = this.resolveColumnValue(r, col) ?? null;
          }
          return proj;
        });
      }
    } else {
      const colExprs = this.parseProjectionColumns(colsStr);
      finalColumns = colExprs.map((e) => e.alias || e.displayName);
      projectedRows = matchingRows.map((r) => {
        const proj: any = {};
        for (const expr of colExprs) {
          const outKey = expr.alias || expr.displayName;
          proj[outKey] = this.resolveColumnValue(r, expr.sourceExpr) ?? null;
        }
        return proj;
      });
    }

    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    const targetLabel = parsedFrom.joins.length > 0
      ? `${parsedFrom.baseTable} JOIN ${parsedFrom.joins.map((j) => j.tableName).join(', ')}`
      : parsedFrom.baseTable;

    if (isExplain) {
      const explainSummary = parsedFrom.joins.length > 0
        ? `EXPLAIN QUERY PLAN: Relational Join (${queryPlanSteps.filter((s) => s.operation.includes('JOIN')).length} join steps, ${matchingRows.length} rows)`
        : `EXPLAIN QUERY PLAN: ${usedBaseIndex ? 'Used Index ' + indexUsed : 'Full Table Scan'} (${matchingRows.length} rows)`;

      return {
        success: true,
        message: explainSummary,
        columns: ['id', 'operation', 'table', 'indexUsed', 'rowsScanned', 'rowsReturned', 'detail'],
        rows: queryPlanSteps.map((s) => ({
          id: s.id,
          operation: s.operation,
          table: s.table,
          indexUsed: s.indexUsed || 'NONE',
          rowsScanned: s.rowsScanned,
          rowsReturned: s.rowsReturned,
          detail: s.detail,
        })),
        metrics: {
          durationMs,
          rowsScanned: totalRowsScanned,
          rowsReturned: queryPlanSteps.length,
          rowsAffected: 0,
          indexUsed,
          queryPlan: queryPlanSteps,
        },
        commandType: 'EXPLAIN',
        targetTable: targetLabel,
      };
    }

    return {
      success: true,
      message: `Query OK, ${projectedRows.length} row${projectedRows.length === 1 ? '' : 's'} returned (${durationMs} ms)`,
      columns: finalColumns,
      rows: projectedRows,
      metrics: {
        durationMs,
        rowsScanned: totalRowsScanned,
        rowsReturned: projectedRows.length,
        rowsAffected: 0,
        indexUsed,
        queryPlan: queryPlanSteps,
      },
      commandType: 'SELECT',
      targetTable: targetLabel,
    };
  }

  private executeInsert(sql: string, start: number): SqlExecutionResult {
    // INSERT INTO table [(cols...)] VALUES (vals...)
    const insertMatch = sql.match(/^INSERT\s+INTO\s+([a-zA-Z0-9_]+)(?:\s*\((.+?)\))?\s+VALUES\s*\((.+?)\);?$/i);
    if (!insertMatch) {
      throw new Error(`Malformed INSERT statement. Format: INSERT INTO table (col1, col2) VALUES (val1, val2)`);
    }

    const [, tableName, colsStr, valsStr] = insertMatch;
    const tableKey = tableName.toLowerCase();
    const rows = this.tables.get(tableKey);
    const schema = this.schemas.get(tableKey);

    if (!rows || !schema) {
      throw new Error(`Table '${tableName}' does not exist.`);
    }

    const parsedValues = this.parseCommaValues(valsStr);
    let columnNames: string[] = [];

    if (colsStr) {
      columnNames = colsStr.split(',').map((c) => c.trim().replace(/^['"`]|['"`]$/g, ''));
    } else {
      columnNames = schema.columns.map((c) => c.name);
    }

    if (columnNames.length !== parsedValues.length) {
      throw new Error(`Column count (${columnNames.length}) does not match value count (${parsedValues.length})`);
    }

    const newRow: any = {};
    for (let i = 0; i < columnNames.length; i++) {
      newRow[columnNames[i]] = parsedValues[i];
    }

    // 1. Verify NOT NULL constraints
    for (const col of schema.columns) {
      if (col.notNull) {
        const val = newRow[col.name];
        if (val === undefined || val === null || val === 'NULL') {
          throw new Error(`NOT NULL constraint failed: '${tableName}.${col.name}' cannot be NULL.`);
        }
      }
    }

    // 2. Verify Primary Key constraint
    const pkCol = schema.columns.find((c) => c.primaryKey);
    if (pkCol) {
      const pkVal = newRow[pkCol.name];
      if (pkVal === undefined || pkVal === null) {
        throw new Error(`Primary Key '${pkCol.name}' cannot be NULL.`);
      }
      const existing = rows.find((r) => r[pkCol.name] === pkVal);
      if (existing) {
        throw new Error(`PRIMARY KEY constraint failed: '${pkCol.name}' value '${pkVal}' already exists.`);
      }
    }

    // 3. Verify Foreign Key referential integrity
    for (const col of schema.columns) {
      if (col.foreignKey) {
        const val = newRow[col.name];
        if (val !== undefined && val !== null && val !== '') {
          const targetTable = col.foreignKey.table;
          const targetCol = col.foreignKey.column;
          const targetRows = this.tables.get(targetTable.toLowerCase());
          if (!targetRows) {
            throw new Error(`FOREIGN KEY constraint failed: Referenced table '${targetTable}' does not exist.`);
          }
          const exists = targetRows.some((r) => String(r[targetCol]) === String(val));
          if (!exists) {
            throw new Error(
              `FOREIGN KEY constraint failed: '${tableName}.${col.name}' references non-existent '${targetTable}.${targetCol}' ('${val}').`
            );
          }
        }
      }
    }

    // Insert row
    rows.push(newRow);
    this.rebuildIndexes(tableName);

    const durationMs = Math.round((performance.now() - start) * 100) / 100;
    return {
      success: true,
      message: `Query OK, 1 row inserted (${durationMs} ms).`,
      rows: [newRow],
      metrics: {
        durationMs,
        rowsScanned: 0,
        rowsReturned: 0,
        rowsAffected: 1,
        queryPlan: [
          {
            id: 1,
            operation: 'INSERT_ROW',
            table: tableName,
            estimatedCost: 1.0,
            rowsScanned: 0,
            rowsReturned: 0,
            detail: `Inserted 1 row into ${tableName}`,
          },
        ],
      },
      commandType: 'INSERT',
      targetTable: tableName,
    };
  }

  private executeUpdate(sql: string, start: number): SqlExecutionResult {
    // UPDATE table SET col1 = val1, ... [WHERE condition]
    const updateMatch = sql.match(/^UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.+?)(?:\s+WHERE\s+(.+?))?;?$/i);
    if (!updateMatch) {
      throw new Error(`Malformed UPDATE statement. Format: UPDATE table SET col = val WHERE condition`);
    }

    const [, tableName, setClause, whereClause] = updateMatch;
    const tableKey = tableName.toLowerCase();
    const rows = this.tables.get(tableKey);
    const schema = this.schemas.get(tableKey);

    if (!rows || !schema) {
      throw new Error(`Table '${tableName}' does not exist.`);
    }

    // Parse SET clause (e.g. Copies = Copies + 1 or Copies = 5, Status = 'Active')
    const assignments = this.parseAssignments(setClause);

    let rowsAffected = 0;
    let rowsScanned = rows.length;

    // 1. Validate constraints across all prospective row updates
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!whereClause || this.evaluateCondition(row, whereClause)) {
        for (const { col, val, isIncrement, incCol, incVal } of assignments) {
          const colDef = schema.columns.find((c) => c.name.toLowerCase() === col.toLowerCase());
          const finalVal = isIncrement && incCol ? (Number(row[incCol]) || 0) + incVal : val;

          // NOT NULL constraint
          if (colDef?.notNull && (finalVal === null || finalVal === undefined || finalVal === 'NULL')) {
            throw new Error(`NOT NULL constraint failed: '${tableName}.${colDef.name}' cannot be updated to NULL.`);
          }

          // Foreign Key referential integrity
          if (colDef?.foreignKey && finalVal !== null && finalVal !== undefined && finalVal !== '') {
            const targetTable = colDef.foreignKey.table;
            const targetCol = colDef.foreignKey.column;
            const targetRows = this.tables.get(targetTable.toLowerCase());
            if (!targetRows || !targetRows.some((r) => String(r[targetCol]) === String(finalVal))) {
              throw new Error(
                `FOREIGN KEY constraint failed: '${tableName}.${colDef.name}' references non-existent '${targetTable}.${targetCol}' ('${finalVal}').`
              );
            }
          }

          // Primary Key uniqueness
          if (colDef?.primaryKey) {
            const duplicate = rows.some((otherRow, otherIdx) => otherIdx !== i && String(otherRow[colDef.name]) === String(finalVal));
            if (duplicate) {
              throw new Error(`PRIMARY KEY constraint failed: '${colDef.name}' value '${finalVal}' already exists in '${tableName}'.`);
            }
          }
        }
      }
    }

    // 2. Apply modifications
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (!whereClause || this.evaluateCondition(row, whereClause)) {
        for (const { col, val, isIncrement, incCol, incVal } of assignments) {
          if (isIncrement && incCol) {
            row[col] = (Number(row[incCol]) || 0) + incVal;
          } else {
            row[col] = val;
          }
        }
        rowsAffected++;
      }
    }

    this.rebuildIndexes(tableName);
    const durationMs = Math.round((performance.now() - start) * 100) / 100;

    return {
      success: true,
      message: `Query OK, ${rowsAffected} row${rowsAffected === 1 ? '' : 's'} affected. Rows matched: ${rowsAffected} Changed: ${rowsAffected} (${durationMs} ms)`,
      metrics: {
        durationMs,
        rowsScanned,
        rowsReturned: 0,
        rowsAffected,
        queryPlan: [
          {
            id: 1,
            operation: 'UPDATE_ROW',
            table: tableName,
            condition: whereClause || 'NONE (All rows)',
            estimatedCost: rowsScanned * 1.8,
            rowsScanned,
            rowsReturned: rowsAffected,
            detail: `Updated ${rowsAffected} row(s) in ${tableName}`,
          },
        ],
      },
      commandType: 'UPDATE',
      targetTable: tableName,
    };
  }

  private executeDelete(sql: string, start: number): SqlExecutionResult {
    // DELETE FROM table [WHERE condition]
    const deleteMatch = sql.match(/^DELETE\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.+?))?;?$/i);
    if (!deleteMatch) {
      throw new Error(`Malformed DELETE statement. Format: DELETE FROM table WHERE condition`);
    }

    const [, tableName, whereClause] = deleteMatch;
    const tableKey = tableName.toLowerCase();
    const rows = this.tables.get(tableKey);

    if (!rows) {
      throw new Error(`Table '${tableName}' does not exist.`);
    }

    // Check referential integrity: prevent deleting rows referenced by foreign keys in child tables
    const toDelete = whereClause ? rows.filter((r) => this.evaluateCondition(r, whereClause)) : [...rows];

    for (const [, otherSchema] of this.schemas.entries()) {
      for (const col of otherSchema.columns) {
        if (col.foreignKey && col.foreignKey.table.toLowerCase() === tableName.toLowerCase()) {
          const childTable = otherSchema.name;
          const childRows = this.tables.get(childTable.toLowerCase()) || [];
          const referencedCol = col.foreignKey.column;

          for (const deletedRow of toDelete) {
            const parentVal = deletedRow[referencedCol];
            const hasChild = childRows.some((childRow) => String(childRow[col.name]) === String(parentVal));
            if (hasChild) {
              throw new Error(
                `FOREIGN KEY constraint failed: cannot delete row from '${tableName}' because child table '${childTable}' references '${referencedCol}' ('${parentVal}').`
              );
            }
          }
        }
      }
    }

    const initialLen = rows.length;
    const remaining = whereClause
      ? rows.filter((r) => !this.evaluateCondition(r, whereClause))
      : [];

    const rowsAffected = initialLen - remaining.length;
    this.tables.set(tableKey, remaining);
    this.rebuildIndexes(tableName);

    const durationMs = Math.round((performance.now() - start) * 100) / 100;

    return {
      success: true,
      message: `Query OK, ${rowsAffected} row${rowsAffected === 1 ? '' : 's'} deleted (${durationMs} ms)`,
      metrics: {
        durationMs,
        rowsScanned: initialLen,
        rowsReturned: 0,
        rowsAffected,
        queryPlan: [
          {
            id: 1,
            operation: 'DELETE_ROW',
            table: tableName,
            condition: whereClause || 'NONE (All rows)',
            estimatedCost: initialLen * 1.5,
            rowsScanned: initialLen,
            rowsReturned: rowsAffected,
            detail: `Deleted ${rowsAffected} rows from ${tableName}`,
          },
        ],
      },
      commandType: 'DELETE',
      targetTable: tableName,
    };
  }

  private executeCreateIndex(sql: string, start: number): SqlExecutionResult {
    // CREATE INDEX [IF NOT EXISTS] index_name ON table (column)
    const match = sql.match(/^CREATE\s+INDEX\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s+ON\s+([a-zA-Z0-9_]+)\s*\((.+?)\);?$/i);
    if (!match) {
      throw new Error(`Malformed CREATE INDEX statement. Format: CREATE INDEX idx_name ON table (col)`);
    }

    const [, indexName, tableName, colNameRaw] = match;
    const colName = colNameRaw.trim().replace(/^['"`]|['"`]$/g, '');

    const ok = this.createIndex(indexName, tableName, colName);
    if (!ok) {
      throw new Error(`Table '${tableName}' does not exist.`);
    }

    const durationMs = Math.round((performance.now() - start) * 100) / 100;

    return {
      success: true,
      message: `Index '${indexName}' created successfully on ${tableName}(${colName}) (${durationMs} ms).`,
      metrics: {
        durationMs,
        rowsScanned: 0,
        rowsReturned: 0,
        rowsAffected: 0,
        indexUsed: indexName,
        queryPlan: [
          {
            id: 1,
            operation: 'INDEX_SEEK',
            table: tableName,
            indexUsed: indexName,
            estimatedCost: 1.0,
            rowsScanned: 0,
            rowsReturned: 0,
            detail: `B-Tree index built for ${tableName}.${colName}`,
          },
        ],
      },
      commandType: 'CREATE_INDEX',
      targetTable: tableName,
    };
  }

  private executeCreateTable(sql: string, start: number): SqlExecutionResult {
    // CREATE TABLE name (col type, ...)
    const match = sql.match(/^CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([a-zA-Z0-9_]+)\s*\((.+?)\);?$/is);
    if (!match) {
      throw new Error(`Malformed CREATE TABLE statement.`);
    }

    const [, tableName, colsDefStr] = match;
    const colLines = colsDefStr.split(',').map((l) => l.trim()).filter(Boolean);
    const columns: SqlColumnDef[] = [];

    for (const line of colLines) {
      const parts = line.split(/\s+/);
      const name = parts[0].replace(/^['"`]|['"`]$/g, '');
      const type = (parts[1]?.toUpperCase() || 'TEXT') as any;
      const primaryKey = line.toUpperCase().includes('PRIMARY KEY');
      const notNull = line.toUpperCase().includes('NOT NULL') || primaryKey;

      columns.push({ name, type, primaryKey, notNull });
    }

    this.createTable({
      name: tableName,
      columns,
      indexes: {},
    });

    const durationMs = Math.round((performance.now() - start) * 100) / 100;

    return {
      success: true,
      message: `Table '${tableName}' created successfully with ${columns.length} columns (${durationMs} ms).`,
      metrics: {
        durationMs,
        rowsScanned: 0,
        rowsReturned: 0,
        rowsAffected: 0,
        queryPlan: [],
      },
      commandType: 'CREATE_TABLE',
      targetTable: tableName,
    };
  }

  // --- Helper parsers ---

  private parseAssignments(clause: string): Array<{
    col: string;
    val: any;
    isIncrement?: boolean;
    incCol?: string;
    incVal: number;
  }> {
    const parts = clause.split(',').map((p) => p.trim());
    return parts.map((part) => {
      const [colRaw, valRaw] = part.split('=').map((s) => s.trim());
      const col = colRaw.replace(/^['"`]|['"`]$/g, '');

      // Check for arithmetic increment like Copies = Copies + 1
      const incMatch = valRaw.match(/^([a-zA-Z0-9_]+)\s*([+-])\s*(\d+)$/);
      if (incMatch) {
        const sign = incMatch[2] === '-' ? -1 : 1;
        const incVal = parseInt(incMatch[3], 10) * sign;
        return { col, val: 0, isIncrement: true, incCol: incMatch[1], incVal };
      }

      return { col, val: this.parseValue(valRaw), incVal: 0 };
    });
  }

  // --- Helper parsers & Join Engine ---

  private parseSelectClauses(sql: string): {
    colsStr: string;
    fromClause: string;
    whereClause?: string;
    orderByClause?: string;
    limitClause?: string;
  } {
    const trimmed = sql.trim().replace(/;$/, '');
    const selectPrefix = /^SELECT\s+/i;
    if (!selectPrefix.test(trimmed)) {
      throw new Error('Malformed SELECT query. Must start with SELECT');
    }

    const afterSelect = trimmed.replace(selectPrefix, '');

    // Look for boundary keyword FROM outside quotes
    const fromMatch = afterSelect.match(/\bFROM\b/i);
    if (!fromMatch || fromMatch.index === undefined) {
      throw new Error('Malformed SELECT query. Missing FROM clause.');
    }

    const colsStr = afterSelect.slice(0, fromMatch.index).trim();
    const restAfterFrom = afterSelect.slice(fromMatch.index + fromMatch[0].length).trim();

    // Find WHERE, ORDER BY, LIMIT in restAfterFrom
    const whereMatch = restAfterFrom.match(/\bWHERE\b/i);
    const orderMatch = restAfterFrom.match(/\bORDER\s+BY\b/i);
    const limitMatch = restAfterFrom.match(/\bLIMIT\b/i);

    const whereIdx = whereMatch && whereMatch.index !== undefined ? whereMatch.index : -1;
    const orderIdx = orderMatch && orderMatch.index !== undefined ? orderMatch.index : -1;
    const limitIdx = limitMatch && limitMatch.index !== undefined ? limitMatch.index : -1;

    // Determine end of FROM clause
    const stopIndices = [whereIdx, orderIdx, limitIdx].filter((i) => i >= 0);
    const fromEndIdx = stopIndices.length > 0 ? Math.min(...stopIndices) : restAfterFrom.length;
    const fromClause = restAfterFrom.slice(0, fromEndIdx).trim();

    let whereClause: string | undefined;
    let orderByClause: string | undefined;
    let limitClause: string | undefined;

    if (whereIdx >= 0) {
      const whereStart = whereIdx + whereMatch![0].length;
      const nextStops = [orderIdx, limitIdx].filter((i) => i > whereIdx);
      const whereEnd = nextStops.length > 0 ? Math.min(...nextStops) : restAfterFrom.length;
      whereClause = restAfterFrom.slice(whereStart, whereEnd).trim();
    }

    if (orderIdx >= 0) {
      const orderStart = orderIdx + orderMatch![0].length;
      const nextStops = [limitIdx].filter((i) => i > orderIdx);
      const orderEnd = nextStops.length > 0 ? Math.min(...nextStops) : restAfterFrom.length;
      orderByClause = restAfterFrom.slice(orderStart, orderEnd).trim();
    }

    if (limitIdx >= 0) {
      const limitStart = limitIdx + limitMatch![0].length;
      limitClause = restAfterFrom.slice(limitStart).trim();
    }

    return {
      colsStr,
      fromClause,
      whereClause,
      orderByClause,
      limitClause,
    };
  }

  private parseFromClause(fromStr: string): ParsedFromClause {
    const joinKeywordRegex = /\b(?:(INNER|LEFT|RIGHT|FULL|CROSS)(?:\s+OUTER)?\s+)?JOIN\b/gi;
    const joinPositions: Array<{ index: number; length: number; type: JoinType }> = [];
    let match: RegExpExecArray | null;

    while ((match = joinKeywordRegex.exec(fromStr)) !== null) {
      const rawType = (match[1] || 'INNER').toUpperCase();
      let type: JoinType = 'INNER';
      if (rawType.includes('LEFT')) type = 'LEFT';
      else if (rawType.includes('RIGHT')) type = 'RIGHT';
      else if (rawType.includes('FULL')) type = 'FULL';
      else if (rawType.includes('CROSS')) type = 'CROSS';
      else type = 'INNER';

      joinPositions.push({
        index: match.index,
        length: match[0].length,
        type,
      });
    }

    if (joinPositions.length === 0) {
      const [baseTable, baseAlias] = this.extractTableAndAlias(fromStr.trim());
      return {
        baseTable,
        baseAlias,
        joins: [],
      };
    }

    const baseTableChunk = fromStr.slice(0, joinPositions[0].index).trim();
    const [baseTable, baseAlias] = this.extractTableAndAlias(baseTableChunk);

    const joins: ParsedJoin[] = [];

    for (let i = 0; i < joinPositions.length; i++) {
      const curr = joinPositions[i];
      const startIndex = curr.index + curr.length;
      const endIndex = i + 1 < joinPositions.length ? joinPositions[i + 1].index : fromStr.length;
      const joinChunk = fromStr.slice(startIndex, endIndex).trim();

      let targetTable = '';
      let targetAlias = '';
      let onCondition: string | undefined;

      const onSplit = joinChunk.split(/\bON\b/i);
      const tableAndAliasChunk = onSplit[0].trim();
      if (onSplit.length > 1) {
        onCondition = onSplit.slice(1).join(' ON ').trim();
      }

      [targetTable, targetAlias] = this.extractTableAndAlias(tableAndAliasChunk);

      joins.push({
        type: curr.type,
        tableName: targetTable,
        alias: targetAlias,
        onCondition,
      });
    }

    return {
      baseTable,
      baseAlias,
      joins,
    };
  }

  private extractTableAndAlias(chunk: string): [string, string] {
    const parts = chunk.trim().split(/\s+/);
    const tableName = parts[0].replace(/^['"`]|['"`]$/g, '');
    if (parts.length === 1) {
      return [tableName, tableName];
    }
    if (parts.length === 2) {
      return [tableName, parts[1].replace(/^['"`]|['"`]$/g, '')];
    }
    if (parts.length >= 3 && parts[1].toUpperCase() === 'AS') {
      return [tableName, parts[2].replace(/^['"`]|['"`]$/g, '')];
    }
    return [tableName, parts[parts.length - 1].replace(/^['"`]|['"`]$/g, '')];
  }

  private wrapBaseRow(row: any, tableName: string, alias: string): any {
    const wrapped: any = { ...row };
    for (const [col, val] of Object.entries(row)) {
      wrapped[`${tableName}.${col}`] = val;
      if (alias && alias !== tableName) {
        wrapped[`${alias}.${col}`] = val;
      }
    }
    return wrapped;
  }

  private performJoin(
    currentRows: any[],
    targetRows: any[],
    join: ParsedJoin,
    targetSchema?: SqlTableSchema
  ): any[] {
    const joinedRows: any[] = [];

    // Check if we can do an equijoin hash join: leftCol = rightCol
    const eqMatch = join.onCondition?.match(/^([a-zA-Z0-9_.]+)\s*=\s*([a-zA-Z0-9_.]+)$/i);

    if (eqMatch && join.type !== 'CROSS') {
      const sideA = eqMatch[1].trim();
      const sideB = eqMatch[2].trim();

      // Determine which side belongs to right table (targetTable or alias)
      let rightCol = '';
      let leftCol = '';

      const isSideATarget =
        sideA.toLowerCase().startsWith(`${join.tableName.toLowerCase()}.`) ||
        (join.alias && sideA.toLowerCase().startsWith(`${join.alias.toLowerCase()}.`));
      const isSideBTarget =
        sideB.toLowerCase().startsWith(`${join.tableName.toLowerCase()}.`) ||
        (join.alias && sideB.toLowerCase().startsWith(`${join.alias.toLowerCase()}.`));

      if (isSideATarget) {
        rightCol = sideA;
        leftCol = sideB;
      } else if (isSideBTarget) {
        rightCol = sideB;
        leftCol = sideA;
      } else {
        const colOnlyA = sideA.includes('.') ? sideA.split('.')[1] : sideA;
        if (targetSchema?.columns.some((c) => c.name.toLowerCase() === colOnlyA.toLowerCase())) {
          rightCol = sideA;
          leftCol = sideB;
        } else {
          rightCol = sideB;
          leftCol = sideA;
        }
      }

      // Build Hash Map for targetRows
      const rightMap = new Map<string, any[]>();
      for (let rIdx = 0; rIdx < targetRows.length; rIdx++) {
        const rightRow = targetRows[rIdx];
        const val = this.resolveColumnValue(rightRow, rightCol);
        const key = val !== undefined && val !== null ? String(val) : '__NULL__';
        if (!rightMap.has(key)) rightMap.set(key, []);
        rightMap.get(key)!.push({ row: rightRow, index: rIdx });
      }

      const matchedRightIndexes = new Set<number>();

      for (const leftRow of currentRows) {
        const leftVal = this.resolveColumnValue(leftRow, leftCol);
        const key = leftVal !== undefined && leftVal !== null ? String(leftVal) : '__NULL__';
        const matches = rightMap.get(key) || [];

        if (matches.length > 0) {
          for (const m of matches) {
            matchedRightIndexes.add(m.index);
            joinedRows.push(this.mergeJoinedRows(leftRow, m.row, join.tableName, join.alias, targetSchema));
          }
        } else if (join.type === 'LEFT' || join.type === 'FULL') {
          joinedRows.push(this.mergeJoinedRows(leftRow, null, join.tableName, join.alias, targetSchema));
        }
      }

      if (join.type === 'RIGHT' || join.type === 'FULL') {
        for (let rIdx = 0; rIdx < targetRows.length; rIdx++) {
          if (!matchedRightIndexes.has(rIdx)) {
            joinedRows.push(this.mergeJoinedRows(null, targetRows[rIdx], join.tableName, join.alias, targetSchema));
          }
        }
      }

      return joinedRows;
    }

    // Nested Loop Join fallback (or CROSS JOIN)
    const matchedRightIndexes = new Set<number>();

    for (const leftRow of currentRows) {
      let matchedAny = false;

      for (let rIdx = 0; rIdx < targetRows.length; rIdx++) {
        const rightRow = targetRows[rIdx];
        const merged = this.mergeJoinedRows(leftRow, rightRow, join.tableName, join.alias, targetSchema);

        const passes =
          join.type === 'CROSS' || !join.onCondition || this.evaluateCondition(merged, join.onCondition);
        if (passes) {
          joinedRows.push(merged);
          matchedAny = true;
          matchedRightIndexes.add(rIdx);
        }
      }

      if (!matchedAny && (join.type === 'LEFT' || join.type === 'FULL')) {
        joinedRows.push(this.mergeJoinedRows(leftRow, null, join.tableName, join.alias, targetSchema));
      }
    }

    if (join.type === 'RIGHT' || join.type === 'FULL') {
      for (let rIdx = 0; rIdx < targetRows.length; rIdx++) {
        if (!matchedRightIndexes.has(rIdx)) {
          joinedRows.push(this.mergeJoinedRows(null, targetRows[rIdx], join.tableName, join.alias, targetSchema));
        }
      }
    }

    return joinedRows;
  }

  private mergeJoinedRows(
    leftRow: any | null,
    rightRow: any | null,
    rightTableName: string,
    rightAlias: string,
    rightSchema?: SqlTableSchema
  ): any {
    const merged: any = {};

    if (leftRow) {
      Object.assign(merged, leftRow);
    }

    if (rightRow) {
      for (const [col, val] of Object.entries(rightRow)) {
        merged[`${rightTableName}.${col}`] = val;
        if (rightAlias && rightAlias !== rightTableName) {
          merged[`${rightAlias}.${col}`] = val;
        }
        if (merged[col] === undefined) {
          merged[col] = val;
        }
      }
    } else if (rightSchema) {
      for (const col of rightSchema.columns) {
        merged[`${rightTableName}.${col.name}`] = null;
        if (rightAlias && rightAlias !== rightTableName) {
          merged[`${rightAlias}.${col.name}`] = null;
        }
        if (merged[col.name] === undefined) {
          merged[col.name] = null;
        }
      }
    }

    return merged;
  }

  private parseProjectionColumns(colsStr: string): ProjectedColumnExpr[] {
    const parts = colsStr.split(',').map((p) => p.trim());
    return parts.map((part) => {
      const asMatch = part.match(/^(.+?)\s+(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
      if (asMatch) {
        const source = asMatch[1].replace(/^['"`]|['"`]$/g, '').trim();
        const alias = asMatch[2].replace(/^['"`]|['"`]$/g, '').trim();
        return { sourceExpr: source, alias, displayName: alias };
      }

      const clean = part.replace(/^['"`]|['"`]$/g, '').trim();
      const displayName = clean.includes('.') ? clean.split('.')[1] : clean;
      return { sourceExpr: clean, displayName };
    });
  }

  private resolveColumnValue(row: any, colRef: string): any {
    if (!row) return undefined;
    if (row[colRef] !== undefined) return row[colRef];

    const trimmed = colRef.trim().replace(/^['"`]|['"`]$/g, '');
    if (row[trimmed] !== undefined) return row[trimmed];

    const lower = trimmed.toLowerCase();
    for (const k of Object.keys(row)) {
      if (k.toLowerCase() === lower) return row[k];
    }

    if (trimmed.includes('.')) {
      const colOnly = trimmed.split('.')[1].toLowerCase();
      for (const k of Object.keys(row)) {
        if (k.toLowerCase() === colOnly || k.toLowerCase().endsWith(`.${colOnly}`)) {
          return row[k];
        }
      }
      if (row[colOnly] !== undefined) return row[colOnly];
    } else {
      for (const k of Object.keys(row)) {
        if (k.toLowerCase() === lower || k.toLowerCase().endsWith(`.${lower}`)) {
          return row[k];
        }
      }
    }

    return undefined;
  }

  private evaluateCondition(row: any, conditionStr: string): boolean {
    const trimmed = conditionStr.trim();

    // Check OR
    if (trimmed.includes(' OR ') || trimmed.includes(' or ')) {
      const subConditions = trimmed.split(/\s+OR\s+/i);
      return subConditions.some((c) => this.evaluateCondition(row, c));
    }

    // Check AND
    if (trimmed.includes(' AND ') || trimmed.includes(' and ')) {
      const subConditions = trimmed.split(/\s+AND\s+/i);
      return subConditions.every((c) => this.evaluateCondition(row, c));
    }

    // Single comparison (supports table.col or alias.col or col)
    const compMatch = trimmed.match(/^([a-zA-Z0-9_.]+)\s*(=|!=|<>|<=|>=|<|>|LIKE)\s*(.+)$/i);
    if (!compMatch) return true;

    const [, colName, op, rawVal] = compMatch;
    const rowVal = this.resolveColumnValue(row, colName);

    // If rawVal is a column reference in row (e.g. s.StudentID in a join condition)
    let targetVal: any;
    const cleanRaw = rawVal.trim().replace(/^['"`]|['"`]$/g, '');
    const otherColVal = this.resolveColumnValue(row, cleanRaw);

    if (otherColVal !== undefined && !/^['"].*['"]$/.test(rawVal.trim()) && !/^\d+(\.\d+)?$/.test(cleanRaw)) {
      targetVal = otherColVal;
    } else {
      targetVal = this.parseValue(rawVal);
    }

    switch (op.toUpperCase()) {
      case '=':
        return rowVal === targetVal || String(rowVal) === String(targetVal);
      case '!=':
      case '<>':
        return rowVal !== targetVal && String(rowVal) !== String(targetVal);
      case '<':
        return Number(rowVal) < Number(targetVal);
      case '<=':
        return Number(rowVal) <= Number(targetVal);
      case '>':
        return Number(rowVal) > Number(targetVal);
      case '>=':
        return Number(rowVal) >= Number(targetVal);
      case 'LIKE': {
        const pattern = String(targetVal).replace(/%/g, '.*').replace(/_/g, '.');
        return new RegExp(`^${pattern}$`, 'i').test(String(rowVal));
      }
      default:
        return true;
    }
  }

  private parseCommaValues(str: string): any[] {
    const result: any[] = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if ((char === "'" || char === '"') && !inQuotes) {
        inQuotes = true;
        quoteChar = char;
      } else if (char === quoteChar && inQuotes) {
        inQuotes = false;
      } else if (char === ',' && !inQuotes) {
        result.push(this.parseValue(current.trim()));
        current = '';
        continue;
      }
      current += char;
    }

    if (current.trim()) {
      result.push(this.parseValue(current.trim()));
    }

    return result;
  }

  private parseValue(raw: string): any {
    const trimmed = raw.trim();
    if (trimmed === 'NULL' || trimmed === 'null') return null;
    if (trimmed === 'TRUE' || trimmed === 'true') return true;
    if (trimmed === 'FALSE' || trimmed === 'false') return false;

    // Quoted string
    if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
      return trimmed.slice(1, -1);
    }

    // Number
    if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
      return Number(trimmed);
    }

    return trimmed;
  }
}

// Global Singleton Instance
export const realSqlLabEngine = new SqlLabEngine();
export const sqlLabEngine = realSqlLabEngine;
