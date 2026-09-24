import { DataFeedEvent } from './types';
import { realSqlLabEngine, SqlExecutionResult } from './sql-lab-engine';

export interface DatabaseState {
  Students: Array<{ StudentID: string; Name: string; Email: string; DateOfBirth?: string; Department: string }>;
  Books: Array<{ BookID: string; Title: string; Author: string; Copies: number; Category: string }>;
  Loans: Array<{ LoanID: string; StudentID: string; BookID: string; BorrowDate: string; DueDate: string; Status: string }>;
  Customers: Array<{ CustomerID: string; Name: string; Email: string; Address: string; DateOfBirth?: string }>;
  Orders: Array<{ OrderID: string; CustomerID: string; OrderDate: string; Total: number; Status: string }>;
  Products: Array<{ ProductID: string; Name: string; Price: number; Stock: number; Category: string }>;
  Cart: Array<{ CartID: string; CustomerID: string; ProductID: string; Quantity: number }>;
}

class DatabaseSimulator {
  private listeners: Array<(event: DataFeedEvent) => void> = [];
  private evtCounter = 0;

  constructor() {
    // Engine initializes with seeded tables
  }

  public onEvent(callback: (event: DataFeedEvent) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  public emitEvent(event: 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE', table: string, details: string, durationMs = 2, success = true): DataFeedEvent {
    const d = new Date();
    const timeStr = d.toTimeString().split(' ')[0];
    this.evtCounter++;
    const newEvent: DataFeedEvent = {
      id: `evt_${Date.now()}_${this.evtCounter}_${Math.random().toString(36).substring(2, 6)}`,
      time: timeStr,
      event,
      table,
      details,
      durationMs,
      success,
    };
    this.listeners.forEach((cb) => cb(newEvent));
    return newEvent;
  }

  public getTableNames(): string[] {
    return realSqlLabEngine.getTableNames();
  }

  public getTable(name: string): any[] {
    return realSqlLabEngine.getTableRows(name);
  }

  public insert(table: string, row: any): DataFeedEvent {
    const cols = Object.keys(row);
    const vals = cols.map((c) => {
      const v = row[c];
      return typeof v === 'string' ? `'${v}'` : v;
    });
    const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${vals.join(', ')})`;
    const result = realSqlLabEngine.execute(sql);
    const detail = row.OrderID
      ? `Order ${row.OrderID} created`
      : row.Name
      ? `New ${table.slice(0, -1)}: ${row.Name}`
      : `Row inserted into ${table}`;
    return this.emitEvent('INSERT', table, detail, result.metrics.durationMs, result.success);
  }

  public select(table: string, filterPredicate?: (item: any) => boolean): any[] {
    const rows = realSqlLabEngine.getTableRows(table);
    const filtered = filterPredicate ? rows.filter(filterPredicate) : rows;
    const detail = `${filtered.length} row${filtered.length === 1 ? '' : 's'} returned`;
    this.emitEvent('SELECT', table, detail, 1.2, true);
    return filtered;
  }

  public update(table: string, keyField: string, keyValue: any, patch: any): DataFeedEvent {
    const formattedKey = typeof keyValue === 'string' ? `'${keyValue}'` : keyValue;
    const setClauses = Object.keys(patch).map((k) => {
      const v = patch[k];
      return `${k} = ${typeof v === 'string' ? `'${v}'` : v}`;
    });
    const sql = `UPDATE ${table} SET ${setClauses.join(', ')} WHERE ${keyField} = ${formattedKey}`;
    const res = realSqlLabEngine.execute(sql);
    const detail = res.metrics.rowsAffected > 0 ? `${keyField}=${keyValue} updated (${res.metrics.rowsAffected} affected)` : `0 rows updated`;
    return this.emitEvent('UPDATE', table, detail, res.metrics.durationMs, res.success);
  }

  public delete(table: string, keyField: string, keyValue: any): DataFeedEvent {
    const formattedKey = typeof keyValue === 'string' ? `'${keyValue}'` : keyValue;
    const sql = `DELETE FROM ${table} WHERE ${keyField} = ${formattedKey}`;
    const res = realSqlLabEngine.execute(sql);
    const detail = res.metrics.rowsAffected > 0 ? `Deleted ${keyField}=${keyValue}` : `0 rows affected`;
    return this.emitEvent('DELETE', table, detail, res.metrics.durationMs, res.success);
  }

  /**
   * Execute real SQL statement through isolated engine
   */
  public executeCustomSql(sql: string): {
    success: boolean;
    data?: any[];
    message: string;
    event?: DataFeedEvent;
    executionResult?: SqlExecutionResult;
  } {
    const result = realSqlLabEngine.execute(sql);
    let eventType: 'INSERT' | 'SELECT' | 'UPDATE' | 'DELETE' = 'SELECT';
    if (result.commandType === 'INSERT') eventType = 'INSERT';
    else if (result.commandType === 'UPDATE') eventType = 'UPDATE';
    else if (result.commandType === 'DELETE') eventType = 'DELETE';

    const evt = this.emitEvent(
      eventType,
      result.targetTable || 'Database',
      result.message,
      result.metrics.durationMs,
      result.success
    );

    return {
      success: result.success,
      data: result.rows,
      message: result.message,
      event: evt,
      executionResult: result,
    };
  }

  public reset() {
    realSqlLabEngine.seedInitialDatabase();
  }
}

export const dbSimulator = new DatabaseSimulator();
export const initialDatabase: any = {
  Books: realSqlLabEngine.getTableRows('Books'),
  Students: realSqlLabEngine.getTableRows('Students'),
  Loans: realSqlLabEngine.getTableRows('Loans'),
  Customers: realSqlLabEngine.getTableRows('Customers'),
  Orders: realSqlLabEngine.getTableRows('Orders'),
  Products: realSqlLabEngine.getTableRows('Products'),
  Cart: realSqlLabEngine.getTableRows('Cart'),
};
