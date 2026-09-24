import test from 'node:test';
import assert from 'node:assert/strict';
import { SqlLabEngine } from '../src/lib/sql-lab-engine.ts';
import { hashPassword, verifyPassword, generateSalt, createSessionToken, validatePasswordStrength, hasPermission } from '../src/lib/auth.ts';
import { TutorEngine } from '../src/lib/tutor-engine.ts';

test('1. SQL Lab Engine: SELECT and Filtering', () => {
  const engine = new SqlLabEngine();
  const res = engine.execute("SELECT * FROM Books WHERE Category = 'Science'");
  assert.equal(res.success, true);
  assert.equal(res.commandType, 'SELECT');
  assert.ok(res.rows && res.rows.length >= 2);
  for (const r of res.rows) {
    assert.equal(r.Category, 'Science');
  }
});

test('2. SQL Lab Engine: INSERT and Primary Key Uniqueness Constraint', () => {
  const engine = new SqlLabEngine();
  // Valid insert
  const res1 = engine.execute("INSERT INTO Books (BookID, Title, Copies, Category) VALUES ('B999', 'Modern OS', 5, 'Technology')");
  assert.equal(res1.success, true);
  assert.equal(res1.metrics.rowsAffected, 1);

  // Duplicate PK insert must fail
  const res2 = engine.execute("INSERT INTO Books (BookID, Title, Copies, Category) VALUES ('B999', 'Duplicate Book', 1, 'Technology')");
  assert.equal(res2.success, false);
  assert.match(res2.message, /PRIMARY KEY constraint failed/i);
});

test('3. SQL Lab Engine: UPDATE with WHERE condition and arithmetic', () => {
  const engine = new SqlLabEngine();
  const initialCopies = engine.getTableRows('Books').find((b) => b.BookID === 'B001').Copies;
  assert.equal(initialCopies, 4);

  const res = engine.execute("UPDATE Books SET Copies = 5 WHERE BookID = 'B001'");
  assert.equal(res.success, true);
  assert.equal(res.metrics.rowsAffected, 1);

  const updatedCopies = engine.getTableRows('Books').find((b) => b.BookID === 'B001').Copies;
  assert.equal(updatedCopies, 5);
});

test('4. SQL Lab Engine: DELETE with WHERE condition', () => {
  const engine = new SqlLabEngine();
  const initialLen = engine.getTableRows('Cart').length;
  assert.ok(initialLen > 0);

  const res = engine.execute("DELETE FROM Cart WHERE CartID = 'CR01'");
  assert.equal(res.success, true);
  assert.equal(res.metrics.rowsAffected, 1);

  const afterLen = engine.getTableRows('Cart').length;
  assert.equal(afterLen, initialLen - 1);
});

test('5. SQL Lab Engine: EXPLAIN QUERY PLAN (Table Scan vs Index Seek)', () => {
  const engine = new SqlLabEngine();
  // Query with index on Orders(CustomerID)
  const explainWithIndex = engine.execute("EXPLAIN SELECT * FROM Orders WHERE CustomerID = 'C001'");
  assert.equal(explainWithIndex.success, true);
  assert.equal(explainWithIndex.commandType, 'EXPLAIN');
  assert.equal(explainWithIndex.metrics.queryPlan[0].operation, 'INDEX_SEEK');

  // Query on unindexed column -> Full Table Scan
  const explainNoIndex = engine.execute("EXPLAIN SELECT * FROM Orders WHERE Status = 'Delivered'");
  assert.equal(explainNoIndex.success, true);
  assert.equal(explainNoIndex.metrics.queryPlan[0].operation, 'TABLE_SCAN');
});

test('6. Auth: PBKDF2 Password Hashing & Verification', async () => {
  const salt = generateSalt(16);
  const password = 'CorrectHorseBatteryStaple123';
  const hashed = await hashPassword(password, salt);

  assert.ok(hashed.length > 30);

  // Correct verification
  const isValid = await verifyPassword(password, salt, hashed);
  assert.equal(isValid, true);

  // Incorrect verification
  const isInvalid = await verifyPassword('WrongPassword!', salt, hashed);
  assert.equal(isInvalid, false);
});

test('7. Auth: Session Token and Password Strength Validation', () => {
  const token = createSessionToken('usr_123', 'student');
  assert.match(token, /^dqs_usr_123_student_/);

  assert.equal(validatePasswordStrength('12345').valid, false);
  assert.equal(validatePasswordStrength('123456').valid, true);
});

