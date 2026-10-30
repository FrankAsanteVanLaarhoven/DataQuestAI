/**
 * Unified BSc Computer Science Course Registry
 * Newcastle University • School of Computing
 * 
 * Provides unified access across Stage 1, Stage 2, and Stage 3 core modules:
 * - CSC1032: Computer Systems Design & Architectures (Canvas ID 70329)
 * - CSC1033: Databases & Information Retrieval (Canvas ID 70330)
 * - CSC1036: Programming Portfolio (Canvas ID 70334)
 * - CSC2031: Secure Programming (Canvas ID 70337)
 * - CSC2032: Algorithm Design and Analysis (Canvas ID 70332)
 * - CSC2035: Software Systems Design & Implementation (Canvas ID 58456)
 * - CSC2033: Software Engineering Team Project (Canvas ID 53978)
 * - CSC3095: Project and Dissertation in Computing Science (Canvas ID 70405)
 * - CSC3131: Development and Operations of Systems - DevOps (Canvas ID 70403)
 */

import type { WeekCurriculum, CanvasModuleTopic, ExamQuestion } from './csc1033-curriculum.ts';
import { CSC1033_WEEKS, CANVAS_COURSE_METADATA as META_1033, CANVAS_MODULES_70330, EXAM_QUESTIONS_70330 } from './csc1033-curriculum.ts';
import { CSC1032_WEEKS, CANVAS_COURSE_METADATA_1032, CANVAS_MODULES_1032, EXAM_QUESTIONS_1032 } from './csc1032-curriculum.ts';
import { CSC1036_WEEKS, CANVAS_COURSE_METADATA_1036, CANVAS_MODULES_1036, EXAM_QUESTIONS_1036 } from './csc1036-curriculum.ts';
import { CSC2031_WEEKS, CANVAS_COURSE_METADATA_2031, CANVAS_MODULES_2031, EXAM_QUESTIONS_2031 } from './csc2031-curriculum.ts';
import { CSC2032_WEEKS, CANVAS_COURSE_METADATA_2032, CANVAS_MODULES_2032, EXAM_QUESTIONS_2032 } from './csc2032-curriculum.ts';
import { CSC2035_WEEKS, CANVAS_COURSE_METADATA_2035, CANVAS_MODULES_2035, EXAM_QUESTIONS_2035 } from './csc2035-curriculum.ts';
import { CSC2033_WEEKS, CANVAS_COURSE_METADATA_2033, CANVAS_MODULES_2033, EXAM_QUESTIONS_2033 } from './csc2033-curriculum.ts';
import { CSC3095_WEEKS, CANVAS_COURSE_METADATA_3095, CANVAS_MODULES_3095, EXAM_QUESTIONS_3095 } from './csc3095-curriculum.ts';
import { CSC3131_WEEKS, CANVAS_COURSE_METADATA_3131, CANVAS_MODULES_3131, EXAM_QUESTIONS_3131 } from './csc3131-curriculum.ts';

export type BscModuleCode = 
  | 'CSC1032' 
  | 'CSC1033' 
  | 'CSC1036' 
  | 'CSC2031' 
  | 'CSC2032' 
  | 'CSC2035' 
  | 'CSC2033' 
  | 'CSC3095' 
  | 'CSC3131';

export interface BscCourseDefinition {
  moduleCode: BscModuleCode;
  moduleTitle: string;
  stage: 'Stage 1' | 'Stage 2' | 'Stage 3';
  credits: number;
  canvasCourseId: number;
  canvasUrl: string;
  weeks: WeekCurriculum[];
  metadata: any;
  canvasModules: CanvasModuleTopic[];
  examQuestions: { A: ExamQuestion[]; B: ExamQuestion[] };
  iconName: string;
  colorTheme: string;
  tagline: string;
}

