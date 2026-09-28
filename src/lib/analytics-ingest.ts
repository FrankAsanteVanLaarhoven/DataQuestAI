import type { DataFeedEvent } from './types';

export const BOOK_CATEGORIES = ['Fiction', 'Science', 'History', 'Others'] as const;
export const BORROW_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const;
export const USER_ROLES = ['Students', 'Teachers', 'Staff', 'Others'] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];
export type UserRole = (typeof USER_ROLES)[number];
export type HotMark = `book:${BookCategory}` | `user:${UserRole}` | 'borrow';

export interface AnalyticsSnapshot {
  books: Record<BookCategory, number>;
  borrowings: number[];
  users: Record<UserRole, number>;
}

export function initialAnalyticsSnapshot(): AnalyticsSnapshot {
  return {
    books: { Fiction: 95, Science: 145, History: 75, Others: 130 },
    borrowings: [120, 132, 128, 148, 142, 149],
    users: { Students: 508, Teachers: 148, Staff: 98, Others: 66 },
  };
}

const INGEST_STEPS: Array<Pick<DataFeedEvent, 'event' | 'table' | 'details'>> = [
  { event: 'INSERT', table: 'Books', details: 'Catalog ingest · Fiction +1' },
  { event: 'INSERT', table: 'Loans', details: 'Borrow ingest · Jun +2' },
  { event: 'INSERT', table: 'Students', details: 'User ingest · Students +1' },
  { event: 'INSERT', table: 'Books', details: 'Catalog ingest · Science +1' },
  { event: 'INSERT', table: 'Loans', details: 'Borrow ingest · Jun +1' },
  { event: 'INSERT', table: 'Students', details: 'User ingest · Teachers +1' },
  { event: 'INSERT', table: 'Books', details: 'Catalog ingest · History +1' },
  { event: 'INSERT', table: 'Students', details: 'User ingest · Staff +1' },
  { event: 'INSERT', table: 'Books', details: 'Catalog ingest · Others +1' },
  { event: 'INSERT', table: 'Students', details: 'User ingest · Others +1' },
];

export function nextIngestEvent(cursor: number): { event: DataFeedEvent; cursor: number } {
  const step = INGEST_STEPS[cursor % INGEST_STEPS.length];
  const now = new Date();
  return {
    cursor: cursor + 1,
    event: {
      id: `ingest_${now.getTime()}_${cursor}`,
      time: now.toTimeString().split(' ')[0],
      event: step.event,
      table: step.table,
      details: step.details,
      durationMs: 1.2,
      success: true,
    },
  };
}

export function applyIngest(
  snapshot: AnalyticsSnapshot,
  event: Pick<DataFeedEvent, 'event' | 'table' | 'details'>
): { snapshot: AnalyticsSnapshot; hot: HotMark } {
  const books = { ...snapshot.books };
  const borrowings = snapshot.borrowings.slice();
  const users = { ...snapshot.users };
  const details = event.details;
  const lastMonth = borrowings.length - 1;

  if (details.startsWith('Catalog ingest') || event.table === 'Books') {
    const category = BOOK_CATEGORIES.find((name) => details.includes(name)) ?? 'Others';
    books[category] += 1;
    return { snapshot: { books, borrowings, users }, hot: `book:${category}` };
  }

  if (details.startsWith('Borrow ingest') || event.table === 'Loans' || event.table === 'Orders') {
    const matched = details.match(/\+(\d+)/);
    borrowings[lastMonth] += matched ? Number(matched[1]) : 1;
    return { snapshot: { books, borrowings, users }, hot: 'borrow' };
  }

  if (details.startsWith('User ingest') || event.table === 'Students' || event.table === 'Customers') {
    const role = USER_ROLES.find((name) => details.includes(name)) ?? 'Students';
    users[role] += 1;
    return { snapshot: { books, borrowings, users }, hot: `user:${role}` };
  }

  borrowings[lastMonth] += 1;
  return { snapshot: { books, borrowings, users }, hot: 'borrow' };
}

export function windowChangePercent(series: number[]): number {
  if (series.length < 2 || series[0] === 0) return 0;
  const last = series[series.length - 1];
  return Math.round(((last - series[0]) / series[0]) * 100);
}

export function roleShares(counts: number[]): number[] {
  const total = counts.reduce((sum, count) => sum + count, 0);
  if (total <= 0) return counts.map(() => 0);
  const shares = counts.map((count) => Math.round((count / total) * 100));
  let drift = shares.reduce((sum, share) => sum + share, 0) - 100;
  const order = counts.map((count, index) => ({ count, index })).sort((a, b) => b.count - a.count);
  for (const item of order) {
    if (drift === 0) break;
    const step = drift > 0 ? -1 : 1;
    if (shares[item.index] + step < 0) continue;
    shares[item.index] += step;
    drift += step;
  }
  return shares;
}

export function borrowPoints(series: number[]): Array<{ value: number; x: number; y: number }> {
  const max = Math.max(...series, 1);
  const min = Math.min(...series, max);
  const span = Math.max(max - min, 1);
  return series.map((value, index) => ({
    value,
    x: Math.round((((index + 0.5) / series.length) * 200) * 10) / 10,
    y: Math.round((70 - ((value - min) / span) * 52) * 10) / 10,
  }));
}
