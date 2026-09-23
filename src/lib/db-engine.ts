import { DataFeedEvent } from './types';

export interface DatabaseState {
  Students: Array<{ StudentID: string; Name: string; Class: string }>;
  Books: Array<{ BookID: string; Title: string; Category: string }>;
  Borrowing: Array<{ BorrowID: string; StudentID: string; BookID: string; BorrowDate: string }>;
  Customers: Array<{ CustomerID: string; Name: string; Email: string; Address: string; DateOfBirth?: string }>;
  Orders: Array<{ OrderID: string; CustomerID: string; OrderDate: string; Total: number; Status: string }>;
  Products: Array<{ ProductID: string; Name: string; Price: number; Stock: number; Category: string }>;
  Cart: Array<{ CartID: string; CustomerID: string; ProductID: string; Quantity: number }>;
  Reviews: Array<{ ReviewID: string; ProductID: string; Rating: number; Comment: string }>;
}

export const initialDatabase: DatabaseState = {
  Students: [
    { StudentID: 'S001', Name: 'Alice', Class: '10A' },
    { StudentID: 'S002', Name: 'Ben', Class: '10B' },
    { StudentID: 'S003', Name: 'Cara', Class: '11A' },
  ],
  Books: [
    { BookID: 'B001', Title: 'Clean Code', Category: 'Science' },
    { BookID: 'B002', Title: 'Python Basics', Category: 'Technology' },
    { BookID: 'B003', Title: 'Database Systems', Category: 'Science' },
    { BookID: 'B004', Title: 'World History', Category: 'History' },
    { BookID: 'B005', Title: 'The Great Fiction', Category: 'Fiction' },
  ],
  Borrowing: [
    { BorrowID: 'BR001', StudentID: 'S001', BookID: 'B001', BorrowDate: '2024-09-01' },
    { BorrowID: 'BR002', StudentID: 'S002', BookID: 'B003', BorrowDate: '2024-09-03' },
    { BorrowID: 'BR003', StudentID: 'S001', BookID: 'B002', BorrowDate: '2024-09-10' },
  ],
  Customers: [
    { CustomerID: 'C001', Name: 'Alex Mercer', Email: 'alex@enterprise.com', Address: '742 Evergreen Terr' },
    { CustomerID: 'C002', Name: 'Elena Rostova', Email: 'elena@dataquest.org', Address: '10 Baker Street' },
    { CustomerID: 'C003', Name: 'Devon Miles', Email: 'devon@cloudvault.io', Address: '500 Technology Way' },
  ],
  Orders: [
    { OrderID: '#1042', CustomerID: 'C001', OrderDate: '2026-09-23', Total: 189.50, Status: 'Delivered' },
    { OrderID: '#1043', CustomerID: 'C002', OrderDate: '2026-09-23', Total: 45.00, Status: 'Processing' },
    { OrderID: '#1044', CustomerID: 'C003', OrderDate: '2026-09-22', Total: 312.20, Status: 'Shipped' },
  ],
  Products: [
    { ProductID: 'P101', Name: 'Database Mastery Handbook', Price: 49.99, Stock: 24, Category: 'Books' },
    { ProductID: 'P102', Name: 'SQL Query Tuning Guide', Price: 29.99, Stock: 15, Category: 'Books' },
    { ProductID: 'P103', Name: 'Enterprise ERD Canvas Mat', Price: 19.99, Stock: 42, Category: 'Hardware' },
    { ProductID: 'P104', Name: 'Cloud Cluster Access Key', Price: 99.00, Stock: 8, Category: 'Cloud' },
  ],
  Cart: [
    { CartID: 'CR01', CustomerID: 'C001', ProductID: 'P101', Quantity: 1 },
  ],
  Reviews: [
    { ReviewID: 'R501', ProductID: 'P101', Rating: 5, Comment: 'Fantastic visual database guide!' },
  ],
};

class DatabaseSimulator {
  private db: DatabaseState = JSON.parse(JSON.stringify(initialDatabase));
  private listeners: Array<(event: DataFeedEvent) => void> = [];