export const BSC_COURSES: Record<BscModuleCode, BscCourseDefinition> = {
  CSC1033: {
    moduleCode: 'CSC1033',
    moduleTitle: 'Databases and Information Retrieval',
    stage: 'Stage 1',
    credits: 20,
    canvasCourseId: 70330,
    canvasUrl: 'https://ncl.instructure.com/courses/70330/modules',
    weeks: CSC1033_WEEKS,
    metadata: META_1033,
    canvasModules: CANVAS_MODULES_70330,
    examQuestions: EXAM_QUESTIONS_70330,
    iconName: 'Database',
    colorTheme: 'from-blue-600 to-indigo-600',
    tagline: 'Relational data modeling, SQL AST query interpreter, 3NF normalization, transactions, and search engine IR pipelines',
  },
  CSC1032: {
    moduleCode: 'CSC1032',
    moduleTitle: 'Computer Systems Design and Architectures',
    stage: 'Stage 1',
    credits: 20,
    canvasCourseId: 70329,
    canvasUrl: 'https://ncl.instructure.com/courses/70329/modules',
    weeks: CSC1032_WEEKS,
    metadata: CANVAS_COURSE_METADATA_1032,
    canvasModules: CANVAS_MODULES_1032,
    examQuestions: EXAM_QUESTIONS_1032,
    iconName: 'Cpu',
    colorTheme: 'from-amber-600 to-orange-600',
    tagline: 'Von Neumann architectures, binary number systems, digital logic gates, assembly language, memory hierarchy, and caching',
  },
  CSC1036: {
    moduleCode: 'CSC1036',
    moduleTitle: 'Programming Portfolio',
    stage: 'Stage 1',
    credits: 30,
    canvasCourseId: 70334,
    canvasUrl: 'https://ncl.instructure.com/courses/70334/modules',
    weeks: CSC1036_WEEKS,
    metadata: CANVAS_COURSE_METADATA_1036,
    canvasModules: CANVAS_MODULES_1036,
    examQuestions: EXAM_QUESTIONS_1036,
    iconName: 'Code',
    colorTheme: 'from-emerald-600 to-green-700',
    tagline: 'Object-Oriented Programming, heap memory, SOLID design principles, JUnit 5 TDD, linked lists, BSTs, hash tables, and portfolio software delivery',
  },
  CSC2031: {
    moduleCode: 'CSC2031',
    moduleTitle: 'Secure Programming',
    stage: 'Stage 2',
    credits: 20,
    canvasCourseId: 70337,
    canvasUrl: 'https://ncl.instructure.com/courses/70337/modules',
    weeks: CSC2031_WEEKS,
    metadata: CANVAS_COURSE_METADATA_2031,
    canvasModules: CANVAS_MODULES_2031,
    examQuestions: EXAM_QUESTIONS_2031,
    iconName: 'ShieldCheck',
    colorTheme: 'from-emerald-600 to-teal-600',
    tagline: 'Defensive web architecture, STRIDE threat modeling, PBKDF2 cryptography, SQLi/XSS defense, and BOLA authorization guards',
  },
  CSC2032: {
    moduleCode: 'CSC2032',
    moduleTitle: 'Algorithm Design and Analysis',
    stage: 'Stage 2',
    credits: 20,
    canvasCourseId: 70332,
    canvasUrl: 'https://ncl.instructure.com/courses/70332/modules',
    weeks: CSC2032_WEEKS,
    metadata: CANVAS_COURSE_METADATA_2032,
    canvasModules: CANVAS_MODULES_2032,
    examQuestions: EXAM_QUESTIONS_2032,
    iconName: 'GitBranch',
    colorTheme: 'from-indigo-600 to-violet-700',
    tagline: 'Asymptotic complexity, Master Theorem recurrences, divide-and-conquer, greedy choices, dynamic programming matrices, graph traversals, and NP-completeness',
  },
  CSC2035: {
    moduleCode: 'CSC2035',
    moduleTitle: 'Software Systems Design and Implementation',
    stage: 'Stage 2',
    credits: 30,
    canvasCourseId: 58456,
    canvasUrl: 'https://ncl.instructure.com/courses/58456/modules',
    weeks: CSC2035_WEEKS,
    metadata: CANVAS_COURSE_METADATA_2035,
    canvasModules: CANVAS_MODULES_2035,
    examQuestions: EXAM_QUESTIONS_2035,
    iconName: 'Layers',
    colorTheme: 'from-purple-600 to-violet-600',
    tagline: 'POSIX operating systems, virtual memory paging, CPU scheduling, concurrency primitives, mutexes, and Berkeley socket TCP/IP',
  },
  CSC2033: {
    moduleCode: 'CSC2033',
    moduleTitle: 'Software Engineering Team Project',
    stage: 'Stage 2',
    credits: 30,
    canvasCourseId: 53978,
    canvasUrl: 'https://ncl.instructure.com/courses/53978/modules',
    weeks: CSC2033_WEEKS,
    metadata: CANVAS_COURSE_METADATA_2033,
    canvasModules: CANVAS_MODULES_2033,
    examQuestions: EXAM_QUESTIONS_2033,
    iconName: 'Users',
    colorTheme: 'from-pink-600 to-rose-600',
    tagline: 'Agile Scrum teams, requirements engineering, UML structural & behavioral modeling, Trunk-based Git, and the CI Andon Cord',
  },
  CSC3095: {
    moduleCode: 'CSC3095',
    moduleTitle: 'Project and Dissertation in Computing Science',
    stage: 'Stage 3',
    credits: 40,
    canvasCourseId: 70405,
    canvasUrl: 'https://ncl.instructure.com/courses/70405/modules',
    weeks: CSC3095_WEEKS,
    metadata: CANVAS_COURSE_METADATA_3095,
    canvasModules: CANVAS_MODULES_3095,
    examQuestions: EXAM_QUESTIONS_3095,
    iconName: 'Award',
    colorTheme: 'from-amber-600 to-yellow-600',
    tagline: 'The compulsory 40-credit capstone dissertation: SMART research questions, PRISMA literature review, URERC ethics, empirical evaluation, and viva defense',
  },
  CSC3131: {
    moduleCode: 'CSC3131',
    moduleTitle: 'Development and Operations of Systems',
    stage: 'Stage 3',
    credits: 20,
    canvasCourseId: 70403,
    canvasUrl: 'https://ncl.instructure.com/courses/70403/modules',
    weeks: CSC3131_WEEKS,
    metadata: CANVAS_COURSE_METADATA_3131,
    canvasModules: CANVAS_MODULES_3131,
    examQuestions: EXAM_QUESTIONS_3131,
    iconName: 'Activity',
    colorTheme: 'from-cyan-600 to-blue-700',
    tagline: 'DevOps & DORA metrics, multi-tier isolation, Kubernetes orchestration, traffic surges, SRE observability, and FinOps economics',
  },
};

export const BSC_COURSE_LIST = Object.values(BSC_COURSES);

export function getBscCourse(code: BscModuleCode): BscCourseDefinition {
  return BSC_COURSES[code] || BSC_COURSES.CSC1033;
}