test('8. Adaptive Tutor & Misconception Engine: Entity vs Attribute Diagnosis', () => {
  const tutor = new TutorEngine();
  const mockNodes = [
    { id: '1', label: 'Customer', type: 'entity', status: 'correct' },
    { id: '2', label: 'Date of Birth', type: 'entity', status: 'wrong' }, // Misconception!
  ];
  const mockEdges = [];

  const diagnosis = tutor.diagnoseCanvas(mockNodes, mockEdges);
  assert.ok(diagnosis);
  assert.equal(diagnosis.type, 'entity_attribute_confusion');
  assert.match(diagnosis.remediationRule, /Independent Existence Test/i);

  const hint1 = tutor.generateTutorMessage(mockNodes, mockEdges, undefined, 'hint', 1);
  assert.match(hint1, /Date of Birth/i);
});

test('9. SQL Lab Engine: NOT NULL and Foreign Key Constraints Enforcement', () => {
  const engine = new SqlLabEngine();

  // NOT NULL constraint
  const resNull = engine.execute("INSERT INTO Books (BookID, Title, Copies, Category) VALUES ('B998', NULL, 3, 'Tech')");
  assert.equal(resNull.success, false);
  assert.match(resNull.message, /NOT NULL constraint failed/i);

  // Foreign Key constraint
  const resFk = engine.execute("INSERT INTO Loans (LoanID, StudentID, BookID, BorrowDate, DueDate, Status) VALUES ('L888', 'NON_EXISTENT_STUDENT', 'B001', '2026-09-24', '2026-10-08', 'Active')");
  assert.equal(resFk.success, false);
  assert.match(resFk.message, /FOREIGN KEY constraint failed/i);
});

test('10. Auth: Role-Based Access Control Hierarchy', () => {
  assert.equal(hasPermission('student', 'teacher'), false);
  assert.equal(hasPermission('student', 'admin'), false);
  assert.equal(hasPermission('teacher', 'student'), true);
  assert.equal(hasPermission('admin', 'teacher'), true);
});

test('11. SQL Lab Engine: Referential Integrity on DELETE', () => {
  const engine = new SqlLabEngine();

  // Student S001 has active loans in Loans table; deleting S001 must fail
  const resDeleteReferenced = engine.execute("DELETE FROM Students WHERE StudentID = 'S001'");
  assert.equal(resDeleteReferenced.success, false);
  assert.match(resDeleteReferenced.message, /FOREIGN KEY constraint failed.*cannot delete row from 'Students'/i);

  // Deleting unreferenced student (e.g. S003 has no loans in seed)
  const resDeleteUnreferenced = engine.execute("DELETE FROM Students WHERE StudentID = 'S003'");
  assert.equal(resDeleteUnreferenced.success, true);
  assert.equal(resDeleteUnreferenced.metrics.rowsAffected, 1);
});

test('12. SQL Lab Engine: UPDATE Constraints Enforcement', () => {
  const engine = new SqlLabEngine();

  // UPDATE setting NOT NULL column to NULL must fail
  const resUpdateNull = engine.execute("UPDATE Books SET Title = NULL WHERE BookID = 'B001'");
  assert.equal(resUpdateNull.success, false);
  assert.match(resUpdateNull.message, /NOT NULL constraint failed/i);

  // UPDATE setting invalid Foreign Key must fail
  const resUpdateFk = engine.execute("UPDATE Loans SET StudentID = 'INVALID_STUDENT' WHERE LoanID = 'L101'");
  assert.equal(resUpdateFk.success, false);
  assert.match(resUpdateFk.message, /FOREIGN KEY constraint failed/i);
});

test('13. Conversational Voice Engine: Text Normalization and Phrasing', async () => {
  const { voiceEngine } = await import('../src/lib/voice-engine.ts');

  const rawText = "In **3NF**, every non-key column must depend solely on the `PK` and not on another `FK`. Run `SELECT *` in SQL!";
  const prepared = voiceEngine.prepareConversationalText(rawText);

  assert.ok(!prepared.includes('**'));
  assert.ok(!prepared.includes('`'));
  assert.ok(prepared.includes('Primary Key'));
  assert.ok(prepared.includes('Foreign Key'));
  assert.ok(prepared.includes('Third Normal Form'));
  assert.ok(prepared.includes('S-Q-L'));

  const chunks = voiceEngine.chunkSentences("First sentence about tables. Second sentence about indexes! Third question?");
  assert.equal(chunks.length, 3);
  assert.equal(chunks[0], "First sentence about tables.");
});

