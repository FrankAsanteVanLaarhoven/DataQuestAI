/**
 * CSC3095: Project and Dissertation in Computing Science Curriculum Specification
 * Newcastle University • School of Computing • Stage 3 Compulsory Capstone (40 Credits)
 * Canvas Course ID: 70405
 * Direct Canvas URL: https://ncl.instructure.com/courses/70405
 * Accredited Syllabus Specification with Academic References, URERC Ethics & IEEE/ACM Standards.
 * Organized in standard 12-Milestone Semester Sequence with Canvas Module Integration & Exam Hub.
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';

export const CSC3095_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Research Question Formulation & SMART Objectives',
    badge: 'Proposal',
    tagline: 'Identifying knowledge gaps, problem statements, SMART deliverables, and supervisor alignment',
    accreditedSpec: 'CSC3095 Specification: Milestone 1 — Research Problem Definition and Feasibility Scoping',
    referencePoint: {
      academic: 'Zobel, J. (2014). Writing for Computer Science (3rd Ed.), Chapter 3: Good Style. Springer.',
      standard: 'ISO/IEC/IEEE 26511: Systems and software engineering — Requirements for managers of information for users.',
      enterprise: 'Academic grant proposal frameworks (EPSRC / UKRI) and enterprise technology R&D charters.',
    },
    pedagogy: {
      simple: 'A good dissertation answers one specific, focused question rather than trying to build everything at once. We formulate clear SMART objectives: Specific, Measurable, Achievable, Relevant, and Time-bound.',
      engineer: 'The research question must articulate a verifiable technical hypothesis with clear success metrics (e.g. latency, throughput, accuracy, algorithmic convergence) contrasting against an explicit baseline.',
    },
    narration: 'Week 1 launches the capstone journey: transforming broad student interests into a rigorous, supervisor-approved scientific research hypothesis.',
    capstone: {
      id: 'diss_w1_proposal',
      title: 'SMART Hypothesis Formulator',
      description: 'Draft the formal research question, hypothesis null/alternative statements, and scope boundaries.',
    },
    quiz: {
      question: 'Which of the following formulations represents a valid scientific research hypothesis for CSC3095?',
      options: [
        '"We will build a cool web application using React and Firebase"',
        '"Implementing Raft consensus via eBPF will reduce peer heartbeat network latency by at least 25% compared to user-space gRPC under 100Mbps line congestion"',
        '"Machine learning is superior to traditional databases for all enterprise use cases"',
        '"Software engineering projects are more successful when developers drink coffee"',
      ],
      correctIndex: 1,
      explanation: 'A rigorous scientific hypothesis specifies the independent variable (eBPF Raft), dependent variable (latency), quantitative benchmark target (>= 25%), baseline comparator (user-space gRPC), and environmental bounds (100Mbps congestion).',
    },
  },
  {
    week: 2,
    title: 'Systematic Literature Review & Scholarly Citations',
    badge: 'Literature',
    tagline: 'PRISMA search protocol, academic databases (ACM, IEEE, Springer, ArXiv), and citation graphs',
    accreditedSpec: 'CSC3095 Specification: Milestone 2 — Comprehensive State-of-the-Art Literature Survey',
    referencePoint: {
      academic: 'Kitchenham, B. & Charters, S. (2007). Guidelines for performing Systematic Literature Reviews in Software Engineering. Keele University Technical Report.',
      standard: 'PRISMA 2020: Preferred Reporting Items for Systematic Reviews and Meta-Analyses.',
      enterprise: 'Scholarly discovery workflows (ACM Digital Library, IEEE Xplore, Google Scholar, DBLP).',
    },
    pedagogy: {
      simple: 'You cannot innovate without knowing what has already been invented. A literature review explores what researchers worldwide have solved and where current limitations still exist.',
      engineer: 'The literature review synthesizes peer-reviewed scholarly literature into a conceptual taxonomy. Students identify gaps in current state-of-the-art work using structured exclusion/inclusion criteria and synthesize bibtex references.',
    },
    narration: 'Week 2 guides the comprehensive survey of existing research to establish a firm foundation and avoid reinventing the wheel.',
    capstone: {
      id: 'diss_w2_litreview',
      title: 'PRISMA Search Matrix',
      description: 'Document database queries, paper screening counts, and comparative synthesis matrices across >= 15 peer-reviewed sources.',
    },
    quiz: {
      question: 'In academic software engineering research, what is the primary role of a Systematic Literature Review (SLR)?',
      options: [
        'To summarize random blog posts from internet forums',
        'To exhaustively identify, critically evaluate, and synthesize all published empirical evidence relevant to a specific research question',
        'To copy existing open-source code into the student dissertation',
        'To generate automated code comments for the final submission',
      ],
      correctIndex: 1,
      explanation: 'A Systematic Literature Review applies an explicit, reproducible methodology to locate, evaluate, and synthesize all peer-reviewed academic publications addressing the research topic.',
    },
  },
  {
    week: 3,
    title: 'Research Ethics, URERC Approval & Data Protection (GDPR)',
    badge: 'Ethics & GDPR',
    tagline: 'University Research Ethics Committee (URERC), informed consent, participant debrief, and anonymization',
    accreditedSpec: 'CSC3095 Specification: Milestone 3 — Formal Ethical Governance and Statutory Compliance',
    referencePoint: {
      academic: 'Newcastle University Policy on the Ethical Conduct of Research (URERC / FMS & SAgE Ethics Committee).',
      standard: 'UK Data Protection Act 2018 / UK GDPR / ACM Code of Ethics and Professional Conduct (2018).',
      enterprise: 'Institutional Review Board (IRB) human subject research protections and data protection impact assessments (DPIA).',
    },
    pedagogy: {
      simple: 'If your project touches human users (surveys, usability tests, personal data), you must protect their privacy and obtain informed consent before collecting any data.',
      engineer: 'All Newcastle University projects must pass the SAgE URERC ethics screening. Research involving human participants requires formal participant information sheets (PIS), signed consent forms, data minimization, pseudonymization, and secure cryptographic storage.',
    },
    narration: 'Week 3 ensures compliance with statutory laws, institutional ethics committees, and professional codes of conduct.',
    capstone: {
      id: 'diss_w3_ethics',
      title: 'URERC Ethics Checklist & DPIA',
      description: 'Complete the Newcastle University Research Ethics checklist and draft user study consent forms.',
    },
    quiz: {
      question: 'Under Newcastle University ethical regulations, what must be in place before any user testing or data collection commences?',
      options: [
        'A complete working production version of the final software',
        'Formal URERC ethics approval, participant information sheets (PIS), and signed informed consent',
        'A commercial patent filing',
        'Approval from the student union council',
      ],
      correctIndex: 1,
      explanation: 'No primary human data collection (interviews, surveys, usability experiments) may legally occur without prior formal approval from the University Research Ethics Committee (URERC) and informed participant consent.',
    },
  },
  {
    week: 4,
    title: 'Architectural Design & Formal System Specification',
    badge: 'Architecture',
    tagline: 'C4 component modeling, formal interfaces, database schema design, and trade-off matrices',
    accreditedSpec: 'CSC3095 Specification: Milestone 4 — High-Level System Architecture and Design Rationale',
    referencePoint: {
      academic: 'Bass, L., Clements, P. & Kazman, R. (2021). Software Architecture in Practice (4th Ed.). Addison-Wesley.',
      standard: 'IEEE 42010-2011: Systems and software engineering — Architecture description.',
      enterprise: 'Architectural Decision Records (ADRs) and C4 structural models (Context, Container, Component, Code).',
    },
    pedagogy: {
      simple: 'Before laying bricks, an architect draws detailed blueprints. We sketch out the components of the software, how they talk to each other, and justify every technology choice.',
      engineer: 'The dissertation architecture chapter documents C4 models, ER diagrams in 3NF, API OpenAPI specifications, and ADRs recording explicit trade-offs (e.g. latency vs consistency, SQL vs NoSQL) against research objectives.',
    },
    narration: 'Week 4 produces the structural blueprints and Architectural Decision Records justifying system design.',
    capstone: {
      id: 'diss_w4_adr',
      title: 'Architectural Decision Record (ADR) Suite',
      description: 'Draft 3 formal ADRs documenting trade-offs, consequences, and alternatives for core system subsystems.',
    },
    quiz: {
      question: 'What is the primary function of an Architectural Decision Record (ADR) in a dissertation design chapter?',
      options: [
        'To record code line counts for university grading',
        'To document why a specific architectural choice was made, what trade-offs were accepted, and which alternatives were rejected',
        'To track student attendance hours with the project supervisor',
        'To store software license keys securely',
      ],
      correctIndex: 1,
      explanation: 'An ADR captures the technical context, considered alternatives, positive/negative trade-offs, and rationale behind a crucial architectural decision, providing scientific justification for examiners.',
    },
  },
  {
    week: 5,
    title: 'Preliminary Prototyping & Technical Spike Solutions',
    badge: 'Prototyping',
    tagline: 'Spike solutions, critical technical de-risking, third-party API validation, and MVP proof-of-concept',
    accreditedSpec: 'CSC3095 Specification: Milestone 5 — Technical De-risking and Proof of Concept (PoC)',
    referencePoint: {
      academic: 'Sommerville, I. (2016). Software Engineering (10th Ed.), Chapter 2: Software Processes. Pearson.',
      standard: 'ISO/IEC/IEEE 15288: Systems and software engineering — System life cycle processes.',
      enterprise: 'Agile technical spikes and minimum viable product (MVP) architectural proofs.',
    },
    pedagogy: {
      simple: 'A spike is a quick, throwaway experiment to test whether a risky idea will actually work before you invest weeks building around it.',
      engineer: 'Spike prototypes validate unproven technical assumptions (e.g. GPU throughput, hardware sensor streaming rates, third-party API rate limits). Findings directly inform the main implementation strategy and refine the risk register.',
    },
    narration: 'Week 5 mitigates fatal project risks early through rapid exploratory prototyping and technical spikes.',
    capstone: {
      id: 'diss_w5_spike',
      title: 'Feasibility Spike Benchmark',
      description: 'Profile execution speed and memory bounds on the project\'s highest-risk subsystem.',
    },
    quiz: {
      question: 'In professional software research, what distinguishes an architectural "spike" from regular production code?',
      options: [
        'Spikes are written exclusively in assembly language',
        'Spikes are targeted, time-boxed experiments built to explore a specific technical unknown and are not meant for permanent production maintainability',
        'Spikes do not need to compile or run',
        'Spikes must be approved by the university registrar',
      ],
      correctIndex: 1,
      explanation: 'A spike is an exploratory, time-boxed investigation designed to gain critical knowledge or resolve architectural uncertainty quickly, after which clean production code is engineered.',
    },
  },
  {
    week: 6,
    title: 'Interim Progress Report, Schedule Tracking & Risk Management',
    badge: 'Interim Milestone',
    tagline: 'Gantt chart critical path, interim dissertation chapter submission, and risk matrix reviews',
    accreditedSpec: 'CSC3095 Specification: Milestone 6 — Formative Interim Report and Supervisor Review',
    referencePoint: {
      academic: 'Project Management Institute (PMI). (2021). A Guide to the Project Management Body of Knowledge (PMBOK Guide, 7th Ed.).',
      standard: 'ISO 31000:2018: Risk management — Guidelines.',
      enterprise: 'Enterprise engineering steering reviews, milestone burn-up tracking, and critical path analysis.',
    },
    pedagogy: {
      simple: 'At the midpoint of the year, we check our progress against our schedule, assess risks that could cause delays, and review our work with our supervisor.',
      engineer: 'The interim milestone requires submission of the formal 15-page progress report including Introduction, Literature Review, and Initial Design. Project velocity is evaluated against the critical path in the project Gantt chart.',
    },
    narration: 'Week 6 marks the formal halfway checkpoint, assessing student delivery velocity against the initial project schedule.',
    capstone: {
      id: 'diss_w6_interim',
      title: 'Interim Progress Report & Risk Matrix',
      description: 'Synthesize completed literature review, system architecture, and updated risk mitigation strategy.',
    },
    quiz: {
      question: 'What is the "critical path" in a dissertation Gantt schedule?',
      options: [
        'The path with the highest financial budget',
        'The sequence of dependent project tasks that directly determines the minimum completion time of the entire project',
        'The list of optional features to build if time permits',
        'The path to the university printing office',
      ],
      correctIndex: 1,
      explanation: 'The critical path represents the longest chain of dependent activities. Any delay in a task on the critical path causes a direct day-for-day delay in the overall dissertation completion date.',
    },
  },
  {
    week: 7,
    title: 'Core Implementation, Modular Decoupling & Automated Test Harnesses',
    badge: 'Implementation',
    tagline: 'Production-grade engineering, modular clean code, integration tests, and CI/CD pipelines',
    accreditedSpec: 'CSC3095 Specification: Milestone 7 — High-Quality Subsystem Implementation and Verification',
    referencePoint: {
      academic: 'Martin, R.C. (2008). Clean Code: A Handbook of Agile Software Craftsmanship. Prentice Hall.',
      standard: 'ISO/IEC 25023: Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Measurement of system and software product quality.',
      enterprise: 'Continuous Integration build matrices, automated smoke tests, and static code analysis (SonarQube).',
    },
    pedagogy: {
      simple: 'This is where you build the core engine of your software. You write clean, modular code with automated tests that prove every component works as expected.',
      engineer: 'The implementation must reflect the architectural blueprints, avoiding spaghetti coupling. Automated test suites (unit, integration, regression) verify functional correctness, generating reproducible artifacts for academic evaluation.',
    },
    narration: 'Week 7 focuses on disciplined software craftsmanship, building the novel artifacts designed to test the project hypothesis.',
    capstone: {
      id: 'diss_w7_build',
      title: 'Automated CI Test Matrix',
      description: 'Construct a GitHub Actions pipeline running linting, unit tests, and code coverage on every commit.',
    },
    quiz: {
      question: 'Why do academic dissertation examiners value automated test suites alongside final project deliverables?',
      options: [
        'Because test code increases the total line count of the student repository',
        'Because test suites provide verifiable, reproducible proof that the software functions correctly according to specification',
        'Automated tests allow the university to deploy the software commercially immediately',
        'Examiners grade students solely on the quantity of test files created',
      ],
      correctIndex: 1,
      explanation: 'Automated test harnesses establish scientific reproducibility and empirical verification, demonstrating to examiners that the claimed features function deterministically without regressions.',
    },
  },
  {
    week: 8,
    title: 'Empirical Methodology, Experimental Design & Hypotheses',
    badge: 'Methodology',
    tagline: 'Controlled experiments, independent/dependent variables, ablation studies, and baseline comparators',
    accreditedSpec: 'CSC3095 Specification: Milestone 8 — Scientific Experimental Methodology and Evaluation Design',
    referencePoint: {
      academic: 'Wohlin, C. et al. (2012). Experimentation in Software Engineering. Springer.',
      standard: 'ACM Artifact Review and Badging: Guidelines for Artifact Evaluation (Replicable / Reproducible).',
      enterprise: 'Production A/B testing infrastructure, benchmarking suites (JMH, Locust, k6), and scientific controls.',
    },
    pedagogy: {
      simple: 'In science, you cannot just say "my system is good." You must run controlled experiments comparing your system against established benchmarks under identical conditions.',
      engineer: 'Empirical software engineering demands rigorous experimental design: defining independent variables (e.g. concurrency level, payload size), dependent variables (e.g. p99 response time, memory footprint), and controlling for external confounders (CPU throttling, network jitter, disk caching).',
    },
    narration: 'Week 8 elevates the dissertation from a pure coding project to a scientific investigation of computational performance.',
    capstone: {
      id: 'diss_w8_experiment',
      title: 'Benchmark Experiment Protocol',
      description: 'Draft the formal experimental protocol detailing test harnesses, repetitions, warm-ups, and statistical metrics.',
    },
    quiz: {
      question: 'When benchmarking Java or runtime system throughput, why is a "warm-up" period essential before collecting measurement data?',
      options: [
        'To allow the computer monitor to warm up its pixels',
        'To allow the Just-In-Time (JIT) compiler to optimize bytecode and JVM memory allocation pools to stabilize before measuring',
        'Because the operating system refuses to execute un-warmed code',
        'Warm-up periods are only needed for legacy mainframe computers',
      ],
      correctIndex: 1,
      explanation: 'Modern managed runtimes (JVM, V8) dynamically interpret and JIT-compile hotspots. Measuring without a warm-up phase captures interpretation overhead and class loading rather than true steady-state performance.',
    },
  },
  {
    week: 9,
    title: 'Quantitative Evaluation, Statistical Analysis & Data Visualization',
    badge: 'Results',
    tagline: 'Descriptive statistics, confidence intervals (95% CI), box plots, significance tests (t-test / Mann-Whitney U)',
    accreditedSpec: 'CSC3095 Specification: Milestone 9 — Rigorous Data Analysis and Empirical Results Presentation',
    referencePoint: {
      academic: 'Montgomery, D.C. (2017). Design and Analysis of Experiments (9th Ed.). John Wiley & Sons.',
      standard: 'IEEE Transactions on Software Engineering: Statistical Guidelines for Empirical Software Engineering.',
      enterprise: 'Production latency histograms (HdrHistogram), p50/p95/p99 latency quantiles, and Box-and-Whisker distribution plots.',
    },
    pedagogy: {
      simple: 'We present our experiment numbers using clear graphs and honest statistics. We do not just show averages; we show distributions, percentiles, and margins of error.',
      engineer: 'Reporting raw arithmetic means is insufficient for skewed latency distributions. Students compute percentiles (p50, p95, p99), 95% bootstrap confidence intervals, and execute non-parametric hypothesis tests (e.g. Wilcoxon-Mann-Whitney) to establish statistical significance.',
    },
    narration: 'Week 9 transforms raw experiment logs into publication-quality academic charts and statistical significance proofs.',
    capstone: {
      id: 'diss_w9_stats',
      title: 'Statistical Benchmark Analyzer',
      description: 'Calculate median, p99, standard deviation, and p-value significance against the baseline implementation.',
    },
    quiz: {
      question: 'Why should computer systems latency benchmarks report percentiles (such as p95 and p99) in addition to or instead of the arithmetic mean?',
      options: [
        'Percentiles are faster to calculate by hand',
        'System latencies exhibit heavy-tailed, non-Gaussian distributions where the mean masks severe tail latency degradation experienced by users',
        'University guidelines forbid calculating the arithmetic mean',
        'Percentiles guarantee that all measurements are strictly positive integers',
      ],
      correctIndex: 1,
      explanation: 'Network and I/O latency distributions are right-skewed with long tails caused by GC pauses and queueing. The arithmetic mean obscures severe latency spikes that affect real users at the 99th percentile.',
    },
  },
  {
    week: 10,
    title: 'Critical Discussion, Threats to Validity & Project Limitations',
    badge: 'Discussion',
    tagline: 'Internal validity, external validity, construct validity, reliability, and honest limitation disclosure',
    accreditedSpec: 'CSC3095 Specification: Milestone 10 — Critical Appraisal, Threat Analysis, and Future Research',
    referencePoint: {
      academic: 'Feldt, R. & Magazinius, A. (2010). Validity Threats in Empirical Software Engineering Research. SEKE 2010.',
      standard: 'ISO/IEC/IEEE 15026: Systems and software engineering — Systems and software assurance.',
      enterprise: 'Engineering post-mortems and rigorous scientific peer-review review methodologies.',
    },
    pedagogy: {
      simple: 'Top marks come from honest self-reflection. What worked? What didn\'t? What assumptions might not hold true in different situations? Identifying your own limitations shows maturity.',
      engineer: 'The Discussion chapter explicitly addresses Threats to Validity: Construct Validity (did we measure the right thing?), Internal Validity (did confounding variables bias results?), and External Validity (do the conclusions generalize beyond the tested environment?).',
    },
    narration: 'Week 10 demonstrates academic maturity: critically appraising your own engineering work and articulating boundaries.',
    capstone: {
      id: 'diss_w10_validity',
      title: 'Threats to Validity Register',
      description: 'Categorize four distinct threats across construct, internal, external, and reliability validity with mitigations.',
    },
    quiz: {
      question: 'Which category of validity threat is concerned with whether the experimental findings can be generalized to other operating systems, network topologies, or datasets?',
      options: [
        'Internal Validity',
        'External Validity',
        'Construct Validity',
        'Syntactic Validity',
      ],
      correctIndex: 1,
      explanation: 'External validity assesses the extent to which the experimental outcomes and conclusions can be generalized beyond the specific laboratory conditions, hardware, or datasets evaluated.',
    },
  },
  {
    week: 11,
    title: 'Dissertation Structuring, Academic Writing & IEEE/ACM Formatting',
    badge: 'Dissertation',
    tagline: 'Formal technical prose, LaTeX typesetting, BibTeX citations, figure captions, and chapter cohesion',
    accreditedSpec: 'CSC3095 Specification: Milestone 11 — Full Technical Dissertation Compilation and Quality Assurance',
    referencePoint: {
      academic: 'Booth, W.C., Colomb, G.G., Williams, J.M., Bizup, J. & FitzGerald, W.T. (2016). The Craft of Research (4th Ed.). University of Chicago Press.',
      standard: 'IEEE Citation Reference Manual / ACM Master Article Template.',
      enterprise: 'Professional technical publishing standards and academic archive metadata requirements.',
    },
    pedagogy: {
      simple: 'Your dissertation is a book that tells the entire story of your project: Introduction, Literature Review, Architecture, Implementation, Evaluation, and Conclusions.',
      engineer: 'The completed 40-credit dissertation follows rigorous academic writing standards: objective voice, precise technical vocabulary, numbered figures/tables with explicit textual cross-references, zero plagiarism, and IEEE/ACM citation consistency.',
    },
    narration: 'Week 11 brings the written dissertation to its final polish, formatting figures, citations, and structural chapters.',
    capstone: {
      id: 'diss_w11_typeset',
      title: 'Dissertation Typesetting & Citation Checker',
      description: 'Audit citation cross-references, figure numbering, and table alignments across all 6 core chapters.',
    },
    quiz: {
      question: 'In formal academic computer science writing, how should figures, charts, and diagrams be incorporated into the text?',
      options: [
        'They should be placed on separate pages at the very end of the document without commentary',
        'Every figure must have a descriptive numbered caption (e.g. Figure 4.2) and must be explicitly referenced and discussed in the preceding or following text',
        'Figures only require image URLs without captions or text mentions',
        'Figures should only be included if the dissertation is under the minimum word limit',
      ],
      correctIndex: 1,
      explanation: 'Academic publication standards require every graphical element to have a clear numbered caption and to be explicitly introduced, analyzed, and synthesized within the surrounding prose.',
    },
  },
  {
    week: 12,
    title: 'Viva Voce Oral Defense, Demonstration & Academic Archive',
    badge: 'Viva Defense',
    tagline: 'Oral presentation, live software demonstration, examiner Q&A defense, and final digital submission',
    accreditedSpec: 'CSC3095 Specification: Milestone 12 — Oral Examination (Viva Voce), Demonstration, and Final Repository Handover',
    referencePoint: {
      academic: 'Newcastle University Degree Regulations: Stage 3 Capstone Project Oral Examination Guidelines.',
      standard: 'ISO/IEC 27001: Information Security — Archival and Asset Handover Procedures.',
      enterprise: 'Executive technical presentations, investor product demos, and open-source archive release tagging.',
    },
    pedagogy: {
      simple: 'The final step is your Viva: a 20-minute demonstration and conversation where you showcase your working software to two professors and answer their technical questions.',
      engineer: 'The viva voce examination assesses independent scholarship, technical depth, architectural understanding, and honest appraisal of findings. Students present a 10-minute slides overview, a 5-minute live demo, and defend against 10 minutes of examiner interrogation.',
    },
    narration: 'Week 12 completes the undergraduate degree: defending the 40-credit capstone dissertation before Newcastle University examiners.',
    capstone: {
      id: 'diss_w12_viva',
      title: 'Viva Defense Simulator',
      description: 'Practice defending architecture trade-offs and empirical validity threats in an examiner Q&A simulation.',
    },
    quiz: {
      question: 'During the CSC3095 oral viva voce defense, how should a candidate respond if an examiner asks about an unexpected edge case or limitation in their software?',
      options: [
        'Deny that the edge case exists and blame the operating system',
        'Calmly acknowledge the boundary condition, explain the underlying technical reason it occurs, and describe how future work would architect a solution',
        'Refuse to answer until consulting a legal representative',
        'Immediately terminate the viva presentation',
      ],
      correctIndex: 1,
      explanation: 'Examiners deliberately probe boundaries to test candidate depth and scientific integrity. Candidly explaining the technical cause and outlining architectural mitigations demonstrates true mastery and earns the highest marks.',
    },
  },
];

export const CANVAS_COURSE_METADATA_3095 = {
  courseId: 70405,
  courseCode: 'CSC3095',
  courseName: 'Project and Dissertation in Computing Science',
  academicYear: '2024/25',
  credits: 40,
  term: 'Semester 1 & 2 (Stage 3 Compulsory Capstone)',
  faculty: 'Science, Agriculture and Engineering',
  school: 'School of Computing',
  stage: 'Stage 3',
  canvasUrl: 'https://ncl.instructure.com/courses/70405',
  staff: [
    { name: 'Dr. Feng Dong', role: 'Dissertation Coordinator & Senior Lecturer', email: 'feng.dong@ncl.ac.uk' },
    { name: 'Prof. Paul Watson', role: 'Professor of Computer Science & Capstone Examiner', email: 'paul.watson@ncl.ac.uk' },
  ],
  timetable: {
    lectures: 'Mondays 10:00 - 11:00 (Research Methods Briefing, USB Lecture Theatre)',
    supervision: 'Weekly 1-on-1 Academic Supervisor Progress Meetings',
    practicals: 'Project Laboratories available 24/7 (Urban Sciences Building)',
  },
  recommendedTexts: [
    'Zobel, J. (2014). Writing for Computer Science (3rd Ed.). Springer.',
    'Wohlin, C. et al. (2012). Experimentation in Software Engineering. Springer.',
    'Bass, L., Clements, P. & Kazman, R. (2021). Software Architecture in Practice (4th Ed.). Addison-Wesley.',
  ],
};

export const CANVAS_MODULES_3095: CanvasModuleTopic[] = [
  {
    id: 'diss-mod-1',
    moduleNumber: 1,
    title: 'Module 1: Scoping, Literature Review & Research Ethics',
    state: 'active',
    readingReference: 'Zobel (2014) Writing for CS • PRISMA 2020 • Newcastle URERC Policy',
    associatedWeek: 1,
    items: [
      { id: 'diss-mod-1-1', title: 'Lecture 1.1: Formulating Hypotheses and Defining SMART Scope Boundaries', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-1-2', title: 'Lecture 1.2: Conducting Systematic Literature Reviews with PRISMA Search Protocols', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-1-3', title: 'Workshop 1: Completing the SAgE URERC Research Ethics and Data Protection Checklist', type: 'practical', url: 'https://ncl.instructure.com/courses/70405/modules' },
    ],
  },
  {
    id: 'diss-mod-2',
    moduleNumber: 2,
    title: 'Module 2: Architectural Specification & Interim Reporting',
    state: 'active',
    readingReference: 'Bass et al. (2021) Software Architecture in Practice • PMBOK Guide (7th Ed.)',
    associatedWeek: 4,
    items: [
      { id: 'diss-mod-2-1', title: 'Lecture 2.1: Documenting System Architecture via C4 Diagrams and ADRs', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-2-2', title: 'Lecture 2.2: Technical De-risking via Spikes and Critical Path Schedule Control', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-2-3', title: 'Milestone Submission: Formative Interim Progress Report and Supervisor Review', type: 'practical', url: 'https://ncl.instructure.com/courses/70405/modules' },
    ],
  },
  {
    id: 'diss-mod-3',
    moduleNumber: 3,
    title: 'Module 3: Experimental Methodology & Empirical Benchmarking',
    state: 'active',
    readingReference: 'Wohlin et al. (2012) Experimentation in SE • Montgomery (2017) Design of Experiments',
    associatedWeek: 7,
    items: [
      { id: 'diss-mod-3-1', title: 'Lecture 3.1: Controlled Empirical Experiments and Confounder Isolation', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-3-2', title: 'Lecture 3.2: Statistical Significance Testing, Quantiles, and Publication Visualizations', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-3-3', title: 'Workshop 2: Statistical Significance Analysis in Python / R with Matplotlib', type: 'practical', url: 'https://ncl.instructure.com/courses/70405/modules' },
    ],
  },
  {
    id: 'diss-mod-4',
    moduleNumber: 4,
    title: 'Module 4: Technical Dissertation Writing & Viva Defense',
    state: 'active',
    readingReference: 'Booth et al. (2016) Craft of Research • Feldt & Magazinius (2010) Validity Threats',
    associatedWeek: 10,
    items: [
      { id: 'diss-mod-4-1', title: 'Lecture 4.1: Threats to Validity, Critical Self-Appraisal, and Discussion Writing', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-4-2', title: 'Lecture 4.2: Academic Typesetting, IEEE/ACM Formatting, and Repository Archiving', type: 'lecture', url: 'https://ncl.instructure.com/courses/70405/modules' },
      { id: 'diss-mod-4-3', title: 'Oral Examination: Live Software Demonstration and Viva Voce Defense', type: 'practical', url: 'https://ncl.instructure.com/courses/70405/modules' },
    ],
  },
];

export const EXAM_QUESTIONS_3095: { A: ExamQuestion[]; B: ExamQuestion[] } = {
  A: [
    {
      id: 'q3095-a1',
      section: 'A',
      title: 'Question 1: Research Methodology & Experimental Validity',
      marks: 15,
      scenario: 'A student develops a novel caching mechanism for distributed key-value stores and evaluates it on a single laptop by running 50 sequential read queries.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Identify three critical threats to validity in this experimental setup (spanning internal, external, and construct validity).',
          marks: 9,
          markingCriteria: [
            '3 marks: Internal Validity — Confounders such as OS disk cache, lack of warm-up phase, background process CPU contention.',
            '3 marks: External Validity — Single-node laptop cannot represent distributed network latency, packet loss, or real-world hardware concurrency.',
            '3 marks: Construct Validity — 50 sequential reads is an unrepresentatively tiny sample size and does not measure write invalidations, cache thrashing, or concurrent contention.',
          ],
          modelAnswer: '1. Internal Validity: Evaluating on a single developer laptop introduces severe confounding variables: background OS daemon activity, CPU thermal throttling, and operating system page cache interference. Without warmup cycles or repeated trials, initial measurements capture transient overhead.\n2. External Validity: A single localhost machine exhibits zero network propagation delay, zero socket packet drops, and zero clock drift. Findings cannot be generalized to real distributed clusters across multiple data centers.\n3. Construct Validity: Running only 50 sequential reads fails to measure the construct of "distributed caching performance" under realistic conditions. It ignores concurrent multi-threaded contention, cache eviction under memory pressure, and cache invalidation under high write workloads.',
        },
        {
          part: '(b)',
          prompt: 'Propose a rigorous revised experimental protocol that resolves these threats.',
          marks: 6,
          markingCriteria: [
            '2 marks: Deployment across at least 3 distributed nodes or containerized cloud network with simulated jitter/latency.',
            '2 marks: Standard benchmarking tool (e.g. YCSB / JMH) with explicit warm-up period, randomized key distributions, and concurrent threads.',
            '2 marks: Statistical rigor: minimum 10,000 requests over >= 10 trials, reporting p50/p95/p99 quantiles and 95% confidence intervals.',
          ],
          modelAnswer: 'Revised protocol:\n1. Infrastructure: Deploy across a minimum 3-node cluster (or emulated network via Docker/Mininet with calibrated latency and packet drop injection).\n2. Workload generator: Utilize an established benchmark harness (e.g., Yahoo! Cloud Serving Benchmark - YCSB) generating Zipfian key access distributions with varying read/write ratios (e.g. 50/50, 95/5).\n3. Statistical sampling: Execute a 60-second warmup period, followed by 10 independent trials of 100,000 transactions each. Report median, p95, and p99 latencies with 95% bootstrap confidence intervals and calculate statistical significance (Mann-Whitney U) against standard Redis/Memcached baselines.',
        },
      ],
    },
  ],
  B: [
    {
      id: 'q3095-b1',
      section: 'B',
      title: 'Question 2: Research Ethics, Data Governance & Architectural Trade-offs',
      marks: 15,
      scenario: 'A capstone project collects student study habits and exam performance via a browser extension and trains a predictive model on cloud servers.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Outline the required legal (UK GDPR) and institutional (Newcastle URERC) ethical requirements before launching the study.',
          marks: 8,
          markingCriteria: [
            '2 marks: Institutional ethics approval from SAgE URERC prior to any participant recruitment.',
            '2 marks: Informed consent: Participant Information Sheet (PIS) detailing study purpose, voluntary withdrawal at any point without penalty.',
            '2 marks: Data Protection / GDPR: Lawful basis, explicit data minimization, purpose limitation.',
            '2 marks: Security: Cryptographic hashing of student identifiers (pseudonymization), encrypted transit/rest, and defined retention/deletion schedule.',
          ],
          modelAnswer: '1. URERC Approval: Formal ethical clearance must be granted by the SAgE University Research Ethics Committee prior to collecting any data.\n2. Informed Consent: Every participant must review a Participant Information Sheet (PIS) specifying objectives, data collected, risks, and sign an explicit consent form confirming voluntary participation and unconditional right of withdrawal.\n3. GDPR Compliance: Adhere to data minimization (collecting only telemetry strictly required for the hypothesis). Student numbers and names must be stripped and replaced with cryptographic pseudonyms.\n4. Security & Retention: All telemetry in transit and at rest must use AES-256 / TLS 1.3 encryption. Data must be stored on secure Newcastle OneDrive / university drives, with automated deletion scheduled upon graduation.',
        },
        {
          part: '(b)',
          prompt: 'Formulate an Architectural Decision Record (ADR) justifying whether the predictive inference model should run on-device (client WebAssembly) or on a centralized cloud server.',
          marks: 7,
          markingCriteria: [
            '2 marks: Context & Problem Statement clearly articulated.',
            '3 marks: Decision and trade-off analysis: Client-side Wasm guarantees absolute user privacy (no browsing telemetry transmitted over wire) and zero server hosting costs, balanced against browser memory limits and client device CPU variance.',
            '2 marks: Final consequences and architectural rationale.',
          ],
          modelAnswer: 'ADR: Client-Side WebAssembly Inference vs Centralized Cloud API\n- Status: Accepted\n- Context: The application predicts study habits based on browser interaction telemetry. Sending fine-grained keystrokes/URLs to a central server introduces high GDPR risk and infrastructure costs.\n- Decision: Deploy an ONNX runtime compiled to WebAssembly running directly inside the user\'s browser sandbox.\n- Positive Consequences: Absolute privacy by design; personal browsing data never traverses the network; zero cloud inference hosting or GPU server expenses; functions offline.\n- Negative Consequences / Trade-offs: Model size must be quantized (<10MB) to prevent browser download lag; inference performance varies based on end-user hardware specifications; model intellectual property is exposed to client-side inspection.',
        },
      ],
    },
  ],
};
