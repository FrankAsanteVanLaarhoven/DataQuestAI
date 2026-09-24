/**
 * Declarative Missions Engine for DataQuestAI
 * Every mission implements the 7-stage pedagogical loop:
 * 1. EXPLAIN (plain words)
 * 2. SHOW IT (animation / visual)
 * 3. BUILD IT (drag/drop canvas)
 * 4. RUN IT (real SQL engine)
 * 5. BREAK IT (introduce error)
 * 6. FIX IT (diagnose & repair)
 * 7. PROVE IT (capstone challenge)
 */

import { Mission, ConceptType } from '../types';

export interface MissionStage {
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  type: 'explain' | 'show' | 'build' | 'run' | 'break' | 'fix' | 'prove';
  prompt: string;
  expectedSql?: string;
  expectedConceptType?: ConceptType;
  remediationHint?: string;
}

export interface DeclarativeMission extends Mission {
  stages: MissionStage[];
  misconceptionTraps: Array<{
    name: string;
    description: string;
    triggerCondition: string;
    remediation: string;
  }>;
}

export const DECLARATIVE_MISSIONS: DeclarativeMission[] = [
  // Mission 1: Build the Library
  {
    id: 'mission-1',
    number: 1,
    title: 'Mission 1 — Build the University Library',
    description: 'Master the fundamental distinction between independent Entities and descriptive Attributes in a university lending system.',
    level: 'Beginner',
    xpReward: 200,
    progress: 0,
    unlocked: true,
    completed: false,
    iconName: 'BookOpen',
    systemGoal: 'Identify independent Entities (Student, Book, Librarian) and classify Date of Birth, Email, and Title as Attributes.',
    instructions: [
      'Apply the Independent Existence Test: Does this object exist independently in reality?',
      'Place "Student", "Book", and "Librarian" into the ENTITY category.',
      'Change "Date of Birth" from an Entity into an ATTRIBUTE on Student.',
      'Assign Primary Key "StudentID" to Student, and "BookID" to Book.',
      'Execute a real SQL query to verify the Student record exists in storage.',
    ],
    initialNodes: [
      { id: 'node-student', type: 'entity', label: 'Student', x: 60, y: 80, status: 'correct', feedback: 'Student is an independent entity.' },
      { id: 'node-book', type: 'entity', label: 'Book', x: 380, y: 80, status: 'idle' },
      { id: 'node-librarian', type: 'entity', label: 'Librarian', x: 700, y: 80, status: 'idle' },
      { id: 'node-pk-stu', type: 'primaryKey', label: 'StudentID', x: 60, y: 220, status: 'correct', feedback: 'StudentID uniquely identifies each student.' },
      { id: 'node-dob', type: 'entity', label: 'Date of Birth', x: 220, y: 220, status: 'wrong', expectedType: 'attribute', feedback: 'Date of Birth describes a Student; it is an Attribute, not an Entity!', recommendation: 'Change card type to Attribute.' },
      { id: 'node-email', type: 'attribute', label: 'Email', x: 60, y: 340, status: 'idle' },
      { id: 'node-title', type: 'attribute', label: 'Title', x: 380, y: 220, status: 'idle' },
      { id: 'node-copies', type: 'attribute', label: 'Copies', x: 380, y: 340, status: 'idle' },
    ],
    initialEdges: [
      { id: 'edge-stu-pk', fromId: 'node-student', toId: 'node-pk-stu', label: 'has PK' },
      { id: 'edge-book-title', fromId: 'node-book', toId: 'node-title', label: 'describes' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'Student', validTypes: ['entity'] },
        { label: 'Book', validTypes: ['entity'] },
        { label: 'Librarian', validTypes: ['entity'] },
        { label: 'Date of Birth', validTypes: ['attribute'] },
        { label: 'StudentID', validTypes: ['primaryKey'] },
        { label: 'Title', validTypes: ['attribute'] },
        { label: 'Copies', validTypes: ['attribute'] },
      ],
      requiredRelationships: [
        { from: 'node-student', to: 'node-pk-stu' },
      ],
    },
    misconceptionTraps: [
      {
        name: 'Entity/Attribute Confusion',
        description: 'Assuming Date of Birth is an entity because it is a distinct noun.',
        triggerCondition: 'node-dob.type === "entity"',
        remediation: 'Can a Date of Birth exist without a person? No, it describes someone.',
      },
    ],
    stages: [
      { stage: 1, title: 'EXPLAIN', type: 'explain', prompt: 'An Entity is a thing that exists independently. An Attribute describes an entity.' },
      { stage: 2, title: 'SHOW IT', type: 'show', prompt: 'Watch how records in Books and Students store attributes as table columns.' },
      { stage: 3, title: 'BUILD IT', type: 'build', prompt: 'Move "Date of Birth" to Attribute and attach it to Student.' },
      { stage: 4, title: 'RUN IT', type: 'run', prompt: 'Run SELECT * FROM Students WHERE Department = "Computing".', expectedSql: 'SELECT * FROM Students' },
      { stage: 5, title: 'BREAK IT', type: 'break', prompt: 'What happens when two students share the same Date of Birth? Can it be a Primary Key?' },
      { stage: 6, title: 'FIX IT', type: 'fix', prompt: 'Assign StudentID as the unique Primary Key.' },
      { stage: 7, title: 'PROVE IT', type: 'prove', prompt: 'Verify your schema passes all relational integrity constraints.' },
    ],
  },

  // Mission 2: Relationships & Junction Table
  {
    id: 'mission-2',
    number: 2,
    title: 'Mission 2 — Relationships & The Junction Table Discovery',
    description: 'Solve the Many-to-Many dilemma: Can one student borrow many books, and can one book title be borrowed by many students?',
    level: 'Intermediate',
    xpReward: 250,
    progress: 0,
    unlocked: true,
    completed: false,
    iconName: 'Link2',
    systemGoal: 'Decompose the M:N relationship between Student and Book by architecting a Loan junction entity.',
    instructions: [
      'Question 1: Can one student borrow several books? Yes (1:N).',
      'Question 2: Can a book title be borrowed by multiple students over time? Yes (1:N).',
      'Direct M:N relationships violate 1NF in relational databases.',
      'Place a "Loan" associative junction entity between Student and Book.',
      'Connect Student (1) ── (N) Loan, and Book (1) ── (N) Loan.',
    ],
    initialNodes: [
      { id: 'node-stu-2', type: 'entity', label: 'Student', x: 80, y: 100, status: 'correct' },
      { id: 'node-loan', type: 'entity', label: 'Loan', x: 380, y: 100, status: 'idle' },
      { id: 'node-book-2', type: 'entity', label: 'Book', x: 680, y: 100, status: 'correct' },
      { id: 'node-loan-id', type: 'primaryKey', label: 'LoanID', x: 380, y: 240, status: 'correct' },
      { id: 'node-borrow-date', type: 'attribute', label: 'BorrowDate', x: 260, y: 240, status: 'idle' },
      { id: 'node-due-date', type: 'attribute', label: 'DueDate', x: 500, y: 240, status: 'idle' },
    ],
    initialEdges: [
      { id: 'e-stu-loan', fromId: 'node-stu-2', toId: 'node-loan', label: '1:N Borrowings', cardinality: '1:N' },
      { id: 'e-book-loan', fromId: 'node-book-2', toId: 'node-loan', label: '1:N Loans', cardinality: '1:N' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'Student', validTypes: ['entity'] },
        { label: 'Loan', validTypes: ['entity'] },
        { label: 'Book', validTypes: ['entity'] },
        { label: 'LoanID', validTypes: ['primaryKey'] },
      ],
      requiredRelationships: [
        { from: 'node-stu-2', to: 'node-loan' },
        { from: 'node-book-2', to: 'node-loan' },
      ],
    },
    misconceptionTraps: [
      {
        name: 'Direct M:N Link',
        description: 'Connecting Student directly to Book with an array of IDs.',
        triggerCondition: 'edge(Student, Book)',
        remediation: 'Relational 1NF forbids multi-valued repeating columns. Use a junction table.',
      },
    ],
    stages: [
      { stage: 1, title: 'EXPLAIN', type: 'explain', prompt: 'Direct Many-to-Many relationships cannot store multiple foreign keys in one row.' },
      { stage: 2, title: 'SHOW IT', type: 'show', prompt: 'Watch how Loan table stores StudentID and BookID together with BorrowDate.' },
      { stage: 3, title: 'BUILD IT', type: 'build', prompt: 'Connect Student and Book through the Loan junction entity.' },
      { stage: 4, title: 'RUN IT', type: 'run', prompt: 'SELECT * FROM Loans JOIN Books ON Loans.BookID = Books.BookID' },
      { stage: 5, title: 'BREAK IT', type: 'break', prompt: 'Attempt to insert a Loan with a non-existent BookID.' },
      { stage: 6, title: 'FIX IT', type: 'fix', prompt: 'Enforce Foreign Key referential integrity constraint.' },
      { stage: 7, title: 'PROVE IT', type: 'prove', prompt: 'Demonstrate zero orphan records on deletion.' },
    ],
  },

  // Mission 3: Real CRUD Operations
  {
    id: 'mission-3',
    number: 3,
    title: 'Mission 3 — Real CRUD: Mutation & Data Integrity',
    description: 'Execute genuine INSERT, SELECT, UPDATE, and DELETE queries on live storage and watch the physical rows change.',
    level: 'Beginner',
    xpReward: 200,
    progress: 0,
    unlocked: true,
    completed: false,
    iconName: 'Database',
    systemGoal: 'Perform real CRUD operations on Books and Customers, observing live query plans and table mutation feedback.',
    instructions: [
      'CREATE: Execute an INSERT INTO Books statement adding a new textbook.',
      'READ: Run a SELECT query with a WHERE filter on Categories.',
      'UPDATE: Increment Copies in Books from 4 to 5 for "Clean Code".',
      'DELETE: Remove a temporary cart item and inspect rows affected.',
    ],
    initialNodes: [
      { id: 'node-crud-c', type: 'crud', label: 'CREATE (INSERT)', x: 100, y: 100, status: 'correct' },
      { id: 'node-crud-r', type: 'crud', label: 'READ (SELECT)', x: 300, y: 100, status: 'correct' },
      { id: 'node-crud-u', type: 'crud', label: 'UPDATE (UPDATE)', x: 500, y: 100, status: 'correct' },
      { id: 'node-crud-d', type: 'crud', label: 'DELETE (DELETE)', x: 700, y: 100, status: 'correct' },
    ],
    initialEdges: [],
    expectedRules: {
      correctNodes: [
        { label: 'CREATE (INSERT)', validTypes: ['crud'] },
        { label: 'READ (SELECT)', validTypes: ['crud'] },
        { label: 'UPDATE (UPDATE)', validTypes: ['crud'] },
        { label: 'DELETE (DELETE)', validTypes: ['crud'] },
      ],
      requiredRelationships: [],
    },
    misconceptionTraps: [
      {
        name: 'Missing WHERE Clause',
        description: 'Executing UPDATE without WHERE, unintentionally updating all rows in the table.',
        triggerCondition: 'sql.toUpperCase().includes("UPDATE") && !sql.toUpperCase().includes("WHERE")',
        remediation: 'Always specify target primary keys in WHERE before executing updates.',
      },
    ],
    stages: [
      { stage: 1, title: 'EXPLAIN', type: 'explain', prompt: 'CRUD maps to the 4 SQL statements: INSERT, SELECT, UPDATE, DELETE.' },
      { stage: 2, title: 'SHOW IT', type: 'show', prompt: 'Observe how UPDATE Book SET Copies = 5 directly changes physical storage.' },
      { stage: 3, title: 'BUILD IT', type: 'build', prompt: 'Construct a custom UPDATE operation in the CrudBuilder.' },
      { stage: 4, title: 'RUN IT', type: 'run', prompt: 'Execute your custom SQL on the live database engine.' },
      { stage: 5, title: 'BREAK IT', type: 'break', prompt: 'Run an UPDATE without a WHERE clause and observe all rows mutate.' },
      { stage: 6, title: 'FIX IT', type: 'fix', prompt: 'Add WHERE BookID = "B001" to restore precise single-row mutation.' },
      { stage: 7, title: 'PROVE IT', type: 'prove', prompt: 'Verify row B001 has exactly 5 copies.' },
    ],
  },

  // Mission 4: E-Commerce Fulfillment (from original)
  {
    id: 'mission-4',
    number: 4,
    title: 'Mission 4 — E-Commerce Core & Index Optimization',
    description: 'Design a 3NF normalized schema for orders, customers, and payments, then benchmark Table Scan vs Index Seek.',
    level: 'Advanced',
    xpReward: 300,
    progress: 0,
    unlocked: true,
    completed: false,
    iconName: 'ShoppingCart',
    systemGoal: 'Create a B-Tree index on Orders(CustomerID) and observe latency drop from 18ms Table Scan to 0.8ms Index Seek.',
    instructions: [
      'Establish Customer, Order, and Payment normalized entities.',
      'Run EXPLAIN SELECT * FROM Orders WHERE CustomerID = "C001".',
      'Notice the full table scan cost.',
      'Execute CREATE INDEX idx_orders_customer ON Orders(CustomerID).',
      'Rerun EXPLAIN and observe the Index Seek operation.',
    ],
    initialNodes: [
      { id: 'node-cust-4', type: 'entity', label: 'Customer', x: 80, y: 100, status: 'correct' },
      { id: 'node-order-4', type: 'entity', label: 'Order', x: 380, y: 100, status: 'correct' },
      { id: 'node-payment-4', type: 'entity', label: 'Payment', x: 680, y: 100, status: 'correct' },
    ],
    initialEdges: [
      { id: 'e-cust-order', fromId: 'node-cust-4', toId: 'node-order-4', label: '1:N Places' },
      { id: 'e-order-pay', fromId: 'node-order-4', toId: 'node-payment-4', label: '1:1 Settles' },
    ],
    expectedRules: {
      correctNodes: [
        { label: 'Customer', validTypes: ['entity'] },
        { label: 'Order', validTypes: ['entity'] },
        { label: 'Payment', validTypes: ['entity'] },
      ],
      requiredRelationships: [],
    },
    misconceptionTraps: [],
    stages: [],
  },
];
