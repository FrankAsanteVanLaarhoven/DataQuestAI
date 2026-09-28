import test from 'node:test';
import assert from 'node:assert/strict';
import {
  applyIngest,
  initialAnalyticsSnapshot,
  nextIngestEvent,
  roleShares,
  windowChangePercent,
} from '../src/lib/analytics-ingest.ts';

test('analytics ingest keeps the opening library totals', () => {
  const snapshot = initialAnalyticsSnapshot();
  const books = Object.values(snapshot.books).reduce((sum, count) => sum + count, 0);
  const users = Object.values(snapshot.users).reduce((sum, count) => sum + count, 0);
  assert.equal(books, 445);
  assert.equal(users, 820);
  assert.equal(windowChangePercent(snapshot.borrowings), 24);
  assert.deepEqual(roleShares(Object.values(snapshot.users)), [62, 18, 12, 8]);
});

test('analytics ingest applies catalog, borrow, and user events', () => {
  let snapshot = initialAnalyticsSnapshot();
  const fiction = applyIngest(snapshot, { event: 'INSERT', table: 'Books', details: 'Catalog ingest · Fiction +1' });
  snapshot = fiction.snapshot;
  assert.equal(fiction.hot, 'book:Fiction');
  assert.equal(snapshot.books.Fiction, 96);

  const borrow = applyIngest(snapshot, { event: 'INSERT', table: 'Loans', details: 'Borrow ingest · Jun +2' });
  snapshot = borrow.snapshot;
  assert.equal(borrow.hot, 'borrow');
  assert.equal(snapshot.borrowings[5], 151);

  const teacher = applyIngest(snapshot, { event: 'INSERT', table: 'Students', details: 'User ingest · Teachers +1' });
  assert.equal(teacher.hot, 'user:Teachers');
  assert.equal(teacher.snapshot.users.Teachers, 149);
  assert.equal(roleShares(Object.values(teacher.snapshot.users)).reduce((sum, share) => sum + share, 0), 100);
});

test('analytics ingest script emits a feed event the charts can read', () => {
  const first = nextIngestEvent(0);
  const second = nextIngestEvent(first.cursor);
  assert.equal(first.event.table, 'Books');
  assert.match(first.event.details, /Fiction/);
  assert.equal(second.event.table, 'Loans');
  assert.notEqual(first.event.id, second.event.id);
});
