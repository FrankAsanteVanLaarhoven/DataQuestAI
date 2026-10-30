/**
 * CSC2033: Software Engineering Team Project Curriculum Specification
 * Newcastle University • School of Computing • Stage 2 Core Module (30 Credits)
 * Canvas Course ID: 53978
 * Direct Canvas URL: https://ncl.instructure.com/courses/53978
 * Accredited Syllabus Specification with Academic References, ISO/IEC/IEEE Standards & Engineering Benchmarks.
 * Organized in standard 12-Week Semester Sequence across Professional Engineering, Lifecycles, and Toolchains.
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';

export const CSC2033_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Software Engineering Lifecycles & Agile Team Organization',
    badge: 'Agile & Team Dynamics',
    tagline: 'Waterfall vs Agile, Scrum sprints, standups, sprint retrospectives, and team role allocation',
    accreditedSpec: 'CSC2033 Specification: Topic 1.1 — Software Lifecycle Models, Agile Frameworks, and Team Dynamics',
    referencePoint: {
      academic: 'Sommerville, I. (2015). Software Engineering (10th Ed.), Chapters 2 & 3. Pearson.',
      standard: 'ISO/IEC/IEEE 12207:2017 Systems and software engineering — Software life cycle processes.',
      enterprise: 'Scrum Alliance & Atlassian Agile Coach: Sprint ceremonies, Jira backlog management, and team charters.',
    },
    pedagogy: {
      simple: 'Building software in a team is completely different from coding alone in your bedroom! Waterfall planned everything years in advance and failed when requirements changed. Agile breaks work into 2-week mini-projects called Sprints, where teams build, test, and show real software to users every fortnight.',
      engineer: 'The traditional linear Waterfall model imposes rigid phase gates (Requirements -> Design -> Implementation -> Verification -> Maintenance), creating high risk when requirements evolve. Agile methodologies (Scrum, Kanban) emphasize iterative empirical process control: Transparency, Inspection, and Adaptation via fixed timeboxed Sprints, Daily Scrum standups, Sprint Planning, and Retrospectives.',
    },
    narration: 'Week 1 launches the Software Engineering Team Project. We contrast predictive Waterfall lifecycles against adaptive Agile Scrum, establish cross-functional team roles (Product Owner, Scrum Master, Developers), and draft our initial team working agreements.',
    capstone: {
      id: 'cap_scrum_sprint_board',
      title: 'Interactive Agile Sprint Board & Story Point Estimator',
      description: 'Manage a team product backlog, estimate story points using Planning Poker Fibonacci scales, and track team velocity across a simulated 2-week sprint.',
    },
    quiz: {
      question: 'In Scrum Agile methodology, what is the primary purpose of the Sprint Retrospective meeting?',
      options: [
        'For the team to inspect how the last sprint went with regards to individuals, interactions, processes, and tools, and identify actionable improvements for the next sprint',
        'To demonstrate working software features to external customer stakeholders',
        'To fire the lowest performing software developer on the team',
        'To write detailed UML diagrams for the entire upcoming year',
      ],
      correctIndex: 0,
      explanation: 'The Sprint Retrospective occurs at the end of every sprint for the team to reflect on team dynamics, processes, and toolchains, agreeing on concrete improvements to implement immediately in the following sprint.',
    },
  },
  {
    week: 2,
    title: 'Requirements Engineering, User Stories & Acceptance Criteria',
    badge: 'Requirements & BDD',
    tagline: 'Functional vs non-functional requirements, User Stories (INVEST), and Given-When-Then BDD acceptance criteria',
    accreditedSpec: 'CSC2033 Specification: Topic 1.2 — Requirements Elicitation, INVEST Criteria, and Behavior-Driven Development',
    referencePoint: {
      academic: 'Pressman, R.S. & Maxim, B.R. (2020). Software Engineering: A Practitioner’s Approach (9th Ed.), Chapter 8. McGraw-Hill.',
      standard: 'ISO/IEC/IEEE 29148:2018 Systems and software engineering — Life cycle processes — Requirements engineering.',
      enterprise: 'Gherkin Syntax (Cucumber) for executable Behavior-Driven Development (BDD) specification.',
    },
    pedagogy: {
      simple: 'If you don’t know what you are building, you will build the wrong thing perfectly! A User Story explains WHO wants a feature, WHAT they want, and WHY ("As a student, I want to renew books online, so I avoid late fines"). We write Acceptance Criteria so everyone agrees on when it is finished.',
      engineer: 'Requirements must be partitioned into Functional (system capabilities) and Non-Functional (FURPS+: Performance, Reliability, Security, Usability). Agile user stories follow the INVEST acronym: Independent, Negotiable, Valuable, Estimable, Small, and Testable. Acceptance criteria are codified in BDD Given-When-Then Gherkin syntax, translating directly into executable automated test suites.',
    },
    narration: 'In Week 2, we master Requirements Engineering. We decompose ambiguous stakeholder briefs into precise User Stories using the INVEST criteria, establish non-functional service level expectations, and write unambiguous Given-When-Then acceptance criteria.',
    capstone: {
      id: 'cap_bdd_story_creator',
      title: 'Interactive User Story Builder & Gherkin BDD Generator',
      description: 'Author user stories meeting INVEST criteria, write formal Given-When-Then acceptance tests, and validate automated requirement traceability.',
    },
    quiz: {
      question: 'What does the "I" stand for in the Agile user story quality acronym INVEST?',
      options: [
        'Independent (the user story can be developed, tested, and delivered without blocking or depending tightly on other stories)',
        'Immediate (the user story must be completed today)',
        'Iterative (the user story must be rewritten every day)',
        'Integrated (the user story must touch all system databases)',
      ],
      correctIndex: 0,
      explanation: 'INVEST stands for Independent, Negotiable, Valuable, Estimable, Small, and Testable. Independence allows teams to schedule and prioritize stories in any order without cascading dependencies.',
    },
  },
  {
    week: 3,
    title: 'Software Architecture & UML Structural Modeling',
    badge: 'UML Structural Design',
    tagline: 'Three-tier architecture, UML Class Diagrams, associations, aggregations, compositions, and multiplicity',
    accreditedSpec: 'CSC2033 Specification: Topic 2.1 — Architectural Design, Separation of Concerns, and UML Class Diagrams',
    referencePoint: {
      academic: 'Fowler, M. (2003). UML Distilled: A Brief Guide to the Standard Object Modeling Language (3rd Ed.). Addison-Wesley.',
      standard: 'OMG Unified Modeling Language (OMG UML) Version 2.5.1 Specification (ISO/IEC 19505).',
      enterprise: 'C4 Model (Context, Containers, Components, Code) for distributed cloud architectures.',
    },
    pedagogy: {
      simple: 'Before architects build a skyscraper, they draw blueprints. In software engineering, UML Class Diagrams are our blueprints! They show the boxes (classes), their attributes and actions (methods), and the lines connecting them (like a Car having an Engine).',
      engineer: 'Architectural design enforces the Separation of Concerns across Presentation, Business Logic, and Data Access tiers. In UML 2.5 Class Diagrams, structural relationships are rigorously defined: Association (bidirectional/unidirectional relationship), Aggregation (weak "has-a" relationship where parts can exist independently, hollow diamond), and Composition (strong "part-of" relationship with coincident lifecycles, filled diamond), marked with precise cardinality multiplicities.',
    },
    narration: 'Week 3 dives into software architecture and structural modeling. We apply multi-tier architectural patterns, construct rigorous UML 2.5 class diagrams, and analyze object lifecycle coupling between aggregation and composition.',
    capstone: {
      id: 'cap_uml_class_modeler',
      title: 'Interactive UML 2.5 Class Diagram Architect & Code Generator',
      description: 'Design class diagrams with inheritance, aggregation, and composition relationships, enforce correct multiplicity rules, and export TypeScript / Java boilerplates.',
    },
    quiz: {
      question: 'In UML Class Diagrams, what is the fundamental semantic difference between Aggregation (hollow diamond) and Composition (filled diamond)?',
      options: [
        'In Composition, the child part belongs exclusively to the parent and cannot survive the destruction of the parent; in Aggregation, the child part can exist independently',
        'Aggregation is only used for database tables, while Composition is used for web pages',
        'Composition represents an "is-a" inheritance relationship, while Aggregation is an interface',
        'There is no semantic difference; both are interchangeable aesthetic styling options',
      ],
      correctIndex: 0,
      explanation: 'Composition (solid black diamond) represents strong ownership with coincident lifecycles: if the whole is destroyed, the parts are destroyed (e.g. Building and Rooms). Aggregation (hollow diamond) represents a weak container relationship where parts can survive independently (e.g. University and Students).',
    },
  },
  {
    week: 4,
    title: 'UML Behavioral Modeling: Sequence & State Diagrams',
    badge: 'UML Behavioral Design',
    tagline: 'Dynamic interaction modeling, UML Sequence Diagrams, lifelines, activation bars, and State Machines',
    accreditedSpec: 'CSC2033 Specification: Topic 2.2 — Behavioral Interaction Modeling, Message Flow, and Statecharts',
    referencePoint: {
      academic: 'Booch, G., Rumbaugh, J., & Jacobson, I. (2005). The Unified Modeling Language User Guide (2nd Ed.). Addison-Wesley.',
      standard: 'OMG UML 2.5.1 Interaction & State Machine Specifications.',
      enterprise: 'Mermaid.js and PlantUML automated diagram generation from documentation repositories.',
    },
    pedagogy: {
      simple: 'While a Class Diagram shows the parts of a car parked in the garage, a Sequence Diagram shows the car driving down the road! It shows who speaks to whom and in what order: Customer presses button -> Checkout talks to Bank -> Bank sends confirmation.',
      engineer: 'Sequence Diagrams model dynamic time-ordered message exchanges across collaborating object lifelines. Messages include Synchronous calls (solid line, filled arrowhead), Asynchronous signals (open arrowhead), and Reply returns (dashed line). Combined fragments (alt for conditionals, loop for iterations, opt for optional branches) model complex control flow. State Machine diagrams model finite state automations (FSM) governed by events, guards, and transition actions.',
    },
    narration: 'In Week 4, we examine dynamic behavioral modeling. We map asynchronous request flows onto UML Sequence Diagrams with lifelines and combined fragments, model reactive systems with State Machine diagrams, and translate sequences into system wireframes.',
    capstone: {
      id: 'cap_sequence_visualizer',
      title: 'Interactive UML Sequence & State Machine Engine',
      description: 'Trace synchronous and asynchronous message exchanges between client, API gateway, authentication service, and database, modeling combined fragments.',
    },
    quiz: {
      question: 'In a UML Sequence Diagram, what does a dashed return line with an open arrow represent?',
      options: [
        'A return message answering a previous synchronous call',
        'An unhandled exception error that crashed the thread',
        'An asynchronous fire-and-forget background notification',
        'The permanent destruction of the object lifeline',
      ],
      correctIndex: 0,
      explanation: 'In UML sequence notation, dashed arrows represent return messages (replies) sent back from the callee to the caller after completing a synchronous operation.',
    },
  },
  {
    week: 5,
    title: 'Version Control Workflows: Git Trunk-Based Development',
    badge: 'Git & Collaboration',
    tagline: 'Git DAG, commits, branches, rebase vs merge, merge conflict resolution, and Trunk-Based Development',
    accreditedSpec: 'CSC2033 Specification: Topic 3.1 — Distributed Version Control, Directed Acyclic Graph (DAG), and Trunk-Based Workflows',
    referencePoint: {
      academic: 'Chacon, S. & Straub, B. (2014). Pro Git (2nd Ed.). Apress.',
      standard: 'Git object format specifications (blobs, trees, commits, tags) & SHA-1 / SHA-256 cryptographic trees.',
      enterprise: 'Google & Meta Trunk-Based Development with Short-Lived Feature Branches and Feature Flags.',
    },
    pedagogy: {
      simple: 'Git is a magical time machine for your team’s code! It saves snapshots of the project at every step. If you make a mistake, you can jump back in time. When five students write code together, Git merges their changes so nobody accidentally deletes a teammate’s work.',
      engineer: 'Git stores project history as an immutable cryptographic Directed Acyclic Graph (DAG) of commit objects referencing trees and blobs. Feature-branching paradigms with long lifecycles create "merge hell." High-performing teams utilize Trunk-Based Development: small, frequent commits merged into main daily, verified by automated CI, with unfinished features shielded behind runtime Feature Flags.',
    },
    narration: 'Week 5 focuses on collaborative Git workflows. We inspect the underlying Git object DAG, practice 3-way merge conflict resolution, evaluate merge versus rebase histories, and adopt trunk-based development with short-lived feature branches.',
    capstone: {
      id: 'cap_git_conflict_lab',
      title: 'Interactive Git DAG Visualizer & 3-Way Merge Conflict Workbench',
      description: 'Simulate concurrent teammate commits on colliding lines of code, inspect the Git commit DAG, execute 3-way merges, and resolve conflicts cleanly.',
    },
    quiz: {
      question: 'What is the primary advantage of Trunk-Based Development compared to traditional long-lived GitFlow feature branches?',
      options: [
        'Developers merge small batches of code into main frequently, preventing large conflicting branch divergences and catastrophic merge conflicts',
        'Trunk-Based Development does not require software testing',
        'It allows developers to push code directly to production without a code review',
        'It reduces the disk space of the Git repository by 90%',
      ],
      correctIndex: 0,
      explanation: 'By keeping branches short-lived (hours or 1-2 days) and integrating into the main trunk frequently, teams avoid massive diverging branches that cause painful, risky merge conflicts.',
    },
  },
  {
    week: 6,
    title: 'Automated Testing, Test-Driven Development (TDD) & Mocking',
    badge: 'Testing & TDD',
    tagline: 'The Test Pyramid, Unit vs Integration vs E2E, Red-Green-Refactor cycle, and Test Doubles (Mocks, Stubs)',
    accreditedSpec: 'CSC2033 Specification: Topic 3.2 — The Test Pyramid, Test-Driven Development (TDD), and Test Doubles',
    referencePoint: {
      academic: 'Beck, K. (2002). Test-Driven Development: By Example. Addison-Wesley Professional.',
      standard: 'ISO/IEC/IEEE 29119:2022 Software and systems engineering — Software testing (Unit, Integration, System).',
      enterprise: 'Martin Fowler’s Test Pyramid (Unit, Service/Integration, UI) & Jest / Vitest / Mockito frameworks.',
    },
    pedagogy: {
      simple: 'Would you fly on a plane whose autopilot was never tested? Test-Driven Development (TDD) flips coding on its head: write the test FIRST (Red), write just enough code to pass the test (Green), and then clean up your code (Refactor). Mocks let you test without charging a real credit card!',
      engineer: 'The Test Pyramid dictates an optimal distribution: high-volume, sub-millisecond Unit Tests at the base; mid-tier Integration Tests verifying subsystem boundaries; and lean End-to-End (E2E) tests at the apex. TDD follows the Red-Green-Refactor cadence. Test Doubles (Meszaros taxonomy) isolate units under test: Dummies, Stubs (canned answers), Spies (recording invocations), and Mocks (pre-programmed expectations).',
    },
    narration: 'In Week 6, we examine automated testing. We construct unit test suites following the Red-Green-Refactor rhythm, measure statement and branch code coverage, isolate external database dependencies using test stubs and mocks, and calculate test pyramid ratios.',
    capstone: {
      id: 'cap_tdd_test_runner',
      title: 'Interactive TDD Red-Green-Refactor Suite & Mocking Sandbox',
      description: 'Implement an algorithmic scoring function using strict TDD: watch unit tests fail (Red), implement code to pass (Green), and refactor with automated coverage metrics.',
    },
    quiz: {
      question: 'In the Red-Green-Refactor cycle of Test-Driven Development, what is the specific objective during the "Green" phase?',
      options: [
        'Write the minimum amount of production code necessary to make the failing test pass',
        'Optimize code execution performance using multi-threading',
        'Refactor the database schema to third normal form',
        'Deploy the code to the live production server',
      ],
      correctIndex: 0,
      explanation: 'During the Green phase, the developer writes only the simplest code required to satisfy the failing test. Cleaning up, removing duplication, and improving design happens afterwards during the Refactor phase.',
    },
  },
  {
    week: 7,
    title: 'Continuous Integration & The Automated Andon Cord Pipeline',
    badge: 'CI & Andon Cord',
    tagline: 'CI runners, GitHub Actions, automated builds, linters, pre-commit hooks, and the Toyota Andon Cord principle',
    accreditedSpec: 'CSC2033 Specification: Topic 4.1 — Continuous Integration Pipelines, Automated Quality Gates, and Build Failure Protocols',
    referencePoint: {
      academic: 'Humble, J. & Farley, D. (2010). Continuous Delivery: Reliable Software Releases through Build, Test, and Deployment Automation. Addison-Wesley.',
      standard: 'ISO/IEC 25010: Systems and software quality requirements and evaluation (SQuaRE) — Quality models.',
      enterprise: 'Toyota Production System (TPS) Andon Cord principle & GitHub Actions declarative CI/CD pipelines.',
    },
    pedagogy: {
      simple: 'In Japanese car factories, any worker who sees a loose bolt pulls a physical rope called the Andon Cord to STOP the entire assembly line until it is fixed! In software engineering, Continuous Integration (CI) is our digital Andon Cord: if a test fails or someone leaves a secret key in code, the pipeline stops immediately and blocks the release.',
      engineer: 'Continuous Integration automatically builds, tests, and validates every commit against quality gates. The pipeline executes: 1) Syntax verification & linting (ESLint, Prettier); 2) Static Application Security Testing (SAST secret scanning); 3) Automated unit and integration test suites; 4) Build artifact bundling. A single failure "pulls the Andon Cord," halting the pipeline, notifying the team, and blocking trunk integration until remediated.',
    },
    narration: 'Week 7 introduces the Automated Andon Cord. We configure GitHub Actions declarative YAML pipelines, integrate pre-commit linters and secret scanners, and observe what happens when a failing test or security vulnerability triggers an automated pipeline halt.',
    capstone: {
      id: 'cap_ci_andon_cord',
      title: 'Interactive Continuous Integration Pipeline & Andon Cord Simulator',
      description: 'Simulate a live CI pipeline: commit changes, watch automated linting, test suites, and secret scanning stages execute, and trigger the Andon Cord on injected bugs.',
    },
    quiz: {
      question: 'What is the core principle of the "Andon Cord" when applied to modern Continuous Integration software pipelines?',
      options: [
        'When an automated test or quality check fails, the pipeline halts immediately, alerting the entire team to fix the issue before any further code is merged',
        'It automatically charges developers a monetary fine when they break the build',
        'It automatically rewires all database connections to point to a backup server',
        'It compresses code into a zip file and sends it to the lecturer via email',
      ],
      correctIndex: 0,
      explanation: 'Originating in Toyota lean manufacturing, the Andon Cord halts the entire assembly line when an anomaly is detected. In CI, a failing build immediately halts the pipeline and blocks deployment until the defect is resolved.',
    },
  },
  {
    week: 8,
    title: 'Software Design Patterns & Object-Oriented Principles (SOLID)',
    badge: 'Design Patterns & SOLID',
    tagline: 'Gang of Four (GoF) patterns, Factory, Observer, Strategy, Adapter, and the SOLID principles',
    accreditedSpec: 'CSC2033 Specification: Topic 4.2 — Object-Oriented Design Patterns (GoF) and SOLID Architectural Principles',
    referencePoint: {
      academic: 'Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). Design Patterns: Elements of Reusable Object-Oriented Software. Addison-Wesley.',
      standard: 'Robert C. Martin (2002) Agile Software Development, Principles, Patterns, and Practices (SOLID).',
      enterprise: 'Reactive event emitters (Observer), pluggable database drivers (Strategy/Adapter), and dependency injection containers.',
    },
    pedagogy: {
      simple: 'Software engineers don’t reinvent the wheel every day! Design Patterns are time-tested solutions to common programming puzzles. The Observer pattern is like a YouTube notification bell: when the channel posts a video, all subscribers are notified automatically. The Strategy pattern lets you swap payment methods (Card, PayPal, Apple Pay) without rewriting your shop.',
      engineer: 'SOLID principles guide maintainable OOP design: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. GoF patterns solve recurring structural and behavioral challenges: Creational (Factory Method, Abstract Factory, Singleton), Structural (Adapter, Decorator, Facade), and Behavioral (Observer, Strategy, Command).',
    },
    narration: 'In Week 8, we master OOP design patterns. We analyze SOLID violations, refactor tightly-coupled code into decoupled modules using the Strategy and Observer patterns, and implement pluggable adapter interfaces.',
    capstone: {
      id: 'cap_design_pattern_lab',
      title: 'Interactive SOLID Principle Refactoring & Pattern Studio',
      description: 'Detect code smells violating Single Responsibility and Open/Closed principles, refactoring tightly-coupled monolithic code using the Strategy and Observer patterns.',
    },
    quiz: {
      question: 'Which SOLID principle states that "software entities should be open for extension, but closed for modification"?',
      options: [
        'The Open/Closed Principle (OCP)',
        'The Single Responsibility Principle (SRP)',
        'The Liskov Substitution Principle (LSP)',
        'The Dependency Inversion Principle (DIP)',
      ],
      correctIndex: 0,
      explanation: 'The Open/Closed Principle (OCP) states that you should be able to add new functionality to a system (extend it) without modifying existing, tested source code (e.g. by adding new subclasses or strategies).',
    },
  },
  {
    week: 9,
    title: 'Code Review Culture, Static Analysis & Technical Debt',
    badge: 'Code Review & Quality',
    tagline: 'Pull Request reviews, code smell taxonomy, SonarQube cyclomatic complexity, and Technical Debt payoff',
    accreditedSpec: 'CSC2033 Specification: Topic 5.1 — Peer Code Review Protocols, Static Code Analysis, and Technical Debt Management',
    referencePoint: {
      academic: 'Fagan, M.E. (1976). Design and Code Inspections to Reduce Errors in Program Development. IBM Systems Journal, 15(3), pp. 182–211.',
      standard: 'IEEE Std 1028-2008: IEEE Standard for Software Reviews and Audits.',
      enterprise: 'Google Engineering Practices: Code Review Developer Guide & SonarQube Clean as You Code methodology.',
    },
    pedagogy: {
      simple: 'Never merge code that nobody else has read! A Code Review is like having a friend proofread your essay before turning it in. Technical Debt is like financial debt: taking shortcuts makes you fast today, but the interest piles up until your software is too messy to change.',
      engineer: 'Peer code reviews improve code quality, share domain knowledge, and identify security defects before production. Static analysis tools compute Cyclomatic Complexity (McCabe metric) and maintainability indexes. Technical Debt (Ward Cunningham metaphor) distinguishes deliberate architectural compromises from inadvertent code degradation, requiring proactive debt refactoring in sprint backlogs.',
    },
    narration: 'Week 9 explores professional engineering quality culture. We study peer code review protocols, establish empathetic feedback rubrics, analyze cyclomatic complexity metrics using automated static analyzers, and manage technical debt backlogs.',
    capstone: {
      id: 'cap_code_review_studio',
      title: 'Interactive Peer Code Review Simulator & Complexity Analyzer',
      description: 'Review simulated pull requests, identify security bugs and code smells, compute McCabe cyclomatic complexity, and draft professional review feedback.',
    },
    quiz: {
      question: 'What does Cyclomatic Complexity measure in software engineering?',
      options: [
        'The number of linearly independent execution paths through a program’s source code',
        'The total physical size of the source code file in kilobytes',
        'The time it takes to compile the application',
        'The number of database tables connected to the application',
      ],
      correctIndex: 0,
      explanation: 'Developed by Thomas McCabe, Cyclomatic Complexity measures the number of decision points (if, while, for, switch) in code, reflecting the minimum number of test cases required to achieve complete branch coverage.',
    },
  },
  {
    week: 10,
    title: 'Release Engineering, Semantic Versioning & Deployment Strategies',
    badge: 'Release & Deployment',
    tagline: 'Semantic Versioning (SemVer), Blue-Green deployments, Canary releases, and Feature Flags',
    accreditedSpec: 'CSC2033 Specification: Topic 5.2 — Software Release Engineering, Semantic Versioning (SemVer), and Zero-Downtime Deployment',
    referencePoint: {
      academic: 'Forsgren, N., Humble, J., & Kim, G. (2018). Accelerate: The Science of Lean Software and DevOps, Chapter 4. IT Revolution Press.',
      standard: 'Semantic Versioning 2.0.0 (SemVer: MAJOR.MINOR.PATCH) Specification.',
      enterprise: 'LaunchDarkly feature flag management & Kubernetes rolling updates and blue-green load balancer switching.',
    },
    pedagogy: {
      simple: 'How do apps like Instagram update without kicking off millions of active users? By using zero-downtime deployments! In a Blue-Green deployment, you build the new version on an identical standby server (Green) and flip the traffic switch instantly when it is ready. If something goes wrong, you flip it right back!',
      engineer: 'Modern release engineering decouples Deployment (installing code on infrastructure) from Release (exposing features to users). Semantic Versioning specifies MAJOR (breaking API changes), MINOR (backward-compatible features), and PATCH (backward-compatible bug fixes). Advanced deployment patterns (Blue-Green, Canary traffic weighting, Rolling Updates) ensure zero user downtime, paired with runtime Feature Flags for instant kill-switch rollbacks.',
    },
    narration: 'In Week 10, we examine release engineering. We version libraries following Semantic Versioning rules, orchestrate Blue-Green router switches with zero downtime, configure Canary traffic ramps, and implement dynamic feature flag toggles.',
    capstone: {
      id: 'cap_blue_green_deployer',
      title: 'Interactive Blue-Green Deployment & Canary Release Switcher',
      description: 'Simulate zero-downtime deployments: deploy to Green environment, route 10% Canary traffic, monitor error rates, and execute an instantaneous rollback.',
    },
    quiz: {
      question: 'Under Semantic Versioning (SemVer 2.0.0), which version number component MUST be incremented when introducing backward-incompatible API changes?',
      options: [
        'The MAJOR version number (e.g. 2.0.0 -> 3.0.0)',
        'The MINOR version number (e.g. 1.2.0 -> 1.3.0)',
        'The PATCH version number (e.g. 1.0.1 -> 1.0.2)',
        'The BUILD metadata tag',
      ],
      correctIndex: 0,
      explanation: 'Under SemVer, MAJOR version must be incremented when incompatible API changes are introduced; MINOR is incremented for backward-compatible features; and PATCH is for backward-compatible bug fixes.',
    },
  },
  {
    week: 11,
    title: 'Team Velocity, Burndown Charts & Risk Management',
    badge: 'Velocity & Risk',
    tagline: 'Velocity tracking, sprint burndown charts, scope creep, risk registers, and Trade Fair demo prep',
    accreditedSpec: 'CSC2033 Specification: Topic 6.1 — Project Tracking Metrics, Burndown Trajectories, and Trade Fair Demonstration Logistics',
    referencePoint: {
      academic: 'Cohn, M. (2005). Agile Estimating and Planning. Prentice Hall.',
      standard: 'Project Management Institute (PMI) PMBOK Guide: Project Risk Management.',
      enterprise: 'Jira Software sprint reports, cumulative flow diagrams, and stakeholder trade fair presentations.',
    },
    pedagogy: {
      simple: 'How do you know if your team will finish before the deadline? A Burndown Chart shows the remaining work sloping down toward zero day by day. If the line is flat, you have a problem! Managing risks means spotting potential roadblocks early so they don’t surprise you on demonstration day.',
      engineer: 'Team Velocity measures the number of accepted story points delivered per sprint, providing empirical data for future capacity forecasting. Sprint Burndown charts plot remaining estimated story points against calendar days; upward spikes diagnose unmanaged Scope Creep. Risk Management maintains an authoritative Risk Matrix evaluating Probability vs Impact with concrete contingency mitigations.',
    },
    narration: 'Week 11 focuses on project delivery metrics and trade fair preparation. We analyze sprint burndown trajectories, compute team velocity baselines, evaluate risk registers, and prepare our live trade fair demonstration technical pitch.',
    capstone: {
      id: 'cap_burndown_velocity_sim',
      title: 'Interactive Sprint Burndown Chart & Velocity Forecaster',
      description: 'Simulate daily team standup task completions, diagnose scope creep spikes on burndown charts, and forecast project completion dates based on historical velocity.',
    },
    quiz: {
      question: 'On a Sprint Burndown Chart, what does an unexpected sharp upward step in the remaining work curve indicate?',
      options: [
        'Scope creep: new user stories or requirements were added into the active sprint backlog after sprint planning',
        'The team completed all user stories ahead of schedule',
        'The server crashed and deleted the source code',
        'The sprint duration was reduced by the Scrum Master',
      ],
      correctIndex: 0,
      explanation: 'A burndown chart plots remaining work. An upward jump indicates that new work (unplanned stories or scope creep) was injected into the sprint backlog mid-sprint, increasing total remaining effort.',
    },
  },
  {
    week: 12,
    title: 'Trade Fair Demonstration, Retrospective & Capstone Showcase',
    badge: 'Team Showcase Capstone',
    tagline: 'Technical trade fair demo, customer value proposition, peer evaluation, and end-to-end team retrospective',
    accreditedSpec: 'CSC2033 Specification: Topic 6.2 — Final Product Delivery, Trade Fair Demonstration, and Team Retrospective Analysis',
    referencePoint: {
      academic: 'Kerth, N.L. (2001). Project Retrospectives: A Handbook for Team Reviews. Dorset House Publishing.',
      standard: 'ISO/IEC/IEEE 29119-3: Test documentation (Final Test Summary Report).',
      enterprise: 'TechCrunch Disrupt style trade fair showcases, investor demo days, and final team post-mortems.',
    },
    pedagogy: {
      simple: 'You made it to Demo Day! Today, your team presents your working software at the Newcastle University Trade Fair. You will showcase your working product to lecturers, industry judges, and fellow students, demonstrating how teamwork transformed an idea into real software.',
      engineer: 'The CSC2033 capstone culminates in the public Trade Fair demonstration. Teams pitch their software solution, defend architectural decisions, walk through automated CI test evidence, and demonstrate live product features. Following the showcase, the team conducts a comprehensive Project Retrospective: analyzing what went well, what could be improved, and compiling individual peer contribution assessments.',
    },
    narration: 'Welcome to the CSC2033 Capstone Showcase. We present our team software systems to Newcastle faculty and industry judges, demonstrate working live code backed by green CI/CD pipelines, and conduct our final engineering post-mortem.',
    capstone: {
      id: 'cap_trade_fair_showcase',
      title: 'Interactive Trade Fair Demo Pitch & Team Post-Mortem Workbench',
      description: 'Present the team software engineering portfolio, evaluate CI build telemetry, defend UML architectural choices, and complete the final team retrospective.',
    },
    quiz: {
      question: 'What is the primary objective of a project post-mortem / final team retrospective following software delivery?',
      options: [
        'To systematically review the project’s successes, failures, processes, and team dynamics so lessons learned can be applied to improve future engineering endeavors',
        'To assign blame and punish individual team members for bugs found during the demo',
        'To delete all documentation and version control history',
        'To convert all code into a single binary executable',
      ],
      correctIndex: 0,
      explanation: 'A project retrospective creates a blameless learning environment to examine what went well, what failed, and how processes, toolchains, and collaboration can be improved in subsequent engineering projects.',
    },
  },
];

export const CANVAS_COURSE_METADATA_2033 = {
  courseId: 53978,
  moduleCode: 'CSC2033',
  moduleTitle: 'Software Engineering Team Project',
  canvasUrl: 'https://ncl.instructure.com/courses/53978/modules',
  academicInstitution: 'Newcastle University',
  faculty: 'School of Computing, Urban Sciences Building (USB)',
  academicYear: '2025/2026',
  credits: 30,
  staff: [
    {
      name: 'Dr Gary Ushaw',
      email: 'gary.ushaw@ncl.ac.uk',
      role: 'Module Leader & Director of Software Engineering Projects',
      office: 'Urban Sciences Building (USB), Room 3.012',
    },
    {
      name: 'Dr Steve Riddle',
      email: 'steve.riddle@ncl.ac.uk',
      role: 'Lecturer (Requirements Engineering & Formal Methods)',
      office: 'Urban Sciences Building (USB)',
    },
    {
      name: 'Dr Marie Devlin',
      email: 'marie.devlin@ncl.ac.uk',
      role: 'Lecturer (Professional Issues & Team Dynamics)',
      office: 'Urban Sciences Building (USB)',
    },
  ],
  assessments: [
    {
      title: 'Milestone 1: Team Charter, Requirements Document & Architecture UML',
      weight: '25%',
      type: 'Technical Design Portfolio',
      due: 'Week 5, Semester 2',
    },
    {
      title: 'Milestone 2: Interim Sprint Demonstration & CI Pipeline Evidence',
      weight: '25%',
      type: 'Live Sprint Demonstration & Git Telemetry',
      due: 'Week 8, Semester 2',
    },
    {
      title: 'Final Capstone: Trade Fair Technical Demonstration & Final Release',
      weight: '50%',
      type: 'Live Trade Fair Demonstration, Codebase & Team Retrospective',
      due: 'Week 12, Semester 2',
    },
  ],
};

export const CANVAS_MODULES_2033: CanvasModuleTopic[] = [
  {
    moduleNumber: 1,
    title: 'Module 1: Team Organization, Agile Scrum & Requirements Engineering',
    state: 'active',
    readingReference: 'Sommerville (2015), Ch. 2-3 • ISO/IEC/IEEE 12207 • INVEST User Stories',
    associatedWeek: 1,
    items: [
      { id: 'se-mod-1-1', title: 'Lecture 1.1: Software Lifecycles: Waterfall vs Agile Scrum', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-1-2', title: 'Lecture 1.2: Team Charters, Role Allocation & Professional Ethics', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-1-3', title: 'Lab Practical 1: Setting up Agile Sprint Boards & Product Backlog in Jira/GitLab', type: 'practical', url: 'https://ncl.instructure.com/courses/53978/modules' },
    ],
  },
  {
    moduleNumber: 2,
    title: 'Module 2: Software Architecture & UML System Modeling',
    state: 'active',
    readingReference: 'Fowler (2003) UML Distilled • OMG UML 2.5.1 Specification',
    associatedWeek: 3,
    items: [
      { id: 'se-mod-2-1', title: 'Lecture 2.1: Architectural Design & Three-Tier Separation of Concerns', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-2-2', title: 'Lecture 2.2: UML Structural Class Diagrams: Associations, Aggregation & Composition', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-2-3', title: 'Lecture 2.3: UML Dynamic Sequence Diagrams: Lifelines & Combined Fragments', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-2-4', title: 'Lab Practical 2: Authoring Architecture Diagrams in UML & PlantUML', type: 'practical', url: 'https://ncl.instructure.com/courses/53978/modules' },
    ],
  },
  {
    moduleNumber: 3,
    title: 'Module 3: Collaborative Git Workflows & Trunk-Based Development',
    state: 'active',
    readingReference: 'Chacon & Straub Pro Git • Accelerate (Forsgren et al.)',
    associatedWeek: 5,
    items: [
      { id: 'se-mod-3-1', title: 'Lecture 3.1: The Git DAG: Branches, Merge vs Rebase & Conflict Resolution', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-3-2', title: 'Lecture 3.2: Trunk-Based Development vs GitFlow: Managing Short-Lived Branches', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-3-3', title: 'Lab Practical 3: Simulating Collaborative Git Merges & 3-Way Conflict Payoff', type: 'practical', url: 'https://ncl.instructure.com/courses/53978/modules' },
    ],
  },
  {
    moduleNumber: 4,
    title: 'Module 4: Automated Testing, TDD & The Andon Cord CI Pipeline',
    state: 'active',
    readingReference: 'Beck (2002) TDD by Example • Humble & Farley Continuous Delivery',
    associatedWeek: 7,
    items: [
      { id: 'se-mod-4-1', title: 'Lecture 4.1: The Test Pyramid: Unit, Integration and End-to-End Testing', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-4-2', title: 'Lecture 4.2: Continuous Integration Pipelines & The Toyota Andon Cord Principle', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-4-3', title: 'Lab Practical 4: Authoring Automated GitHub Actions CI Pipelines with Quality Gates', type: 'practical', url: 'https://ncl.instructure.com/courses/53978/modules' },
    ],
  },
  {
    moduleNumber: 5,
    title: 'Module 5: Code Review Culture, Design Patterns & Refactoring',
    state: 'active',
    readingReference: 'Gamma et al. (1994) Design Patterns • Robert C. Martin SOLID',
    associatedWeek: 8,
    items: [
      { id: 'se-mod-5-1', title: 'Lecture 5.1: SOLID Object-Oriented Design Principles in Practice', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-5-2', title: 'Lecture 5.2: GoF Design Patterns: Factory, Strategy, Observer and Adapter', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-5-3', title: 'Lecture 5.3: Peer Code Review Rubrics & Cyclomatic Complexity Analysis', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-5-4', title: 'Lab Practical 5: Refactoring Monolithic Codebases into Decoupled Patterns', type: 'practical', url: 'https://ncl.instructure.com/courses/53978/modules' },
    ],
  },
  {
    moduleNumber: 6,
    title: 'Module 6: Release Engineering, Trade Fair Showcase & Retrospective',
    state: 'active',
    readingReference: 'SemVer 2.0.0 Specification • Kerth (2001) Project Retrospectives',
    associatedWeek: 12,
    items: [
      { id: 'se-mod-6-1', title: 'Lecture 6.1: Zero-Downtime Deployments: Blue-Green and Canary Releases', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-6-2', title: 'Lecture 6.2: Trade Fair Pitch Preparation & Technical Product Demos', type: 'lecture', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-6-3', title: 'Trade Fair Event: Newcastle University Computing Science Demo Day', type: 'practical', url: 'https://ncl.instructure.com/courses/53978/modules' },
      { id: 'se-mod-6-4', title: 'Lab Practical 6: Conducting Blameless Team Post-Mortems and Retrospectives', type: 'reading', url: 'https://ncl.instructure.com/courses/53978/modules' },
    ],
  },
];

export const EXAM_QUESTIONS_2033: { A: ExamQuestion[]; B: ExamQuestion[] } = {
  A: [
    {
      id: 'q2033-a1',
      section: 'A',
      title: 'Question 1: Agile Software Estimation & Burndown Tracking',
      marks: 10,
      scenario: 'A student software engineering team commits to 40 story points in a 2-week sprint. By Day 6, the burndown chart indicates that 35 story points remain.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Explain how the team can use their historical velocity to assess whether the sprint goal is at risk, and identify two common causes for lagging burndown trajectories.',
          marks: 5,
          markingCriteria: [
            '2.5 marks: Calculation comparing current burndown rate (5 pts in 6 days = ~0.83 pts/day) vs required rate (~3.5 pts/day for remaining 4 days) showing high risk.',
            '2.5 marks: Two valid root causes (e.g. unestimated technical blockers / scope creep; stories too large / not meeting INVEST).',
          ],
          modelAnswer: '1. Velocity Assessment: The team planned 40 points over 10 working days (ideal burn = 4 pts/day). After 6 days, only 5 points have been completed (0.83 pts/day). To finish the remaining 35 points in 4 days requires 8.75 pts/day, which is more than double the original planned rate. The sprint is severely at risk.\n2. Root Causes:\n- Stories are too large (violating the "S" in INVEST), causing work to sit in "In Progress" for days without reaching the "Done" definition.\n- Unplanned technical blockers (e.g. CI pipeline failures or external API environment downtime) stalling developers.',
        },
        {
          part: '(b)',
          prompt: 'Recommend two concrete actions the Scrum Master and team should take during the mid-sprint standup to recover predictability without working unsustainable overtime.',
          marks: 5,
          markingCriteria: [
            '2.5 marks: Negotiating with the Product Owner to descop lowest-priority user stories back to the product backlog.',
            '2.5 marks: Swarming / pairing developers on the single most critical in-progress story to move it to Done.',
          ],
          modelAnswer: '1. Scope Renegotiation: The team should consult the Product Owner immediately to descop the lowest-priority user stories, moving them back into the product backlog so the team focuses strictly on delivering the core MVP sprint goal.\n2. Swarming on In-Progress Work: Halt starting new stories and pair developers ("swarm") on existing open items to clear blockers and transition open stories to "Done", reducing Work in Progress (WIP).',
        },
      ],
    },
  ],
  B: [
    {
      id: 'q2033-b1',
      section: 'B',
      title: 'Question 2: Continuous Integration Pipelines & The Andon Cord',
      marks: 15,
      scenario: 'A student team member creates a pull request that adds an important new payment feature, but fails two unit tests and contains an unencrypted API secret in a configuration file.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Describe the sequence of automated checks an enterprise Continuous Integration (CI) pipeline must execute to prevent this code from reaching production, invoking the "Andon Cord" principle.',
          marks: 8,
          markingCriteria: [
            '4 marks: Explicit pipeline stages: Linting -> SAST / Secret Scanning -> Automated Unit/Integration Testing -> Build verification.',
            '4 marks: Explanation of the Andon Cord mechanism immediately halting the pipeline, rejecting PR merge, and broadcasting alert.',
          ],
          modelAnswer: 'Pipeline Sequence:\n1. Stage 1 (Static Analysis & Secret Scanning): Gitleaks or TruffleHog scans git commit diffs for patterns matching API keys and tokens. When the unencrypted secret is detected, the check fails immediately.\n2. Stage 2 (Automated Test Suite): Jest/Vitest runs all unit tests in parallel. When the two payment unit tests fail assertions, the runner exits with code 1.\n3. The Andon Cord Principle: Originating from the Toyota Production System, any defect halts the entire line. The CI runner pulls the digital Andon Cord: the build status turns Red, the PR merge button is hard-blocked on GitHub/GitLab, and the team channel is notified. No code can be merged into the trunk while the cord is pulled.',
        },
        {
          part: '(b)',
          prompt: 'Explain the proper remediation steps for both the committed API secret and the failing unit tests before the pull request can be approved.',
          marks: 7,
          markingCriteria: [
            '3.5 marks: Immediately rotating the leaked credential; moving secret to server environment variables; scrubbing git history.',
            '3.5 marks: Debugging the unit tests to pass cleanly; verifying green CI pipeline before peer code review approval.',
          ],
          modelAnswer: '1. Secret Remediation: Simply committing a deletion is insufficient because the secret remains in the Git commit history. The team must:\n- Immediately invalidate and rotate the compromised API key at the provider.\n- Move the new secret into environment variables (.env.local / GitHub Actions Secrets).\n- Rewrite git history (e.g. git filter-repo) or recreate the branch cleanly.\n2. Test Remediation: Debug the root cause of the payment calculation error, update the implementation so all assertions pass, and verify that the full CI pipeline executes Green (all checks passing) before requesting peer code review.',
        },
      ],
    },
  ],
};
