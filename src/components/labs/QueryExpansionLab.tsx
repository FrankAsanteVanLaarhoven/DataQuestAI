'use client';

import React, { useState } from 'react';
import { Search, Zap, CheckCircle2, AlertTriangle, ArrowRight, HelpCircle } from 'lucide-react';

interface DocumentRecord {
  id: number;
  title: string;
  category: string;
  snippet: string;
  matchedBy: string;
}

const CORPUS: DocumentRecord[] = [
  { id: 1, title: 'Compact Electric Car Review', category: 'Automotive', snippet: 'A high-efficiency electric car designed for city parking.', matchedBy: 'car' },
  { id: 2, title: 'Used Car Buying Checklist', category: 'Consumer Guide', snippet: 'Inspect the transmission before purchasing any used car.', matchedBy: 'car' },
  { id: 3, title: 'Vintage Sports Car Heritage', category: 'History', snippet: 'Preserving classic mid-century sports car engineering.', matchedBy: 'car' },
  { id: 4, title: 'Commercial Vehicle Safety Standards', category: 'Logistics', snippet: 'Fleet vehicle diagnostics ensure road safety compliance.', matchedBy: 'vehicle' },
  { id: 5, title: 'Heavy Duty Construction Vehicle Fleet', category: 'Industrial', snippet: 'Excavators and multi-axle vehicle transports.', matchedBy: 'vehicle' },
  { id: 6, title: 'Autonomous Vehicle Navigation Sensors', category: 'Technology', snippet: 'LiDAR integration in next-gen autonomous vehicle models.', matchedBy: 'vehicle' },
  { id: 7, title: 'German Automobile Engineering Milestones', category: 'Engineering', snippet: 'Precision tolerance and performance in modern automobile design.', matchedBy: 'automobile' },
  { id: 8, title: 'Automobile Assembly Line Robotics', category: 'Manufacturing', snippet: 'High-speed welding robots in automated automobile plants.', matchedBy: 'automobile' },
  { id: 9, title: 'The Early History of the Motorcar', category: 'History', snippet: 'Steam-driven motorcar prototypes of the late 19th century.', matchedBy: 'motorcar' },
  { id: 10, title: 'Global Automotive Supply Chain Report', category: 'Economy', snippet: 'Semiconductor shortages impact global automotive manufacturers.', matchedBy: 'automotive' },
  { id: 11, title: 'Automotive Battery Chemistry Innovations', category: 'Chemistry', snippet: 'Solid-state electrolyte trials for the automotive sector.', matchedBy: 'automotive' },
  { id: 12, title: 'Zero-Emission Urban Vehicle Mandates', category: 'Policy', snippet: 'Clean air zones regulating passenger vehicle emissions.', matchedBy: 'vehicle' },
];

