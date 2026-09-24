/**
 * DataQuestAI Automated Verification Harness
 * Tests:
 * 1. SQL Execution & Parsing (SELECT, INSERT, UPDATE, DELETE, EXPLAIN)
 * 2. Primary Key constraints & Unique validation
 * 3. NOT NULL constraints validation
 * 4. Foreign Key referential integrity validation
 * 5. Query Plan Generation (Index Seek vs Table Scan)
 * 6. Cryptographic PBKDF2 Password Hashing & Verification
 * 7. RBAC permissions hierarchy and session validation
 * 8. Platform storage configuration inspectability
 */

import { SqlLabEngine } from '../src/lib/sql-lab-engine.ts';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  createSessionToken,
  validatePasswordStrength,
  hasPermission,
} from '../src/lib/auth.ts';
import { getPlatformStorageInfo } from '../src/lib/platform-db.ts';

async function runAllTests() {
  console.log('🧪 Starting DataQuestAI Production V2 Automated Verification...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. SQL Engine: SELECT with WHERE
  const engine = new SqlLabEngine();
  const resSelect = engine.execute("SELECT * FROM Books WHERE Category = 'Science'");
  assert(resSelect.success === true, 'SELECT query executed successfully');
  assert(resSelect.rows.length >= 2, 'SELECT returned filtered Science books');

  // 2. SQL Engine: INSERT with Primary Key enforcement
  const resInsert = engine.execute("INSERT INTO Books (BookID, Title, Copies, Category) VALUES ('B888', 'Distributed Systems', 3, 'Technology')");
  assert(resInsert.success === true, 'INSERT query added new row');
  assert(resInsert.metrics.rowsAffected === 1, 'INSERT recorded 1 row affected');

  const resDuplicate = engine.execute("INSERT INTO Books (BookID, Title, Copies, Category) VALUES ('B888', 'Duplicate', 1, 'Tech')");
  assert(resDuplicate.success === false, 'Duplicate PRIMARY KEY insertion rejected');

  // 3. SQL Engine: NOT NULL constraint check
  const resNullTitle = engine.execute("INSERT INTO Books (BookID, Title, Copies, Category) VALUES ('B889', NULL, 1, 'Tech')");
  assert(resNullTitle.success === false, 'NOT NULL constraint failed on NULL Title');

  // 4. SQL Engine: Foreign Key referential integrity check
  const resInvalidFk = engine.execute("INSERT INTO Loans (LoanID, StudentID, BookID, BorrowDate, DueDate, Status) VALUES ('L999', 'S999_NONEXISTENT', 'B001', '2026-09-24', '2026-10-08', 'Active')");
  assert(resInvalidFk.success === false, 'FOREIGN KEY constraint failed on invalid StudentID reference');

  // 5. SQL Engine: UPDATE with arithmetic
  const resUpdate = engine.execute("UPDATE Books SET Copies = 5 WHERE BookID = 'B001'");
  assert(resUpdate.success === true, 'UPDATE query executed');
  assert(resUpdate.metrics.rowsAffected === 1, 'UPDATE affected 1 row');
  const bookB001 = engine.getTableRows('Books').find((b) => b.BookID === 'B001');
  assert(bookB001.Copies === 5, 'Physical row Copies updated to 5');

  // UPDATE constraint checks
  const resUpdateNull = engine.execute("UPDATE Books SET Title = NULL WHERE BookID = 'B001'");
  assert(resUpdateNull.success === false, 'UPDATE rejected setting NOT NULL column to NULL');

  const resUpdateFk = engine.execute("UPDATE Loans SET StudentID = 'NONEXISTENT' WHERE LoanID = 'L101'");
  assert(resUpdateFk.success === false, 'UPDATE rejected setting invalid Foreign Key');

  // 6. SQL Engine: DELETE with referential integrity check
  const resDeleteReferenced = engine.execute("DELETE FROM Students WHERE StudentID = 'S001'");
  assert(resDeleteReferenced.success === false, 'DELETE blocked by FOREIGN KEY constraint (active child loans exist)');

  const resDelete = engine.execute("DELETE FROM Cart WHERE CartID = 'CR01'");
  assert(resDelete.success === true, 'DELETE query executed');
  assert(resDelete.metrics.rowsAffected === 1, 'DELETE affected 1 row');

  // 7. SQL Engine: EXPLAIN Query Plans
  const explainIndex = engine.execute("EXPLAIN SELECT * FROM Orders WHERE CustomerID = 'C001'");
  assert(explainIndex.commandType === 'EXPLAIN', 'EXPLAIN query recognized');
  assert(explainIndex.metrics.queryPlan[0].operation === 'INDEX_SEEK', 'EXPLAIN verified INDEX_SEEK on indexed CustomerID');

  const explainScan = engine.execute("EXPLAIN SELECT * FROM Orders WHERE Status = 'Delivered'");
  assert(explainScan.metrics.queryPlan[0].operation === 'TABLE_SCAN', 'EXPLAIN verified TABLE_SCAN on unindexed Status');

  // 8. SQL Engine: JOIN Capabilities
  const resJoin = engine.execute("SELECT Orders.OrderID, Customers.Name, Orders.Total FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID");
  assert(resJoin.success === true && resJoin.rows.length === 3, 'INNER JOIN executed successfully');
  assert(resJoin.rows[0].Name === 'Alex Mercer', 'INNER JOIN correctly projected customer name');

  const resChainedJoin = engine.execute("SELECT s.Name AS StudentName, b.Title AS BookTitle, l.BorrowDate FROM Loans l JOIN Students s ON l.StudentID = s.StudentID JOIN Books b ON l.BookID = b.BookID WHERE l.Status = 'Active'");
  assert(resChainedJoin.success === true && resChainedJoin.rows.length === 3, 'Chained multi-table JOIN with aliases executed');
  assert(resChainedJoin.columns.includes('StudentName'), 'Chained JOIN supported column aliasing');

  const resLeftJoin = engine.execute("SELECT Students.StudentID, Students.Name, Loans.LoanID FROM Students LEFT JOIN Loans ON Students.StudentID = Loans.StudentID");
  assert(resLeftJoin.success === true && resLeftJoin.rows.length >= 4, 'LEFT OUTER JOIN returned all left rows');
  const unborrowedStudent = resLeftJoin.rows.find((r) => r.StudentID === 'S004');
  assert(unborrowedStudent && unborrowedStudent.LoanID === null, 'LEFT OUTER JOIN extended unmatched rows with NULL');

  const explainJoin = engine.execute("EXPLAIN SELECT Orders.OrderID, Customers.Name FROM Orders JOIN Customers ON Orders.CustomerID = Customers.CustomerID");
  const hasJoinStep = explainJoin.metrics.queryPlan.some((step) => step.operation === 'HASH_JOIN' || step.operation === 'NESTED_LOOP_JOIN');
  assert(hasJoinStep, 'EXPLAIN Query Plan generated genuine Relational JOIN operation step');

  // 8. Cryptographic Auth
  const salt = generateSalt(16);
  const password = 'SecretPassword123!';
  const hash = await hashPassword(password, salt);
  assert(hash.length === 64, 'PBKDF2 generated 256-bit SHA-256 hash');

  const verifyValid = await verifyPassword(password, salt, hash);
  assert(verifyValid === true, 'Constant-time password verification succeeded');

  const verifyInvalid = await verifyPassword('WrongPassword', salt, hash);
  assert(verifyInvalid === false, 'Invalid password correctly rejected');

  const sessionToken = createSessionToken('usr_alex', 'student');
  assert(sessionToken.startsWith('dqs_usr_alex_student_'), 'Session token generated with prefix and role');

  // 9. RBAC Hierarchy
  assert(hasPermission('student', 'teacher') === false, 'Student cannot access teacher privileges');
  assert(hasPermission('teacher', 'student') === true, 'Teacher has student level access');
  assert(hasPermission('admin', 'teacher') === true, 'Admin has teacher level access');

  // 10. Platform Storage Info
  const storageInfo = getPlatformStorageInfo();
  assert(typeof storageInfo.engine === 'string', 'Platform storage engine inspectable');
  assert(typeof storageInfo.storageTarget === 'string', 'Platform storage target path inspectable');

  console.log(`\n📊 Verification Complete: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
