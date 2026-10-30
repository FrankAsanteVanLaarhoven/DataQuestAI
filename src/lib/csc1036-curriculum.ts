/**
 * CSC1036: Programming Portfolio Curriculum Specification
 * Newcastle University • School of Computing • Stage 1 Core Module (30 Credits)
 * Canvas Course ID: 70334
 * Direct Canvas URL: https://ncl.instructure.com/courses/70334
 * Accredited Syllabus Specification with Academic References, SOLID Standards & TDD Frameworks.
 * Organized in standard 12-Week Semester Sequence with Canvas Module Integration & Exam Hub.
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';

export const CSC1036_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Procedural to Object-Oriented Programming Paradigm',
    badge: 'Foundations',
    tagline: 'State, behaviors, class declarations, constructors, and primitive vs reference semantics',
    accreditedSpec: 'CSC1036 Specification: Topic 1.1 — Object Modeling, Heap Allocation, and Reference Lifecycles',
    referencePoint: {
      academic: 'Bloch, J. (2018). Effective Java (3rd Ed.), Chapter 2: Creating and Destroying Objects. Addison-Wesley.',
      standard: 'ISO/IEC 23271: Common Language Infrastructure (CLI) / JVM Specification — Object Model & Memory Allocation.',
      enterprise: 'Standard OpenJDK runtime object layout (compressed OOPs, object headers, and GC roots).',
    },
    pedagogy: {
      simple: 'In procedural code, functions operate on loose variables. In Object-Oriented Programming, we bundle real-world data (state) and the actions that modify that data (behaviors) into unified capsules called objects.',
      engineer: 'Objects represent typed instances allocated dynamically on the heap with runtime type headers. References point to memory addresses; reference reassignment differs fundamentally from value cloning, necessitating deep vs shallow copy awareness.',
    },
    narration: 'Week 1 bridges the transition from basic scripting to professional object-oriented design and memory allocation models.',
    capstone: {
      id: 'port_w1_memory',
      title: 'Heap Reference Inspector',
      description: 'Trace heap allocations and reference aliases across mutable vs immutable class instances.',
    },
    quiz: {
      question: 'When an object variable is assigned to another object variable in Java (e.g. `b = a`), what is physically copied?',
      options: [
        'A deep clone of all instance fields and methods',
        'The memory address reference pointing to the object on the heap',
        'A new snapshot stored in the CPU cache registers',
        'The class bytecode definition from the classloader',
      ],
      correctIndex: 1,
      explanation: 'Java manipulates objects exclusively through reference variables. Assignment copies the 64-bit reference address pointing to the heap instance, not the object body itself.',
    },
  },
  {
    week: 2,
    title: 'Encapsulation, Invariants & Information Hiding',
    badge: 'OOP Core',
    tagline: 'Access specifiers, defensive copying, immutability, and class invariant protection',
    accreditedSpec: 'CSC1036 Specification: Topic 1.2 — Data Hiding, Mutability Control, and Defensive Accessors',
    referencePoint: {
      academic: 'Parnas, D.L. (1972). On the Criteria To Be Used in Decomposing Systems into Modules. Communications of the ACM, 15(12), 1053-1058.',
      standard: 'SEI CERT Oracle Coding Standard for Java: OBJ05-J (Do not return references to private mutable class members).',
      enterprise: 'Domain-Driven Design (DDD) Value Objects and immutable state persistence patterns.',
    },
    pedagogy: {
      simple: 'Encapsulation is like a bank vault. Customers cannot reach inside to grab cash directly; they must interact through a teller who verifies account limits and keeps accurate transaction logs.',
      engineer: 'Encapsulation enforces class invariants through private state variables guarded by validated accessors and mutators. Returning unshielded references to internal mutable structures (e.g. `java.util.Date` or arrays) leaks state and breaches invariants.',
    },
    narration: 'Week 2 teaches the core principle of enterprise security: never expose internal mutable representation to external callers.',
    capstone: {
      id: 'port_w2_immutable',
      title: 'Immutable Value Object Audit',
      description: 'Refactor a leaked bank account class into an invariant-shielded immutable domain record.',
    },
    quiz: {
      question: 'Why should a getter method for an internal `java.util.Date` field return a defensive copy rather than the original reference?',
      options: [
        'To reduce garbage collection pause times',
        'Because `Date` is mutable and the caller could alter the internal object state via `setTime()`',
        'Defensive copying allows multi-threading without requiring synchronized blocks',
        'Because Java does not allow private fields to be accessed through getters',
      ],
      correctIndex: 1,
      explanation: 'Because `Date` instances are mutable, exposing the internal reference allows client code to bypass class invariant checks and mutate state out-of-band.',
    },
  },
  {
    week: 3,
    title: 'Inheritance, Polymorphism & Virtual Method Tables',
    badge: 'Polymorphism',
    tagline: 'Subtyping, method overriding, super calls, and the Virtual Method Table (vtable)',
    accreditedSpec: 'CSC1036 Specification: Topic 2.1 — Subclassing, Dynamic Dispatch, and the vtable Mechanism',
    referencePoint: {
      academic: 'Meyer, B. (1997). Object-Oriented Software Construction (2nd Ed.). Prentice Hall.',
      standard: 'ISO/IEC 14882: Programming Languages — C++ Virtual Functions and Dynamic Polymorphism.',
      enterprise: 'HotSpot JVM JIT inlining: Monomorphic vs Megamorphic call-site optimization.',
    },
    pedagogy: {
      simple: 'Polymorphism means many shapes. You can command different instruments (Guitar, Piano, Drums) to "play()", and each will produce sound in its own unique manner through a single shared command.',
      engineer: 'Dynamic dispatch resolves overridden methods at runtime via an index offset in the object\'s Virtual Method Table (vtable). Subclasses override pointers in the vtable while inheriting the parent layout.',
    },
    narration: 'Week 3 explores how polymorphism replaces fragile switch/case conditionals with extensible, dynamic method dispatch.',
    capstone: {
      id: 'port_w3_dispatch',
      title: 'Dynamic Dispatch Simulator',
      description: 'Trace runtime method resolution through virtual method table indices across a 3-tier hierarchy.',
    },
    quiz: {
      question: 'Which CPU/memory mechanism enables the Java Virtual Machine to execute the overridden subclass method at runtime?',
      options: [
        'Static binary recompilation',
        'Runtime Dynamic Dispatch via Virtual Method Tables (vtables)',
        'Operating system hardware interrupts',
        'CPU branch prediction speculation',
      ],
      correctIndex: 1,
      explanation: 'The JVM and C++ compilers use Virtual Method Tables (vtables) containing function pointers indexed by method signature to resolve the concrete receiver instance dynamically.',
    },
  },
  {
    week: 4,
    title: 'Interfaces, Abstract Classes & Multiple Polymorphic Contracts',
    badge: 'Contracts',
    tagline: 'Interface segregation, default methods, abstract class invariants, and composition over inheritance',
    accreditedSpec: 'CSC1036 Specification: Topic 2.2 — Pure Abstract Contracts and Interface-Driven Design',
    referencePoint: {
      academic: 'Gamma, E., Helm, R., Johnson, R. & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley.',
      standard: 'ISO/IEC 19770: IT Asset Management — Component Interfaces and Pluggable Architectures.',
      enterprise: 'Spring Framework and Java standard library `Collection`, `List`, `Comparable` interfaces.',
    },
    pedagogy: {
      simple: 'An interface is a formal contract. A USB socket defines exact dimensions and electrical pinouts; whether you plug in a mouse, keyboard, or flash drive, the computer speaks to it seamlessly.',
      engineer: 'Interfaces decouple consumer dependencies from provider implementations, enabling pluggable architectures and mocking. Abstract classes provide partial templates with shared state, whereas interfaces define pure behavioral capabilities.',
    },
    narration: 'Week 4 instills the architectural maxim: Program to an interface, not an implementation.',
    capstone: {
      id: 'port_w4_contracts',
      title: 'Pluggable Payment Gateway',
      description: 'Implement a payment processor using decoupled `PaymentProvider` interfaces without coupling to specific APIs.',
    },
    quiz: {
      question: 'When should a software architect choose an `interface` over an `abstract class` in modern Java?',
      options: [
        'When state fields and constructors must be inherited across subclasses',
        'When multiple unrelated classes need to provide a common set of capabilities without sharing class hierarchy',
        'When maximum raw memory execution speed is the only design requirement',
        'When private helper methods cannot be written in the project',
      ],
      correctIndex: 1,
      explanation: 'Interfaces allow unrelated classes in completely different inheritance trees to implement the same behavioral contract (e.g. `Comparable` or `AutoCloseable`), avoiding brittle single-inheritance limits.',
    },
  },
  {
    week: 5,
    title: 'The SOLID Software Design Principles',
    badge: 'Architecture',
    tagline: 'Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion',
    accreditedSpec: 'CSC1036 Specification: Topic 3.1 — SOLID Principles for Maintainable Codebases',
    referencePoint: {
      academic: 'Martin, R.C. (2017). Clean Architecture: A Craftsman\'s Guide to Software Structure and Design. Prentice Hall.',
      standard: 'IEEE 1016-2009: IEEE Standard for Information Technology — Systems Design — Software Design Descriptions.',
      enterprise: 'Enterprise Dependency Injection (Spring IoC / Google Guice) and Liskov verification suites.',
    },
    pedagogy: {
      simple: 'SOLID is a set of five golden rules that keep code from rotting into an unmaintainable mess as features are added over years.',
      engineer: 'S (Single Responsibility): One reason to change; O (Open/Closed): Open for extension, closed for modification; L (Liskov Substitution): Subtypes must be substitutable for base types without breaking caller expectations; I (Interface Segregation): No client should depend on methods it does not use; D (Dependency Inversion): Depend upon abstractions, not concretions.',
    },
    narration: 'Week 5 examines the definitive architectural principles tested in every university software portfolio and technical interview.',
    capstone: {
      id: 'port_w5_solid',
      title: 'LSP Violation Detector',
      description: 'Refactor the classic Square-Rectangle anti-pattern to uphold the Liskov Substitution Principle.',
    },
    quiz: {
      question: 'If a derived class throws an `UnsupportedOperationException` when a base class method is called, which SOLID principle is being directly violated?',
      options: [
        'Single Responsibility Principle (SRP)',
        'Liskov Substitution Principle (LSP)',
        'Open/Closed Principle (OCP)',
        'Dependency Inversion Principle (DIP)',
      ],
      correctIndex: 1,
      explanation: 'The Liskov Substitution Principle states that client code expecting a base type T must behave correctly with any subtype S of T. Throwing unexpected runtime exceptions breaks caller invariants.',
    },
  },
  {
    week: 6,
    title: 'Automated Testing, TDD & JUnit 5 Test Harnesses',
    badge: 'Testing',
    tagline: 'Unit tests, parameterized assertions, test fixtures (@BeforeEach), mocks, and code coverage',
    accreditedSpec: 'CSC1036 Specification: Topic 3.2 — Test-Driven Development (TDD) and Automated Verification',
    referencePoint: {
      academic: 'Beck, K. (2003). Test-Driven Development: By Example. Addison-Wesley.',
      standard: 'ISO/IEC/IEEE 29119: Software and Systems Engineering — Software Testing standards.',
      enterprise: 'JUnit 5, Mockito, and JaCoCo line/branch coverage reporting in enterprise CI pipelines.',
    },
    pedagogy: {
      simple: 'Test-Driven Development (TDD) is like writing the exam questions before studying the material: Red (write a failing test), Green (write just enough code to pass), Refactor (clean up without breaking tests).',
      engineer: 'JUnit 5 structured tests enforce regression defense. Unit tests must be hermetic, deterministic, fast, and test boundary conditions (empty collections, null pointers, integer overflows, off-by-one errors) using assertions.',
    },
    narration: 'Week 6 instills professional engineering rigor: software is not finished until verifiable automated tests prove it works.',
    capstone: {
      id: 'port_w6_junit',
      title: 'JUnit 5 Suite Builder',
      description: 'Write a full parameterized test suite covering edge cases for a currency calculation engine.',
    },
    quiz: {
      question: 'In the Red-Green-Refactor TDD cycle, what is the immediate objective of the "Green" phase?',
      options: [
        'Optimize memory consumption to O(1)',
        'Write the minimal production code necessary to make the failing test pass',
        'Add comprehensive docstrings and commit to production Git branch',
        'Re-architect the system using abstract factory patterns',
      ],
      correctIndex: 1,
      explanation: 'The Green phase dictates writing the absolute minimum code required to turn the failing unit test green, deferring design refinement and cleanup to the Refactor phase.',
    },
  },
  {
    week: 7,
    title: 'Fundamental Linear Data Structures: Singly & Doubly Linked Lists',
    badge: 'Data Structures',
    tagline: 'Node allocation, pointer manipulation, sentinel head/tail nodes, and iterator implementations',
    accreditedSpec: 'CSC1036 Specification: Topic 4.1 — Dynamic Linked Structures and Pointer Invariants',
    referencePoint: {
      academic: 'Sedgewick, R. & Wayne, K. (2011). Algorithms (4th Ed.), Chapter 1.3: Bags, Queues, and Stacks. Addison-Wesley.',
      standard: 'ISO/IEC 9899: C Programming Language — Dynamic Memory Allocation and Linked Lists.',
      enterprise: 'Java `LinkedList<E>` vs `ArrayList<E>` spatial locality and cache miss trade-offs.',
    },
    pedagogy: {
      simple: 'An array is like a row of connected hotel rooms: fast to jump to room 50, but hard to insert a new room in the middle. A linked list is like a treasure hunt: each clue tells you where to find the next one.',
      engineer: 'Linked lists allocate nodes on the heap with explicit next/prev reference pointers. Insertions at known nodes execute in O(1) time without array resizing, but lack CPU cache locality due to pointer chasing.',
    },
    narration: 'Week 7 explores dynamic memory structures where items are linked by reference rather than contiguous array slots.',
    capstone: {
      id: 'port_w7_linkedlist',
      title: 'In-Place Linked List Reversal',
      description: 'Implement a pointer-swapping algorithm that reverses a singly linked list in O(n) time and O(1) auxiliary space.',
    },
    quiz: {
      question: 'What is the primary performance drawback of a linked list compared to an array list when reading elements sequentially?',
      options: [
        'Linked lists cannot store primitive data types',
        'Linked lists suffer frequent CPU cache misses because nodes are scattered across arbitrary heap memory addresses',
        'Linked lists require garbage collection on every read access',
        'Linked list sizes are hard-coded at compile time',
      ],
      correctIndex: 1,
      explanation: 'Arrays store contiguous memory words that CPU cache lines prefetch efficiently. Linked lists scatter nodes across heap addresses, causing cache misses on pointer dereferences.',
    },
  },
  {
    week: 8,
    title: 'Stacks, Queues, Deques & Buffer Management',
    badge: 'LIFO & FIFO',
    tagline: 'LIFO evaluation, FIFO buffering, circular array queues, and arithmetic expression evaluation',
    accreditedSpec: 'CSC1036 Specification: Topic 4.2 — Abstract Data Types: Stacks, Queues, and Ring Buffers',
    referencePoint: {
      academic: 'Knuth, D.E. (1997). The Art of Computer Programming, Vol 1: Fundamental Algorithms (3rd Ed.). Addison-Wesley.',
      standard: 'POSIX.1-2017: Message Queues and Ring Buffer IPC semantics.',
      enterprise: 'JVM call stack frames and Netty ring buffer event-loop queues.',
    },
    pedagogy: {
      simple: 'A stack is a stack of plates: last plate placed is the first plate taken (LIFO). A queue is a checkout line: first customer in line is the first one served (FIFO).',
      engineer: 'Stacks implement LIFO semantics used for recursive call frames and Dijkstra\'s two-stack arithmetic parsing. Queues implement FIFO semantics essential for asynchronous event loops, implemented via circular ring buffers.',
    },
    narration: 'Week 8 builds high-performance LIFO and FIFO buffers used across operating systems, compilers, and network protocols.',
    capstone: {
      id: 'port_w8_ringbuffer',
      title: 'Circular Ring Buffer Engine',
      description: 'Build a zero-allocation circular queue with head/tail modulo pointers for real-time telemetry streaming.',
    },
    quiz: {
      question: 'In a circular array queue of capacity N using head and tail pointers, how is the next index computed when wrapping around?',
      options: [
        'index = (index + 1) % N',
        'index = index + 1',
        'index = index / N',
        'index = (index - 1) * N',
      ],
      correctIndex: 0,
      explanation: 'The modulo operator `(index + 1) % N` causes index N-1 to wrap cleanly back to 0, recycling array memory without shifting existing elements.',
    },
  },
  {
    week: 9,
    title: 'Associative Data Structures: Hash Tables & Collision Resolution',
    badge: 'Hash Tables',
    tagline: 'Hash functions, bucket arrays, separate chaining, open addressing with linear probing, and load factor',
    accreditedSpec: 'CSC1036 Specification: Topic 5.1 — Hashing Algorithms, Collision Resolution, and Rehashing',
    referencePoint: {
      academic: 'Cormen, T.H. et al. (2022). Introduction to Algorithms (4th Ed.), Chapter 11: Hash Tables. MIT Press.',
      standard: 'FIPS PUB 180-4: Secure Hash Standard (Cryptographic) vs Non-cryptographic Murmur3/xxHash.',
      enterprise: 'Java `HashMap` treeification threshold (converting linked bins to red-black trees when bin count >= 8).',
    },
    pedagogy: {
      simple: 'A hash table is like a giant library where a mathematical formula instantly tells you which shelf holds your book without searching through any other shelves.',
      engineer: 'A hash function maps keys to integer hash codes, reduced to bucket indices via `hash & (capacity - 1)`. Collisions are resolved via separate chaining (linked list / red-black tree buckets) or open addressing (linear/quadratic probing). When the load factor exceeds threshold α (typically 0.75), resizing doubles capacity and rehashes all entries.',
    },
    narration: 'Week 9 demystifies the most heavily utilized data structure in computer science: the O(1) average-time dictionary.',
    capstone: {
      id: 'port_w9_hashmap',
      title: 'Collision Resolution Simulator',
      description: 'Benchmark lookup performance of separate chaining versus linear probing under high load factors.',
    },
    quiz: {
      question: 'Why does Java 8+ convert a `HashMap` collision bucket from a linked list to a Red-Black Tree when its size exceeds 8?',
      options: [
        'To reduce RAM memory consumption',
        'To protect against Denial-of-Service attacks by bounding worst-case lookup time from O(n) to O(log n)',
        'Because trees allow hash tables to be sorted alphabetically',
        'Because linked lists cannot hold more than 8 elements in the JVM',
      ],
      correctIndex: 1,
      explanation: 'If an adversary generates keys with identical hash codes (Hash DoS attack), linear chaining degrades lookups to O(n). Treeifying buckets ensures worst-case performance remains bounded at O(log n).',
    },
  },
  {
    week: 10,
    title: 'Hierarchical Structures: Binary Search Trees (BST)',
    badge: 'Trees',
    tagline: 'Tree node representations, BST invariant, in-order/pre-order/post-order traversals, and deletion',
    accreditedSpec: 'CSC1036 Specification: Topic 5.2 — Tree Topologies, BST Invariants, and Node Deletion Cases',
    referencePoint: {
      academic: 'Sedgewick, R. & Wayne, K. (2011). Algorithms (4th Ed.), Chapter 3.2: Binary Search Trees. Addison-Wesley.',
      standard: 'IEEE 1003.1: File Hierarchy Systems (Directory traversal algorithms).',
      enterprise: 'Database index structures (B+ Trees) and balanced self-balancing AVL / Red-Black implementations.',
    },
    pedagogy: {
      simple: 'A binary search tree arranges numbers like family branches: everything smaller goes to the left, everything larger goes to the right. This lets you cut the search area in half with every step.',
      engineer: 'The BST invariant specifies that for any node X, all keys in left(X) < key(X) and all keys in right(X) > key(X). Deleting a node with two children requires finding its in-order successor (minimum in right subtree) to replace it.',
    },
    narration: 'Week 10 covers non-linear hierarchical data structures, formal tree traversals, and logarithmic search guarantees.',
    capstone: {
      id: 'port_w10_bst',
      title: 'BST 2-Child Deletion Engine',
      description: 'Implement the Hibbard deletion algorithm preserving the BST invariant across arbitrary subtree topologies.',
    },
    quiz: {
      question: 'When deleting a node that possesses two children from a Binary Search Tree, what node should replace it to preserve the BST invariant?',
      options: [
        'The root node of the entire tree',
        'Its in-order successor (the smallest key in its right subtree)',
        'The absolute oldest node allocated on the heap',
        'Any arbitrary leaf node in the left subtree',
      ],
      correctIndex: 1,
      explanation: 'Replacing the deleted node with its in-order successor (the minimum node in its right subtree) guarantees that all remaining left children remain smaller and all right children remain larger.',
    },
  },
  {
    week: 11,
    title: 'Defensive Programming, Exception Hierarchies & Robust I/O',
    badge: 'Reliability',
    tagline: 'Checked vs unchecked exceptions, try-with-resources, AutoCloseable, and robust JSON/stream deserialization',
    accreditedSpec: 'CSC1036 Specification: Topic 6.1 — Error Recovery, Resource Leaks, and Stream Serialization',
    referencePoint: {
      academic: 'Bloch, J. (2018). Effective Java (3rd Ed.), Chapter 10: Exceptions. Addison-Wesley.',
      standard: 'CWE-404: Improper Resource Shutdown or Release (Common Weakness Enumeration).',
      enterprise: 'Standard enterprise file/socket stream safety and Jackson/Gson type serialization.',
    },
    pedagogy: {
      simple: 'When unexpected errors happen (like a missing file or disconnected internet), good code doesn\'t crash; it safely cleans up open files and presents a friendly error message.',
      engineer: 'The `try-with-resources` statement guarantees deterministic invocation of `close()` on `AutoCloseable` resources even when exceptions propagate. Checked exceptions represent recoverable system conditions; unchecked runtime exceptions denote programming defects.',
    },
    narration: 'Week 11 trains students to write crash-proof production code that manages file descriptors and handles corrupt input gracefully.',
    capstone: {
      id: 'port_w11_io',
      title: 'Robust File Parser & Validator',
      description: 'Build a streaming CSV/JSON parser with automatic resource closing and schema validation.',
    },
    quiz: {
      question: 'Why is Java\'s `try-with-resources` statement preferred over manual `finally { resource.close(); }` blocks?',
      options: [
        'It executes resource closing on a separate background thread',
        'It prevents exception suppression where an error inside `close()` hides the primary business exception',
        'It converts all checked exceptions into unchecked exceptions',
        'It allows files to be accessed without requiring read permissions',
      ],
      correctIndex: 1,
      explanation: 'Try-with-resources preserves the primary business exception and attaches closing exceptions as "suppressed" exceptions, preventing the common bug where closing cleanup masks the root cause.',
    },
  },
  {
    week: 12,
    title: 'Portfolio Capstone: Clean Architecture, Git & Portfolio Review',
    badge: 'Portfolio Defense',
    tagline: 'Model-View-Controller (MVC), Git feature branching, pull request reviews, and portfolio submission',
    accreditedSpec: 'CSC1036 Specification: Topic 6.2 — Final Portfolio Synthesis, Code Review Standards, and Architecture Defense',
    referencePoint: {
      academic: 'Fowler, M. (2018). Refactoring: Improving the Design of Existing Code (2nd Ed.). Addison-Wesley.',
      standard: 'ISO/IEC 25010: Systems and Software Quality Requirements and Evaluation (SQuaRE).',
      enterprise: 'Production GitHub / GitLab PR code review standards, linting, and continuous integration.',
    },
    pedagogy: {
      simple: 'A programming portfolio is proof of your skills. In this final week, you synthesize all your classes, data structures, and tests into a clean, well-documented project ready for evaluation.',
      engineer: 'The portfolio synthesis demonstrates separation of concerns (MVC / hexagonal architecture), comprehensive automated unit test coverage (>80%), Git version control hygiene, and clean object-oriented architecture.',
    },
    narration: 'Week 12 culminates in the submission and evaluation of the 30-credit Stage 1 Newcastle University Programming Portfolio.',
    capstone: {
      id: 'port_w12_capstone',
      title: 'Full Portfolio Showcase',
      description: 'Submit the completed, tested, and documented multi-tier software application portfolio.',
    },
    quiz: {
      question: 'In the Model-View-Controller (MVC) architectural pattern, what is the strict responsibility of the Model component?',
      options: [
        'Rendering HTML buttons and graphical user interfaces',
        'Managing business data state, business logic rules, and class invariants independent of the UI',
        'Handling HTTP network socket connections directly from the client',
        'Logging debug messages to the operating system console',
      ],
      correctIndex: 1,
      explanation: 'The Model encapsulates the core domain state, validation logic, and business rules. It has zero coupling to the UI (View) or input dispatchers (Controller).',
    },
  },
];

export const CANVAS_COURSE_METADATA_1036 = {
  courseId: 70334,
  courseCode: 'CSC1036',
  courseName: 'Programming Portfolio',
  academicYear: '2024/25',
  credits: 30,
  term: 'Semester 1 & 2 (Stage 1 Core)',
  faculty: 'Science, Agriculture and Engineering',
  school: 'School of Computing',
  stage: 'Stage 1',
  canvasUrl: 'https://ncl.instructure.com/courses/70334',
  staff: [
    { name: 'Dr. John Colquhoun', role: 'Degree Programme Director & Module Leader', email: 'john.colquhoun@ncl.ac.uk' },
    { name: 'Prof. Graham Morgan', role: 'Professor of Computer Science', email: 'graham.morgan@ncl.ac.uk' },
  ],
  timetable: {
    lectures: 'Tuesdays 11:00 - 13:00 (Curtis Auditorium, Herschel Building)',
    practicals: 'Thursdays 14:00 - 17:00 (Urban Sciences Building, PC Cluster 1.01)',
  },
  recommendedTexts: [
    'Bloch, J. (2018). Effective Java (3rd Ed.). Addison-Wesley.',
    'Sedgewick, R. & Wayne, K. (2011). Algorithms (4th Ed.). Addison-Wesley.',
    'Martin, R.C. (2008). Clean Code: A Handbook of Agile Software Craftsmanship. Prentice Hall.',
  ],
};

export const CANVAS_MODULES_1036: CanvasModuleTopic[] = [
  {
    id: 'port-mod-1',
    moduleNumber: 1,
    title: 'Module 1: Foundations of Object-Oriented Design in Java',
    state: 'active',
    readingReference: 'Bloch (2018), Ch. 2 • JVM Object Headers & Heap Memory',
    associatedWeek: 1,
    items: [
      { id: 'port-mod-1-1', title: 'Lecture 1.1: The JVM Execution Model, Heap vs Stack, and Reference Semantics', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-1-2', title: 'Lecture 1.2: Encapsulation, Immutability, and Invariant Preservation', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-1-3', title: 'Lab Practical 1: Setting up OpenJDK, Gradle, and IDE Tooling', type: 'practical', url: 'https://ncl.instructure.com/courses/70334/modules' },
    ],
  },
  {
    id: 'port-mod-2',
    moduleNumber: 2,
    title: 'Module 2: Contracts, Polymorphism & SOLID Principles',
    state: 'active',
    readingReference: 'Martin (2017) Clean Architecture • Meyer (1997) Subtyping',
    associatedWeek: 4,
    items: [
      { id: 'port-mod-2-1', title: 'Lecture 2.1: Polymorphism, Virtual Method Tables, and Interface Design', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-2-2', title: 'Lecture 2.2: The Five SOLID Principles with Real-World Anti-Patterns', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-2-3', title: 'Lab Practical 2: TDD with JUnit 5 Assertions and Edge-Case Suites', type: 'practical', url: 'https://ncl.instructure.com/courses/70334/modules' },
    ],
  },
  {
    id: 'port-mod-3',
    moduleNumber: 3,
    title: 'Module 3: Linear & Associative Data Structures',
    state: 'active',
    readingReference: 'Sedgewick & Wayne (2011), Ch. 1.3 & 3.4 • Java Collections',
    associatedWeek: 7,
    items: [
      { id: 'port-mod-3-1', title: 'Lecture 3.1: Singly and Doubly Linked Lists vs Contiguous Arrays', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-3-2', title: 'Lecture 3.2: Stacks, Queues, and Hash Tables with Collision Strategies', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-3-3', title: 'Lab Practical 3: Implementing a Resizable Hash Map from Scratch', type: 'practical', url: 'https://ncl.instructure.com/courses/70334/modules' },
    ],
  },
  {
    id: 'port-mod-4',
    moduleNumber: 4,
    title: 'Module 4: Trees, Streams, Defensive I/O & Portfolio Synthesis',
    state: 'active',
    readingReference: 'Fowler (2018) Refactoring • ISO/IEC 25010 Quality Metrics',
    associatedWeek: 10,
    items: [
      { id: 'port-mod-4-1', title: 'Lecture 4.1: Binary Search Trees, Traversals, and Deletion Cases', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-4-2', title: 'Lecture 4.2: Defensive I/O, Serialization, and MVC Architectural Cleanliness', type: 'lecture', url: 'https://ncl.instructure.com/courses/70334/modules' },
      { id: 'port-mod-4-3', title: 'Lab Practical 4: Final Portfolio Git Submission & Architecture Review', type: 'practical', url: 'https://ncl.instructure.com/courses/70334/modules' },
    ],
  },
];

export const EXAM_QUESTIONS_1036: { A: ExamQuestion[]; B: ExamQuestion[] } = {
  A: [
    {
      id: 'q1036-a1',
      section: 'A',
      title: 'Question 1: Object References, Immutability & Defensive Copying',
      marks: 15,
      scenario: 'You are tasked with designing a secure `StudentRegistration` class containing student ID, name, and a list of enrolled `Course` objects.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Explain what happens if the getter `public List<Course> getCourses()` returns the internal private `courses` list reference directly. Provide the code modification needed to preserve encapsulation.',
          marks: 7,
          markingCriteria: [
            '3 marks: Identifying that returning the internal reference allows external callers to mutate the list via .add() or .clear() without class knowledge.',
            '4 marks: Correct implementation returning `Collections.unmodifiableList(courses)` or `new ArrayList<>(courses)`.',
          ],
          modelAnswer: 'If `getCourses()` returns the direct reference, the caller can execute `reg.getCourses().clear()`, mutating the internal state of `StudentRegistration` and violating its invariants.\n\nTo preserve encapsulation, return an unmodifiable wrapper or a defensive copy:\n```java\npublic List<Course> getCourses() {\n    return Collections.unmodifiableList(courses);\n    // or: return new ArrayList<>(courses);\n}\n```',
        },
        {
          part: '(b)',
          prompt: 'Contrast the memory allocation and lifecycle of a primitive `int` variable versus an `Integer` object reference in the Java memory model.',
          marks: 8,
          markingCriteria: [
            '4 marks: Primitive `int` stores raw 32-bit binary directly in stack frame; no object header, no dereferencing.',
            '4 marks: `Integer` allocates heap object containing 16-byte object header and 4-byte payload; reference on stack points to heap address; incurs GC overhead and unboxing costs.',
          ],
          modelAnswer: '1. Primitive `int`: A raw 32-bit two\'s-complement numeric value allocated directly within the executing method\'s call stack frame. Incurs zero heap overhead, zero pointer indirection, and is discarded immediately when the stack frame pops.\n2. `Integer` object: A full object allocated dynamically on the heap. In a 64-bit JVM, it consumes 16-24 bytes (12-byte Mark/Klass word object header + 4-byte int payload + padding). The stack stores an 8-byte reference address pointing to this heap allocation. Access requires memory dereferencing and triggers Garbage Collection cycles upon deallocation.',
        },
      ],
    },
  ],
  B: [
    {
      id: 'q1036-b1',
      section: 'B',
      title: 'Question 2: Hash Table Collisions & Binary Search Tree Deletion',
      marks: 15,
      scenario: 'A software system uses a hash table of size M = 7 with hash function h(k) = k mod 7. Keys 10, 17, 24, and 31 are inserted sequentially.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Trace the insertion of keys 10, 17, 24, 31 under (i) Separate Chaining and (ii) Open Addressing with Linear Probing. State the bucket index of key 31 in both cases.',
          marks: 8,
          markingCriteria: [
            '2 marks: Correct computation of h(k): 10%7=3, 17%7=3, 24%7=3, 31%7=3 (all collide at bucket 3).',
            '3 marks: Separate Chaining: all four keys appended to bucket 3 linked list; key 31 is at bucket 3.',
            '3 marks: Linear Probing: 10 goes to [3], 17 probes to [4], 24 probes to [5], 31 probes to [6]; key 31 is at bucket 6.',
          ],
          modelAnswer: 'Hash values: 10%7 = 3; 17%7 = 3; 24%7 = 3; 31%7 = 3. All keys hash to bucket 3.\n\n(i) Separate Chaining:\nAll elements reside in the linked list at bucket 3:\nBucket 3 -> [10] -> [17] -> [24] -> [31]\nKey 31 resides at bucket index 3.\n\n(ii) Linear Probing (open addressing):\n- Insert 10: slot [3] is free -> placed in [3].\n- Insert 17: slot [3] occupied -> probes [4] (free) -> placed in [4].\n- Insert 24: slot [3] occupied -> probes [4] (occupied) -> probes [5] (free) -> placed in [5].\n- Insert 31: slot [3] occupied -> probes [4] -> probes [5] -> probes [6] (free) -> placed in [6].\nKey 31 resides at bucket index 6.',
        },
        {
          part: '(b)',
          prompt: 'Describe the algorithmic steps required to delete a node with two children from a Binary Search Tree (BST), explaining why this maintains the BST invariant.',
          marks: 7,
          markingCriteria: [
            '3 marks: Locate the node\'s in-order successor (the minimum node in its right subtree) or in-order predecessor.',
            '2 marks: Copy the successor\'s key/value into the node to be deleted.',
            '2 marks: Recursively delete the successor node from the right subtree (which has at most one child).',
          ],
          modelAnswer: 'When deleting a node Z with two non-null children:\n1. Find Z\'s in-order successor Y, which is the leftmost node in Z\'s right subtree (the smallest key strictly greater than Z.key).\n2. Note that Y cannot have a left child (otherwise it would not be minimal in that subtree); it has at most a right child.\n3. Copy Y\'s key and satellite data into node Z.\n4. Delete node Y from Z\'s right subtree by linking Y\'s parent directly to Y\'s right child.\n\nWhy this preserves the BST invariant:\nBecause Y is greater than all nodes in Z\'s left subtree, and smaller than all remaining nodes in Z\'s right subtree, placing Y at Z satisfies the BST order property across all branches.',
        },
      ],
    },
  ],
};
