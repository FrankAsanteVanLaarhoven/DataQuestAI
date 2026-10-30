/**
 * CSC2031: Secure Programming Curriculum Specification
 * Newcastle University • School of Computing • Stage 2 Core Module (20 Credits)
 * Canvas Course ID: 70337
 * Direct Canvas URL: https://ncl.instructure.com/courses/70337
 * Accredited Syllabus Specification with Academic References, OWASP Standards & Enterprise Benchmarks.
 * Organized in standard 12-Week Semester Sequence with Canvas Module Integration & Exam Hub.
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';

export const CSC2031_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Foundations of Secure Programming & Threat Modeling',
    badge: 'Security Foundations',
    tagline: 'Security by design, CIA triad, STRIDE threat modeling, and defensive mindset',
    accreditedSpec: 'CSC2031 Specification: Topic 1.1 — Secure Coding Principles, Threat Modeling (STRIDE), and CIA Triad',
    referencePoint: {
      academic: 'Anderson, R. (2020). Security Engineering: A Guide to Building Dependable Distributed Systems (3rd Ed.), Chapters 1 & 3. Wiley.',
      standard: 'ISO/IEC 27001:2022 Information Security, Cybersecurity and Privacy Protection & OWASP Top 10:2021 A04 Insecure Design.',
      enterprise: 'Microsoft Threat Modeling Tool & STRIDE methodology across cloud microservices.',
    },
    pedagogy: {
      simple: 'Writing code that works is not enough; we must write code that keeps working even when someone tries to break it. Threat modeling is like thinking like a burglar before building the house so you put locks on the right doors and windows.',
      engineer: 'Security is a non-functional attribute evaluated via the CIA Triad (Confidentiality, Integrity, Availability) alongside Authenticity and Non-repudiation. STRIDE systematically categorizes threats into Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, and Elevation of Privilege across Data Flow Diagrams (DFD).',
    },
    narration: 'Week 1 establishes the foundations of Secure Programming. We study the CIA triad, analyze historical vulnerability root causes, and learn Microsoft STRIDE threat modeling to decompose system trust boundaries before writing a single line of application code.',
    capstone: {
      id: 'cap_stride_threat_model',
      title: 'Interactive STRIDE Threat Modeling & Trust Boundary Lab',
      description: 'Deconstruct a web application data flow diagram, map trust boundaries between untrusted clients and internal databases, and mitigate elevation-of-privilege threats.',
    },
    quiz: {
      question: 'Under the STRIDE threat modeling methodology, which threat corresponds directly to the violation of data integrity?',
      options: [
        'Tampering',
        'Spoofing',
        'Information Disclosure',
        'Repudiation',
      ],
      correctIndex: 0,
      explanation: 'Tampering involves unauthorized modification of data or code in transit or at rest, which directly violates the security property of Integrity.',
    },
  },
  {
    week: 2,
    title: 'Authentication & Credential Storage Architecture',
    badge: 'Authentication',
    tagline: 'Password hashing, PBKDF2, Argon2, salts, timing attacks, and MFA protocols',
    accreditedSpec: 'CSC2031 Specification: Topic 1.2 — Authentication Mechanisms, Cryptographic Password Hashing, and Salt Derivation',
    referencePoint: {
      academic: 'Howard, M. & LeBlanc, D. (2003). Writing Secure Code (2nd Ed.), Chapter 6: Authentication. Microsoft Press.',
      standard: 'NIST SP 800-63B: Digital Identity Guidelines — Authentication and Lifecycle Management.',
      enterprise: 'OWASP Password Storage Cheat Sheet: Recommended PBKDF2-HMAC-SHA256 (600,000 iterations) and Argon2id.',
    },
    pedagogy: {
      simple: 'Never save a user’s real password in a database! If hackers steal the database, they would see all passwords. Instead, we run the password through a one-way mathematical blender called a cryptographic hash, adding a unique random salt for every user so rainbow tables fail.',
      engineer: 'Storing plaintext or unsalted hashes exposes systems to precomputed dictionary and rainbow table attacks. Modern authentication utilizes adaptive, memory-hard key derivation functions (Argon2id, PBKDF2-HMAC-SHA256 with 600k+ iterations, or bcrypt) combined with per-user CSPRNG salts. Verifications must use constant-time comparisons (crypto.timingSafeEqual) to eliminate side-channel timing leaks.',
    },
    narration: 'In Week 2, we dive into secure authentication architectures. We examine why fast hash algorithms like MD5 and SHA-256 are dangerous for password storage, demonstrate GPU brute-force resistance using PBKDF2 and Argon2, and enforce constant-time equality checks.',
    capstone: {
      id: 'cap_auth_hasher',
      title: 'Interactive PBKDF2 & Argon2 Password Hashing Simulator',
      description: 'Benchmark password hashing speeds, generate cryptographically secure random salts, and verify hashes using constant-time comparison algorithms.',
    },
    quiz: {
      question: 'Why are standard SHA-256 or MD5 hashing algorithms considered insecure for password storage?',
      options: [
        'Modern GPUs and ASICs can compute billions of SHA-256 hashes per second, making offline brute-force trivial',
        'SHA-256 hashes are reversible using standard mathematical inverse operations',
        'SHA-256 produces variable-length output that leaks password length',
        'Web browsers cannot send SHA-256 payloads over HTTPS',
      ],
      correctIndex: 0,
      explanation: 'General-purpose cryptographic hashes like SHA-256 are designed to be fast for data integrity, which allows attackers with GPUs to test billions of password candidates per second. Password storage requires slow, memory-hard Key Derivation Functions like Argon2 or PBKDF2.',
    },
  },
  {
    week: 3,
    title: 'Session Management, Cookies & CSRF Defense',
    badge: 'Sessions & CSRF',
    tagline: 'Stateful sessions, JWT tokens, HttpOnly/SameSite cookies, and Anti-CSRF tokens',
    accreditedSpec: 'CSC2031 Specification: Topic 2.1 — Session Hijacking, Secure Cookie Flags, and Cross-Site Request Forgery (CSRF)',
    referencePoint: {
      academic: 'Stuttard, D. & Pinto, M. (2011). The Web Application Hacker’s Handbook (2nd Ed.), Chapter 7: Attacking Session Management. Wiley.',
      standard: 'IETF RFC 6265bis: Cookies: HTTP State Management Mechanism (SameSite=Strict/Lax/None, Secure, HttpOnly).',
      enterprise: 'OWASP Cross-Site Request Forgery (CSRF) Prevention Cheat Sheet & Synchronizer Token Pattern.',
    },
    pedagogy: {
      simple: 'When you log in, the website hands your browser a digital wristband called a session cookie. If bad websites can trick your browser into sending that wristband without your permission, that is CSRF. We protect it with HttpOnly locks and secret Anti-CSRF verification tokens.',
      engineer: 'Session fixation and hijacking occur when session identifiers are predictable, leaked in URLs, or accessible via JavaScript (document.cookie). Defenses require high-entropy CSPRNG session IDs (128+ bits), regenerated upon authentication, marked HttpOnly, Secure, and SameSite=Lax/Strict. State-changing requests must be protected against CSRF via the Synchronizer Token Pattern or Double Submit Cookie pattern.',
    },
    narration: 'Week 3 analyzes web session security. We dissect session hijacking vectors, compare server-side stateful sessions against stateless JSON Web Tokens, configure HTTP security flags, and implement anti-CSRF token verification.',
    capstone: {
      id: 'cap_session_guard',
      title: 'Interactive Session Hijacking & CSRF Defense Simulator',
      description: 'Simulate cross-origin forgery attacks, observe cookie transmission under different SameSite policies, and validate cryptographic anti-CSRF headers.',
    },
    quiz: {
      question: 'Which cookie attribute prevents client-side JavaScript from accessing session cookies via document.cookie?',
      options: [
        'HttpOnly',
        'Secure',
        'SameSite=Strict',
        'Domain',
      ],
      correctIndex: 0,
      explanation: 'The HttpOnly flag instructs the browser that the cookie must not be accessible via client-side scripts, mitigating credential theft via Cross-Site Scripting (XSS).',
    },
  },
  {
    week: 4,
    title: 'Injection Attacks & Parameterized SQL Defense',
    badge: 'Injection Defense',
    tagline: 'SQL Injection, blind SQLi, command injection, and AST parameterized queries',
    accreditedSpec: 'CSC2031 Specification: Topic 2.2 — SQL Injection Vectors, Command Injection, and Prepared Statements',
    referencePoint: {
      academic: 'Halfond, W.G., Viegas, J., & Orso, A. (2006). A Classification of SQL Injection Attacks and Countermeasures. IEEE ISESE.',
      standard: 'OWASP Top 10:2021 A03 Injection & OWASP SQL Injection Prevention Cheat Sheet.',
      enterprise: 'PostgreSQL libpq parameterized protocol ($1, $2) & Object-Relational Mappers (ORM) query sanitization.',
    },
    pedagogy: {
      simple: 'Imagine telling a librarian: "Find me books by Shakespeare OR delete all books". If the librarian follows both instructions, that is SQL Injection! We stop this by strictly separating the instruction code from the user’s text data using prepared statements.',
      engineer: 'SQL Injection occurs when untrusted input is concatenated directly into SQL command strings, altering the lexical meaning and AST structure of the query. Defense relies on prepared statements with parameter binding, which compiles the query AST beforehand and treats user parameters strictly as literal values rather than executable syntax.',
    },
    narration: 'In Week 4, we examine SQL and Command Injection. We observe how string concatenation alters query syntax trees, test Union-based and Boolean blind SQLi exploits, and demonstrate how parameterized prepared statements eliminate injection at the parser level.',
    capstone: {
      id: 'cap_sqli_sandbox',
      title: 'Interactive SQL Injection Attack & Remediation Sandbox',
      description: 'Inject payloads into vulnerable dynamic queries, observe query AST mutation, and rewrite queries using parameterized prepared statements.',
    },
    quiz: {
      question: 'Why do prepared statements (parameterized queries) guarantee immunity against SQL injection?',
      options: [
        'The database compiles the query structure into an execution plan before binding parameters as pure data values, preventing AST alteration',
        'Prepared statements strip all quotation marks and spaces from user input',
        'Prepared statements execute queries in an encrypted sandbox outside the relational engine',
        'The database converts all input strings into hexadecimal integers before running',
      ],
      correctIndex: 0,
      explanation: 'Prepared statements separate code from data. The query template is parsed and compiled first; parameter values supplied later are strictly evaluated as literal data values and cannot change the parsed syntax tree.',
    },
  },
  {
    week: 5,
    title: 'Cross-Site Scripting (XSS) & Content Security Policy',
    badge: 'XSS & CSP',
    tagline: 'Stored, Reflected, and DOM-based XSS, context-aware output encoding, and CSP headers',
    accreditedSpec: 'CSC2031 Specification: Topic 3.1 — Cross-Site Scripting (XSS) Taxonomies, Context-Aware Escaping, and W3C CSP',
    referencePoint: {
      academic: 'Zalewski, M. (2011). The Tangled Web: A Guide to Securing Modern Web Applications, Chapters 8 & 9. No Starch Press.',
      standard: 'W3C Content Security Policy Level 3 & OWASP Cross Site Scripting Prevention Cheat Sheet.',
      enterprise: 'Google CSP Evaluator & Strict-Dynamic nonce-based Content Security Policy deployments.',
    },
    pedagogy: {
      simple: 'XSS happens when a website displays user comments without cleaning them, allowing a malicious user to inject JavaScript that runs in other people’s browsers to steal their passwords. We prevent this by encoding all special characters and enforcing strict Content Security Policies.',
      engineer: 'XSS manifests as Stored (persistent in database), Reflected (bounced off server in query params), or DOM-based (client script sinks like element.innerHTML or eval). Defenses require contextual output encoding (HTML body, attribute, JavaScript, or CSS contexts) alongside defense-in-depth W3C Content Security Policy (CSP) headers restricting script-src execution.',
    },
    narration: 'Week 5 explores Cross-Site Scripting. We trace malicious payloads from input sinks to output execution, contrast stored and DOM-based XSS, implement contextual sanitization, and author strict Content Security Policy directives with cryptographic nonces.',
    capstone: {
      id: 'cap_xss_encoder',
      title: 'Interactive Context-Aware HTML/JS Sanitizer & CSP Generator',
      description: 'Test XSS payloads across HTML, attribute, and JavaScript contexts, observe sanitization transforms, and validate HTTP Content-Security-Policy headers.',
    },
    quiz: {
      question: 'Which Content Security Policy directive prevents inline <script> tags from executing unless signed with an authorized cryptographic nonce?',
      options: [
        "script-src 'nonce-{random}'",
        "default-src 'self'",
        "style-src 'unsafe-inline'",
        "object-src 'none'",
      ],
      correctIndex: 0,
      explanation: "Specifying script-src with a cryptographic nonce (e.g. 'nonce-rAnd0m123') blocks all inline scripts lacking matching nonce attributes, preventing injected XSS payloads from executing.",
    },
  },
  {
    week: 6,
    title: 'Authorization, RBAC & Broken Object Level Authorization (BOLA)',
    badge: 'Authorization & BOLA',
    tagline: 'Role-Based Access Control, IDOR / BOLA vulnerabilities, and least privilege enforcement',
    accreditedSpec: 'CSC2031 Specification: Topic 3.2 — Access Control Models (RBAC, ABAC), Insecure Direct Object References (IDOR), and BOLA',
    referencePoint: {
      academic: 'Ferraiolo, D.F., Sandhu, R., Gavrila, S., Kuhn, D.R., & Chandramouli, R. (2001). Proposed NIST Standard for Role-Based Access Control. ACM TISSEC.',
      standard: 'NIST SP 800-162: Guide to Attribute Based Access Control (ABAC) Definition and Considerations.',
      enterprise: 'OWASP API Security Top 10:2023 API1 Broken Object Level Authorization (BOLA / IDOR).',
    },
    pedagogy: {
      simple: 'Authentication checks WHO you are; Authorization checks WHAT you are allowed to do. If changing the order number in a website link from 101 to 102 lets you see someone else’s private receipt, that is Broken Object Level Authorization! The server must always check ownership.',
      engineer: 'Insecure Direct Object References (IDOR) and Broken Object Level Authorization (BOLA) occur when an API endpoint uses user-supplied keys to fetch resources without verifying that the authenticated user possesses authorization on that specific object instance. Robust systems enforce authoritative server-side ownership predicates (e.g. WHERE id = :id AND owner_id = :session_user_id).',
    },
    narration: 'In Week 6, we analyze authorization vulnerabilities. We compare Role-Based and Attribute-Based Access Control, demonstrate BOLA/IDOR exploit chains in REST APIs, and implement server-side ownership verification guards on all database mutations.',
    capstone: {
      id: 'cap_bola_guard',
      title: 'Interactive BOLA / IDOR Vulnerability Hunter & Authorization Guard',
      description: 'Simulate privilege escalation across student, teacher, and admin endpoints, test IDOR parameter manipulation, and enforce strict ownership checks.',
    },
    quiz: {
      question: 'What is the primary root cause of Broken Object Level Authorization (BOLA / IDOR)?',
      options: [
        'The server trusts the user-supplied object identifier in the request without validating whether the active session has access rights to that specific entity',
        'The database does not support primary keys',
        'The client browser is not configured with HTTPS',
        'The server uses JSON instead of XML for serialization',
      ],
      correctIndex: 0,
      explanation: 'BOLA/IDOR occurs when an application exposes a reference to an internal object (e.g. user ID or document ID) and relies on user input to retrieve it without performing server-side authorization checks against the current session identity.',
    },
  },
  {
    week: 7,
    title: 'Cryptographic Protocols: TLS, Certificates & Public Key Infrastructure',
    badge: 'Cryptography & TLS',
    tagline: 'Symmetric vs asymmetric encryption, RSA/ECC, TLS 1.3 handshake, and MITM defense',
    accreditedSpec: 'CSC2031 Specification: Topic 4.1 — Public Key Cryptography, X.509 Certificates, TLS 1.3 Handshake, and PFS',
    referencePoint: {
      academic: 'Katz, J. & Lindell, Y. (2020). Introduction to Modern Cryptography (3rd Ed.), Chapters 10 & 11. CRC Press.',
      standard: 'IETF RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3 & NIST FIPS 186-5 Digital Signature Standard.',
      enterprise: 'Let’s Encrypt automated ACME certificate issuance and Ephemeral Diffie-Hellman (ECDHE) Perfect Forward Secrecy.',
    },
    pedagogy: {
      simple: 'When browsing the web, how do you know nobody is eavesdropping on your passwords? TLS encryption scrambles the message into gibberish. Asymmetric keys exchange a shared secret in the open, and then super-fast symmetric encryption protects all messages.',
      engineer: 'TLS 1.3 eliminates obsolete cipher suites, mandating Ephemeral Diffie-Hellman (ECDHE) for Perfect Forward Secrecy (PFS), ensuring compromised server private keys cannot decrypt recorded historical traffic. X.509 certificates authenticate public keys via a hierarchical Public Key Infrastructure (PKI) verified through cryptographic signature chains to trusted Root Certificate Authorities.',
    },
    narration: 'Week 7 explores network cryptography. We dissect the 1-RTT TLS 1.3 cryptographic handshake, differentiate symmetric (AES-GCM) and asymmetric (RSA/ECDSA) algorithms, examine digital certificate validation, and explain Perfect Forward Secrecy.',
    capstone: {
      id: 'cap_tls_handshake',
      title: 'Interactive TLS 1.3 Handshake & Certificate Chain Inspector',
      description: 'Step through ClientHello, ServerHello, ECDHE key exchange, and X.509 digital signature verification in a simulated transport stream.',
    },
    quiz: {
      question: 'What security guarantee does Perfect Forward Secrecy (PFS) provide in TLS 1.3?',
      options: [
        'Even if the server’s long-term private key is compromised in the future, past recorded encrypted sessions cannot be decrypted',
        'The server can never suffer a denial of service attack',
        'Passwords stored in the database are automatically encrypted',
        'Client browsers never need to verify the certificate authority chain',
      ],
      correctIndex: 0,
      explanation: 'PFS generates unique ephemeral session keys for each TLS connection using Diffie-Hellman key exchange. Compromising the server’s static private key later does not allow an attacker to reconstruct past session keys.',
    },
  },
  {
    week: 8,
    title: 'Input Validation, Whitelisting & Secure Deserialization',
    badge: 'Input Validation',
    tagline: 'Positive validation vs blacklisting, regex DoS (ReDoS), and insecure object deserialization',
    accreditedSpec: 'CSC2031 Specification: Topic 4.2 — Input Validation Strategies, ReDoS Vulnerabilities, and Insecure Deserialization',
    referencePoint: {
      academic: 'CWE-20: Improper Input Validation & CWE-502: Deserialization of Untrusted Data. MITRE Corporation.',
      standard: 'OWASP Input Validation Cheat Sheet & OWASP Deserialization Cheat Sheet.',
      enterprise: 'JSON Schema / Zod runtime validation vs Java native object deserialization (ysoserial gadget chains).',
    },
    pedagogy: {
      simple: 'Never trust input from the outside world! Blacklisting (blocking known bad words) always fails because attackers find new spellings. Instead, use whitelisting: only accept data that matches strict rules (e.g. an age must be a whole number between 1 and 120).',
      engineer: 'Input validation must enforce positive specifications (whitelisting): data type, character set, length bounds, and format syntax. Deserializing untrusted binary object streams (Python pickle, Java ObjectInputStream, PHP unserialize) allows remote code execution via gadget chains executing during deserialization. Applications must deserialize strictly into safe, inert formats (JSON) with structural runtime validation schemas.',
    },
    narration: 'In Week 8, we study input validation and deserialization. We investigate catastrophic backtracking in regular expressions (ReDoS), demonstrate remote code execution via insecure object deserialization, and implement type-safe runtime schema validators.',
    capstone: {
      id: 'cap_input_validator',
      title: 'Interactive ReDoS Analyzer & Type-Safe Schema Validator',
      description: 'Benchmark catastrophic backtracking in vulnerable regex patterns and configure strict schema-driven input validators with boundary bounds.',
    },
    quiz: {
      question: 'Why is whitelisting (accept-known-good) superior to blacklisting (reject-known-bad) in security validation?',
      options: [
        'Blacklists cannot anticipate all evasion techniques, encoding variations, and novel payloads, leaving gaps attackers can exploit',
        'Whitelisting uses twice as much CPU memory as blacklisting',
        'Blacklists are only effective when used with SQLite databases',
        'Whitelisting is an automated browser extension that does not require server-side code',
      ],
      correctIndex: 0,
      explanation: 'Attackers frequently bypass blacklists using alternate encodings, Unicode variations, or novel syntax. Whitelisting defines explicit acceptable boundaries; anything outside those boundaries is safely rejected.',
    },
  },
  {
    week: 9,
    title: 'Secure Error Handling, Defensive Logging & Data Leakage',
    badge: 'Error & Logging',
    tagline: 'Stack trace exposure, fail-safe defaults, audit logging, and PII log redaction',
    accreditedSpec: 'CSC2031 Specification: Topic 5.1 — Fail-Safe Error Handling, Audit Logging Best Practices, and Sensitive Data Exposure',
    referencePoint: {
      academic: 'Saltzer, J.H. & Schroeder, M.D. (1975). The Protection of Information in Computer Systems. Proceedings of the IEEE, 63(9), pp. 1278–1308.',
      standard: 'CWE-209: Generation of Error Message Containing Sensitive Information & OWASP Logging Cheat Sheet.',
      enterprise: 'UK Data Protection Act 2018 / GDPR Article 32: Security of processing and PII masking in Elasticsearch/Datadog.',
    },
    pedagogy: {
      simple: 'When an error happens, tell the user something went wrong with a helpful reference code, but never dump internal code secrets or database passwords on the screen! Also, make sure your log files record security events without accidentally saving users’ passwords.',
      engineer: 'Verbose stack traces displayed to clients violate the principle of Information Hiding, leaking framework versions, internal file paths, database schemas, and configuration variables. Applications must catch exceptions, log redacted forensic details internally with correlation IDs, and emit sanitized generic error responses. Log sinks must filter credentials, tokens, and PII to prevent compliance breaches.',
    },
    narration: 'Week 9 focuses on error handling and defensive logging. We analyze how verbose stack traces accelerate vulnerability reconnaissance, implement global error boundaries with correlation IDs, and construct automated log redaction filters for PII and credentials.',
    capstone: {
      id: 'cap_error_sanitizer',
      title: 'Interactive Error Boundary Sanitizer & PII Log Redaction Engine',
      description: 'Trigger deliberate database exceptions, observe client-side information leakage, and enforce server-side error redaction with correlation IDs.',
    },
    quiz: {
      question: 'Which piece of information should NEVER be written to application log files in production?',
      options: [
        'Plaintext user passwords or payment card verification values (CVV)',
        'HTTP request response status codes',
        'Client IP addresses',
        'Timestamp of the transaction',
      ],
      correctIndex: 0,
      explanation: 'Logging plaintext passwords, authentication tokens, or payment card security codes creates severe security vulnerabilities and directly violates PCI-DSS and GDPR regulations.',
    },
  },
  {
    week: 10,
    title: 'Software Supply Chain Security & Dependency Auditing',
    badge: 'Supply Chain',
    tagline: 'Third-party dependencies, Software Bill of Materials (SBOM), typosquatting, and automated CI auditing',
    accreditedSpec: 'CSC2031 Specification: Topic 5.2 — Software Supply Chain Risk, Dependency Vulnerability Auditing, and SBOM Management',
    referencePoint: {
      academic: 'Ohm, M., Plate, H., Sykosch, A., & Meier, M. (2020). Backstabber’s Knife Collection: A Review of Open Source Software Supply Chain Attacks. DIMVA.',
      standard: 'Executive Order 14028: Improving the Nation’s Cybersecurity (SBOM mandate) & CycloneDX / SPDX specifications.',
      enterprise: 'npm audit, GitHub Dependabot, Snyk, and OWASP Dependency-Check automated pipeline scanning.',
    },
    pedagogy: {
      simple: 'Most modern apps are built from hundreds of open-source packages written by strangers. If one package gets hacked, your entire app can be compromised! Software supply chain security is about checking every ingredient in your recipe with automated scanners.',
      engineer: 'Modern software assemblies comprise up to 90% transitive open-source dependencies. Attack vectors include typosquatting, compromised maintainer credentials, and malicious post-install lifecycle scripts. Mitigations require Software Bill of Materials (SBOM) generation, lockfile pinning, cryptographically verified package signatures, and automated vulnerability gating (npm audit, Snyk, Trivy) in CI/CD.',
    },
    narration: 'In Week 10, we examine software supply chain risks. We inspect open-source dependency trees, evaluate real attacks like event-stream and Log4j, generate CycloneDX Software Bills of Materials, and integrate automated vulnerability scanning into deployment pipelines.',
    capstone: {
      id: 'cap_sbom_auditor',
      title: 'Interactive Dependency Tree Vulnerability Scanner & SBOM Generator',
      description: 'Audit a package dependency manifest for known CVEs, detect malicious package typosquats, and generate an industry-standard CycloneDX SBOM.',
    },
    quiz: {
      question: 'What is a Software Bill of Materials (SBOM)?',
      options: [
        'A formal, machine-readable inventory of all software components, libraries, and transitive dependencies that constitute an application',
        'A commercial invoice sent to clients for licensing cloud software',
        'A hardware specification sheet for rack-mounted servers',
        'A database schema diagram created in UML',
      ],
      correctIndex: 0,
      explanation: 'An SBOM provides a formal, structured list of all third-party components and transitive dependencies included in a software build, enabling rapid vulnerability assessment when new CVEs are discovered.',
    },
  },
  {
    week: 11,
    title: 'AI Security & LLM Vulnerabilities: Prompt Injection & Insecure Output',
    badge: 'AI & LLM Security',
    tagline: 'Prompt injection, jailbreaking, insecure output handling, data poisoning, and OWASP Top 10 for LLMs',
    accreditedSpec: 'CSC2031 Specification: Topic 6.1 — Generative AI Security Vectors, Prompt Injection (Direct/Indirect), and LLM Guardrails',
    referencePoint: {
      academic: 'Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., & Fritz, M. (2023). Not what you\'ve signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection. ACM AISec.',
      standard: 'OWASP Top 10 for Large Language Model Applications (LLM01 Prompt Injection, LLM02 Insecure Output Handling).',
      enterprise: 'Llama Guard, NeMo Guardrails, and human-in-the-loop validation for enterprise AI pipelines.',
    },
    pedagogy: {
      simple: 'When we build AI features into our applications, AI models can be tricked just like humans! Attackers can hide secret instructions inside text (Prompt Injection) to make the AI ignore its rules or reveal private database records. We need guardrails to inspect both what goes into the AI and what comes out.',
      engineer: 'Large Language Models lack a formal separation between control instructions and data payloads. In direct prompt injection, users override system prompts; in indirect injection, untrusted external documents contain hidden adversarial instructions executed when parsed by the LLM. Mitigation requires semantic input guardrails, dual-LLM verifiers, strict least-privilege tool execution, and contextual output encoding before rendering AI outputs.',
    },
    narration: 'Week 11 investigates the emerging frontier of Generative AI and LLM security. We dissect direct and indirect prompt injection attacks, test multi-turn jailbreak techniques, evaluate OWASP Top 10 for LLMs, and implement automated input/output guardrails.',
    capstone: {
      id: 'cap_llm_guardrails',
      title: 'Interactive Prompt Injection Defense & AI Guardrail Evaluator',
      description: 'Simulate direct and indirect prompt injection attacks against an enterprise AI tutor, test system prompt extraction, and implement layered semantic guardrails.',
    },
    quiz: {
      question: 'What constitutes an Indirect Prompt Injection attack in an LLM-powered application?',
      options: [
        'An adversarial prompt embedded within an external data source (such as a webpage, email, or database record) that is read and executed by the LLM during processing',
        'A physical hardware glitch in the GPU memory controller',
        'A brute-force attack against the user’s password',
        'A DNS spoofing attack against the LLM API endpoint',
      ],
      correctIndex: 0,
      explanation: 'In indirect prompt injection, the attacker does not interact with the LLM directly; instead, they plant instructions in external content (e.g. an email or document) that the LLM ingests, causing the model to deviate from its intended instructions.',
    },
  },
  {
    week: 12,
    title: 'Comprehensive Security Audit, Pen-Testing & DevSecOps Capstone',
    badge: 'Security Capstone',
    tagline: 'Full-spectrum penetration test, vulnerability scoring (CVSS), remediation verification, and final exam prep',
    accreditedSpec: 'CSC2031 Specification: Topic 6.2 — Security Auditing, CVSS v3.1 Scoring, Automated DevSecOps, and Capstone Mastery',
    referencePoint: {
      academic: 'McGraw, G. (2006). Software Security: Building Security In. Addison-Wesley Professional.',
      standard: 'NIST SP 800-115: Technical Guide to Information Security Testing and Assessment & FIRST CVSS v3.1 Specification.',
      enterprise: 'Red Team / Blue Team penetration testing exercises, Bug Bounty workflows, and shift-left DevSecOps automation.',
    },
    pedagogy: {
      simple: 'Congratulations on reaching the final week! In this capstone, you become both the ethical hacker who finds the vulnerabilities and the senior security architect who fixes them. You will audit an entire web application, score each flaw by risk, and prove it is bulletproof.',
      engineer: 'The security capstone integrates all 12 weeks into an end-to-end audit: threat modeling, static analysis (SAST), dynamic analysis (DAST), dependency auditing (SCA), and manual penetration testing. Students classify findings using the Common Vulnerability Scoring System (CVSS v3.1), implement remediation patches across authentication, session, SQL, XSS, and authorization layers, and verify zero regressions.',
    },
    narration: 'Welcome to the Week 12 Capstone. We synthesize the entire Secure Programming curriculum into a comprehensive security audit. You will identify vulnerabilities across an integrated multi-tier enterprise web application, calculate CVSS scores, patch code flaws, and prove production readiness.',
    capstone: {
      id: 'cap_enterprise_security_audit',
      title: 'Full-Spectrum Enterprise Web Security Audit & CVSS Patching Lab',
      description: 'Conduct a penetration test on a multi-tier university web system, discover 5 critical vulnerabilities, compute CVSS scores, and deploy defensive code patches.',
    },
    quiz: {
      question: 'In the CVSS v3.1 vulnerability scoring metric, what are the three primary metric groups evaluated?',
      options: [
        'Base Metric Group, Temporal Metric Group, and Environmental Metric Group',
        'Database Metric Group, Network Metric Group, and Client Metric Group',
        'Confidentiality Group, Integrity Group, and Availability Group only',
        'Cost Group, Duration Group, and Staff Group',
      ],
      correctIndex: 0,
      explanation: 'CVSS v3.1 evaluates vulnerabilities across Base metrics (intrinsic qualities), Temporal metrics (characteristics that change over time like exploit availability), and Environmental metrics (qualities specific to a user’s environment).',
    },
  },
];

export const CANVAS_COURSE_METADATA_2031 = {
  courseId: 70337,
  moduleCode: 'CSC2031',
  moduleTitle: 'Secure Programming',
  canvasUrl: 'https://ncl.instructure.com/courses/70337/modules',
  academicInstitution: 'Newcastle University',
  faculty: 'School of Computing, Urban Sciences Building (USB)',
  academicYear: '2025/2026',
  credits: 20,
  staff: [
    {
      name: 'Dr Charles Morisset',
      email: 'charles.morisset@ncl.ac.uk',
      role: 'Module Leader & Senior Lecturer in Cyber Security',
      office: 'Urban Sciences Building (USB), Room 3.024',
    },
    {
      name: 'Dr Feng Hao',
      email: 'feng.hao@ncl.ac.uk',
      role: 'Lecturer (Cryptographic Protocols & Applied Security)',
      office: 'Urban Sciences Building (USB)',
    },
    {
      name: 'Dr Maryam Mehrnezhad',
      email: 'maryam.mehrnezhad@ncl.ac.uk',
      role: 'Lecturer (Web Application Security & Privacy)',
      office: 'Urban Sciences Building (USB)',
    },
  ],
  assessments: [
    {
      title: 'Coursework 1: Secure Web Application Implementation & Threat Model',
      weight: '50%',
      type: 'Technical Practical Portfolio',
      due: 'Week 7, Semester 1',
    },
    {
      title: 'Coursework 2: Vulnerability Audit, Pen-Test & Remediation Patching',
      weight: '50%',
      type: 'Defensive Security Report & Verified Code Patches',
      due: 'Week 12, Semester 1',
    },
  ],
};

export const CANVAS_MODULES_2031: CanvasModuleTopic[] = [
  {
    moduleNumber: 1,
    title: 'Module 1: Security Foundations, Threat Modeling & Defensive Design',
    state: 'active',
    readingReference: 'Anderson (2020), Ch. 1-3 • ISO/IEC 27001 • OWASP Top 10 Insecure Design',
    associatedWeek: 1,
    items: [
      { id: 'sec-mod-1-1', title: 'Lecture 1.1: Security Principles and the CIA Triad', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-1-2', title: 'Lecture 1.2: Microsoft STRIDE Threat Modeling Methodology', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-1-3', title: 'Lab Practical 1: Deconstructing Data Flow Diagrams & Identifying Trust Boundaries', type: 'practical', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-1-4', title: 'Academic Reading: Saltzer & Schroeder Design Principles', type: 'reading', url: 'https://ncl.instructure.com/courses/70337/modules' },
    ],
  },
  {
    moduleNumber: 2,
    title: 'Module 2: Cryptographic Password Hashing & Authentication Architecture',
    state: 'active',
    readingReference: 'NIST SP 800-63B • OWASP Password Storage Cheat Sheet • RFC 2898 (PBKDF2)',
    associatedWeek: 2,
    items: [
      { id: 'sec-mod-2-1', title: 'Lecture 2.1: The Mathematics of One-Way Cryptographic Hashes & Salts', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-2-2', title: 'Lecture 2.2: Memory-Hard KDFs (PBKDF2, Argon2id, bcrypt) vs GPU Cracking', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-2-3', title: 'Lab Practical 2: Building a Cryptographically Secure User Registration System', type: 'practical', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-2-4', title: 'Security Quiz: Authentication & Side-Channel Timing Defense', type: 'quiz', url: 'https://ncl.instructure.com/courses/70337/modules' },
    ],
  },
  {
    moduleNumber: 3,
    title: 'Module 3: Web Application Session Management & CSRF Defense',
    state: 'active',
    readingReference: 'RFC 6265bis • OWASP Session Management & Cross-Site Request Forgery Cheat Sheets',
    associatedWeek: 3,
    items: [
      { id: 'sec-mod-3-1', title: 'Lecture 3.1: Session Identifiers, Token Entropy & Fixation Attacks', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-3-2', title: 'Lecture 3.2: Cookie Security Flags (HttpOnly, Secure, SameSite) & Anti-CSRF', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-3-3', title: 'Lab Practical 3: Simulating CSRF Exploits & Implementing Synchronizer Tokens', type: 'practical', url: 'https://ncl.instructure.com/courses/70337/modules' },
    ],
  },
  {
    moduleNumber: 4,
    title: 'Module 4: Injection Vulnerabilities & Parameterized Query Defense',
    state: 'active',
    readingReference: 'Halfond et al. (IEEE ISESE) • OWASP A03:2021 Injection • PostgreSQL libpq documentation',
    associatedWeek: 4,
    items: [
      { id: 'sec-mod-4-1', title: 'Lecture 4.1: SQL Injection Mechanics & Syntax Tree Manipulation', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-4-2', title: 'Lecture 4.2: Prepared Statements, Parameter Binding & Blind SQLi', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-4-3', title: 'Lab Practical 4: Hardening Vulnerable Endpoints with Prepared Statements', type: 'practical', url: 'https://ncl.instructure.com/courses/70337/modules' },
    ],
  },
  {
    moduleNumber: 5,
    title: 'Module 5: Cross-Site Scripting (XSS) & Content Security Policy',
    state: 'active',
    readingReference: 'Zalewski (2011) The Tangled Web • W3C CSP Level 3 • OWASP XSS Prevention',
    associatedWeek: 5,
    items: [
      { id: 'sec-mod-5-1', title: 'Lecture 5.1: Stored, Reflected and DOM-Based XSS Taxonomies', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-5-2', title: 'Lecture 5.2: Contextual Output Encoding & Strict Nonce-Based CSP', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-5-3', title: 'Lab Practical 5: Building an XSS Defense Layer with Modern CSP Directives', type: 'practical', url: 'https://ncl.instructure.com/courses/70337/modules' },
    ],
  },
  {
    moduleNumber: 6,
    title: 'Module 6: Authorization Models & Broken Object Level Authorization',
    state: 'active',
    readingReference: 'NIST RBAC Standard (Ferraiolo et al.) • OWASP API Security Top 10 BOLA',
    associatedWeek: 6,
    items: [
      { id: 'sec-mod-6-1', title: 'Lecture 6.1: RBAC vs ABAC Access Control Architectures', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-6-2', title: 'Lecture 6.2: Detecting and Remediating Insecure Direct Object References (IDOR)', type: 'lecture', url: 'https://ncl.instructure.com/courses/70337/modules' },
      { id: 'sec-mod-6-3', title: 'Lab Practical 6: Implementing Strict Multi-Tenant Ownership Guards', type: 'practical', url: 'https://ncl.instructure.com/courses/70337/modules' },
    ],
  },
];

export const EXAM_QUESTIONS_2031: { A: ExamQuestion[]; B: ExamQuestion[] } = {
  A: [
    {
      id: 'q2031-a1',
      section: 'A',
      title: 'Question 1: Cryptographic Password Storage & Timing Attacks',
      marks: 10,
      scenario: 'A startup hashes passwords using single-iteration SHA-256 with no salt and compares submitted credentials using JavaScript string equality (===).',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Explain two specific attack vectors this storage mechanism is vulnerable to, identifying the mathematical or computational mechanisms that enable them.',
          marks: 5,
          markingCriteria: [
            '2 marks: Explanation of offline dictionary / precomputed rainbow table attacks due to missing unique per-user salt.',
            '3 marks: Explanation of high-speed GPU hash cracking (billions/sec) due to absence of memory-hard iterative key derivation function.',
          ],
          modelAnswer: '1. Rainbow Table / Dictionary Attack: Because no salt is used, identical passwords produce identical hashes. Attackers can look up hashes in precomputed tables instantly.\n2. GPU Brute-Force: SHA-256 is designed for fast data integrity checking. Modern GPUs compute tens of billions of SHA-256 hashes per second. Without a slow, memory-hard KDF (Argon2id, PBKDF2 with 600k iterations), passwords can be cracked offline in minutes.',
        },
        {
          part: '(b)',
          prompt: 'Explain why using standard string comparison (===) introduces a side-channel vulnerability, and provide the correct engineering remediation.',
          marks: 5,
          markingCriteria: [
            '2.5 marks: Identification of timing side-channel attack where comparison terminates at the first non-matching byte.',
            '2.5 marks: Recommendation of constant-time comparison (e.g. crypto.timingSafeEqual) with identical execution time regardless of byte match position.',
          ],
          modelAnswer: 'Standard string equality (===) executes early-exit comparison: it returns false immediately upon encountering the first differing byte. An attacker measuring response times with microsecond precision can infer how many leading bytes match, incrementally guessing the secret. Remediation: Use a constant-time comparison function such as crypto.timingSafeEqual() in Node.js, which always inspects every byte in fixed time.',
        },
      ],
    },
  ],
  B: [
    {
      id: 'q2031-b1',
      section: 'B',
      title: 'Question 2: Web Application Injection & Multi-Tier Authorization',
      marks: 15,
      scenario: 'An e-commerce API endpoint `/api/orders?order_id=` executes `SELECT * FROM Orders WHERE id = \'\' + req.query.order_id + \'\'`. Customers can view order details and receipts.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Construct a SQL injection payload that extracts the administrator password hash from the `Users` table via this endpoint, and explain how prepared statements prevent it.',
          marks: 8,
          markingCriteria: [
            '4 marks: Valid UNION SELECT payload aligning column counts and targeting Users table.',
            '4 marks: Explanation of AST pre-compilation in prepared statements separating code from data.',
          ],
          modelAnswer: "Payload: 1' UNION SELECT id, username, password_hash, email FROM Users WHERE role = 'admin' --\n\nExplanation: In dynamic string concatenation, the single quote breaks out of the string literal boundary, injecting a new UNION SELECT query into the parser's Abstract Syntax Tree (AST). Prepared statements prevent this by pre-compiling the SQL statement AST into database memory first; the parameter is bound purely as a literal data scalar and cannot alter query syntax.",
        },
        {
          part: '(b)',
          prompt: 'Even with prepared statements, this endpoint suffers from an authorization flaw. Identify this vulnerability (under OWASP taxonomy) and write the corrected SQL query enforcing tenancy.',
          marks: 7,
          markingCriteria: [
            '3 marks: Correctly identifying BOLA (Broken Object Level Authorization) / IDOR (Insecure Direct Object Reference).',
            '4 marks: Writing parameterized query incorporating authenticated session user ID: WHERE id = $1 AND customer_id = $2.',
          ],
          modelAnswer: "Vulnerability: Broken Object Level Authorization (BOLA), also classified as Insecure Direct Object Reference (IDOR) (OWASP API Top 10 API1).\n\nRoot Cause: Any authenticated customer can supply another customer's order_id and view their private receipt.\n\nRemediation Query:\nSELECT * FROM Orders WHERE id = $1 AND customer_id = $2;\nwhere $1 is the sanitized order_id and $2 is the authoritative session user ID extracted from the verified server-side session token.",
        },
      ],
    },
  ],
};
