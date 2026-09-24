/**
 * DataQuestAI Grounded Adaptive Tutoring & Misconception Engine
 * Diagnoses pedagogical misconceptions based on actual student canvas & SQL actions,
 * provides multi-tier Socratic scaffolding, and logs diagnostic learning telemetry.
 */

import { CanvasNode, CanvasEdge, Mission } from './types';
import { telemetryService } from './telemetry';

export interface DiagnosedMisconception {
  id: string;
  type: 'entity_attribute_confusion' | 'pk_fk_confusion' | 'cardinality_mismatch' | 'missing_where_clause' | 'normalization_violation';
  label: string;
  detectedOnNode?: string;
  studentMistake: string;
  likelyRootCause: string;
  remediationRule: string;
  hintLevel1: string;
  hintLevel2: string;
  workedExample: string;
  deepExplanation: string;
}

export class TutorEngine {
  /**
   * Analyze canvas nodes and edges against mission criteria to detect pedagogical misconceptions
   */
  public diagnoseCanvas(nodes: CanvasNode[], edges: CanvasEdge[], mission?: Mission): DiagnosedMisconception | null {
    // 1. Check for Entity vs Attribute Confusion
    const wrongDob = nodes.find(
      (n) => (n.label.toLowerCase().includes('date of birth') || n.label.toLowerCase().includes('dob') || n.label.toLowerCase().includes('price') || n.label.toLowerCase().includes('email')) &&
             n.type === 'entity'
    );

    if (wrongDob) {
      telemetryService.recordMisconception('entity_attribute_confusion');
      return {
        id: 'misc_ent_attr',
        type: 'entity_attribute_confusion',
        label: 'Entity vs Attribute Confusion',
        detectedOnNode: wrongDob.label,
        studentMistake: `"${wrongDob.label}" is modeled as an Entity.`,
        likelyRootCause: 'Every noun must be an entity: Students often classify any distinct property mentioned in a scenario as an independent database entity.',
        remediationRule: 'The Independent Existence Test: Can this object exist in reality without a parent entity? If it only describes someone or something else, it is an ATTRIBUTE.',
        hintLevel1: `Take a close look at "${wrongDob.label}". Does it have an independent identity in the real world, or does it describe an entity?`,
        hintLevel2: `Click on "${wrongDob.label}" and change its category to "Attribute". Then link it to the entity it describes.`,
        workedExample: `In a university database:\n• Student is an Entity (has independent existence, ID, enrollments).\n• Date of Birth, Email, and Name are Attributes describing that Student.`,
        deepExplanation: `In relational database design (Peter Chen ERD & Codd Relational Model), an Entity represents a distinct real-world thing that has its own identity (e.g., Student, Book, Hospital Patient). Attributes are scalar properties that qualify or describe that entity. Modeling an attribute as an entity leads to needless tables and performance bottlenecks.`,
      };
    }

    // 2. Check for Many-to-Many direct link without Junction Table
    const studentNode = nodes.find((n) => n.label.toLowerCase() === 'student');
    const bookNode = nodes.find((n) => n.label.toLowerCase() === 'book');
    const loanNode = nodes.find((n) => n.label.toLowerCase() === 'loan' || n.label.toLowerCase() === 'borrowing');

    if (studentNode && bookNode && !loanNode) {
      const directEdge = edges.find(
        (e) => (e.fromId === studentNode.id && e.toId === bookNode.id) ||
               (e.fromId === bookNode.id && e.toId === studentNode.id)
      );
      if (directEdge) {
        telemetryService.recordMisconception('cardinality_mismatch');
        return {
          id: 'misc_card_m2m',
          type: 'cardinality_mismatch',
          label: 'Direct Many-to-Many without Junction Table',
          detectedOnNode: 'Student ↔ Book',
          studentMistake: 'Direct relationship between Student and Book without an associative Loan entity.',
          likelyRootCause: 'Assuming relational databases can store multiple foreign key values in a single row without violating First Normal Form (1NF).',
          remediationRule: 'M:N Decomposition: Whenever an entity A can have multiple Bs, and B can have multiple As, resolve the relationship with a Junction Entity.',
          hintLevel1: 'One student can borrow many books, and one book can be borrowed by many students over time. How should a relational database resolve this?',
          hintLevel2: 'Add a "Loan" junction entity in the middle: Student (1) ── (N) Loan (N) ── (1) Book.',
          workedExample: `In Newcastle University Library:\nStudent (StudentID)\n  ↓ 1:N\nLoan (LoanID, StudentID, BookID, BorrowDate, DueDate)\n  ↑ N:1\nBook (BookID)`,
          deepExplanation: `First Normal Form (1NF) strictly forbids repeating groups and array-valued columns. A direct M:N relationship cannot be represented in standard relational tables without storing comma-separated IDs or duplicate rows. An associative junction table converts the M:N relationship into two clean 1:N foreign-key relationships.`,
        };
      }
    }

    // 3. Check for Primary vs Foreign Key placement
    const wrongPk = nodes.find((n) => n.type === 'primaryKey' && n.label.toLowerCase().includes('_fk'));
    if (wrongPk) {
      telemetryService.recordMisconception('pk_fk_confusion');
      return {
        id: 'misc_pk_fk',
        type: 'pk_fk_confusion',
        label: 'Primary Key vs Foreign Key Inversion',
        detectedOnNode: wrongPk.label,
        studentMistake: `Key "${wrongPk.label}" is misclassified.`,
        likelyRootCause: 'Confusing the unique identifier of a parent row with the reference pointer stored in child rows.',
        remediationRule: 'The Primary Key uniquely identifies rows in this table; a Foreign Key references a Primary Key in another table.',
        hintLevel1: `Check "${wrongPk.label}". Is it this table's own primary identity, or does it point to another table?`,
        hintLevel2: `Change the key card type to Foreign Key so it correctly references the parent primary key.`,
        workedExample: `In Order ── Customer:\n• Customers table: customer_id is PRIMARY KEY\n• Orders table: customer_id is FOREIGN KEY (referencing Customers.customer_id)`,
        deepExplanation: `Relational integrity depends on Referential Integrity Constraints. The Primary Key enforces entity uniqueness (Entity Integrity Rule). The Foreign Key enforces reference validity (Referential Integrity Rule). Inverting them breaks cascade operations and allows orphaned records.`,
      };
    }

    return null;
  }