  public onEvent(callback: (event: DataFeedEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private evtCounter = 0;

  private emit(event: 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE', table: string, details: string) {
    const d = new Date();
    const timeStr = d.toTimeString().split(' ')[0];
    this.evtCounter++;
    const newEvent: DataFeedEvent = {
      id: `evt_${Date.now()}_${this.evtCounter}_${Math.random().toString(36).substring(2, 6)}`,
      time: timeStr,
      event,
      table,
      details,
      durationMs: Math.floor(Math.random() * 8) + 2,
      success: true,
    };
    this.listeners.forEach((cb) => cb(newEvent));
    return newEvent;
  }

  public getTableNames(): Array<keyof DatabaseState> {
    return Object.keys(this.db) as Array<keyof DatabaseState>;
  }

  public getTable<K extends keyof DatabaseState>(name: K): DatabaseState[K] {
    return this.db[name] || ([] as any);
  }

  public insert(table: keyof DatabaseState, row: any) {
    if (!this.db[table]) {
      (this.db as any)[table] = [];
    }
    (this.db[table] as any[]).push(row);
    const detail = row.OrderID
      ? `Order ${row.OrderID}`
      : row.Name
      ? `New ${table.slice(0, -1)}: ${row.Name}`
      : `New row inserted into ${table}`;
    return this.emit('INSERT', String(table), detail);
  }

  public select(table: keyof DatabaseState, filterPredicate?: (item: any) => boolean) {
    const list = this.db[table] || [];
    const filtered = filterPredicate ? list.filter(filterPredicate) : list;
    const detail = `${filtered.length} row${filtered.length === 1 ? '' : 's'} returned`;
    this.emit('SELECT', String(table), detail);
    return filtered;
  }

  public update(table: keyof DatabaseState, keyField: string, keyValue: any, patch: any) {
    const list = (this.db[table] as any[]) || [];
    let modified = 0;
    for (let i = 0; i < list.length; i++) {
      if (list[i][keyField] === keyValue) {
        list[i] = { ...list[i], ...patch };
        modified++;
      }
    }
    const detail = modified > 0 ? `${keyField}=${keyValue} updated` : `0 rows updated`;
    return this.emit('UPDATE', String(table), detail);
  }

  public delete(table: keyof DatabaseState, keyField: string, keyValue: any) {
    const list = (this.db[table] as any[]) || [];
    const initialLen = list.length;
    (this.db as any)[table] = list.filter((row) => row[keyField] !== keyValue);
    const removed = initialLen - ((this.db[table] as any[]).length);
    const detail = removed > 0 ? `Deleted ${keyField}=${keyValue}` : `Item removed`;
    return this.emit('DELETE', String(table), detail);
  }

  public executeCustomSql(sql: string): { success: boolean; data?: any[]; message: string; event?: DataFeedEvent } {
    const trimmed = sql.trim();
    const upper = trimmed.toUpperCase();

    try {
      if (upper.startsWith('SELECT')) {
        // Simple parser: SELECT * FROM [Table]
        const fromMatch = trimmed.match(/from\s+([a-zA-Z0-9_]+)/i);
        const tableName = fromMatch ? (fromMatch[1] as keyof DatabaseState) : 'Customers';
        const targetTable = this.db[tableName] ? tableName : 'Customers';
        const rows = this.select(targetTable);
        return {
          success: true,
          data: rows,
          message: `Query OK, ${rows.length} rows in set.`,
        };
      }

      if (upper.startsWith('INSERT INTO')) {
        const match = trimmed.match(/insert\s+into\s+([a-zA-Z0-9_]+)/i);
        const table = (match ? match[1] : 'Orders') as keyof DatabaseState;
        const fallbackRow = {
          OrderID: '#' + (1000 + Math.floor(Math.random() * 9000)),
          CustomerID: 'C001',
          OrderDate: new Date().toISOString().split('T')[0],
          Total: Math.floor(Math.random() * 150) + 15,
          Status: 'New',
        };
        const evt = this.insert(table in this.db ? table : 'Orders', fallbackRow);
        return {
          success: true,
          message: `Query OK, 1 row affected.`,
          event: evt,
        };
      }

      if (upper.startsWith('UPDATE')) {
        const match = trimmed.match(/update\s+([a-zA-Z0-9_]+)/i);
        const table = (match ? match[1] : 'Products') as keyof DatabaseState;
        const targetTable = table in this.db ? table : 'Products';
        const evt = this.update(targetTable, 'ProductID', 'P101', { Stock: 23 });
        return {
          success: true,
          message: `Query OK, 1 row affected. Rows matched: 1 Changed: 1`,
          event: evt,
        };
      }

      if (upper.startsWith('DELETE FROM')) {
        const match = trimmed.match(/delete\s+from\s+([a-zA-Z0-9_]+)/i);
        const table = (match ? match[1] : 'Cart') as keyof DatabaseState;
        const targetTable = table in this.db ? table : 'Cart';
        const evt = this.delete(targetTable, 'CartID', 'CR01');
        return {
          success: true,
          message: `Query OK, 1 row affected.`,
          event: evt,
        };
      }

      // Default fallback
      const evt = this.emit('SELECT', 'Customers', '1 row returned');
      return {
        success: true,
        data: this.db.Customers.slice(0, 1),
        message: 'Executed SQL statement successfully.',
        event: evt,
      };
    } catch (err: any) {
      return {
        success: false,
        message: `SQL Syntax Error: ${err.message || 'Check statement'}`,
      };
    }
  }

  public reset() {
    this.db = JSON.parse(JSON.stringify(initialDatabase));
  }
}

export const dbSimulator = new DatabaseSimulator();
