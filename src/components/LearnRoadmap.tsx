'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { dbSimulator } from '@/lib/db-engine';
import {
  BookOpen,
  CheckCircle,
  Database,
  Search,
  Layers,
  Cpu,
  ArrowRight,
  Code2,
  Table,
  FileCode,
  Image,
  Music,
  Key,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';

export const LearnRoadmap: React.FC = () => {
  const { awardXp } = useAppStore();
  const [activeStep, setActiveStep] = useState(1);
  const [dataInspectorFormat, setDataInspectorFormat] = useState<'structured' | 'semi' | 'unstructured'>('structured');
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM Students WHERE Class = '10A'");
  const [sqlResult, setSqlResult] = useState<any[]>(
    dbSimulator.getTable('Students').filter((s: any) => s.Class === '10A')
  );
  const [sqlMessage, setSqlMessage] = useState('Query OK, 1 row in set.');

  const runSql = () => {
    const res = dbSimulator.executeCustomSql(sqlQuery);
    if (res.data) {
      setSqlResult(res.data);
    }
    setSqlMessage(res.message);
    awardXp(15, 'Executed interactive SQL in Learn Module');
  };

  const roadmapSteps = [
    { num: 1, title: 'What Data Is', desc: 'How computers store & represent data' },
    { num: 2, title: 'Database Building Blocks', desc: 'Tables, keys, entities & relations' },
    { num: 3, title: 'Relational DBs & SQL', desc: 'Queries, DDL, DML & Normalisation' },
    { num: 4, title: 'Search & Retrieval', desc: 'Indexing, crawling & metadata' },
    { num: 5, title: 'OLTP vs OLAP', desc: 'Transactions vs Analytical warehouses' },
    { num: 6, title: 'Big Data, AI & Ethics', desc: 'NoSQL, LLM embeddings & compliance' },
  ];

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Course Hero Banner matching Image 2 */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> CSC1033 Made Simple
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Introduction to Database Systems, Information Retrieval, and Data for Real Life
          </h1>
          <p className="mt-2 text-sm sm:text-base text-pink-100 font-medium">
            A step-by-step visual interactive guide for beginners and enterprise engineers.
          </p>
        </div>

        {/* Floating Cartoon Laptop / Plant Decoration */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 items-center gap-4 text-6xl">
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-center">
            <span className="block text-4xl mb-1">💻</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-100">
              LEARN • BUILD • GROW
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap Navigation Steps Row matching Image 2 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
            Our Learning Roadmap
          </h2>
          <span className="text-xs font-bold text-pink-600">Goal: Understand databases from start to finish</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {roadmapSteps.map((step) => {
            const isCurrent = activeStep === step.num;
            return (
              <button
                key={step.num}
                onClick={() => {
                  setActiveStep(step.num);
                  awardXp(5, `Viewed Chapter ${step.num}`);
                }}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden ${
                  isCurrent
                    ? 'bg-pink-50 dark:bg-pink-950/60 border-pink-400 ring-2 ring-pink-400/30 shadow-xs'
                    : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                      isCurrent
                        ? 'bg-pink-500 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {step.num}
                  </div>
                  {step.num < activeStep && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
                <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  {step.title}
                </h3>
                <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-tight">
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content Visualizer */}
      {activeStep === 1 && (
        /* Image 3: 1. What is Data? */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 1</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              1. What Is Data?
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              The different kinds of data and how computers represent them.
            </p>
            <div className="mt-3 p-3 bg-pink-50 dark:bg-pink-950/40 border border-pink-200 dark:border-pink-900 rounded-2xl flex items-center gap-2">
              <span className="text-lg">💡</span>
              <p className="text-xs text-pink-900 dark:text-pink-200 font-semibold">
                <strong>Data</strong> = pieces of information that a computer can store, process, and use.
              </p>
            </div>
          </div>

          {/* 3 Kinds of Data Interactive Cards matching Image 3 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setDataInspectorFormat('structured')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                dataInspectorFormat === 'structured'
                  ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/30 ring-2 ring-pink-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-pink-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-xl text-pink-600">
                  <Table className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Structured data</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Organised in a fixed format, like rows and columns in a database table.
              </p>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-pink-100 text-pink-700">
                Example: Student ID, Name, Grade
              </span>
            </div>

            <div
              onClick={() => setDataInspectorFormat('semi')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                dataInspectorFormat === 'semi'
                  ? 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/30 ring-2 ring-purple-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-xl text-purple-600">
                  <FileCode className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Semi-structured data</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Not fully fixed in tables, but organised with tags or key-value labels.
              </p>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-purple-100 text-purple-700">
                Example: XML, JSON documents
              </span>
            </div>

            <div
              onClick={() => setDataInspectorFormat('unstructured')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                dataInspectorFormat === 'unstructured'
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-2 ring-blue-500/20'
                  : 'border-slate-200 dark:border-slate-800 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-xl text-blue-600">
                  <Image className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Unstructured data</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                Data with no fixed table shape or predefined schema.
              </p>
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-blue-100 text-blue-700">
                Example: Emails, photos, audio, videos
              </span>
            </div>
          </div>

          {/* Interactive Format Viewer */}
          <div className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
              <span className="text-pink-400 font-bold uppercase text-[10px]">
                Live Representation: {dataInspectorFormat}
              </span>
              <span className="text-[10px] text-slate-500">UTF-8 Encoded Binary Storage</span>
            </div>

            {dataInspectorFormat === 'structured' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-pink-400 border-b border-slate-800">
                      <th className="p-2">StudentID (PK)</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-900">
                      <td className="p-2 text-amber-400">S001</td>
                      <td className="p-2">Alice</td>
                      <td className="p-2 text-emerald-400">10A</td>
                    </tr>
                    <tr className="border-b border-slate-900">
                      <td className="p-2 text-amber-400">S002</td>
                      <td className="p-2">Ben</td>
                      <td className="p-2 text-emerald-400">10B</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {dataInspectorFormat === 'semi' && (
              <pre className="text-purple-300 whitespace-pre">
{`{
  "students": [
    { "id": "S001", "name": "Alice", "tags": ["honor-roll", "robotics"] },
    { "id": "S002", "name": "Ben", "extra_notes": "Needs lab locker key" }
  ]
}`}
              </pre>
            )}

            {dataInspectorFormat === 'unstructured' && (
              <div className="text-blue-300 space-y-2">
                <p>/* Unstructured Media / Blob Storage Payload */</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-slate-900 rounded">photo.jpg [Binary 2.4 MB]</span>
                  <span className="px-2 py-1 bg-slate-900 rounded">lecture_notes.mp3 [Audio stream]</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeStep === 2 && (
        /* Image 4: 2. Database Building Blocks */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 2</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              2. Database Building Blocks
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              The words every beginner and systems engineer must understand.
            </p>
          </div>

          {/* Key Terms Grid matching Image 4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {[
              { term: 'Database', icon: '🗄️', def: 'An organised collection of data.' },
              { term: 'DBMS', icon: '💻', def: 'Software used to create & control data.' },
              { term: 'Table', icon: '▦', def: 'Grid used to store data in rows & cols.' },
              { term: 'Row / Record', icon: '▬', def: 'One complete item in a table.' },
              { term: 'Column / Field', icon: '▮', def: 'One type of information.' },
              { term: 'Entity', icon: '👤', def: 'A real-world thing we store data about.' },
              { term: 'Attribute', icon: '📝', def: 'A detail describing an entity.' },
              { term: 'Relationship', icon: '🔗', def: 'A connection between entities.' },
              { term: 'Schema', icon: '🗺️', def: 'The overall blueprint of the database.' },
              { term: 'Primary Key', icon: '🔑', def: 'Unique identifier for each row.' },
              { term: 'Foreign Key', icon: '🗝️', def: 'Field that links to another table.' },
              { term: 'Linking Table', icon: '🌉', def: 'Resolves Many-to-Many relationships.' },
            ].map((item) => (
              <div key={item.term} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                <span className="text-xl mb-1 block">{item.icon}</span>
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100">{item.term}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{item.def}</p>
              </div>
            ))}
          </div>

          {/* Mini Case Study: Library Database matching Image 4 */}
          <div className="mt-4 p-5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-900">
            <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-2">
              A Simple Example: Library Database (Many-to-Many Relationship)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Students and books have a <strong>Many-to-Many relationship</strong> (one student borrows multiple books, and one book can be borrowed by multiple students over time). We resolve this using a linking table called <strong>Borrowing</strong>!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Students Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-pink-200 dark:border-slate-800 p-3">
                <div className="bg-pink-500 text-white font-bold text-xs p-1.5 rounded-lg text-center mb-2">
                  Students
                </div>
                <table className="w-full text-[10px] text-left">
                  <thead>
                    <tr className="border-b font-bold text-slate-400">
                      <th>StudentID (PK)</th>
                      <th>Name</th>
                      <th>Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbSimulator.getTable('Students').map((s) => (
                      <tr key={s.StudentID} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="font-bold text-pink-600">{s.StudentID}</td>
                        <td>{s.Name}</td>
                        <td>{s.Class}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Books Table */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-slate-800 p-3">
                <div className="bg-indigo-600 text-white font-bold text-xs p-1.5 rounded-lg text-center mb-2">
                  Books
                </div>
                <table className="w-full text-[10px] text-left">
                  <thead>
                    <tr className="border-b font-bold text-slate-400">
                      <th>BookID (PK)</th>
                      <th>Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbSimulator.getTable('Books').slice(0, 3).map((b) => (
                      <tr key={b.BookID} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="font-bold text-indigo-600">{b.BookID}</td>
                        <td>{b.Title}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Borrowing Table (Linking Table) */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-slate-800 p-3">
                <div className="bg-purple-600 text-white font-bold text-xs p-1.5 rounded-lg text-center mb-2">
                  Borrowing (Linking Table)
                </div>
                <table className="w-full text-[10px] text-left">
                  <thead>
                    <tr className="border-b font-bold text-slate-400">
                      <th>BorrowID</th>
                      <th>StudentID (FK)</th>
                      <th>BookID (FK)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dbSimulator.getTable('Borrowing').map((br) => (
                      <tr key={br.BorrowID} className="border-b border-slate-100 dark:border-slate-800">
                        <td className="font-bold text-purple-600">{br.BorrowID}</td>
                        <td className="font-bold text-pink-600">{br.StudentID}</td>
                        <td className="font-bold text-indigo-600">{br.BookID}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeStep === 3 && (
        /* Image 5: 3. Relational Databases and SQL */
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter 3</span>
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
              3. Relational Databases and SQL
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              How tables work together and how we query them with Structured Query Language.
            </p>
          </div>

          {/* DDL vs DML vs Normalization Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-black text-pink-600 mb-1">1. DDL (Data Definition)</h4>
              <p className="text-[11px] text-slate-500 mb-2">Used to define table schemas and relationships.</p>
              <pre className="p-2 bg-slate-950 text-pink-300 font-mono text-[10px] rounded-lg">
{`CREATE TABLE Students (
  StudentID INT PRIMARY KEY,
  Name TEXT,
  Class TEXT
);`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-black text-purple-600 mb-1">2. DML (Data Manipulation)</h4>
              <p className="text-[11px] text-slate-500 mb-2">Used to insert, read, update and delete data.</p>
              <pre className="p-2 bg-slate-950 text-purple-300 font-mono text-[10px] rounded-lg">
{`SELECT Name FROM Students
WHERE Class = '10A';

INSERT INTO Students
VALUES ('S004', 'David', '10A');`}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <h4 className="text-xs font-black text-emerald-600 mb-1">3. Normalisation (1NF, 2NF, 3NF)</h4>
              <p className="text-[11px] text-slate-500 mb-2">Eliminates duplicate columns and update anomalies.</p>
              <ul className="text-[10px] space-y-1 text-slate-600 dark:text-slate-300 font-medium">
                <li>• <strong>1NF:</strong> Atomic values (no list in a single cell)</li>
                <li>• <strong>2NF:</strong> No partial functional dependency</li>
                <li>• <strong>3NF:</strong> No transitive dependencies</li>
              </ul>
            </div>
          </div>

          {/* Interactive SQL Terminal Sandbox */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-xl text-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-pink-500" />
                <span className="text-xs font-bold text-slate-300">Interactive SQL Query Terminal</span>
              </div>
              <button
                onClick={runSql}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 text-white rounded-lg text-xs font-black shadow-xs"
              >
                <Play className="w-3 h-3" />
                Execute Query
              </button>
            </div>

            <textarea
              rows={2}
              value={sqlQuery}
              onChange={(e) => setSqlQuery(e.target.value)}
              className="w-full bg-slate-900 text-pink-300 font-mono text-xs p-2.5 rounded-xl border border-slate-800 outline-hidden focus:border-pink-500"
            />

            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                <span>Result Table:</span>
                <span className="text-emerald-400 font-mono">{sqlMessage}</span>
              </div>

              {sqlResult.length > 0 ? (
                <div className="overflow-x-auto max-h-40">
                  <table className="w-full text-[11px] text-left font-mono">
                    <thead>
                      <tr className="border-b border-slate-800 text-pink-400">
                        {Object.keys(sqlResult[0]).map((k) => (
                          <th key={k} className="p-1.5">{k}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sqlResult.map((row, idx) => (
                        <tr key={idx} className="border-b border-slate-900/60 hover:bg-slate-900">
                          {Object.values(row).map((v: any, i) => (
                            <td key={i} className="p-1.5 text-slate-200">{String(v)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-500 text-xs italic">No rows returned.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeStep >= 4 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <span className="text-xs font-extrabold text-pink-600 uppercase tracking-widest">Chapter {activeStep}</span>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {roadmapSteps[activeStep - 1].title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {roadmapSteps[activeStep - 1].desc}
          </p>

          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            {activeStep === 4 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Information Retrieval & Web Crawling
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Search engines rely on <strong>Inverted Indexes</strong> (mapping keywords directly to document IDs), crawling bots that traverse hyperlinks, and BM25 / TF-IDF scoring algorithms.
                </p>
                <div className="p-3 bg-slate-950 text-cyan-300 font-mono text-xs rounded-xl">
                  Inverted Index: {"'database' -> [Doc #12, Doc #45, Doc #88]"}
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Transactional (OLTP) vs Analytical (OLAP) Systems
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-pink-200">
                    <h5 className="font-bold text-pink-600 mb-1">OLTP (Online Transaction Processing)</h5>
                    <p className="text-slate-600 dark:text-slate-300">Fast, row-level inserts and updates for day-to-day shopping carts and banking.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-purple-200">
                    <h5 className="font-bold text-purple-600 mb-1">OLAP (Online Analytical Processing)</h5>
                    <p className="text-slate-600 dark:text-slate-300">Columnar queries aggregating billions of historical sales across years.</p>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 6 && (
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  Big Data, AI Vectors & Data Ethics
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Modern architectures incorporate NoSQL (Key-Value, Document, Graph), Vector databases for AI embeddings (RAG), and strict data ethics (GDPR, retention policies, cryptographic anonymization).
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