  /**
   * Produce adaptive tutor guidance for the current state
   */
  public generateTutorMessage(
    nodes: CanvasNode[],
    edges: CanvasEdge[],
    mission: Mission | undefined,
    actionType: 'hint' | 'explain' | 'example' | 'next',
    hintLevel: number
  ): string {
    const diagnosed = this.diagnoseCanvas(nodes, edges, mission);

    if (diagnosed) {
      if (actionType === 'hint') {
        return hintLevel <= 1 ? `💡 ${diagnosed.hintLevel1}` : `🔍 Diagnostic Hint: ${diagnosed.hintLevel2}`;
      } else if (actionType === 'explain') {
        return `📖 Misconception Diagnosis: ${diagnosed.label}\n\n• Root Cause: ${diagnosed.likelyRootCause}\n• Guiding Principle: ${diagnosed.remediationRule}\n\n${diagnosed.deepExplanation}`;
      } else if (actionType === 'example') {
        return `</> Concrete Industry Architecture:\n${diagnosed.workedExample}`;
      } else {
        return `➡️ Next Step: ${diagnosed.remediationRule}\nApply this to "${diagnosed.detectedOnNode || 'the canvas'}" and run "Check Solution" to verify!`;
      }
    }

    // Default contextual guidance if no active error
    const correctCount = nodes.filter((n) => n.status === 'correct').length;
    const totalCount = nodes.length;

    if (actionType === 'hint') {
      return `💡 Architecture Tip: You have ${correctCount}/${totalCount} verified components. Ensure every entity has an assigned Primary Key (PK) and check that relationships connect related entities.`;
    } else if (actionType === 'explain') {
      return `📖 Relational Systems Architecture:\n• Three-Level Schema: External (Views), Conceptual (ERD/Schema), Physical (B-Trees, Storage).\n• ACID Guarantees: Atomicity, Consistency, Isolation, Durability.\n• Normalization: Eliminates update anomalies through functional dependencies.`;
    } else if (actionType === 'example') {
      return `</> Enterprise Example:\nIn Shopify's database engine, orders are written to an active transactional master with 3NF normalization, then streamed via change data capture (CDC) to a snowflake analytical warehouse for reporting.`;
    } else {
      return `➡️ Next Step: Run a live CRUD query in the Live Transaction Engine below to verify your database operations on real storage!`;
    }
  }
}

export const tutorEngine = new TutorEngine();