test('14. Conversational Voice Engine: Voice Profiles and State Telemetry', async () => {
  const { voiceEngine, VOICE_PROFILES } = await import('../src/lib/voice-engine.ts');

  voiceEngine.setProfile('lecturer');
  const st1 = voiceEngine.getState();
  assert.equal(st1.profile, 'lecturer');
  assert.equal(st1.rate, VOICE_PROFILES.lecturer.rate);

  voiceEngine.setProfile('coach');
  const st2 = voiceEngine.getState();
  assert.equal(st2.profile, 'coach');
  assert.equal(st2.rate, VOICE_PROFILES.coach.rate);

  voiceEngine.setMuted(true);
  assert.equal(voiceEngine.getState().isMuted, true);
  voiceEngine.setMuted(false);
  assert.equal(voiceEngine.getState().isMuted, false);
});

test('15. SQL Lab Engine: INNER JOIN and Multi-Table Chained Joins with Aliases', () => {
  const engine = new SqlLabEngine();

  // Test Orders JOIN Customers
  const res1 = engine.execute(
    'SELECT Orders.OrderID, Customers.Name, Orders.Total FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID'
  );
  assert.equal(res1.success, true);
  assert.equal(res1.commandType, 'SELECT');
  assert.ok(res1.rows && res1.rows.length === 3);
  assert.equal(res1.rows[0].OrderID, '#1042');
  assert.equal(res1.rows[0].Name, 'Alex Mercer');
  assert.equal(res1.rows[0].Total, 189.5);

  // Test Chained Multi-Table JOIN: Loans + Students + Books with aliases and WHERE clause
  const res2 = engine.execute(`
    SELECT s.Name AS StudentName, b.Title AS BookTitle, l.BorrowDate, l.Status
    FROM Loans l
    JOIN Students s ON l.StudentID = s.StudentID
    JOIN Books b ON l.BookID = b.BookID
    WHERE l.Status = 'Active'
    ORDER BY s.Name ASC
  `);
  assert.equal(res2.success, true);
  assert.ok(res2.rows && res2.rows.length === 3);
  assert.equal(res2.columns?.includes('StudentName'), true);
  assert.equal(res2.columns?.includes('BookTitle'), true);
  // Verify order
  assert.equal(res2.rows[0].StudentName, 'Alice Johnson');
});

test('16. SQL Lab Engine: LEFT OUTER JOIN and NULL Extension', () => {
  const engine = new SqlLabEngine();

  // Students who may or may not have borrowed books
  // S003 (Cara Williams) and S004 (David Lee) have no loans
  const res = engine.execute(`
    SELECT Students.StudentID, Students.Name, Loans.LoanID
    FROM Students
    LEFT JOIN Loans ON Students.StudentID = Loans.StudentID
    ORDER BY Students.StudentID ASC
  `);
  assert.equal(res.success, true);
  assert.ok(res.rows && res.rows.length >= 4);

  // S001 has loans
  const s1 = res.rows.find((r) => r.StudentID === 'S001');
  assert.ok(s1 && s1.LoanID);

  // S004 (David Lee) has no loans, LoanID must be null
  const s4 = res.rows.find((r) => r.StudentID === 'S004');
  assert.ok(s4);
  assert.equal(s4.LoanID, null);
});

test('17. SQL Lab Engine: EXPLAIN QUERY PLAN for Relational Joins', () => {
  const engine = new SqlLabEngine();

  const explainRes = engine.execute(`
    EXPLAIN SELECT Orders.OrderID, Customers.Name
    FROM Orders
    JOIN Customers ON Orders.CustomerID = Customers.CustomerID
  `);
  assert.equal(explainRes.success, true);
  assert.equal(explainRes.commandType, 'EXPLAIN');
  assert.ok(explainRes.rows && explainRes.rows.length >= 2);

  // Should have Table Scan on base table + Hash Join on joined table
  const joinStep = explainRes.metrics.queryPlan.find((step) => step.operation === 'HASH_JOIN' || step.operation === 'NESTED_LOOP_JOIN');
  assert.ok(joinStep, 'Query plan must include a JOIN operation step');
  assert.match(joinStep.detail, /Join/i);
});



