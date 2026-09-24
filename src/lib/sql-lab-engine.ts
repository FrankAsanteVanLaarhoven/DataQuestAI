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
  operation: 'TABLE_SCAN' | 'INDEX_SEEK' | 'FILTER' | 'INSERT_ROW' | 'UPDATE_ROW' | 'DELETE_ROW';
  table: string;
  indexUsed?: string;
  condition?: string;
  estimatedCost: number;
  rowsScanned: number;
  rowsReturned: number;
  detail: string;
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
    // SELECT [cols] FROM [table] [WHERE condition] [ORDER BY col [ASC|DESC]] [LIMIT n]
    const selectMatch = sql.match(/^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z0-9_]+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER\s+BY\s+(.+?))?(?:\s+LIMIT\s+(\d+))?;?$/i);

    if (!selectMatch) {
      throw new Error(`Malformed SELECT query. Format: SELECT [columns] FROM [table] [WHERE condition]`);
    }

    const [, colsStr, tableName, whereClause, orderByClause, limitClause] = selectMatch;
    const tableKey = tableName.toLowerCase();
    const rows = this.tables.get(tableKey);

    if (!rows) {
      throw new Error(`Table '${tableName}' does not exist.`);
    }

    const schema = this.schemas.get(tableKey);
    let rowsScanned = 0;
    let indexUsed: string | undefined;
    let queryPlanSteps: QueryPlanStep[] = [];

    // Check if an index can be used for simple Equality WHERE: col = 'val'
    let matchingRows: any[] = [];
    let usedIndex = false;

    if (whereClause) {
      const eqMatch = whereClause.match(/^([a-zA-Z0-9_]+)\s*=\s*['"]?([^'"]+)['"]?$/i);
      if (eqMatch) {
        const colName = eqMatch[1];
        const val = this.parseValue(eqMatch[2]);
        const indexKey = `${tableKey}.${colName.toLowerCase()}`;

        if (this.indexes.has(indexKey)) {
          usedIndex = true;
          indexUsed = `idx_${tableKey}_${colName.toLowerCase()}`;
          const indexMap = this.indexes.get(indexKey)!;
          const found = indexMap.get(val) || [];
          rowsScanned = found.length;
          matchingRows = [...found];

          queryPlanSteps.push({
            id: 1,
            operation: 'INDEX_SEEK',
            table: tableName,
            indexUsed,
            condition: `${colName} = ${JSON.stringify(val)}`,
            estimatedCost: 1.2,
            rowsScanned,
            rowsReturned: matchingRows.length,
            detail: `Index Seek on ${tableName} using ${indexUsed} (scanned ${rowsScanned} indexed entries)`,
          });
        }
      }
    }

    if (!usedIndex) {
      // Full Table Scan
      rowsScanned = rows.length;
      matchingRows = whereClause
        ? rows.filter((r) => this.evaluateCondition(r, whereClause))
        : [...rows];

      queryPlanSteps.push({
        id: 1,
        operation: 'TABLE_SCAN',
        table: tableName,
        condition: whereClause || 'NONE',
        estimatedCost: rowsScanned * 1.5,
        rowsScanned,
        rowsReturned: matchingRows.length,
        detail: `Full Table Scan on ${tableName} (examined ${rowsScanned} rows)`,
      });
    }

    // ORDER BY
    if (orderByClause) {
      const parts = orderByClause.trim().split(/\s+/);
      const orderCol = parts[0];
      const isDesc = parts[1] && parts[1].toUpperCase() === 'DESC';

      matchingRows.sort((a, b) => {
        const valA = a[orderCol];
        const valB = b[orderCol];
        if (valA === valB) return 0;
        if (valA > valB) return isDesc ? -1 : 1;
        return isDesc ? 1 : -1;
      });
    }

    // LIMIT
    if (limitClause) {
      const lim = parseInt(limitClause, 10);
      matchingRows = matchingRows.slice(0, lim);
    }

    // Column projection
    let finalColumns: string[] = [];
    let projectedRows: any[] = [];

    const isWildcard = colsStr.trim() === '*';
    if (isWildcard) {
      finalColumns = schema ? schema.columns.map((c) => c.name) : Object.keys(matchingRows[0] || {});
      projectedRows = matchingRows.map((r) => ({ ...r }));
    } else {
      finalColumns = colsStr.split(',').map((c) => c.trim().replace(/^['"`]|['"`]$/g, ''));
      projectedRows = matchingRows.map((r) => {
        const proj: any = {};
        for (const col of finalColumns) {
          proj[col] = r[col] !== undefined ? r[col] : null;
        }
        return proj;
      });
    }

    const durationMs = Math.round((performance.now() - start) * 100) / 100;

    if (isExplain) {
      return {
        success: true,
        message: `EXPLAIN QUERY PLAN: ${usedIndex ? 'Used Index ' + indexUsed : 'Full Table Scan'} (${matchingRows.length} rows)`,
        columns: ['id', 'operation', 'table', 'indexUsed', 'rowsScanned', 'rowsReturned', 'detail'],
        rows: queryPlanSteps.map((s) => ({
          id: s.id,
          operation: s.operation,
          table: s.table,
          indexUsed: s.indexUsed || 'NONE (Table Scan)',
          rowsScanned: s.rowsScanned,
          rowsReturned: s.rowsReturned,
          detail: s.detail,
        })),
        metrics: {
          durationMs,
          rowsScanned,
          rowsReturned: queryPlanSteps.length,
          rowsAffected: 0,
          indexUsed,
          queryPlan: queryPlanSteps,
        },
        commandType: 'EXPLAIN',
        targetTable: tableName,
      };
    }

    return {
      success: true,
      message: `Query OK, ${projectedRows.length} row${projectedRows.length === 1 ? '' : 's'} returned (${durationMs} ms)`,
      columns: finalColumns,
      rows: projectedRows,
      metrics: {
        durationMs,
        rowsScanned,
        rowsReturned: projectedRows.length,
        rowsAffected: 0,
        indexUsed,
        queryPlan: queryPlanSteps,
      },
      commandType: 'SELECT',
      targetTable: tableName,
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

    // Single comparison
    const compMatch = trimmed.match(/^([a-zA-Z0-9_]+)\s*(=|!=|<>|<=|>=|<|>|LIKE)\s*(.+)$/i);
    if (!compMatch) return true;

    const [, colName, op, rawVal] = compMatch;
    const rowVal = row[colName];
    const targetVal = this.parseValue(rawVal);

    switch (op.toUpperCase()) {
      case '=':
        return rowVal === targetVal || String(rowVal) === String(targetVal);
      case '!=':
      case '<>':
        return rowVal !== targetVal;
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
