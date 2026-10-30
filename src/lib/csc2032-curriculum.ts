/**
 * CSC2032: Algorithm Design and Analysis Curriculum Specification
 * Newcastle University • School of Computing • Stage 2 Core Module (20 Credits)
 * Canvas Course ID: 70332
 * Direct Canvas URL: https://ncl.instructure.com/courses/70332
 * Accredited Syllabus Specification with Academic References, CLRS Standards & Complexity Benchmarks.
 * Organized in standard 12-Week Semester Sequence with Canvas Module Integration & Exam Hub.
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';

export const CSC2032_WEEKS: WeekCurriculum[] = [
  {
    week: 1,
    title: 'Algorithm Foundations & The RAM Model of Computation',
    badge: 'Foundations',
    tagline: 'Computational problem formulation, Random Access Machine (RAM) model, and exact operation counting',
    accreditedSpec: 'CSC2032 Specification: Topic 1.1 — Algorithm Definition, Computational Models, and Operation Counting',
    referencePoint: {
      academic: 'Cormen, T.H., Leiserson, C.E., Rivest, R.L. & Stein, C. (2022). Introduction to Algorithms (4th Ed.), Chapter 2: Getting Started. MIT Press.',
      standard: 'IEEE 1471 / ISO/IEC 42010: Systems and Software Engineering — Computational Performance Characterization.',
      enterprise: 'Standard C++ STL algorithm runtime guarantees (ISO/IEC 14882) vs Python time complexity benchmarks.',
    },
    pedagogy: {
      simple: 'An algorithm is a step-by-step recipe to solve a problem. In computer science, we analyze algorithms using a standard idealized computer called the RAM model, counting how many basic mathematical and memory operations occur as our input data grows.',
      engineer: 'The Random Access Machine (RAM) architecture assumes single-processor instructions execute in uniform constant time O(1). We compute the exact step-count function T(n) = c1*n + c2 by counting loop iterations, assignment statements, and arithmetic comparisons.',
    },
    narration: 'Week 1 establishes the mathematical bedrock of computer science: moving beyond clock-time measurements to machine-independent algorithmic analysis.',
    capstone: {
      id: 'alg_w1_ram',
      title: 'RAM Operation Step Counter',
      description: 'Profile insertion sort step counts line-by-line across best-case sorted arrays and worst-case reversed arrays.',
    },
    quiz: {
      question: 'Under the standard RAM model of computation, which of the following operations is assumed to take O(1) constant time?',
      options: [
        'Sorting an array of n integers',
        'Accessing an element in an array by index A[i]',
        'Searching for an arbitrary value in an unsorted list of length n',
        'Multiplying two n-bit integers without hardware coprocessors',
      ],
      correctIndex: 1,
      explanation: 'Under the Random Access Machine model, direct memory addressing by index (A[i]) is postulated to execute in uniform O(1) time regardless of array size.',
    },
  },
  {
    week: 2,
    title: 'Asymptotic Growth & Big-O Notation',
    badge: 'Complexity',
    tagline: 'Formal mathematical definitions of Big-O, Big-Omega, Big-Theta, Little-o, and limit quotients',
    accreditedSpec: 'CSC2032 Specification: Topic 1.2 — Asymptotic Notation: O, Ω, Θ, o, ω, and Limit Rules',
    referencePoint: {
      academic: 'Kleinberg, J. & Tardos, É. (2006). Algorithm Design, Chapter 2: Basics of Algorithm Analysis. Pearson/Addison-Wesley.',
      standard: 'Knuth, D.E. (1976). Big Omicron and Big Omega and Big Theta. ACM SIGACT News, 8(2), 18-24.',
      enterprise: 'Google Search index query latency bounds: Sub-linear logarithmic tier vs Quadratic scale-out bottlenecks.',
    },
    pedagogy: {
      simple: 'Big-O notation describes how an algorithm slows down as the input gets huge. Big-O gives the worst-case upper bound, Big-Omega gives the best-case lower bound, and Big-Theta means both bounds match tight like a glove.',
      engineer: 'f(n) = O(g(n)) iff ∃ constants c > 0, n0 ≥ 0 such that 0 ≤ f(n) ≤ c*g(n) for all n ≥ n0. We evaluate asymptotic dominance via limit quotients: lim_{n→∞} f(n)/g(n) = 0 implies f(n) = o(g(n)).',
    },
    narration: 'Week 2 formalizes Donald Knuth’s asymptotic definitions, giving you the vocabulary to prove algorithm efficiency across orders of magnitude.',
    capstone: {
      id: 'alg_w2_asymptotics',
      title: 'Asymptotic Dominance Proof Engine',
      description: 'Prove tight theta bounds for polynomial, logarithmic, exponential, and factorial functions using limit calculus.',
    },
    quiz: {
      question: 'If f(n) = 3n^2 + 100n*log(n) + 4000, what is the tight asymptotic bound (Big-Theta) of f(n)?',
      options: [
        'Θ(n*log(n))',
        'Θ(n^2)',
        'Θ(n^3)',
        'Θ(log(n))',
      ],
      correctIndex: 1,
      explanation: 'As n grows towards infinity, the leading term n^2 dominates all lower-order terms (100n*log(n) and 4000). Thus f(n) = Θ(n^2).',
    },
  },
  {
    week: 3,
    title: 'Divide & Conquer: MergeSort & Inversion Counting',
    badge: 'Divide & Conquer',
    tagline: 'Splitting problems into subproblems, recursive combination, and O(n log n) inversion counting',
    accreditedSpec: 'CSC2032 Specification: Topic 2.1 — Divide-and-Conquer Paradigm, MergeSort, and Counting Inversions',
    referencePoint: {
      academic: 'Sedgewick, R. & Wayne, K. (2011). Algorithms (4th Ed.), Chapter 2: Sorting. Addison-Wesley.',
      standard: 'POSIX.1-2008 qsort() and mergesort() algorithm specification.',
      enterprise: 'Collaborative filtering recommendation engines (Amazon/Netflix) using inversion count distance metrics.',
    },
    pedagogy: {
      simple: 'Divide and conquer breaks a big problem into smaller pieces, solves each piece independently, and glues the solutions back together. MergeSort cuts lists in half, sorts each half, and zips them together in O(n) time.',
      engineer: 'Divide-and-conquer decomposes a problem into a subproblems of size n/b, solves them recursively, and combines them in O(n^d) time. Modified MergeSort counts inversions in O(n log n) by tallying remaining left-array items during merge.',
    },
    narration: 'Week 3 unlocks the power of recursion to turn quadratic brute-force operations into sleek O(n log n) industrial algorithms.',
    capstone: {
      id: 'alg_w3_mergesort',
      title: 'Inversion Count Recommendation Engine',
      description: 'Compute preference ranking similarity between users by measuring permutations and inversions in O(n log n).',
    },
    quiz: {
      question: 'How many inversions exist in the array [4, 1, 3, 2]?',
      options: [
        '2 inversions',
        '4 inversions: (4,1), (4,3), (4,2), (3,2)',
        '6 inversions',
        '1 inversion',
      ],
      correctIndex: 1,
      explanation: 'An inversion is any pair (i, j) where i < j and A[i] > A[j]. Here: (4,1), (4,3), (4,2), and (3,2) form 4 inversions.',
    },
  },
  {
    week: 4,
    title: 'Recurrence Relations & The Master Theorem',
    badge: 'Recurrences',
    tagline: 'Solving T(n) = a*T(n/b) + f(n) across leaf-heavy, balanced, and root-heavy recurrence cases',
    accreditedSpec: 'CSC2032 Specification: Topic 2.2 — Recurrence Trees, Substitution Method, and Master Theorem',
    referencePoint: {
      academic: 'Bentley, J.L., Haken, D. & Saxe, J.B. (1980). A general method for solving divide-and-conquer recurrences. ACM SIGACT.',
      standard: 'ISO/IEC TR 24772: Algorithmic Complexity Avoidance & Recursion Bounding.',
      enterprise: 'Database B-Tree and LSM-Tree search complexity derivations across clustered distributed partitions.',
    },
    pedagogy: {
      simple: 'The Master Theorem is a fast cookbook formula that gives the exact speed of recursive algorithms without drawing out huge trees. You compare how fast subproblems branch out versus how much work is done merging them.',
      engineer: 'For T(n) = a*T(n/b) + f(n), we compute the critical watershed exponent c_crit = log_b(a). Case 1 (leaf-heavy): f(n) = O(n^{c_crit - ε}) gives T(n) = Θ(n^{log_b(a)}). Case 2 (balanced): f(n) = Θ(n^{c_crit}) gives T(n) = Θ(n^{c_crit} * log n). Case 3 (root-heavy): f(n) = Ω(n^{c_crit + ε}) gives T(n) = Θ(f(n)).',
    },
    narration: 'Week 4 equips you with the Master Theorem to solve complex algorithmic recurrences in seconds.',
    capstone: {
      id: 'alg_w4_master_solver',
      title: 'Master Theorem Recurrence Solver',
      description: 'Input any recurrence parameters (a, b, f(n)) and visually inspect the recursion tree depth and dominant cost.',
    },
    quiz: {
      question: 'What is the asymptotic solution of T(n) = 8*T(n/2) + n^2 by the Master Theorem?',
      options: [
        'T(n) = Θ(n^2)',
        'T(n) = Θ(n^3)',
        'T(n) = Θ(n^2 * log n)',
        'T(n) = Θ(n * log n)',
      ],
      correctIndex: 1,
      explanation: 'a = 8, b = 2. log_b(a) = log_2(8) = 3. Since f(n) = n^2 = O(n^{3 - 1}), we are in Case 1 (leaf-dominated). Therefore, T(n) = Θ(n^3).',
    },
  },
  {
    week: 5,
    title: 'Randomized Algorithms & QuickSort Partitioning',
    badge: 'Randomization',
    tagline: 'Lomuto vs Hoare partitioning, randomized pivots, expected O(n log n) runtime, and QuickSelect',
    accreditedSpec: 'CSC2032 Specification: Topic 2.3 — Randomized QuickSort, Indicator Random Variables, and QuickSelect',
    referencePoint: {
      academic: 'Hoare, C.A.R. (1962). Quicksort. The Computer Journal, 5(1), 10-16.',
      standard: 'C standard library stdlib.h qsort() algorithm baseline.',
      enterprise: 'Dual-pivot Quicksort (Yaroslavskiy) implemented in Java Oracle JDK 7+ Arrays.sort().',
    },
    pedagogy: {
      simple: 'QuickSort picks a pivot element, puts everything smaller on the left, and everything larger on the right. By picking pivots randomly, we guarantee that bad inputs like already-sorted lists can never slow us down.',
      engineer: 'Randomized QuickSort achieves E[T(n)] = 2n*ln(n) = Θ(n log n) expected time. Using indicator random variables X_ij for probability of comparison P(z_i ~ z_j) = 2/(j - i + 1), linearity of expectation guarantees worst-case quadratic O(n^2) has negligible probability.',
    },
    narration: 'Week 5 explores randomization as an engineering shield against worst-case adversary inputs.',
    capstone: {
      id: 'alg_w5_quickselect',
      title: 'O(n) Median Selection via QuickSelect',
      description: 'Find the k-th smallest element in an unordered dataset in expected O(n) time without complete sorting.',
    },
    quiz: {
      question: 'What is the average-case and worst-case time complexity of standard deterministic QuickSort with first-element pivot?',
      options: [
        'Average: O(n log n); Worst: O(n log n)',
        'Average: O(n log n); Worst: O(n^2)',
        'Average: O(n); Worst: O(n log n)',
        'Average: O(n^2); Worst: O(n^2)',
      ],
      correctIndex: 1,
      explanation: 'Deterministic QuickSort runs in average-case O(n log n), but degrades to worst-case O(n^2) on sorted or reverse-sorted inputs because subproblems split into size 0 and n-1.',
    },
  },
  {
    week: 6,
    title: 'Greedy Algorithms: Interval Scheduling & Huffman Coding',
    badge: 'Greedy',
    tagline: 'Locally optimal choices, greedy-choice property, optimal substructure, and lossless Huffman compression',
    accreditedSpec: 'CSC2032 Specification: Topic 3.1 — Greedy Design Paradigm, Exchange Arguments, and Huffman Trees',
    referencePoint: {
      academic: 'Huffman, D.A. (1952). A Method for the Construction of Minimum-Redundancy Codes. Proceedings of the IRE.',
      standard: 'RFC 1951: DEFLATE Compressed Data Format Specification (Huffman Coding + LZ77).',
      enterprise: 'Operating system process dispatchers and cloud job schedulers prioritizing earliest deadline first.',
    },
    pedagogy: {
      simple: 'A greedy algorithm always takes the best immediate choice right now without looking back. For meeting rooms, choosing the talk that ends earliest leaves the most time open for other talks.',
      engineer: 'Greedy optimality requires the greedy-choice property and optimal substructure. We prove optimality via exchange arguments: transforming an arbitrary optimal schedule O into greedy schedule G without decreasing cardinality.',
    },
    narration: 'Week 6 investigates greedy heuristics, showing when locally optimal steps yield global mathematical optima.',
    capstone: {
      id: 'alg_w6_huffman',
      title: 'Huffman Prefix-Free Compression Tool',
      description: 'Construct priority-queue Huffman trees and encode text into bitstreams achieving Shannon entropy limits.',
    },
    quiz: {
      question: 'In the Interval Scheduling problem, which greedy selection strategy is mathematically guaranteed to maximize non-overlapping requests?',
      options: [
        'Earliest start time',
        'Shortest interval duration',
        'Earliest finishing time',
        'Fewest overlapping conflicts',
      ],
      correctIndex: 2,
      explanation: 'Selecting requests by earliest finishing time leaves the maximum possible remaining time for subsequent non-conflicting intervals, provably optimal via exchange argument.',
    },
  },
  {
    week: 7,
    title: 'Dynamic Programming: Memoization & 0/1 Knapsack',
    badge: 'Dynamic Programming',
    tagline: 'Overlapping subproblems, DAG state transitions, top-down memoization vs bottom-up tabulation',
    accreditedSpec: 'CSC2032 Specification: Topic 3.2 — Dynamic Programming Fundamentals, Tabulation, and 0/1 Knapsack',
    referencePoint: {
      academic: 'Bellman, R. (1957). Dynamic Programming. Princeton University Press.',
      standard: 'ISO/IEC 23091: High-efficiency Video Coding — Dynamic Rate-Distortion Optimization.',
      enterprise: 'E-commerce logistics capacity packing and financial portfolio risk budgeting.',
    },
    pedagogy: {
      simple: 'Dynamic programming remembers past answers so you never solve the same puzzle twice. Instead of recomputing combinations over and over, we store answers in a grid and build upward.',
      engineer: 'DP applies when a problem exhibits optimal substructure and overlapping subproblems. For 0/1 Knapsack: V[i, w] = max(V[i-1, w], V[i-1, w - w_i] + v_i). Pseudo-polynomial time O(n*W) using bottom-up 2D matrix allocation.',
    },
    narration: 'Week 7 explores Dynamic Programming, Richard Bellman’s cornerstone method for solving combinatorial optimization problems.',
    capstone: {
      id: 'alg_w7_knapsack',
      title: '0/1 Knapsack Matrix Visualizer',
      description: 'Build the complete 2D dynamic programming table and backtrack along optimal decision boundaries.',
    },
    quiz: {
      question: 'Why is the O(n*W) runtime of the 0/1 Knapsack dynamic programming algorithm classified as pseudo-polynomial?',
      options: [
        'Because it only works for floating-point numbers',
        'Because the runtime is polynomial in the numerical value of W, but exponential in the bit-length of W (log W)',
        'Because it runs faster than O(n log n)',
        'Because it requires quadratic memory',
      ],
      correctIndex: 1,
      explanation: 'The input size of W is represented in log2(W) bits. Since W = 2^{log W}, an algorithm whose runtime is proportional to W is exponential in the size of the binary input representation.',
    },
  },
  {
    week: 8,
    title: 'Advanced DP: Longest Common Subsequence & Edit Distance',
    badge: 'Sequence DP',
    tagline: 'String alignment, genomic DNA homology, Levenshtein distance, and matrix-chain multiplication',
    accreditedSpec: 'CSC2032 Specification: Topic 3.3 — Sequence Alignment, LCS, Edit Distance, and Matrix-Chain Order',
    referencePoint: {
      academic: 'Needleman, S.B. & Wunsch, C.D. (1970). A general method applicable to the search for similarities in amino acid sequence. JMB.',
      standard: 'NCBI BLAST & Smith-Waterman alignment algorithm benchmarks.',
      enterprise: 'Git diff computation (Myers algorithm) and autocorrect fuzzy spell-checking engines.',
    },
    pedagogy: {
      simple: 'How does git diff know what lines you changed? It uses Dynamic Programming to find the longest sequence of words that both files share in common, highlighting the insertions and deletions.',
      engineer: 'LCS recurrence: if X[i] == Y[j] then c[i,j] = c[i-1,j-1] + 1; else c[i,j] = max(c[i-1,j], c[i,j-1]). Levenshtein distance extends this with substitution penalties, solving pairwise alignment in O(m*n) time and O(min(m, n)) space.',
    },
    narration: 'Week 8 applies dynamic programming to text processing, computational biology, and version control differentials.',
    capstone: {
      id: 'alg_w8_lcs',
      title: 'Git Diff & DNA Sequence Aligner',
      description: 'Align genomic nucleotide strands and source code files with full traceback path reconstruction.',
    },
    quiz: {
      question: 'What is the length of the Longest Common Subsequence between strings "ABCBDAB" and "BDCABA"?',
      options: [
        '3 ("ABC")',
        '4 ("BCBA" or "BDAB")',
        '5 ("ABCBA")',
        '6 ("ABCBDAB")',
      ],
      correctIndex: 1,
      explanation: 'The subsequences "BCBA" and "BDAB" both have length 4 and appear in order in both input strings.',
    },
  },
  {
    week: 9,
    title: 'Graph Traversal: BFS, DFS & Topological Sort',
    badge: 'Graph Algorithms',
    tagline: 'Adjacency lists, shortest unweighted paths via BFS, cycle detection, and DAG topological sorting',
    accreditedSpec: 'CSC2032 Specification: Topic 4.1 — Graph Representations, BFS, DFS, and Directed Acyclic Graphs (DAGs)',
    referencePoint: {
      academic: 'Tarjan, R.E. (1972). Depth-First Search and Linear Graph Algorithms. SIAM Journal on Computing, 1(2), 146-160.',
      standard: 'POSIX Make & Webpack DAG task dependency resolution standards.',
      enterprise: 'Social network connection distance (LinkedIn 1st/2nd/3rd degree) and web crawler frontier queues.',
    },
    pedagogy: {
      simple: 'Graphs connect dots (vertices) with lines (edges). Breadth-First Search radiates outward like ripples on water to find the shortest hop path. Depth-First Search dives deep like exploring a dark cave before backtracking.',
      engineer: 'BFS explores level-by-level using an FIFO queue in O(V + E) time, constructing shortest-path trees on unweighted graphs. DFS uses LIFO recursion or stacks, recording discovery d[v] and finish f[v] timestamps for cycle detection and topological sorting of DAGs.',
    },
    narration: 'Week 9 builds foundational graph analytics used in search engines, build tools, and distributed network routing.',
    capstone: {
      id: 'alg_w9_topo_sort',
      title: 'Build Dependency Topological Scheduler',
      description: 'Resolve package compilation dependencies, detect circular dependency cycles, and emit linear build order.',
    },
    quiz: {
      question: 'Which graph traversal algorithm correctly determines whether a directed graph contains a cycle?',
      options: [
        'Breadth-First Search checking cross edges',
        'Depth-First Search detecting a back edge to an active gray ancestor',
        'Binary search on adjacency matrix',
        'Dijkstra’s algorithm with zero weights',
      ],
      correctIndex: 1,
      explanation: 'In DFS with 3-color vertex marking (white = unvisited, gray = in-progress on stack, black = finished), encountering an edge to a gray vertex indicates a back edge, proving a cycle exists.',
    },
  },
  {
    week: 10,
    title: 'Minimum Spanning Trees: Kruskal & Prim with Disjoint Sets',
    badge: 'Spanning Trees',
    tagline: 'Connecting network nodes with minimal total edge weight using Union-Find and priority queues',
    accreditedSpec: 'CSC2032 Specification: Topic 4.2 — Minimum Spanning Trees (MST), Kruskal, Prim, and Disjoint Set Union',
    referencePoint: {
      academic: 'Kruskal, J.B. (1956). On the shortest spanning subtree of a graph. Proceedings of the AMS.',
      standard: 'IEEE 802.1D: Rapid Spanning Tree Protocol (RSTP) for Ethernet bridge loop avoidance.',
      enterprise: 'Telecommunications fiber-optic cable layouts and electricity power grid distribution design.',
    },
    pedagogy: {
      simple: 'Imagine wiring electricity to houses with the least copper wire possible so all houses stay connected without loops. Kruskal sorts all wires and picks the cheapest wire that connects two separate neighborhoods.',
      engineer: 'MST cut property: the minimum weight edge crossing any cut (S, V-S) belongs to the MST. Kruskal sorts edges in O(E log E) and checks connectivity using Disjoint Set Union (DSU) with union-by-rank and path compression in O(α(V)). Total time: O(E log V).',
    },
    narration: 'Week 10 designs optimal network topologies through minimum spanning trees and the amortized Disjoint Set Union structure.',
    capstone: {
      id: 'alg_w10_kruskal',
      title: 'Fiber Network Spanning Tree Designer',
      description: 'Compute minimum-cost fiber optic routing between Newcastle data centers with live cycle rejection visualizer.',
    },
    quiz: {
      question: 'What is the amortized time complexity of performing m operations on a Disjoint Set Union structure with union-by-rank and path compression?',
      options: [
        'O(m * log n)',
        'O(m * α(n)), where α is the inverse Ackermann function',
        'O(m * n)',
        'O(m^2)',
      ],
      correctIndex: 1,
      explanation: 'Tarjan proved that combining union-by-rank and path compression yields amortized time O(α(n)) per operation, where α(n) ≤ 4 for all practical universe quantities.',
    },
  },
  {
    week: 11,
    title: 'Shortest Paths: Dijkstra & Bellman-Ford Algorithms',
    badge: 'Shortest Paths',
    tagline: 'Single-source shortest paths on weighted graphs, min-priority queues, and negative cycle detection',
    accreditedSpec: 'CSC2032 Specification: Topic 4.3 — Dijkstra’s Algorithm, Fibonacci Heaps, and Bellman-Ford with Negative Weights',
    referencePoint: {
      academic: 'Dijkstra, E.W. (1959). A note on two problems in connexion with graphs. Numerische Mathematik, 1, 269-271.',
      standard: 'IETF RFC 2328: OSPF Version 2 (Open Shortest Path First routing using Dijkstra).',
      enterprise: 'Google Maps GPS routing, logistics delivery dispatchers, and BGP Internet routing protocols.',
    },
    pedagogy: {
      simple: 'Dijkstra’s algorithm finds the quickest driving route from your house to anywhere in the city. It visits intersections in order of distance from start, updating shortest paths as it goes. Bellman-Ford works even when some roads have tolls or discounts (negative costs).',
      engineer: 'Dijkstra maintains tentative distances dist[v] and relaxes edges using a min-priority queue in O((V + E) log V) time. It requires non-negative edge weights. Bellman-Ford relaxes all |E| edges |V|-1 times in O(V*E) time, detecting negative-weight cycles on the |V|-th pass.',
    },
    narration: 'Week 11 examines the routing engines powering modern GPS navigation and global Internet packet transmission.',
    capstone: {
      id: 'alg_w11_dijkstra',
      title: 'Newcastle Metro Shortest Route Simulator',
      description: 'Compute exact travel time paths between Tyne & Wear Metro stations and handle delay disruptions.',
    },
    quiz: {
      question: 'Why does Dijkstra’s algorithm fail to guarantee optimal shortest paths when negative edge weights exist?',
      options: [
        'Because Fibonacci heaps do not support negative keys',
        'Because once a vertex is marked settled/visited, Dijkstra assumes its distance is final and never re-relaxes it',
        'Because graphs with negative weights cannot be directed',
        'Because it causes infinite loops in every graph',
      ],
      correctIndex: 1,
      explanation: 'Dijkstra greedily finalizes the shortest distance to the minimum-distance unvisited vertex. A subsequent negative-weight edge could produce a cheaper path to an already finalized vertex, breaking the greedy invariant.',
    },
  },
  {
    week: 12,
    title: 'Intractability: P, NP & NP-Completeness Reductions',
    badge: 'NP-Completeness',
    tagline: 'Tractable vs intractable problems, polynomial-time verification, Cook-Levin theorem, and 3-SAT reductions',
    accreditedSpec: 'CSC2032 Specification: Topic 5.1 — Complexity Classes P, NP, NP-Complete, and Polynomial Reductions',
    referencePoint: {
      academic: 'Cook, S.A. (1971). The complexity of theorem-proving procedures. Proceedings of the 3rd ACM STOC.',
      standard: 'Clay Mathematics Institute: Millennium Prize Problems — P versus NP.',
      enterprise: 'Cryptographic security assumptions (RSA, ECC) predicated on computational intractability.',
    },
    pedagogy: {
      simple: 'Some problems are easy for computers to solve in polynomial time (Class P). Other problems like cracking codes or solving Sudoku are hard to solve, but easy to check if someone gives you the answer (Class NP). NP-Complete problems are the hardest puzzles in NP.',
      engineer: 'P = languages decidable in polynomial time O(n^k). NP = languages verifiable in polynomial time with a certificate. A language L is NP-Complete if L ∈ NP and ∀L\' ∈ NP, L\' ≤_p L. If any NP-Complete problem is solved in polynomial time, then P = NP.',
    },
    narration: 'Week 12 culminates in the deepest open question in computer science: whether finding solutions is fundamentally harder than verifying them.',
    capstone: {
      id: 'alg_w12_reductions',
      title: 'Polynomial-Time Reduction Workbench',
      description: 'Construct gadget reductions from 3-SAT to Independent Set and Vertex Cover with certificate verifiers.',
    },
    quiz: {
      question: 'To prove that a new problem X is NP-Complete, which of the following reduction directions is mathematically required?',
      options: [
        'Reduce problem X to a known polynomial problem in Class P (X ≤_p Sorting)',
        'Reduce problem X to a known NP-Complete problem Y (X ≤_p 3-SAT)',
        'Reduce a known NP-Complete problem Y to problem X in polynomial time (3-SAT ≤_p X), and show X ∈ NP',
        'Prove that problem X cannot be solved by any computer',
      ],
      correctIndex: 2,
      explanation: 'To establish NP-hardness, you must show that an existing known hard problem (like 3-SAT) can be transformed in polynomial time into an instance of X (3-SAT ≤_p X). Showing X ∈ NP completes the proof of NP-completeness.',
    },
  },
];

export const CANVAS_COURSE_METADATA_2032 = {
  courseId: 70332,
  moduleCode: 'CSC2032',
  moduleTitle: 'Algorithm Design and Analysis',
  canvasUrl: 'https://ncl.instructure.com/courses/70332/modules',
  academicInstitution: 'Newcastle University',
  faculty: 'School of Computing, Urban Sciences Building (USB)',
  academicYear: '2025/2026',
  credits: 20,
  staff: [
    {
      name: 'Dr Rob Henderson',
      email: 'rob.henderson@ncl.ac.uk',
      role: 'Module Leader & Algorithms Lecturer',
      office: 'Urban Sciences Building (USB), Room 3.024',
    },
    {
      name: 'Prof Maciej Koutny',
      email: 'maciej.koutny@ncl.ac.uk',
      role: 'Lecturer in Formal Models & Complexity',
      office: 'Urban Sciences Building (USB), Floor 3',
    },
  ],
  assessments: [
    {
      id: 'cw_2032',
      title: 'Coursework: Algorithmic Implementation & Empirical Profiling Portfolio',
      weighting: '40%',
      type: 'Programming Assignment & Complexity Proof Report',
      due: 'Week 8, Semester 1',
    },
    {
      id: 'exam_2032',
      title: 'Formal Written Examination (1.5 Hours)',
      weighting: '60%',
      type: 'Closed-Book Digital Examination (Inspera)',
      due: 'January Examination Window',
    },
  ],
  timetable: {
    lectures: 'Monday 10:00 & Wednesday 11:00 — Curtis Auditorium, Herschel Building',
    practicals: 'Thursday 14:00 OR 15:00 — Urban Sciences Building (USB) Floor 3 Flat Floor Space',
    surgeries: 'Friday 12:00 — Live Microsoft Teams Q&A Clinic',
  },
  recommendedTexts: [
    'T.H. Cormen, C.E. Leiserson, R.L. Rivest & C. Stein, Introduction to Algorithms (4th Ed., MIT Press)',
    'J. Kleinberg & É. Tardos, Algorithm Design (Pearson)',
    'R. Sedgewick & K. Wayne, Algorithms (4th Ed., Addison-Wesley)',
  ],
};

export const CANVAS_MODULES_2032: CanvasModuleTopic[] = [
  {
    moduleNumber: 1,
    title: 'Module 1: Analysis Fundamentals & Asymptotic Notation',
    state: 'active',
    readingReference: 'CLRS Chapter 2 & 3 • Kleinberg & Tardos Chapter 2',
    associatedWeek: 1,
    items: [
      { id: 'alg-mod-1-1', title: 'Lecture 1.1: The RAM Model and Computational Complexity', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-1-2', title: 'Lecture 1.2: Asymptotic Growth: O, Ω, Θ Definitions and Limit Proofs', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-1-3', title: 'Lab Practical 1: Profiling Algorithm Execution Speeds in Python/C++', type: 'practical', url: 'https://ncl.instructure.com/courses/70332/modules' },
    ],
  },
  {
    moduleNumber: 2,
    title: 'Module 2: Divide and Conquer & Recurrence Relations',
    state: 'active',
    readingReference: 'CLRS Chapter 4 • Master Theorem General Method',
    associatedWeek: 3,
    items: [
      { id: 'alg-mod-2-1', title: 'Lecture 2.1: MergeSort, Inversion Counting, and Recurrence Trees', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-2-2', title: 'Lecture 2.2: The Master Theorem for Divide-and-Conquer Recurrences', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-2-3', title: 'Lab Practical 2: Implementing Divide-and-Conquer Solvers', type: 'practical', url: 'https://ncl.instructure.com/courses/70332/modules' },
    ],
  },
  {
    moduleNumber: 3,
    title: 'Module 3: Greedy Algorithms & Dynamic Programming',
    state: 'active',
    readingReference: 'CLRS Chapters 14 & 15 • Bellman Dynamic Programming',
    associatedWeek: 7,
    items: [
      { id: 'alg-mod-3-1', title: 'Lecture 3.1: Greedy Choice Property: Interval Scheduling & Huffman Coding', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-3-2', title: 'Lecture 3.2: Dynamic Programming: 0/1 Knapsack, LCS, and Memoization', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-3-3', title: 'Lab Practical 3: Building 2D Tabulation Matrices and Backtrack Paths', type: 'practical', url: 'https://ncl.instructure.com/courses/70332/modules' },
    ],
  },
  {
    moduleNumber: 4,
    title: 'Module 4: Graph Traversals, Spanning Trees & Shortest Paths',
    state: 'active',
    readingReference: 'CLRS Chapters 20-22 • Dijkstra Shortest Paths',
    associatedWeek: 9,
    items: [
      { id: 'alg-mod-4-1', title: 'Lecture 4.1: Graph Traversals: BFS, DFS, and Topological Sorting', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-4-2', title: 'Lecture 4.2: Minimum Spanning Trees: Kruskal & Prim with DSU', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-4-3', title: 'Lecture 4.3: Shortest Path Routing: Dijkstra vs Bellman-Ford', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-4-4', title: 'Lab Practical 4: Implementing Graph Solvers with Min-Heaps', type: 'practical', url: 'https://ncl.instructure.com/courses/70332/modules' },
    ],
  },
  {
    moduleNumber: 5,
    title: 'Module 5: Computational Complexity & NP-Completeness',
    state: 'active',
    readingReference: 'CLRS Chapter 34 • Garey & Johnson Computers and Intractability',
    associatedWeek: 12,
    items: [
      { id: 'alg-mod-5-1', title: 'Lecture 5.1: The Complexity Classes P and NP: Polynomial Verification', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-5-2', title: 'Lecture 5.2: Polynomial-Time Reductions and the Cook-Levin Theorem', type: 'lecture', url: 'https://ncl.instructure.com/courses/70332/modules' },
      { id: 'alg-mod-5-3', title: 'Lab Practical 5: Constructing 3-SAT and Vertex Cover Gadgets', type: 'practical', url: 'https://ncl.instructure.com/courses/70332/modules' },
    ],
  },
];

export const EXAM_QUESTIONS_2032: { A: ExamQuestion[]; B: ExamQuestion[] } = {
  A: [
    {
      id: 'q2032-a1',
      section: 'A',
      title: 'Question 1: Recurrences, Master Theorem & Asymptotic Proofs',
      marks: 15,
      scenario: 'An algorithm splits an array of size n into 4 subproblems, each of size n/2, solves them recursively, and performs O(n^2) linear-combination work.',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Write the recurrence relation for the algorithm, and use the Master Theorem to determine its tight asymptotic runtime Θ(g(n)).',
          marks: 7,
          markingCriteria: [
            '2 marks: Correct recurrence formulation T(n) = 4*T(n/2) + Θ(n^2).',
            '2 marks: Calculation of watershed exponent log_b(a) = log_2(4) = 2.',
            '3 marks: Identification of Case 2 (balanced case: f(n) = Θ(n^{log_b(a)})) yielding T(n) = Θ(n^2 * log n).',
          ],
          modelAnswer: '1. Recurrence: T(n) = 4*T(n/2) + Θ(n^2).\n2. Master Theorem parameters: a = 4, b = 2, f(n) = Θ(n^2).\n3. Critical exponent: log_b(a) = log_2(4) = 2. So n^{log_b(a)} = n^2.\n4. Since f(n) = Θ(n^2) matches n^{log_b(a)} = n^2, we are in Case 2.\n5. Therefore, T(n) = Θ(n^2 * log n).',
        },
        {
          part: '(b)',
          prompt: 'Formally prove using the limit quotient definition that 10n^2 + 5n*log(n) = O(n^2).',
          marks: 8,
          markingCriteria: [
            '4 marks: Definition of limit quotient lim_{n→∞} f(n)/g(n) < ∞.',
            '4 marks: Step-by-step division and limit evaluation showing finite constant value 10.',
          ],
          modelAnswer: 'Evaluate the limit quotient:\nlim_{n→∞} (10n^2 + 5n*log(n)) / n^2 = lim_{n→∞} (10 + 5*log(n)/n)\nBy L\'Hôpital\'s rule or standard limits, lim_{n→∞} log(n)/n = 0.\nTherefore, the limit equals 10 + 0 = 10, which is a strictly positive finite constant.\nBecause the limit is finite (< ∞), 10n^2 + 5n*log(n) = O(n^2) by definition.',
        },
      ],
    },
  ],
  B: [
    {
      id: 'q2032-b1',
      section: 'B',
      title: 'Question 2: Dynamic Programming & Knapsack Optimality',
      marks: 15,
      scenario: 'You are packing a knapsack with maximum capacity W = 7 kg. You have 4 items with weights and values: Item 1 (wt=1, val=1), Item 2 (wt=3, val=4), Item 3 (wt=4, val=5), Item 4 (wt=5, val=7).',
      subQuestions: [
        {
          part: '(a)',
          prompt: 'Construct the complete 2D dynamic programming table V[i, w] for i = 0..4 and w = 0..7. State the optimal total value achievable.',
          marks: 9,
          markingCriteria: [
            '4 marks: Correct initialization of base cases V[0, w] = 0 and V[i, 0] = 0.',
            '4 marks: Correct application of recurrence V[i, w] = max(V[i-1, w], V[i-1, w - w_i] + v_i).',
            '1 mark: Correct optimal value of 9 (Item 2 with wt=3, val=4 + Item 3 with wt=4, val=5 = wt 7, val 9).',
          ],
          modelAnswer: 'Table V[i, w]:\nw:   0  1  2  3  4  5  6  7\ni=0: 0  0  0  0  0  0  0  0\ni=1: 0  1  1  1  1  1  1  1  (item 1: wt 1, val 1)\ni=2: 0  1  1  4  5  5  5  5  (item 2: wt 3, val 4)\ni=3: 0  1  1  4  5  6  6  9  (item 3: wt 4, val 5)\ni=4: 0  1  1  4  5  7  8  9  (item 4: wt 5, val 7)\nOptimal total value = 9.',
        },
        {
          part: '(b)',
          prompt: 'Backtrack from the cell V[4, 7] through the table to identify the exact subset of items chosen in the optimal solution.',
          marks: 6,
          markingCriteria: [
            '2 marks: Backtracking from V[4,7] = 9: matches V[3,7] = 9, so Item 4 is NOT included.',
            '2 marks: Inspecting V[3,7] = 9: exceeds V[2,7] = 5, so Item 3 IS included; remaining weight = 7 - 4 = 3.',
            '2 marks: Inspecting V[2,3] = 4: exceeds V[1,3] = 1, so Item 2 IS included; remaining weight = 3 - 3 = 0. Solution: {Item 2, Item 3}.',
          ],
          modelAnswer: '1. Start at V[4, 7] = 9. Since V[3, 7] = 9 (same value), Item 4 was not taken. Move to V[3, 7].\n2. At V[3, 7] = 9, V[2, 7] = 5. Since 9 > 5, Item 3 was taken. Value contributed = 5, weight consumed = 4. Remaining weight = 7 - 4 = 3. Move to V[2, 3].\n3. At V[2, 3] = 4, V[1, 3] = 1. Since 4 > 1, Item 2 was taken. Value contributed = 4, weight consumed = 3. Remaining weight = 3 - 3 = 0. Move to V[1, 0] = 0.\n4. Remaining weight is 0. Solution set is {Item 2, Item 3}. Total weight = 3 + 4 = 7 kg, total value = 4 + 5 = £9.',
        },
      ],
    },
  ],
};