export const QueryExpansionLab: React.FC = () => {
  const [query, setQuery] = useState('car');
  const [expansionEnabled, setExpansionEnabled] = useState(false);
  const [studentQuizAnswerRecall, setStudentQuizAnswerRecall] = useState<string | null>(null);
  const [studentQuizAnswerPrecision, setStudentQuizAnswerPrecision] = useState<string | null>(null);

  const synonyms = ['automobile', 'vehicle', 'motorcar', 'automotive'];

  const results = CORPUS.filter((doc) => {
    if (expansionEnabled) {
      return (
        doc.matchedBy === query.toLowerCase() ||
        synonyms.includes(doc.matchedBy)
      );
    }
    return doc.matchedBy === query.toLowerCase();
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-950 text-violet-400 text-xs font-black uppercase tracking-wider mb-2 border border-violet-800">
            <Zap className="w-3.5 h-3.5" /> Information Retrieval & Recall
          </div>
          <h3 className="text-xl font-black text-white">
            Query Expansion: Precision vs. Recall Game
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Compare literal keyword search against lexical ontology query expansion. Observe the fundamental tradeoff: expanding recall vs risk of precision degradation.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-xs font-bold text-slate-300">Query Expansion:</span>
          <button
            onClick={() => setExpansionEnabled(!expansionEnabled)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all ${
              expansionEnabled
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {expansionEnabled ? 'ON (Expanded)' : 'OFF (Exact Match)'}
          </button>
        </div>
      </div>

      {/* Query Bar & Synonyms Tree */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <label className="text-xs font-bold text-slate-300 block">User Search Query:</label>
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                readOnly
                value={query}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs font-mono text-cyan-300"
              />
            </div>
            <button
              onClick={() => setExpansionEnabled(!expansionEnabled)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white rounded-xl text-xs font-bold transition-all"
            >
              Toggle Expansion
            </button>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Matched Documents:</span>
              <span className="font-mono font-bold text-base text-cyan-400">{results.length} results</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-slate-400">Recall Coverage:</span>
              <span className={`font-mono font-bold ${expansionEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                {expansionEnabled ? '100% (High Recall)' : '25% (Exact Only)'}
              </span>
            </div>
          </div>
        </div>

        {/* Ontology Synset Graph */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-black uppercase text-violet-400 tracking-wider">
            Educational Synonym Graph (Inspired by WordNet Synsets)
          </span>
          <div className="font-mono text-xs bg-slate-900 p-3 rounded-xl border border-slate-800 leading-relaxed text-slate-300">
            <div className="text-cyan-400 font-bold">query: &quot;car&quot;</div>
            <div className={expansionEnabled ? 'text-emerald-400' : 'text-slate-600'}>
              ├── automobile <span className="text-[10px] text-slate-500">(direct synonym)</span>
            </div>
            <div className={expansionEnabled ? 'text-emerald-400' : 'text-slate-600'}>
              ├── vehicle <span className="text-[10px] text-slate-500">(hypernym / broader term)</span>
            </div>
            <div className={expansionEnabled ? 'text-emerald-400' : 'text-slate-600'}>
              ├── motorcar <span className="text-[10px] text-slate-500">(historical synonym)</span>
            </div>
            <div className={expansionEnabled ? 'text-emerald-400' : 'text-slate-600'}>
              └── automotive <span className="text-[10px] text-slate-500">(topical derivative)</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 block">
            {expansionEnabled
              ? '✓ Query rewrite dispatched 5 parallel disjunctive postings lookups.'
              : 'Exact string match active. Documents containing "automobile" or "vehicle" are missed!'}
          </span>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-300">Retrieved Corpus Documents ({results.length}):</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
          {results.map((doc) => (
            <div key={doc.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-violet-700/60 transition-colors">
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-violet-400 font-bold">{doc.category}</span>
                <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-mono">
                  via: {doc.matchedBy}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-200 line-clamp-1">{doc.title}</p>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{doc.snippet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Pedagogy Questions */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950/60 to-purple-950/60 border border-violet-800/60 space-y-3">
        <h4 className="text-xs font-black uppercase text-violet-300 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4" /> Concept Mastery Checkpoint
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {/* Question 1: Recall */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <p className="font-bold text-slate-200">1. Did Query Expansion improve Recall?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStudentQuizAnswerRecall('yes')}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                  studentQuizAnswerRecall === 'yes'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Yes (Recall increased)
              </button>
              <button
                onClick={() => setStudentQuizAnswerRecall('no')}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                  studentQuizAnswerRecall === 'no'
                    ? 'bg-rose-600 border-rose-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                No
              </button>
            </div>
            {studentQuizAnswerRecall === 'yes' && (
              <p className="text-[11px] text-emerald-400">
                ✓ Correct! Recall is the proportion of all relevant documents successfully retrieved. Expanding synonyms increased results from 3 to 12.
              </p>
            )}
          </div>

          {/* Question 2: Precision */}
          <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2">
            <p className="font-bold text-slate-200">2. Could Precision decrease if synonyms are too broad?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStudentQuizAnswerPrecision('yes')}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                  studentQuizAnswerPrecision === 'yes'
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                Yes (Precision risk)
              </button>
              <button
                onClick={() => setStudentQuizAnswerPrecision('no')}
                className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                  studentQuizAnswerPrecision === 'no'
                    ? 'bg-rose-600 border-rose-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                No
              </button>
            </div>
            {studentQuizAnswerPrecision === 'yes' && (
              <p className="text-[11px] text-emerald-400">
                ✓ Correct! Precision is the ratio of retrieved documents that are strictly relevant. Broad synonyms (like heavy industrial trucks for &quot;car&quot;) can dilute precision.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
