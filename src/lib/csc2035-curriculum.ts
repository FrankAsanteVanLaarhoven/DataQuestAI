/**
 * CSC2035: Software Systems Design and Implementation Curriculum Specification
 * Newcastle University • School of Computing • Stage 2 Core Module (30 Credits)
 * Canvas Course ID: 58456
 * Direct Canvas URL: https://ncl.instructure.com/courses/58456
 * Accredited Syllabus Specification with Academic References, POSIX Standards & Systems Benchmarks.
 * Organized in standard 12-Week Semester Sequence across Operating Systems and Networked Systems strands.
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';

export const CSC2035_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Operating Systems Architecture & Dual-Mode Execution',
    badge: 'OS Architecture',
    tagline: 'Kernel space vs user space, system call traps, context switching, and POSIX API',
    accreditedSpec: 'CSC2035 Specification: Topic 1.1 — Dual-Mode Execution, Hardware Protection, and the System Call Interface',
    referencePoint: {
      academic: 'Silberschatz, A., Galvin, P.B., & Gagne, G. (2018). Operating System Concepts (10th Ed.), Chapter 1 & 2. Wiley.',
      standard: 'IEEE Std 1003.1-2017 (POSIX.1-2017): Standard for Information Technology — Portable Operating System Interface.',
      enterprise: 'Linux Kernel architecture (Ring 0 supervisor mode vs Ring 3 user mode on x86-64 / ARM64).',
    },
    pedagogy: {
      simple: 'Why doesn’t a buggy program crash your whole computer? The Operating System divides memory into two worlds: User Space (where your apps live) and Kernel Space (where the operating system controls hardware). An app must knock on the door via a System Call to ask the kernel to read a file or send data.',
      engineer: 'Modern CPUs enforce hardware rings (e.g. Ring 0 vs Ring 3). User programs execute in unprivileged mode, preventing direct hardware access. Invoking system services requires a software interrupt or trap instruction (syscall / sysenter), which switches privilege levels, saves registers into a trap frame, and enters the kernel dispatch table.',
    },
    narration: 'Week 1 introduces Operating Systems architecture. We examine dual-mode execution, trace how CPU privilege levels protect hardware resources, dissect system call dispatching, and measure the performance cost of context switching.',
    capstone: {
      id: 'cap_syscall_tracer',
      title: 'Interactive System Call Dispatcher & Trap Frame Inspector',
      description: 'Trace standard C POSIX system calls (read, write, open), observe user-to-kernel mode transitions, and inspect CPU register trap frames.',
    },
    quiz: {
      question: 'What hardware mechanism enables an unprivileged user-mode application to transition into privileged kernel-mode to execute a system call?',
      options: [
        'A software interrupt or trap instruction (such as syscall) that switches the CPU mode bit to supervisor mode',
        'Direct pointer dereferencing of kernel memory addresses',
        'Writing raw assembly instructions into the graphics card buffer',
        'Allocating memory dynamically using malloc()',
      ],
      correctIndex: 0,
      explanation: 'User applications cannot directly access kernel code. They invoke a software trap instruction (syscall) that safely raises the CPU privilege level, switches to the kernel stack, and transfers execution to a predefined kernel dispatch vector.',
    },
  },
  {
    week: 2,
    title: 'Process Abstraction, Lifecycle & POSIX Process Control',
    badge: 'Process Lifecycle',
    tagline: 'Process Control Block (PCB), process states, fork(), exec(), waitpid(), and zombie processes',
    accreditedSpec: 'CSC2035 Specification: Topic 1.2 — The Process Model, State Transitions, and UNIX Process Management',
    referencePoint: {
      academic: 'Stevens, W.R. & Rago, S.A. (2013). Advanced Programming in the UNIX Environment (3rd Ed.), Chapters 7 & 8. Addison-Wesley.',
      standard: 'The Open Group Base Specifications Issue 7: POSIX.1-2017 Process Creation and Termination (fork, execve, waitpid).',
      enterprise: 'systemd init PID 1 process reaping and Linux task_struct scheduling representation.',
    },
    pedagogy: {
      simple: 'A program is a recipe stored on a hard drive; a process is the chef actively cooking that recipe in memory. In UNIX, new processes are created through fork(), which clones the parent process, and exec(), which replaces the child’s memory with a completely new program.',
      engineer: 'A process is an instance of an executing program encapsulated in a Process Control Block (PCB / task_struct) maintaining PID, program counter, CPU registers, memory maps, and open file descriptor tables. Process creation via fork() duplicates address space using Copy-on-Write (CoW). A terminated child whose parent has not called wait() becomes a Zombie process.',
    },
    narration: 'In Week 2, we explore the process abstraction. We trace the 5-state process lifecycle (New, Ready, Running, Waiting, Terminated), examine Copy-on-Write memory sharing during fork(), and prevent zombie and orphan processes using waitpid().',
    capstone: {
      id: 'cap_process_tree_sim',
      title: 'Interactive UNIX Process Tree & Fork/Exec State Simulator',
      description: 'Simulate hierarchical process creation with fork(), track parent-child PID relations, observe state transitions, and reap zombie processes with waitpid().',
    },
    quiz: {
      question: 'What is a "Zombie" process in a UNIX-like operating system?',
      options: [
        'A process that has finished execution but whose parent has not yet read its exit status via wait() or waitpid()',
        'A process that has suffered an unhandled infinite loop',
        'A process running with root administrator privileges without a password',
        'A process that consumes 100% of the available RAM',
      ],
      correctIndex: 0,
      explanation: 'When a process terminates, its memory and resources are deallocated, but its entry in the process table (PCB) remains so the parent can inspect its exit status. Until the parent calls wait(), it remains in the Zombie state.',
    },
  },
  {
    week: 3,
    title: 'Memory Management, Virtual Paging & Address Translation',
    badge: 'Virtual Memory',
    tagline: 'Virtual vs physical addresses, Page Tables, Memory Management Unit (MMU), TLB, and Page Faults',
    accreditedSpec: 'CSC2035 Specification: Topic 2.1 — Virtual Memory Architecture, Paging, Multi-Level Page Tables, and TLB Caches',
    referencePoint: {
      academic: 'Tanenbaum, A.S. & Bos, H. (2015). Modern Operating Systems (4th Ed.), Chapter 3: Memory Management. Pearson.',
      standard: 'x86-64 4-Level and 5-Level Paging Architecture (CR3 Register, PML4, Page Directory, Page Table).',
      enterprise: 'Linux Demand Paging, anonymous memory mappings, and Page Fault latency optimization.',
    },
    pedagogy: {
      simple: 'Every running application thinks it has all the memory in the computer to itself! Virtual Memory creates this illusion. The CPU’s Memory Management Unit uses a translation dictionary called a Page Table to convert an app’s pretend address into the real physical address in RAM.',
      engineer: 'Virtual memory isolates process address spaces into fixed-size Pages (typically 4 KB) mapped to physical Page Frames. Address translation splits virtual addresses into a Page Number and Offset. The hardware MMU utilizes a Translation Lookaside Buffer (TLB) associative cache to accelerate lookups. Accessing unmapped pages triggers a hardware Page Fault interrupt handled by the OS swap manager.',
    },
    narration: 'Week 3 analyzes Virtual Memory. We calculate multi-level page table offsets, trace MMU address translation through the Translation Lookaside Buffer, investigate page faults, and evaluate LRU and FIFO page replacement algorithms.',
    capstone: {
      id: 'cap_mmu_translator',
      title: 'Interactive MMU Virtual-to-Physical Address Translation Simulator',
      description: 'Deconstruct 32-bit and 64-bit virtual addresses into page directory indexes and offsets, simulate TLB hits and misses, and handle page fault exceptions.',
    },
    quiz: {
      question: 'What is the primary function of the Translation Lookaside Buffer (TLB) in computer systems?',
      options: [
        'A high-speed hardware cache inside the CPU that stores recent virtual-to-physical page translations to avoid slow memory lookups',
        'A hard drive partition used to store swap files when RAM is full',
        'A software queue that orders system calls before execution',
        'A network buffer that holds incoming TCP packets',
      ],
      correctIndex: 0,
      explanation: 'Page table lookups require multiple memory accesses. The TLB is a fast associative cache on the CPU that caches recent virtual-to-physical address mappings, achieving translation in single-digit clock cycles.',
    },
  },
  {
    week: 4,
    title: 'CPU Scheduling Algorithms & Multiprogramming',
    badge: 'CPU Scheduling',
    tagline: 'Preemptive vs non-preemptive scheduling, FCFS, SJF, Round Robin, Multilevel Feedback Queues (MLFQ)',
    accreditedSpec: 'CSC2035 Specification: Topic 2.2 — Processor Scheduling Criteria, Round Robin Time Slices, and Multilevel Queues',
    referencePoint: {
      academic: 'Arpaci-Dusseau, R.H. & Arpaci-Dusseau, A.C. (2018). Operating Systems: Three Easy Pieces, Chapters 7–10: Scheduling. Arpaci-Dusseau Books.',
      standard: 'POSIX Realtime Extensions: SCHED_FIFO, SCHED_RR, and SCHED_OTHER scheduling policies.',
      enterprise: 'Linux Completely Fair Scheduler (CFS) utilizing red-black trees and virtual runtime (vruntime).',
    },
    pedagogy: {
      simple: 'When 50 programs want to use the CPU at the exact same moment, how does the computer decide who gets it next? CPU schedulers are like traffic controllers. Round Robin gives everyone a tiny slice of time (quantum) in turns, while Shortest Job First helps short tasks finish immediately.',
      engineer: 'Schedulers optimize turnaround time, response time, waiting time, throughput, and CPU utilization. Non-preemptive policies (FCFS, SJF) run tasks until voluntary yield or I/O block, risking convoy effects. Preemptive policies (Round Robin) enforce a time quantum using timer interrupts. Multilevel Feedback Queues (MLFQ) dynamically adjust task priorities based on observed CPU-bound vs I/O-bound behavior.',
    },
    narration: 'In Week 4, we evaluate CPU scheduling. We compare First-Come First-Served, Shortest Job First, and Round Robin on Gantt charts, compute average waiting times, and analyze how Multilevel Feedback Queues balance interactive and compute workloads.',
    capstone: {
      id: 'cap_cpu_scheduler',
      title: 'Interactive CPU Scheduling Gantt Chart & Algorithm Benchmarker',
      description: 'Simulate FCFS, SJF, and Round Robin scheduling across customizable process arrival times and burst lengths, measuring waiting time and throughput.',
    },
    quiz: {
      question: 'What negative symptom occurs in Round Robin scheduling if the time quantum (slice) is set excessively small (e.g., 1 microsecond)?',
      options: [
        'A large proportion of CPU time is wasted on context-switch overhead rather than executing actual program instructions',
        'Processes with short burst times starve indefinitely',
        'The operating system runs out of virtual memory',
        'All processes are automatically converted into zombie processes',
      ],
      correctIndex: 0,
      explanation: 'Every context switch incurs CPU cycle overhead saving and restoring registers and flushing cache lines. If the time slice is too small, context-switch overhead dominates total CPU execution time.',
    },
  },
  {
    week: 5,
    title: 'Threads, Concurrency & POSIX Pthreads',
    badge: 'Threads & Concurrency',
    tagline: 'Processes vs threads, shared heap vs private stacks, race conditions, and POSIX pthread_create()',
    accreditedSpec: 'CSC2035 Specification: Topic 3.1 — Multithreading Models, Thread Synchronization, and Race Condition Diagnostics',
    referencePoint: {
      academic: 'Butenhof, D.R. (1997). Programming with POSIX Threads. Addison-Wesley Professional.',
      standard: 'POSIX.1c Threads Extension (IEEE Std 1003.1c-1995): pthread_create, pthread_join, and thread attributes.',
      enterprise: 'Linux 1:1 Native POSIX Thread Library (NPTL) and clone() system call flags.',
    },
    pedagogy: {
      simple: 'A process is like an entire house, while threads are roommates living inside that house. They share the same living room and kitchen (shared heap and global variables), but each roommate has their own bedroom and diary (private stack and local variables). If two roommates write in the same notebook at the same time, chaos happens!',
      engineer: 'Threads are lightweight dispatchable execution units within a single process. All threads in a process share the same virtual address space, code segment, data segment, and file descriptors, but maintain independent thread IDs, program counters, register sets, and private call stacks. Concurrent unsynchronized read-modify-write sequences on shared memory produce non-deterministic Race Conditions.',
    },
    narration: 'Week 5 dives into multithreading. We compare processes and threads, inspect memory layout differences between shared heap and per-thread stacks, reproduce race conditions in shared counters, and synchronize threads using POSIX pthreads.',
    capstone: {
      id: 'cap_pthread_race_lab',
      title: 'Interactive Multithreaded Race Condition & Memory Layout Lab',
      description: 'Spawn concurrent POSIX threads incrementing a shared counter without synchronization, observe non-deterministic corruptions, and verify correct memory state.',
    },
    quiz: {
      question: 'Which of the following resources is UNIQUE to each thread within a multithreaded process rather than shared?',
      options: [
        'The call stack and CPU register state',
        'The process heap memory',
        'The open file descriptor table',
        'The global variables and executable code segment',
      ],
      correctIndex: 0,
      explanation: 'Threads share the process address space (heap, globals, code, open files), but each thread must maintain its own private execution context: a separate call stack for local variables and its own CPU register state.',
    },
  },
  {
    week: 6,
    title: 'Mutual Exclusion: Critical Sections, Mutexes & Semaphores',
    badge: 'Mutual Exclusion',
    tagline: 'Critical Section Problem, Peterson’s Algorithm, Hardware Test-and-Set, Mutex Locks & Semaphores',
    accreditedSpec: 'CSC2035 Specification: Topic 3.2 — Synchronization Primitives, Atomic Hardware Instructions, and Dijkstra Semaphores',
    referencePoint: {
      academic: 'Dijkstra, E.W. (1965). Cooperating Sequential Processes. Technological University Eindhoven Report EWD-123.',
      standard: 'POSIX.1-2017: pthread_mutex_t, pthread_cond_t, and sem_t synchronization interfaces.',
      enterprise: 'x86 atomic CMPXCHG (compare-and-swap) and lock prefix hardware bus guarantees.',
    },
    pedagogy: {
      simple: 'Imagine a single bathroom on an airplane. Only one person can be inside at a time! A Mutex (mutual exclusion) is the lock on the door. If someone is inside, everyone else waits outside. A Semaphore is like a bouncer counting people into a club: it allows up to N people inside before blocking the next.',
      engineer: 'The Critical Section problem requires satisfying Mutual Exclusion, Progress, and Bounded Waiting. Software solutions (Peterson’s Algorithm) require memory ordering guarantees. Hardware atomic primitives (Test-and-Set, Compare-and-Swap) provide lock-free primitives. POSIX Mutexes enforce binary exclusion; Counting Semaphores manage resource pools with atomic wait (sem_wait / P) and signal (sem_post / V) operations.',
    },
    narration: 'In Week 6, we master synchronization. We analyze the three critical section requirements, evaluate atomic hardware instructions, implement Peterson’s algorithm, and contrast binary mutex locks against Dijkstra counting semaphores.',
    capstone: {
      id: 'cap_mutex_semaphore_sim',
      title: 'Interactive Producer-Consumer Mutex & Bounded-Buffer Semaphore Lab',
      description: 'Implement Dijkstra’s bounded-buffer producer-consumer problem using POSIX mutexes and counting semaphores, eliminating deadlocks and race conditions.',
    },
    quiz: {
      question: 'What are the three mandatory requirements that any valid solution to the Critical Section problem must satisfy?',
      options: [
        'Mutual Exclusion, Progress, and Bounded Waiting',
        'High Bandwidth, Low Latency, and Zero Packet Loss',
        'Atomicity, Consistency, and Durability',
        'Confidentiality, Integrity, and Availability',
      ],
      correctIndex: 0,
      explanation: 'A correct solution must guarantee Mutual Exclusion (only one process in critical section), Progress (processes waiting can decide who enters next), and Bounded Waiting (no process can be starved indefinitely).',
    },
  },
  {
    week: 7,
    title: 'Deadlocks: Characterization, Prevention & Banker’s Algorithm',
    badge: 'Deadlocks',
    tagline: 'The four Coffman conditions, Resource Allocation Graphs (RAG), and Dijkstra’s Banker’s Algorithm',
    accreditedSpec: 'CSC2035 Specification: Topic 4.1 — Deadlock Characterization, Resource Allocation Graphs, and Avoidance Algorithms',
    referencePoint: {
      academic: 'Coffman, E.G., Elphick, M.J., & Shoshani, A. (1971). System Deadlocks. ACM Computing Surveys, 3(2), pp. 67–78.',
      standard: 'NIST Computer Security Resource Center: Concurrency and Resource Deadlock Avoidance.',
      enterprise: 'PostgreSQL deadlock detection background daemon and lock timeout mechanisms.',
    },
    pedagogy: {
      simple: 'Deadlock is like four cars arriving at an uncontrolled four-way intersection at the exact same instant, each waiting for the car on their right to move. Nobody can move! In computers, if Process A holds Lock 1 and waits for Lock 2, while Process B holds Lock 2 and waits for Lock 1, both freeze forever.',
      engineer: 'A Deadlock occurs if and only if all four Coffman conditions hold simultaneously: Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait. Deadlock prevention breaks at least one condition (e.g. strict global resource ordering breaks circular wait). Deadlock avoidance dynamically evaluates system state safety using Dijkstra’s Banker’s Algorithm to ensure a safe execution sequence exists.',
    },
    narration: 'Week 7 investigates system deadlocks. We dissect the four Coffman conditions, construct Resource Allocation Graphs to identify directed cycles, simulate Dijkstra’s Banker’s Algorithm to reject unsafe resource requests, and implement deadlock recovery.',
    capstone: {
      id: 'cap_bankers_algo_sim',
      title: 'Interactive Resource Allocation Graph & Banker’s Algorithm Lab',
      description: 'Construct multi-resource allocation matrices, detect directed deadlock cycles in resource graphs, and execute Banker’s safety algorithm to evaluate grant safety.',
    },
    quiz: {
      question: 'Which of the following is NOT one of the four Coffman conditions required for a deadlock to occur?',
      options: [
        'Preemptive Resource Reallocation',
        'Mutual Exclusion',
        'Hold and Wait',
        'Circular Wait',
      ],
      correctIndex: 0,
      explanation: 'The four Coffman conditions are Mutual Exclusion, Hold and Wait, No Preemption (resources cannot be forcibly taken away), and Circular Wait. Preemptive reallocation actually breaks deadlock.',
    },
  },
  {
    week: 8,
    title: 'Inter-Process Communication (IPC): Pipes, FIFOs & Shared Memory',
    badge: 'IPC Mechanisms',
    tagline: 'Anonymous pipes, named FIFOs, shared memory (shmget/mmap), and UNIX domain sockets',
    accreditedSpec: 'CSC2035 Specification: Topic 4.2 — Inter-Process Communication Paradigms, Message Passing, and Shared Memory Systems',
    referencePoint: {
      academic: 'Stevens, W.R. (1998). UNIX Network Programming, Volume 2: Interprocess Communications (2nd Ed.). Prentice Hall.',
      standard: 'POSIX.1-2017: pipe, mkfifo, shm_open, mmap, and msync IPC standards.',
      enterprise: 'High-frequency trading zero-copy shared memory queues and Chrome multiprocess IPC architecture.',
    },
    pedagogy: {
      simple: 'Since processes are locked in their own private memory rooms, how do they talk to each other? Operating systems provide communication pipes! An Anonymous Pipe connects the output of one process to the input of another, like typing `cat file.txt | grep error` in your terminal.',
      engineer: 'IPC bridges isolated address spaces via two primary paradigms: Message Passing (UNIX anonymous pipes, named FIFOs, message queues) and Shared Memory (mmap, shmget). Anonymous pipes provide unidirectional byte streams synchronized via kernel ring buffers; writing to a full pipe or reading from an empty pipe blocks by default. Shared memory offers maximum throughput by mapping the same physical frames into multiple virtual address spaces without kernel copy overhead.',
    },
    narration: 'In Week 8, we explore Inter-Process Communication. We implement unidirectional anonymous pipes with pipe() and dup2(), configure named FIFOs for unrelated processes, and set up high-speed zero-copy shared memory regions with POSIX mmap.',
    capstone: {
      id: 'cap_ipc_pipeline',
      title: 'Interactive POSIX Pipe & Shared Memory Data Pipeline',
      description: 'Wire parent and child processes using POSIX pipes, simulate shell pipeline redirection (dup2), and inspect zero-copy shared memory segments.',
    },
    quiz: {
      question: 'Why does Shared Memory provide the highest throughput among all Inter-Process Communication mechanisms?',
      options: [
        'Data does not need to be copied into kernel space and back out to user space; processes read and write directly to shared physical RAM frames',
        'Shared memory automatically encrypts all messages using AES-256',
        'The kernel prioritizes shared memory threads ahead of all other processes',
        'Shared memory bypasses CPU cache levels',
      ],
      correctIndex: 0,
      explanation: 'In pipe or socket IPC, data must be copied from user buffer to kernel buffer and then to the receiving user buffer. Shared memory maps the same physical RAM frames into both address spaces, enabling zero-copy access at raw memory bus speeds.',
    },
  },
  {
    week: 9,
    title: 'Network Systems: Layered Architecture, Protocols & TCP/IP Model',
    badge: 'Network Architectures',
    tagline: 'OSI 7-layer model, TCP/IP 4-layer model, packet encapsulation, and IP addressing',
    accreditedSpec: 'CSC2035 Specification: Topic 5.1 — Layered Network Architectures, Encapsulation/Decapsulation, and the Internet Protocol (IP)',
    referencePoint: {
      academic: 'Kurose, J.F. & Ross, K.W. (2021). Computer Networking: A Top-Down Approach (8th Ed.), Chapter 1: Computer Networks and the Internet. Pearson.',
      standard: 'IETF RFC 791: Internet Protocol (IPv4) & IETF RFC 8200: Internet Protocol, Version 6 (IPv6) Specification.',
      enterprise: 'Ethernet framing (IEEE 802.3), MTU 1500-byte boundaries, and BGP routing across internet backbones.',
    },
    pedagogy: {
      simple: 'How does an email travel from your laptop in Newcastle to a server in Tokyo in less than a second? By breaking the journey into standardized layers! Application data gets wrapped in envelopes inside envelopes (encapsulation), adding postal addresses (IP) and room numbers (Ports) at every step.',
      engineer: 'The Internet is organized hierarchically into the 4-layer TCP/IP model: Link (Ethernet frames, MAC addresses), Internet (IPv4/IPv6 packet routing, TTL), Transport (TCP/UDP segments, port multiplexing), and Application (HTTP, DNS). Each layer prepends its protocol header during Encapsulation on transmission and strips it during Decapsulation upon reception.',
    },
    narration: 'Week 9 begins the Networked Systems strand. We contrast the theoretical OSI 7-layer model with the practical TCP/IP 4-layer stack, trace packet encapsulation from application payload to physical wire, and examine IP routing and TTL hop limits.',
    capstone: {
      id: 'cap_packet_encapsulator',
      title: 'Interactive Network Packet Encapsulation & Header Deconstructor',
      description: 'Wrap an HTTP request payload down the TCP/IP stack, calculating TCP port headers, IP checksums and TTLs, and Ethernet MAC frames.',
    },
    quiz: {
      question: 'What process occurs when a network protocol adds its specific control header to data received from the layer above it?',
      options: [
        'Encapsulation',
        'Decapsulation',
        'Demultiplexing',
        'Serialization',
      ],
      correctIndex: 0,
      explanation: 'Encapsulation is the process where each layer in the protocol stack wraps payload data from the higher layer with its own protocol header (and sometimes trailer) before passing it down to the next layer.',
    },
  },
  {
    week: 10,
    title: 'Transport Layer: TCP Reliability, 3-Way Handshake & Flow Control',
    badge: 'TCP Reliability',
    tagline: 'UDP vs TCP, SYN/ACK handshake, Sliding Window flow control, and AIMD congestion control',
    accreditedSpec: 'CSC2035 Specification: Topic 5.2 — Reliable Data Transfer (rdt), TCP Connection Management, and Sliding Window Mechanics',
    referencePoint: {
      academic: 'Kurose, J.F. & Ross, K.W. (2021). Computer Networking (8th Ed.), Chapter 3: Transport Layer. Pearson.',
      standard: 'IETF RFC 793 (RFC 9293): Transmission Control Protocol (TCP) Specification & RFC 5681 TCP Congestion Control.',
      enterprise: 'BBR (Bottleneck Bandwidth and RTT) vs CUBIC congestion control in Linux and Google global infrastructure.',
    },
    pedagogy: {
      simple: 'The internet is unreliable; packets get dropped or delayed all the time! UDP just sends packets and hopes they arrive (great for live video games). TCP is like certified mail: it establishes a connection with a 3-way handshake ("Hello", "Hello back", "Thanks!"), numbers every single byte, and retransmits anything lost in transit.',
      engineer: 'TCP provides connection-oriented, reliable, in-order byte stream delivery over unreliable IP networks. Connection lifecycle uses a 3-Way Handshake (SYN, SYN-ACK, ACK) and 4-way termination (FIN, ACK, FIN, ACK). Reliability relies on Sequence Numbers, Cumulative ACKs, and Retransmission Timeouts (RTO). Flow control uses a sliding Receive Window (rwnd); congestion control dynamically throttles the Congestion Window (cwnd) via Additive Increase Multiplicative Decrease (AIMD).',
    },
    narration: 'In Week 10, we deconstruct TCP reliability. We step through the SYN/ACK handshake state machine, visualize sliding window buffer dynamics, analyze TCP slow-start and AIMD congestion recovery, and contrast TCP guarantees against lightweight UDP datagrams.',
    capstone: {
      id: 'cap_tcp_handshake_sim',
      title: 'Interactive TCP 3-Way Handshake & Sliding Window Simulator',
      description: 'Simulate packet drops, observe TCP sequence number acknowledgments, calculate RTT timeouts, and watch the sliding window adapt to congestion.',
    },
    quiz: {
      question: 'What sequence of flags is exchanged during the standard TCP 3-Way Handshake to establish a connection?',
      options: [
        'SYN -> SYN-ACK -> ACK',
        'ACK -> SYN -> SYN-ACK',
        'FIN -> ACK -> FIN-ACK',
        'HELLO -> READY -> START',
      ],
      correctIndex: 0,
      explanation: 'The client sends a segment with the SYN flag set; the server responds with a segment having both SYN and ACK flags set; and the client finalizes connection establishment by sending an ACK segment.',
    },
  },
  {
    week: 11,
    title: 'Network Socket Programming & Client-Server Architecture',
    badge: 'Socket Programming',
    tagline: 'POSIX Berkeley Sockets, socket(), bind(), listen(), accept(), connect(), and concurrency models',
    accreditedSpec: 'CSC2035 Specification: Topic 6.1 — Berkeley Socket API, Server State Machines, and Network Byte Order (Endians)',
    referencePoint: {
      academic: 'Donahoo, M.J. & Calvert, K.L. (2009). TCP/IP Sockets in C: Practical Guide for Programmers (2nd Ed.). Morgan Kaufmann.',
      standard: 'POSIX.1-2017: sys/socket.h, netinet/in.h, and arpa/inet.h networking interfaces.',
      enterprise: 'Nginx multi-worker socket architecture & epoll event-driven network server designs.',
    },
    pedagogy: {
      simple: 'A Network Socket is like a telephone receiver for your program. The server creates a socket, plugs it into a specific port (bind), listens for incoming rings (listen), and picks up the call (accept). The client dials the server’s IP and port (connect) to start chatting.',
      engineer: 'The Berkeley Sockets API abstracts network endpoints as file descriptors. Servers execute socket() -> bind(sockaddr_in) -> listen(backlog) -> accept(), which blocks until an incoming SYN completes the handshake and spawns a dedicated client connection descriptor. Multi-byte integers must be converted between Host and Network Byte Order (htons, ntohl) to prevent Endianness corruptions.',
    },
    narration: 'Week 11 covers POSIX Network Socket Programming. We construct concurrent TCP echo servers in C, trace socket file descriptors through bind, listen, and accept state transitions, convert network byte orders, and handle multi-client connections using fork() and worker threads.',
    capstone: {
      id: 'cap_socket_lab',
      title: 'Interactive POSIX Berkeley Socket Server & Client Workbench',
      description: 'Step through socket lifecycle calls (socket, bind, listen, accept, connect, send, recv), trace socket queues, and inspect network byte order encodings.',
    },
    quiz: {
      question: 'In a TCP server program, what does the accept() system call return upon a successful client connection?',
      options: [
        'A brand new file descriptor dedicated exclusively to communicating with that specific connected client',
        'The integer 0 to indicate success',
        'The server’s listening port number',
        'The MAC address of the network router',
      ],
      correctIndex: 0,
      explanation: 'accept() extracts the first connection request on the listening queue and returns a new file descriptor referring to that specific connected socket. The original listening socket remains open to continue accepting further incoming connections.',
    },
  },
  {
    week: 12,
    title: 'High-Performance Systems & Systems Engineering Capstone',
    badge: 'Systems Capstone',
    tagline: 'Non-blocking I/O, event loops (epoll/kqueue), C10K problem, multi-tier system integration, and exam prep',
    accreditedSpec: 'CSC2035 Specification: Topic 6.2 — Scalable I/O Multiplexing, Non-blocking Sockets, and Systems Integration Capstone',
    referencePoint: {
      academic: 'Love, R. (2013). Linux System Programming (2nd Ed.), Chapter 2: File I/O & Multiplexing. O’Reilly Media.',
      standard: 'POSIX select() and pselect() vs Linux epoll (epoll_create, epoll_ctl, epoll_wait) specifications.',
      enterprise: 'Node.js libuv event loop and High-throughput Nginx/Redis single-threaded async event loops.',
    },
    pedagogy: {
      simple: 'How can a single web server handle 100,000 users at once without running out of memory for 100,000 threads? By using Event-Driven I/O! Instead of having a dedicated waiter standing at every table waiting for customers to chew, one waiter checks an electronic notification board (epoll) and only visits tables that are ready to order!',
      engineer: 'Traditional thread-per-connection architectures collapse under massive concurrency (the C10K problem) due to thread stack memory consumption and CPU context-switch latency. High-performance systems employ Non-blocking I/O multiplexed via OS-level event mechanisms (epoll on Linux, kqueue on BSD/macOS). A single event loop thread monitors thousands of active descriptors with O(1) readiness dispatch.',
    },
    narration: 'Welcome to the Week 12 Systems Capstone. We synthesize Operating Systems and Networked Systems into a high-performance event-driven server. You will evaluate I/O multiplexing with select and epoll, design non-blocking multi-tier architectures, and prove mastery of systems programming.',
    capstone: {
      id: 'cap_epoll_event_loop',
      title: 'Interactive Epoll Event-Loop & High-Concurrency Systems Lab',
      description: 'Benchmark thread-per-client versus non-blocking epoll event loops under 10,000 simulated connections, measuring memory footprint and latency.',
    },
    quiz: {
      question: 'Why does the Linux epoll mechanism scale significantly better than traditional POSIX select() when monitoring 10,000 concurrent network connections?',
      options: [
        'epoll uses an in-kernel ready list returning only the active file descriptors in O(1) time, whereas select() requires scanning through all 10,000 descriptors in O(N) time on every call',
        'epoll uses quantum computing to anticipate incoming packets',
        'select() is limited to UDP connections only',
        'epoll automatically compresses network data before transmitting',
      ],
      correctIndex: 0,
      explanation: 'select() requires the application to pass and scan the entire descriptor set on every iteration ($O(N)$ overhead). epoll registers descriptors once in the kernel and epoll_wait() returns strictly the events that have fired ($O(1)$ with respect to total connections).',
    },
  },
];

export const CANVAS_COURSE_METADATA_2035 = {
  courseId: 58456,
  moduleCode: 'CSC2035',
  moduleTitle: 'Software Systems Design and Implementation',
  canvasUrl: 'https://ncl.instructure.com/courses/58456/modules',
  academicInstitution: 'Newcastle University',
  faculty: 'School of Computing, Urban Sciences Building (USB)',
  academicYear: '2025/2026',
  credits: 30,
  staff: [
    {
      name: 'Dr Chris Phillips',
      email: 'chris.phillips@ncl.ac.uk',
      role: 'Module Leader & Senior Lecturer (Operating Systems Strand)',
      office: 'Urban Sciences Building (USB), Room 3.018',
    },
    {
      name: 'Dr Nigel Thomas',
      email: 'nigel.thomas@ncl.ac.uk',
      role: 'Lecturer (Networked Systems & Systems Modeling)',
      office: 'Urban Sciences Building (USB)',
    },
    {
      name: 'Dr Paul Ezhilchelvan',
      email: 'paul.ezhilchelvan@ncl.ac.uk',
      role: 'Lecturer (Distributed Protocols & Concurrency)',
      office: 'Urban Sciences Building (USB)',
    },
  ],
  assessments: [
    {
      title: 'Coursework 1: C Systems Programming & Process Concurrency',
      weight: '40%',
      type: 'Practical C Software Implementation',
      due: 'Week 6, Semester 1',
    },
    {
      title: 'Coursework 2: Multithreaded Networked Client-Server System',
      weight: '60%',
      type: 'Network Systems Implementation & Performance Report',
      due: 'Week 12, Semester 1',
    },
  ],
};

export const CANVAS_MODULES_2035: CanvasModuleTopic[] = [
  {
    moduleNumber: 1,
    title: 'Module 1: Dual-Mode Execution, Hardware Protection & System Calls',
    state: 'active',
    readingReference: 'Silberschatz et al. (2018), Ch. 1-2 • POSIX.1-2017 Specification',
    associatedWeek: 1,
    items: [
      { id: 'sys-mod-1-1', title: 'Lecture 1.1: Operating System Organization & Hardware Privilege Rings', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-1-2', title: 'Lecture 1.2: System Call Dispatching, Traps & Context Switching', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-1-3', title: 'Lab Practical 1: Inspecting Linux System Calls with strace in C', type: 'practical', url: 'https://ncl.instructure.com/courses/58456/modules' },
    ],
  },
  {
    moduleNumber: 2,
    title: 'Module 2: Process Control, Process Trees & Fork/Exec Lifecycle',
    state: 'active',
    readingReference: 'Stevens & Rago (2013), Ch. 7-8 • POSIX Process Lifecycle',
    associatedWeek: 2,
    items: [
      { id: 'sys-mod-2-1', title: 'Lecture 2.1: The Process Control Block (PCB) & State Transitions', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-2-2', title: 'Lecture 2.2: UNIX Process Management: fork(), execvp(), and waitpid()', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-2-3', title: 'Lab Practical 2: Implementing a Custom POSIX Command Shell in C', type: 'practical', url: 'https://ncl.instructure.com/courses/58456/modules' },
    ],
  },
  {
    moduleNumber: 3,
    title: 'Module 3: Virtual Memory, Address Translation & Page Tables',
    state: 'active',
    readingReference: 'Tanenbaum & Bos (2015), Ch. 3 • x86-64 Paging Architecture',
    associatedWeek: 3,
    items: [
      { id: 'sys-mod-3-1', title: 'Lecture 3.1: Paging Architecture & Multi-Level Page Tables', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-3-2', title: 'Lecture 3.2: The Hardware MMU, TLB Caching & Page Fault Handling', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-3-3', title: 'Lab Practical 3: Virtual Memory Simulation & Page Replacement Benchmarks', type: 'practical', url: 'https://ncl.instructure.com/courses/58456/modules' },
    ],
  },
  {
    moduleNumber: 4,
    title: 'Module 4: Threads, Race Conditions & POSIX Pthreads',
    state: 'active',
    readingReference: 'Butenhof (1997) Programming with POSIX Threads • POSIX.1c',
    associatedWeek: 5,
    items: [
      { id: 'sys-mod-4-1', title: 'Lecture 4.1: Thread Memory Layout: Shared Heap vs Private Stacks', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-4-2', title: 'Lecture 4.2: POSIX Thread Creation, Joining & Race Condition Analysis', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-4-3', title: 'Lab Practical 4: Multithreaded Matrix Multiplication with POSIX Pthreads', type: 'practical', url: 'https://ncl.instructure.com/courses/58456/modules' },
    ],
  },
  {
    moduleNumber: 5,
    title: 'Module 5: Mutual Exclusion: Mutexes, Semaphores & Deadlocks',
    state: 'active',
    readingReference: 'Dijkstra (1965) EWD-123 • Coffman et al. (1971) System Deadlocks',
    associatedWeek: 6,
    items: [
      { id: 'sys-mod-5-1', title: 'Lecture 5.1: The Critical Section Problem & Atomic Hardware Primitives', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-5-2', title: 'Lecture 5.2: Dijkstra Semaphores & POSIX Mutex Implementation', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-5-3', title: 'Lecture 5.3: Deadlock Characterization & Banker’s Safety Algorithm', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-5-4', title: 'Lab Practical 5: The Bounded Buffer Problem with Mutexes and Semaphores', type: 'practical', url: 'https://ncl.instructure.com/courses/58456/modules' },
    ],
  },
  {
    moduleNumber: 6,
    title: 'Module 6: Network Systems: TCP/IP Stack & Berkeley Socket Programming',
    state: 'active',
    readingReference: 'Kurose & Ross (2021), Ch. 1 & 3 • Donahoo & Calvert TCP/IP Sockets',
    associatedWeek: 11,
    items: [
      { id: 'sys-mod-6-1', title: 'Lecture 6.1: Network Layering, Encapsulation & Transport Protocols', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-6-2', title: 'Lecture 6.2: TCP Reliability, 3-Way Handshake & Flow Control', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-6-3', title: 'Lecture 6.3: POSIX Socket Programming: socket(), bind(), listen(), accept()', type: 'lecture', url: 'https://ncl.instructure.com/courses/58456/modules' },
      { id: 'sys-mod-6-4', title: 'Lab Practical 6: Building a Concurrent Multi-Client Web Server in C', type: 'practical', url: 'https://ncl.instructure.com/courses/58456/modules' },
    ],
  },
];

export const EXAM_QUESTIONS_2035: { A: ExamQuestion[]; B: ExamQuestion[] } = {
  A: [
    {
      id: 'q2035-a1',
      section: 'A',
      title: 'Question 1: Virtual Memory Address Translation & Paging',
      marks: 10,
      scenario: 'A computer system uses 32-bit virtual addresses and a 2-level paging scheme. The page size is 4 KB (2^12 bytes). The first level page directory has 1,024 entries, and each second-level page table has 1,024 entries.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Break down the 32-bit virtual address into its constituent components: Page Directory Index, Page Table Index, and Page Offset, specifying the bit-width of each field.',
          marks: 4,
          markingCriteria: [
            '1 mark: 12 bits for Page Offset (since 4 KB = 2^12 bytes).',
            '1.5 marks: 10 bits for Page Table Index (since 1024 = 2^10 entries).',
            '1.5 marks: 10 bits for Page Directory Index (since 1024 = 2^10 entries; 10 + 10 + 12 = 32 bits total).',
          ],
          modelAnswer: 'Page Offset: 12 bits (bits 0–11), because 4 KB = 4,096 bytes = 2^12 bytes.\nPage Table Index: 10 bits (bits 12–21), because 1,024 entries = 2^10.\nPage Directory Index: 10 bits (bits 22–31), because 1,024 entries = 2^10.\nTotal = 10 + 10 + 12 = 32 bits.',
        },
        {
          part: '(b)',
          prompt: 'Explain what happens when a program accesses a virtual page whose valid-invalid bit in the page table entry is marked 0 (invalid). Detail the operating system steps taken to resolve it.',
          marks: 6,
          markingCriteria: [
            '2 marks: Identification of hardware Page Fault trap to the OS kernel.',
            '2 marks: OS checks internal VMA structure to verify whether address access is legitimate.',
            '2 marks: Allocating physical frame, reading page from swap disk, updating page table to valid (1), and restarting the trapped CPU instruction.',
          ],
          modelAnswer: '1. The CPU MMU detects the invalid bit (0) and triggers a Page Fault hardware trap, pausing the process.\n2. The OS page fault handler inspects the process memory descriptors (vm_area_struct) to determine if the access was valid.\n3. If invalid (illegal access), the OS sends a SIGSEGV signal (Segmentation Fault).\n4. If valid, the OS finds a free physical frame (or evicts one using LRU page replacement).\n5. The OS schedules a disk read to load the desired page from swap space into the physical frame.\n6. The OS updates the page table entry with the physical frame number and sets the valid bit to 1.\n7. The OS restores registers and restarts the exact machine instruction that faulted.',
        },
      ],
    },
  ],
  B: [
    {
      id: 'q2035-b1',
      section: 'B',
      title: 'Question 2: Concurrency, Synchronization & Deadlocks',
      marks: 15,
      scenario: 'Two concurrent threads T1 and T2 share two POSIX mutexes, `mutex_A` and `mutex_B`. T1 acquires `mutex_A` then `mutex_B`. T2 acquires `mutex_B` then `mutex_A`.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Illustrate how an interleaving of these two threads can produce a deadlock, and show that all four Coffman conditions are met.',
          marks: 8,
          markingCriteria: [
            '4 marks: Explicit timeline showing T1 locking A, T2 locking B, T1 requesting B (blocked), T2 requesting A (blocked).',
            '4 marks: Explicitly mapping the scenario to Mutual Exclusion, Hold and Wait, No Preemption, and Circular Wait.',
          ],
          modelAnswer: "Timeline:\n- Time 1: Thread T1 executes pthread_mutex_lock(&mutex_A) [Succeeds; T1 holds A].\n- Time 2: Thread T2 executes pthread_mutex_lock(&mutex_B) [Succeeds; T2 holds B].\n- Time 3: Thread T1 executes pthread_mutex_lock(&mutex_B) [Blocks; waiting for T2 to release B].\n- Time 4: Thread T2 executes pthread_mutex_lock(&mutex_A) [Blocks; waiting for T1 to release A].\nBoth threads are permanently blocked.\n\nCoffman Conditions:\n1. Mutual Exclusion: Mutexes A and B can only be held by one thread at a time.\n2. Hold and Wait: T1 holds A while waiting for B; T2 holds B while waiting for A.\n3. No Preemption: The OS cannot forcibly strip a locked mutex from T1 or T2.\n4. Circular Wait: T1 waits for T2 (holding B), and T2 waits for T1 (holding A).",
        },
        {
          part: '(b)',
          prompt: 'Propose an engineering solution to eliminate this deadlock permanently without changing the requirement that both mutexes must be held simultaneously.',
          marks: 7,
          markingCriteria: [
            '4 marks: Enforcing strict global lock ordering / resource hierarchy.',
            '3 marks: Showing that acquiring mutex_A before mutex_B in both threads breaks the Circular Wait condition.',
          ],
          modelAnswer: "Solution: Enforce strict Global Lock Hierarchy (Resource Ordering).\nDefine an agreed global acquisition order: Mutex A (Rank 1) must ALWAYS be acquired before Mutex B (Rank 2).\n\nBoth T1 and T2 must be written as:\npthread_mutex_lock(&mutex_A);\npthread_mutex_lock(&mutex_B);\n// Critical Section\npthread_mutex_unlock(&mutex_B);\npthread_mutex_unlock(&mutex_A);\n\nMathematical Justification: Enforcing a total order on locks makes a circular wait graph impossible (a cycle would require lock_i < lock_j and lock_j < lock_i, a contradiction). Deadlock is mathematically prevented.",
        },
      ],
    },
  ],
};
