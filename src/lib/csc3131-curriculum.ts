/**
 * CSC3131: Development and Operations of Systems (DevOps) Curriculum Specification
 * Newcastle University • School of Computing • Stage 3 Core Module (20 Credits)
 * Canvas Course ID: 70403
 * Direct Canvas URL: https://ncl.instructure.com/courses/70403
 * Accredited Syllabus Specification with Academic References, DORA Benchmarks & Google SRE Principles.
 * Organized in standard 12-Week Semester Sequence across Multi-Tier Systems, Observability, and Operations.
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';

export const CSC3131_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'DevOps Culture, The Three Ways & DORA Metrics',
    badge: 'DevOps & DORA',
    tagline: 'Flow, Feedback, Continual Learning, and the Four DORA Metrics measuring engineering performance',
    accreditedSpec: 'CSC3131 Specification: Topic 1.1 — DevOps Principles, Lean Thinking, and DORA High-Performance Metrics',
    referencePoint: {
      academic: 'Forsgren, N., Humble, J., & Kim, G. (2018). Accelerate: The Science of Lean Software and DevOps. IT Revolution Press.',
      standard: 'DORA (DevOps Research and Assessment) Annual State of DevOps Reports.',
      enterprise: 'Google Cloud DevOps assessment framework & Amazon two-pizza team service ownership ("you build it, you run it").',
    },
    pedagogy: {
      simple: 'In old software companies, developers wrote code and threw it over a wall to operators, who hated deploying changes because things broke! DevOps brings them into one unified team. DORA measures how good a team is using four numbers: how often you release, how fast changes ship, how often things break, and how fast you fix them.',
      engineer: 'DevOps is codified by The Three Ways (Gene Kim): 1) Systemic Flow from development to operations; 2) Amplified Feedback loops from right to left; 3) Continual Experimentation and Learning. The four authoritative DORA metrics benchmark engineering velocity and stability: Deployment Frequency (DF), Lead Time for Changes (LTFC), Change Failure Rate (CFR), and Time to Restore Service (TTRS). Elite performers deploy multiple times daily with lead times under one hour.',
    },
    narration: 'Week 1 launches Development and Operations of Systems. We analyze historical silos between dev and ops, examine Gene Kim’s Three Ways, and calculate the four authoritative DORA engineering velocity and stability metrics.',
    capstone: {
      id: 'cap_dora_metric_calculator',
      title: 'Interactive DORA Four-Metric Benchmarker & Pipeline Telemetry Lab',
      description: 'Compute real-world DORA metrics from simulated Git commits and deployment logs, diagnosing bottlenecks across lead time, deployment frequency, and recovery time.',
    },
    quiz: {
      question: 'Which of the following represents the four authoritative DORA metrics established in Accelerate?',
      options: [
        'Deployment Frequency, Lead Time for Changes, Change Failure Rate, and Time to Restore Service',
        'Lines of Code, Hours Worked, Number of Commits, and Bug Count',
        'CPU Utilization, RAM Footprint, Disk I/O, and Network Bandwidth',
        'Story Points, Velocity, Scrum Hours, and Standup Duration',
      ],
      correctIndex: 0,
      explanation: 'Accelerate established that software delivery performance is reliably measured by two velocity metrics (Deployment Frequency, Lead Time for Changes) and two stability metrics (Change Failure Rate, Time to Restore Service).',
    },
  },
  {
    week: 2,
    title: 'Systems for People: The Status Request & Multi-Tier Separation',
    badge: 'Multi-Tier Systems',
    tagline: 'Separation of concerns, Client -> Gateway -> App Logic -> Database topology, and shielding private ledgers',
    accreditedSpec: 'CSC3131 Specification: Topic 1.2 — Multi-Tier System Topology, Ingress Gateways, and Internal Ledger Isolation',
    referencePoint: {
      academic: 'Fowler, M. (2002). Patterns of Enterprise Application Architecture, Chapter 1: Layering. Addison-Wesley.',
      standard: 'NIST Special Publication 800-44: Guidelines on Securing Public Web Servers (DMZ Architecture).',
      enterprise: 'Stripe API Ingress Gateway architecture isolating financial ledgers from public consumer traffic.',
    },
    pedagogy: {
      simple: 'Imagine a bank where customers walk right into the vault to count their money! That would be insane. In computer systems, browsers must NEVER talk directly to the database. We put an API Gateway (the bank lobby) and an Application Server (the teller) in between to check credentials first.',
      engineer: 'The Status Request challenge exemplifies the multi-tier architectural contract. Public clients interact exclusively with an Ingress Gateway or Reverse Proxy located in the DMZ. The Gateway routes authenticated requests to the internal Application Tier, which alone executes business logic and communicates with authoritative databases/ledgers via private networking. Direct client-to-database connections are strictly prohibited.',
    },
    narration: 'In Week 2, we tackle Systems for People and Challenge 6: The Status Request. We configure multi-tier topologies, place reverse-proxy gateways between untrusted clients and business services, and isolate authoritative database ledgers.',
    capstone: {
      id: 'cap_status_request_lab',
      title: 'Foundry Challenge: Shielding the Status Request Ledger',
      description: 'Wire a Payments Desk client through an API Gateway to the App Logic tier, ensuring zero direct network pathways to the private PostgreSQL ledger.',
    },
    quiz: {
      question: 'Why must client-side web browsers NEVER be allowed to open direct TCP connections to a production database ledger?',
      options: [
        'Clients could bypass business validation, exploit database credentials exposed in client-side code, and exhaust database connection pools',
        'Relational databases do not support internet protocols',
        'Web browsers cannot display database tables without flash plugins',
        'PostgreSQL is incompatible with the Linux operating system',
      ],
      correctIndex: 0,
      explanation: 'Direct client-to-database access exposes database credentials, bypasses all business logic and access-control validation in the application tier, and allows attackers to execute arbitrary SQL or exhaust database connection capacity.',
    },
  },
  {
    week: 3,
    title: 'Infrastructure as Code (IaC) & Cloud Provisioning',
    badge: 'Infrastructure as Code',
    tagline: 'Declarative vs imperative infrastructure, Terraform, state files, drift detection, and cloud idempotency',
    accreditedSpec: 'CSC3131 Specification: Topic 2.1 — Declarative Infrastructure as Code (IaC), State Management, and Idempotency',
    referencePoint: {
      academic: 'Morris, K. (2020). Infrastructure as Code: Dynamic Systems for the Cloud Age (2nd Ed.). O’Reilly Media.',
      standard: 'HashiCorp Configuration Language (HCL2) & OpenTofu / Terraform 1.5+ specifications.',
      enterprise: 'AWS CloudFormation, Google Cloud Deployment Manager, and automated Terraform Cloud CI/CD provisioning.',
    },
    pedagogy: {
      simple: 'In the old days, setting up servers meant clicking around in cloud control panels and hoping you remembered every setting. Infrastructure as Code lets you describe your entire cloud setup in a text file! If a data center burns down, you run one command and recreate the exact same servers in minutes.',
      engineer: 'IaC treats infrastructure provisioning with software engineering rigor (version-controlled, tested, automated). Declarative approaches (Terraform HCL, Kubernetes YAML) specify the desired target state, allowing the engine to calculate execution plans (diffs) to reconcile current state with target state. Core tenets include Idempotency (repeated runs produce identical results without side effects) and immutable state management.',
    },
    narration: 'Week 3 covers Infrastructure as Code. We contrast imperative scripts with declarative Terraform configurations, trace state synchronization and drift detection, and provision immutable cloud architectures with automated rollback.',
    capstone: {
      id: 'cap_terraform_provisioner',
      title: 'Interactive Terraform HCL State Engine & Drift Detector',
      description: 'Author declarative Terraform HCL blocks for VPCs, load balancers, and database clusters, calculate execution graph diffs, and reconcile configuration drift.',
    },
    quiz: {
      question: 'What does "Idempotency" mean in the context of Infrastructure as Code provisioning tools?',
      options: [
        'Executing the configuration multiple times produces the exact same end state as executing it once, without creating duplicate resources',
        'The script can only be run once and must be deleted afterwards',
        'All cloud infrastructure is destroyed automatically every 24 hours',
        'The code executes exclusively in memory without saving state',
      ],
      correctIndex: 0,
      explanation: 'An idempotent operation can be applied multiple times without changing the result beyond the initial application. In IaC, running terraform apply repeatedly when no changes exist leaves infrastructure untouched.',
    },
  },
  {
    week: 4,
    title: 'Containerization, Linux Cgroups & Docker Internals',
    badge: 'Containers & Docker',
    tagline: 'Virtual machines vs containers, Linux Namespaces (PID, NET, MNT), Cgroups, Dockerfiles, and multi-stage builds',
    accreditedSpec: 'CSC3131 Specification: Topic 2.2 — Operating System Level Virtualization, Control Groups (cgroups v2), and OCI Images',
    referencePoint: {
      academic: 'Turnbull, J. (2014). The Docker Book: Containerization is the new virtualization. James Turnbull.',
      standard: 'Open Container Initiative (OCI) Image and Runtime Specifications (v1.0) & Linux kernel Documentation/cgroup-v2.txt.',
      enterprise: 'Docker Desktop, containerd, and high-density microservice packaging in production clusters.',
    },
    pedagogy: {
      simple: 'Have you ever heard a developer say: "It worked on my machine!"? Containers solve this forever! A container packs your code, its libraries, and settings into a standardized digital shipping container (Docker image) that runs identically on a laptop, a test server, or in the cloud.',
      engineer: 'Unlike Virtual Machines that emulate complete hardware and run separate guest kernels via a hypervisor, Containers provide lightweight OS-level virtualization sharing the host kernel. Isolation is enforced via Linux Namespaces (pid, net, mnt, ipc, uts, user) and resource limits (CPU quotas, memory caps) are strictly enforced via Control Groups (cgroups v2). Images use union filesystems (OverlayFS) with copy-on-write layer stacking.',
    },
    narration: 'In Week 4, we examine container internals. We deconstruct Linux namespaces and cgroups, inspect multi-stage Dockerfile optimization to slash image sizes, and package microservices into Open Container Initiative (OCI) compliant images.',
    capstone: {
      id: 'cap_docker_cgroup_lab',
      title: 'Interactive Linux Namespace & Cgroup Resource Throttler',
      description: 'Simulate container namespace process isolation, apply cgroup CPU and memory quotas to prevent noisy neighbors, and optimize multi-stage Docker build layers.',
    },
    quiz: {
      question: 'What fundamental Linux kernel feature is responsible for isolating process IDs, network interfaces, and filesystem mount points inside a Docker container?',
      options: [
        'Linux Namespaces',
        'Control Groups (cgroups)',
        'The Swap Partition',
        'The BIOS Firmware',
      ],
      correctIndex: 0,
      explanation: 'Linux Namespaces provide process-level isolation (PID, NET, MNT, IPC, UTS, USER) ensuring a container sees only its own isolated slice of the operating system. Control Groups (cgroups) manage resource limits (CPU/RAM).',
    },
  },
  {
    week: 5,
    title: 'Container Orchestration & Kubernetes Microservice Topologies',
    badge: 'Kubernetes',
    tagline: 'Kubernetes control plane, Pods, Deployments, Services (ClusterIP/NodePort/LoadBalancer), and Ingress controllers',
    accreditedSpec: 'CSC3131 Specification: Topic 3.1 — Container Orchestration, Declarative Pod Topologies, and Service Discovery',
    referencePoint: {
      academic: 'Burns, B., Grant, B., Oppenheimer, D., Brewer, E., & Wilkes, J. (2016). Borg, Omega, and Kubernetes. ACM Queue, 14(1).',
      standard: 'Cloud Native Computing Foundation (CNCF) Kubernetes Core APIs & Specifications.',
      enterprise: 'Google Kubernetes Engine (GKE), Amazon EKS, and production microservice meshes (Istio/Envoy).',
    },
    pedagogy: {
      simple: 'If Docker gives you shipping containers, Kubernetes is the giant automated cargo ship and crane that manages them! If one container crashes in the middle of the night, Kubernetes automatically restarts it, balances traffic across healthy containers, and rolls out updates without downtime.',
      engineer: 'Kubernetes operates on a declarative reconciliation loop: continuously driving observed cluster state toward declared spec state. The Control Plane (kube-apiserver, etcd, kube-scheduler, kube-controller-manager) coordinates Worker Nodes running kubelet and kube-proxy. Workloads run inside Pods managed by Deployments (ReplicaSets). Services provide stable virtual IPs and Layer 4 load balancing across transient Pod IPs.',
    },
    narration: 'Week 5 explores Kubernetes orchestration. We deconstruct the Kubernetes control plane, author declarative YAML specs for Deployments and Services, trace internal DNS service discovery, and configure self-healing rolling updates.',
    capstone: {
      id: 'cap_k8s_orchestrator',
      title: 'Interactive Kubernetes Cluster Topology & Rolling Update Simulator',
      description: 'Deploy a multi-pod web service, configure ClusterIP and LoadBalancer services, simulate node failure and automated pod rescheduling, and execute zero-downtime rolling updates.',
    },
    quiz: {
      question: 'In Kubernetes, why are Services necessary to expose Pods to network traffic instead of communicating directly with Pod IP addresses?',
      options: [
        'Pods are ephemeral and transient; their IP addresses change whenever they are created, restarted, or rescheduled, whereas Services provide a stable IP and DNS name with load balancing',
        'Pods do not have network IP addresses in Kubernetes',
        'Direct Pod communication requires physical fiber-optic cables',
        'Services encrypt all data using quantum cryptography',
      ],
      correctIndex: 0,
      explanation: 'Pods are frequently terminated, scaled, or rescheduled, causing their internal IPs to change constantly. A Kubernetes Service assigns a persistent virtual IP and DNS name, routing traffic dynamically to healthy pods via label selectors.',
    },
  },
  {
    week: 6,
    title: 'Traffic Surges & Scalability: The 10:00 AM Ticket Rush',
    badge: 'Scaling & Caching',
    tagline: 'Vertical vs horizontal scaling, Load Balancers, Distributed Caching (Redis), Read Replicas, and Challenge 4',
    accreditedSpec: 'CSC3131 Specification: Topic 3.2 — Elastic Scaling, Distributed In-Memory Caches, and Read/Write Database Partitioning',
    referencePoint: {
      academic: 'Kleppmann, M. (2017). Designing Data-Intensive Applications, Chapter 5: Replication. O’Reilly Media.',
      standard: 'RFC 7234: Hypertext Transfer Protocol (HTTP/1.1): Caching & Redis serialization protocol (RESP).',
      enterprise: 'High-concurrency ticketing architectures (Ticketmaster, Glastonbury) absorbing 100,000 requests/sec.',
    },
    pedagogy: {
      simple: 'Imagine 10,000 fans refreshing a concert ticket page at 10:00 AM sharp! If every click hits the database, the database will crash in seconds. We solve this by adding a Distributed Cache (Redis) to serve identical read requests in 1 millisecond, and horizontal app replicas to share the load.',
      engineer: 'Vertical scaling (bigger machines) encounters physical hardware limits and single points of failure. Horizontal scaling deploys stateless application replicas behind Layer 7 Load Balancers (Round Robin, Least Connections). Database bottlenecks are alleviated by: 1) In-memory Look-Aside / Write-Through caching (Redis) absorbing read traffic ($O(1)$ lookups); 2) Read Replicas with asynchronous replication streams offloading analytical and read queries.',
    },
    narration: 'In Week 6, we tackle Challenge 4: The 10:00 AM Ticket Surge. We simulate 10,000 concurrent requests smashing an unscaled PostgreSQL database, observe thread pool exhaustion, and restore healthy throughput by provisioning distributed caches and queues.',
    capstone: {
      id: 'cap_ticket_surge_lab',
      title: 'Foundry Challenge: Absorbing The 10:00 AM Ticket Surge',
      description: 'Place a Distributed Cache (Redis) and an Asynchronous Queue connected to the App Logic Tier to prevent database crash under an incoming 10,000 rps traffic surge.',
    },
    quiz: {
      question: 'In a Cache-Aside (Lazy Loading) architecture with Redis, what sequence of actions does the application execute upon a user read request?',
      options: [
        'Check Redis cache first; if cache hit, return immediately; if cache miss, query database, store result in Redis with a TTL, and return to user',
        'Always query the database first, then write a copy to Redis',
        'Write data to Redis and delete the database',
        'Send an email to the database administrator',
      ],
      correctIndex: 0,
      explanation: 'In Cache-Aside, the app checks the cache first. On a hit, it returns the cached data immediately. On a miss, it fetches data from the database, populates the cache for subsequent requests, and returns the response.',
    },
  },
  {
    week: 7,
    title: 'Asynchronous Systems & Message Queues: Decoupled Backpressure',
    badge: 'Queues & Backpressure',
    tagline: 'Synchronous vs asynchronous processing, Message Queues (RabbitMQ, Kafka), Dead Letter Queues, and backpressure',
    accreditedSpec: 'CSC3131 Specification: Topic 4.1 — Asynchronous Messaging, Publish/Subscribe Topologies, and Message Queue Durability',
    referencePoint: {
      academic: 'Hohpe, G. & Woolf, B. (2003). Enterprise Integration Patterns: Designing, Building, and Deploying Messaging Solutions. Addison-Wesley.',
      standard: 'Advanced Message Queuing Protocol (AMQP 0-9-1 / 1.0) Specification & Apache Kafka protocol.',
      enterprise: 'Amazon SQS, RabbitMQ, and Apache Kafka handling trillions of events daily at Netflix and Uber.',
    },
    pedagogy: {
      simple: 'When you order food at a restaurant, the cashier hands you a receipt with an order number and starts serving the next customer immediately, while the kitchen cooks your meal in the background. A Message Queue works the same way: it takes work from users instantly so they never wait on slow jobs.',
      engineer: 'Synchronous request-response architectures create temporal coupling: if a downstream service slows down or crashes, callers block and threads exhaust. Asynchronous message queues (RabbitMQ, Kafka) decouple producers from consumers. Queues act as shock absorbers providing Backpressure during traffic spikes, ensuring message durability, at-least-once delivery, and automatic retries with Dead Letter Queues (DLQ).',
    },
    narration: 'Week 7 investigates asynchronous message architectures. We construct producer-consumer queues using AMQP protocols, analyze consumer backpressure under queue saturation, and configure Dead Letter Queues to quarantine poison pill messages.',
    capstone: {
      id: 'cap_message_queue_sim',
      title: 'Interactive Message Queue Backpressure & Dead Letter Simulator',
      description: 'Publish high-volume message bursts to a simulated RabbitMQ queue, observe consumer worker scaling, simulate worker exceptions, and route poison messages to a DLQ.',
    },
    quiz: {
      question: 'What is the purpose of a Dead Letter Queue (DLQ) in an enterprise messaging architecture?',
      options: [
        'To isolate and store messages that cannot be processed successfully after maximum retry attempts, preventing them from blocking the queue or crashing workers',
        'To store deleted user emails permanently',
        'To speed up CPU clock speeds during message parsing',
        'To route messages directly to the trash without processing',
      ],
      correctIndex: 0,
      explanation: 'A Dead Letter Queue holds messages that repeatedly fail processing (e.g. malformed payloads or poison pills) so developers can inspect and debug them offline without jamming the main processing pipeline.',
    },
  },
  {
    week: 8,
    title: 'Observability & SRE: The 02:14 AM Night Alert',
    badge: 'Observability & SRE',
    tagline: 'The Three Pillars: Metrics, Logs, Traces, OpenTelemetry, Prometheus, Grafana, and Challenge 5',
    accreditedSpec: 'CSC3131 Specification: Topic 4.2 — Telemetry Pipelines, Distributed Tracing (W3C TraceContext), and Alerting Thresholds',
    referencePoint: {
      academic: 'Beyer, B., Jones, C., Petoff, J., & Murphy, N.R. (2016). Site Reliability Engineering: How Google Runs Production Systems, Chapters 6 & 10. O’Reilly.',
      standard: 'OpenTelemetry (OTel) Specification & W3C Distributed Tracing Recommendation (Traceparent header).',
      enterprise: 'Prometheus metrics scraping, Grafana dashboards, Datadog APM, and PagerDuty automated alert escalation.',
    },
    pedagogy: {
      simple: 'Imagine driving a car with a blacked-out windshield and no speedometer; you would crash immediately! Observability is the dashboard for your software systems. Metrics show how fast you are going (speedometer), Logs record what happened (dashcam), and Traces show the exact path of every request from phone to database.',
      engineer: 'Observability infers internal system state from external telemetry outputs across three complementary pillars: 1) Metrics (numeric time-series aggregated over intervals, e.g. Prometheus counter/gauge/histogram); 2) Structured Logs (contextual JSON forensic records); 3) Distributed Traces (propagated via W3C TraceContext traceparent headers, correlating asynchronous spans across microservice boundaries).',
    },
    narration: 'In Week 8, we confront Challenge 5: The 02:14 AM Observability Alert. We diagnose an intermittent nocturnal outage stranding couriers, implement distributed tracing using OpenTelemetry, and configure Prometheus alerting rules to detect degradation before users notice.',
    capstone: {
      id: 'cap_night_alert_lab',
      title: 'Foundry Challenge: Diagnosing The 02:14 AM Night Alert',
      description: 'Wire a Telemetry & SRE Agent into an active multi-tier dispatch gateway, capture distributed traces, identify a 500 error root cause, and silence the PagerDuty alert.',
    },
    quiz: {
      question: 'In distributed tracing (e.g. OpenTelemetry), how are individual microservice operations linked together across asynchronous network boundaries to form a single cohesive trace?',
      options: [
        'By propagating a unique Trace ID and Span ID across HTTP headers (such as the standard W3C traceparent header)',
        'By running all microservices inside a single monolithic process',
        'By sharing a single physical hard drive across all cloud regions',
        'By synchronizing atomic clocks across all servers using GPS satellites',
      ],
      correctIndex: 0,
      explanation: 'Distributed tracing injects metadata (Trace ID and Parent Span ID) into outbound network headers (W3C traceparent). Downstream services extract this context and attach it to their child spans, allowing the tracing engine to reconstruct the end-to-end distributed execution tree.',
    },
  },
  {
    week: 9,
    title: 'Site Reliability Engineering: SLIs, SLOs & Error Budgets',
    badge: 'SLOs & Error Budgets',
    tagline: 'Service Level Indicators (SLIs), Service Level Objectives (SLOs), Service Level Agreements (SLAs), and Error Budget burn rates',
    accreditedSpec: 'CSC3131 Specification: Topic 5.1 — Service Level Objectives (SLO), Error Budget Governance, and Blameless Post-Mortems',
    referencePoint: {
      academic: 'Beyer, B., Murphy, N.R., Rands, D., & Thorne, R. (2018). The Site Reliability Workbook, Chapter 2: Implementing SLOs. O’Reilly.',
      standard: 'Google SRE Best Practices: Quantifying Service Availability & Error Budget Burn Rate Alerts.',
      enterprise: 'High-availability SLAs (99.9% "three nines" vs 99.99% "four nines") and feature freeze policies upon budget exhaustion.',
    },
    pedagogy: {
      simple: 'Is 100% perfection possible in software? No, and trying to reach 100% uptime costs too much money and stops you from releasing new features! SRE sets a target like 99.9% uptime (SLO). The remaining 0.1% is your Error Budget: permission to take risks and move fast until the budget runs out.',
      engineer: 'SRE balances reliability with product innovation via quantitative governance: 1) SLI (Service Level Indicator): A carefully defined quantitative metric (e.g. Ratio of successful HTTP requests to total requests, where latency < 200ms); 2) SLO (Service Level Objective): A target reliability percentage agreed with business stakeholders (e.g. 99.9% over a rolling 30-day window); 3) Error Budget (1 - SLO): If depleted, deployments freeze and engineering effort pivots strictly to stability.',
    },
    narration: 'Week 9 focuses on Site Reliability Engineering governance. We formulate rigorous Service Level Indicators, calculate monthly downtime allowances for 99.9% vs 99.99% SLO targets, track multi-window Error Budget burn rates, and author blameless post-mortems.',
    capstone: {
      id: 'cap_slo_error_budget',
      title: 'Interactive SRE Error Budget Burn Rate & SLO Governance Dashboard',
      description: 'Configure availability and latency SLIs, track 30-day error budget burn rates under simulated incidents, and trigger automated deployment freeze policies upon budget depletion.',
    },
    quiz: {
      question: 'How much total allowable downtime per 30-day calendar month corresponds to a Service Level Objective (SLO) of 99.9% ("three nines") availability?',
      options: [
        'Approximately 43 minutes and 12 seconds',
        'Approximately 4.3 seconds',
        'Exactly 24 hours',
        'Zero minutes',
      ],
      correctIndex: 0,
      explanation: 'A 30-day month contains 43,200 minutes. At 99.9% availability, the allowable downtime is 0.1%: 43,200 × 0.001 = 43.2 minutes (~43 mins 12 secs). At 99.99% ("four nines"), allowable downtime shrinks to just 4.3 minutes.',
    },
  },
  {
    week: 10,
    title: 'Chaos Engineering & Resilient System Design',
    badge: 'Chaos Engineering',
    tagline: 'Blast radius, Netflix Chaos Monkey, Circuit Breaker pattern, Bulkheads, and graceful degradation',
    accreditedSpec: 'CSC3131 Specification: Topic 5.2 — Chaos Engineering Principles, Failure Injection, and Fault-Tolerant Design Patterns',
    referencePoint: {
      academic: 'Basiri, A., Sengupta, N., Shturova, J., Bahmani, A., & Hochstein, L. (2016). Chaos Engineering. IEEE Software, 33(3), pp. 35–41.',
      standard: 'Principles of Chaos Engineering (principlesofchaos.org).',
      enterprise: 'Netflix Simian Army (Chaos Monkey, Chaos Kong) and AWS Fault Injection Simulator (FIS).',
    },
    pedagogy: {
      simple: 'How do you know if your fire sprinkler system works? You test it before there is a real fire! Chaos Engineering deliberately injects small failures (unplugging a server or slowing down network wires) during normal working hours so engineers can prove the system recovers automatically without disturbing customers.',
      engineer: 'Chaos Engineering is the discipline of experimenting on a system in order to build confidence in the system’s capability to withstand turbulent conditions in production. Experiments follow: 1) Formulate steady-state hypothesis; 2) Inject failure (CPU spikes, network latency, terminated instances); 3) Limit blast radius; 4) Verify automated mitigation via resilient patterns (Circuit Breakers via Netflix Hystrix / Resilience4j, Bulkheads, Retries with Exponential Backoff and Jitter).',
    },
    narration: 'In Week 10, we practice Chaos Engineering. We inject synthetic latency and packet loss into distributed microservices, observe cascading failure cascades, and implement the Circuit Breaker pattern with exponential backoff and jitter.',
    capstone: {
      id: 'cap_chaos_monkey_lab',
      title: 'Interactive Chaos Monkey Failure Injection & Circuit Breaker Workbench',
      description: 'Inject server crashes and network latency into an active multi-tier topology, observe cascading thread pool exhaustion, and configure Circuit Breaker trips to isolate degraded nodes.',
    },
    quiz: {
      question: 'What are the three core states of the Circuit Breaker resilience pattern?',
      options: [
        'Closed (normal traffic flows), Open (calls fail fast immediately without hitting degraded dependency), and Half-Open (trial requests test if dependency has recovered)',
        'Active, Inactive, and Deleted',
        'Green, Yellow, and Red',
        'Read, Write, and Execute',
      ],
      correctIndex: 0,
      explanation: 'When healthy, the circuit is Closed. When failure thresholds are exceeded, the circuit trips Open, failing fast to prevent thread exhaustion. After a timeout, it enters Half-Open to send trial requests; if successful, it closes and resumes normal operation.',
    },
  },
  {
    week: 11,
    title: 'Cloud Economics, FinOps & Shared Infrastructure Ledgers',
    badge: 'FinOps & Cost',
    tagline: 'Cloud cost attribution, rightsizing, on-demand vs spot/reserved instances, FinOps lifecycle, and token spend governance',
    accreditedSpec: 'CSC3131 Specification: Topic 6.1 — Cloud Financial Management (FinOps), Resource Rightsizing, and Unit Economics',
    referencePoint: {
      academic: 'Storment, J.R. & Fuller, M. (2020). Cloud FinOps: Collaborative, Real-Time Cloud Financial Management. O’Reilly Media.',
      standard: 'FinOps Foundation Framework (Inform, Optimize, Operate phases).',
      enterprise: 'AWS Cost Explorer, Google Cloud Billing reports, and AI token budget governance for enterprise LLM workloads.',
    },
    pedagogy: {
      simple: 'In the cloud, every second a server runs or every gigabyte transferred costs real money! FinOps is about making sure engineers see the price tag of their technical choices. Running a giant server that sits 95% idle is like leaving the air conditioning running with the windows wide open.',
      engineer: 'Cloud FinOps combines engineering, finance, and product management to optimize cloud value. The lifecycle iterates through: 1) Inform (cost visibility, allocation tags, unit metrics e.g. cost per transaction); 2) Optimize (resource rightsizing, terminating idle resources, leveraging commitments like Reserved Instances / Savings Plans, spot instances); 3) Operate (continuous automated policy governance, anomaly alerts, model token budgeting).',
    },
    narration: 'Week 11 examines Cloud Financial Management (FinOps). We analyze cloud billing line items, audit over-provisioned idle instances, calculate multi-year Reserved Instance savings, and enforce token budget caps on generative AI model inference.',
    capstone: {
      id: 'cap_finops_cost_optimizer',
      title: 'Interactive Cloud Cost Attribution & Resource Rightsizing Engine',
      description: 'Audit a bloated cloud infrastructure footprint, identify idle compute and unattached EBS volumes, rightsizing instances to slash monthly spend by 60% without impacting SLOs.',
    },
    quiz: {
      question: 'In the FinOps Foundation Framework, what are the three iterative phases of Cloud Financial Management?',
      options: [
        'Inform, Optimize, and Operate',
        'Plan, Build, and Run',
        'Buy, Rent, and Sell',
        'Compute, Store, and Transfer',
      ],
      correctIndex: 0,
      explanation: 'The FinOps framework operates in three iterative phases: Inform (visibility and allocation), Optimize (rate and usage rightsizing), and Operate (continuous execution and organizational alignment).',
    },
  },
  {
    week: 12,
    title: 'End-to-End Enterprise Systems & DevOps Capstone',
    badge: 'DevOps Capstone',
    tagline: 'Full production delivery: IaC provisioning, multi-tier security, CI/CD automation, SRE observability, and final exam prep',
    accreditedSpec: 'CSC3131 Specification: Topic 6.2 — Enterprise Systems Engineering, Global Production Operations, and DevOps Capstone Mastery',
    referencePoint: {
      academic: 'Kim, G., Humble, J., Debois, P., Willis, J., & Forsgren, N. (2021). The DevOps Handbook (2nd Ed.). IT Revolution Press.',
      standard: 'ISO/IEC/IEEE 15026: Systems and software engineering — Systems and software assurance.',
      enterprise: 'Live enterprise multi-region disaster recovery simulations and game day exercises.',
    },
    pedagogy: {
      simple: 'Congratulations! You have reached the summit of DevOps engineering. In this capstone, you bring together everything you have learned: security guards, automated pipelines, cloud infrastructure, message queues, and telemetry dashboards to run a world-class production service.',
      engineer: 'The CSC3131 Capstone synthesizes the entire operational lifecycle: 1) Declarative multi-tier topology architecture (DMZ, App Tier, Cache, Queues, Database); 2) Automated CI/CD deployment pipelines with zero-downtime rolling updates; 3) Full-stack SRE observability (OTel distributed tracing, Prometheus alerts); 4) Chaos engineering resilience verification; 5) FinOps cost efficiency auditing.',
    },
    narration: 'Welcome to the Week 12 Final Capstone. We unite software engineering, infrastructure automation, systems architecture, and operational site reliability into a unified, resilient, enterprise-scale production platform.',
    capstone: {
      id: 'cap_enterprise_systems_foundry',
      title: 'Full Systems Architecture & Automated Operations Capstone',
      description: 'Assemble a complete production multi-tier topology in the Foundry Lab, survive a simulated traffic surge and injected node failure, and prove 99.99% operational availability.',
    },
    quiz: {
      question: 'Which architectural principle is paramount when designing resilient cloud-native systems intended for 24/7 mission-critical operations?',
      options: [
        'Design for failure: assume any component, network link, or server can and will fail at any moment, and build automated self-healing recovery into the system architecture',
        'Purchase the single most expensive physical server available so it never crashes',
        'Disable all software updates and security patches so the system remains unchanged forever',
        'Run all components on a single developer laptop',
      ],
      correctIndex: 0,
      explanation: 'In modern cloud systems, hardware and network failures are inevitable at scale. High availability is achieved by designing for failure: decoupling services, removing single points of failure, implementing health checks, and automating failover and recovery.',
    },
  },
];

export const CANVAS_COURSE_METADATA_3131 = {
  courseId: 70403,
  moduleCode: 'CSC3131',
  moduleTitle: 'Development and Operations of Systems',
  canvasUrl: 'https://ncl.instructure.com/courses/70403/modules',
  academicInstitution: 'Newcastle University',
  faculty: 'School of Computing, Urban Sciences Building (USB)',
  academicYear: '2025/2026',
  credits: 20,
  staff: [
    {
      name: 'Dr Laura Heels',
      email: 'laura.heels@ncl.ac.uk',
      role: 'Module Co-Leader & Senior Lecturer in Software Engineering & DevOps',
      office: 'Urban Sciences Building (USB), Room 3.015',
    },
    {
      name: 'Dr Christopher Bull',
      email: 'christopher.bull@ncl.ac.uk',
      role: 'Module Co-Leader & Lecturer in Systems & DevOps',
      office: 'Urban Sciences Building (USB), Room 3.017',
    },
    {
      name: 'Dr Matthew Forshaw',
      email: 'matthew.forshaw@ncl.ac.uk',
      role: 'Senior Lecturer in Cloud Computing & Systems Performance',
      office: 'Urban Sciences Building (USB)',
    },
  ],
  assessments: [
    {
      title: 'Coursework 1: Automated Multi-Tier Architecture & CI/CD Pipeline',
      weight: '40%',
      type: 'Technical Systems Lab & Automated Pipeline Submission',
      due: 'Week 6, Semester 1',
    },
    {
      title: 'Coursework 2: SRE Observability, Chaos Resilience & FinOps Audit',
      weight: '60%',
      type: 'Technical Operations Portfolio & Incident Response Report',
      due: 'Week 12, Semester 1',
    },
  ],
};

export const CANVAS_MODULES_3131: CanvasModuleTopic[] = [
  {
    moduleNumber: 1,
    title: 'Module 1: DevOps Principles, Multi-Tier Systems & DORA Metrics',
    state: 'active',
    readingReference: 'Forsgren et al. (2018) Accelerate • Gene Kim The Three Ways • DORA Reports',
    associatedWeek: 1,
    items: [
      { id: 'ops-mod-1-1', title: 'Lecture 1.1: The DevOps Philosophy & Dismantling Silos', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-1-2', title: 'Lecture 1.2: The Four DORA Metrics & Engineering Performance', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-1-3', title: 'Foundry Lab 1: Multi-Tier Architecture & Shielding the Status Request', type: 'practical', url: 'https://ncl.instructure.com/courses/70403/modules' },
    ],
  },
  {
    moduleNumber: 2,
    title: 'Module 2: Infrastructure as Code & Containerized Packaging',
    state: 'active',
    readingReference: 'Morris (2020) Infrastructure as Code • Docker Internals • cgroups v2',
    associatedWeek: 3,
    items: [
      { id: 'ops-mod-2-1', title: 'Lecture 2.1: Declarative IaC with Terraform & State Management', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-2-2', title: 'Lecture 2.2: Linux Namespaces, Cgroups & Docker Image Stacking', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-2-3', title: 'Lab Practical 2: Building Production Multi-Stage Container Pipelines', type: 'practical', url: 'https://ncl.instructure.com/courses/70403/modules' },
    ],
  },
  {
    moduleNumber: 3,
    title: 'Module 3: Container Orchestration & Kubernetes Microservice Topologies',
    state: 'active',
    readingReference: 'Burns et al. (Borg, Omega, Kubernetes) • CNCF Kubernetes Architecture',
    associatedWeek: 5,
    items: [
      { id: 'ops-mod-3-1', title: 'Lecture 3.1: The Kubernetes Control Plane & Declarative Reconciliation', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-3-2', title: 'Lecture 3.2: Pods, ReplicaSets, Services and Ingress Controllers', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-3-3', title: 'Lab Practical 3: Deploying Resilient Microservices with Zero-Downtime Rollouts', type: 'practical', url: 'https://ncl.instructure.com/courses/70403/modules' },
    ],
  },
  {
    moduleNumber: 4,
    title: 'Module 4: High-Concurrency Scaling & Message Queues',
    state: 'active',
    readingReference: 'Kleppmann (2017) Data-Intensive Applications • AMQP & Kafka Architecture',
    associatedWeek: 6,
    items: [
      { id: 'ops-mod-4-1', title: 'Lecture 4.1: Absorbing Traffic Surges: Load Balancing & Redis Caching', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-4-2', title: 'Lecture 4.2: Asynchronous Message Queues & Backpressure Topologies', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-4-3', title: 'Foundry Lab 4: Solving Challenge 4: The 10:00 AM Ticket Rush', type: 'practical', url: 'https://ncl.instructure.com/courses/70403/modules' },
    ],
  },
  {
    moduleNumber: 5,
    title: 'Module 5: Site Reliability Engineering, Observability & Alerting',
    state: 'active',
    readingReference: 'Google SRE Book (Beyer et al.) • OpenTelemetry Specification • W3C TraceContext',
    associatedWeek: 8,
    items: [
      { id: 'ops-mod-5-1', title: 'Lecture 5.1: The Three Pillars of Observability: Metrics, Logs & Traces', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-5-2', title: 'Lecture 5.2: SLIs, SLOs and Error Budget Governance in Production', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-5-3', title: 'Foundry Lab 5: Solving Challenge 5: The 02:14 AM Observability Alert', type: 'practical', url: 'https://ncl.instructure.com/courses/70403/modules' },
    ],
  },
  {
    moduleNumber: 6,
    title: 'Module 6: Chaos Engineering, FinOps & Production Mastery',
    state: 'active',
    readingReference: 'Principles of Chaos Engineering • Storment & Fuller Cloud FinOps',
    associatedWeek: 12,
    items: [
      { id: 'ops-mod-6-1', title: 'Lecture 6.1: Chaos Engineering: Fault Injection & Circuit Breakers', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-6-2', title: 'Lecture 6.2: Cloud FinOps: Cost Attribution, Rightsizing & Tokenomics', type: 'lecture', url: 'https://ncl.instructure.com/courses/70403/modules' },
      { id: 'ops-mod-6-3', title: 'Foundry Capstone: Full Systems Architecture & Live Game Day Simulation', type: 'practical', url: 'https://ncl.instructure.com/courses/70403/modules' },
    ],
  },
];

export const EXAM_QUESTIONS_3131: { A: ExamQuestion[]; B: ExamQuestion[] } = {
  A: [
    {
      id: 'q3131-a1',
      section: 'A',
      title: 'Question 1: DORA Engineering Metrics & Continuous Delivery',
      marks: 10,
      scenario: 'An enterprise software organization deploys code once every 3 months. When they deploy, 35% of releases fail and cause incidents requiring an average of 48 hours to restore service. Developers take an average of 6 weeks from committing code to seeing it run in production.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Classify this organization across the four DORA metrics (Deployment Frequency, Lead Time for Changes, Change Failure Rate, Time to Restore Service) according to the DORA cluster thresholds (Elite, High, Medium, Low).',
          marks: 4,
          markingCriteria: [
            '1 mark: Deployment Frequency = Low (between once per month and once every 6 months).',
            '1 mark: Lead Time for Changes = Low (between 1 month and 6 months).',
            '1 mark: Change Failure Rate = Low / Poor (35% is significantly worse than the 0-15% target).',
            '1 mark: Time to Restore Service = Low (48 hours is between one day and one week).',
          ],
          modelAnswer: '1. Deployment Frequency: Low (Deploying once every 3 months is well below the daily/weekly tempo of High and Elite performers).\n2. Lead Time for Changes: Low (6 weeks is in the 1 to 6 months category).\n3. Change Failure Rate: Low (35% failure rate falls into the degraded bracket; Elite performers achieve 0-15%).\n4. Time to Restore Service: Low (48 hours exceeds the under-one-hour target of Elite performers). Overall cluster: Low Performer.',
        },
        {
          part: '(b)',
          prompt: 'Formulate three concrete architectural and organizational interventions that will move this team into the High/Elite DORA performance tier.',
          marks: 6,
          markingCriteria: [
            '2 marks: Transitioning from monolithic big-bang releases to Trunk-Based Development with small batch sizes.',
            '2 marks: Implementing automated CI/CD deployment pipelines with zero-downtime Blue-Green / Canary releases.',
            '2 marks: Introducing comprehensive automated test suites and SRE observability to detect and rollback incidents in minutes.',
          ],
          modelAnswer: '1. Small Batch Sizes & Trunk-Based Development: Break massive quarterly releases into daily/weekly incremental commits, eliminating long-lived diverging feature branches and dramatically reducing Lead Time for Changes.\n2. Automated CI/CD Pipelines: Automate regression testing, linting, and artifact deployment so releases require zero manual human handoffs, increasing Deployment Frequency.\n3. Automated Rollbacks & Blue-Green Deployments: Implement automated canary monitoring and instant one-click or automated rollbacks when telemetry detects latency or error spikes, slashing Time to Restore Service from 48 hours to minutes.',
        },
      ],
    },
  ],
  B: [
    {
      id: 'q3131-b1',
      section: 'B',
      title: 'Question 2: High-Concurrency System Scalability & SRE Governance',
      marks: 15,
      scenario: 'A university exam results portal expects 50,000 students to log in and check marks within a 15-minute window starting at 09:00 AM. The application tier connects directly to a single relational database instance that caps out at 600 concurrent connections.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Explain the failure cascade that will occur at 09:00 AM under this architecture, referencing connection pool exhaustion, queuing theory, and database thread saturation.',
          marks: 7,
          markingCriteria: [
            '3.5 marks: Connection pool exhaustion and thread queuing causing request latencies to exceed client HTTP timeouts (504 Gateway Timeout).',
            '3.5 marks: Thundering herd and cascading failure as desperate users repeatedly click refresh, compounding the overload.',
          ],
          modelAnswer: 'Failure Cascade Analysis:\n1. Connection Pool Exhaustion: 50,000 students generating multiple requests per second will instantaneously exhaust the 600 available database connections.\n2. Thread Stalling & Latency Spike: The application servers will block waiting for free database connections. As worker threads stall, application server memory footprints spike and queue lengths explode (Little’s Law: L = λW).\n3. Cascading Timeouts: Latency exceeds reverse proxy timeouts (e.g. 30s), yielding HTTP 504 Gateway Timeout errors.\n4. Thundering Herd: When users see errors, they hit "Refresh" repeatedly, multiplying incoming RPS and driving the saturated database into complete CPU deadlock.',
        },
        {
          part: '(b)',
          prompt: 'Draw and explain a multi-tier architectural topology incorporating Redis caching, horizontal scaling, and message queues that guarantees 99.99% availability during this surge.',
          marks: 8,
          markingCriteria: [
            '4 marks: Topology description: Ingress Gateway/ALB -> Horizontal App Instances (HPA) -> Redis Cache-Aside cluster -> Read-Replica DB pool + Message Queue for result viewing telemetry.',
            '4 marks: Explanation of how Redis absorbs 95%+ of identical read requests in sub-millisecond time and how rate-limiting / queues prevent DB collapse.',
          ],
          modelAnswer: 'Target Resilient Architecture:\n1. Edge & Load Balancer: Cloudflare/CloudFront CDN caches static assets. An Application Load Balancer distributes incoming traffic across horizontally autoscaling application pods (Kubernetes HPA).\n2. Distributed Cache Tier (Redis Cluster): Exam result records are immutable once published. The application utilizes Cache-Aside: exam results are pre-warmed or cached on first read in Redis. Redis handles 100,000+ operations/second in RAM at sub-millisecond latency, absorbing over 98% of total queries away from the database.\n3. Read Replicas: For cache misses, reads are routed to read-only database replicas via connection pooling (PgBouncer), preserving the primary database.\n4. Graceful Queue & Rate Limiter: A token-bucket rate limiter at the API Gateway throttles aggressive individual refreshers, and non-critical logging is queued asynchronously to Kafka/SQS.\nResult: The primary database handles minimal load; response latency remains < 50ms; and 99.99% availability is preserved.',
        },
      ],
    },
  ],
};
