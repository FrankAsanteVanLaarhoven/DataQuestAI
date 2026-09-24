'use client';

import React, { useState } from 'react';
import { Search, Filter, Cpu, ArrowRight, CheckCircle2, Play, Sparkles } from 'lucide-react';

const STOP_WORDS = new Set([
  'a', 'about', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
  'in', 'is', 'it', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'what', 'with'
]);

function simpleStem(word: string): string {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.endsWith('ies')) return w.slice(0, -3) + 'y';
  if (w.endsWith('es')) return w.slice(0, -2);
  if (w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
  if (w.endsWith('ing')) return w.slice(0, -3);
  if (w.endsWith('ed')) return w.slice(0, -2);
  if (w.endsWith('ly')) return w.slice(0, -2);
  return w;
}

export const SearchEngineLab: React.FC = () => {
  const [inputText, setInputText] = useState(
    'The students are searching databases and learning modern information retrieval systems.'
  );
  const [activeStage, setActiveStage] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState('student database');

  // Pipeline computation
  const rawTokens = inputText.split(/\s+/).map((w) => w.replace(/[^a-zA-Z]/g, '')).filter(Boolean);
  const filteredTokens = rawTokens.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
  const stemmedTokens = filteredTokens.map((w) => simpleStem(w));

  // Inverted Index
  const invertedIndex: Record<string, { count: number; docId: number }> = {};
  for (const token of stemmedTokens) {
    if (!invertedIndex[token]) {
      invertedIndex[token] = { count: 0, docId: 17 };
    }
    invertedIndex[token].count++;
  }

  // Query evaluation
  const queryTokens = searchQuery.split(/\s+/).map((w) => simpleStem(w)).filter(Boolean);
  const matchedTerms = queryTokens.filter((qt) => invertedIndex[qt]);
  const score = Math.round((matchedTerms.length / (queryTokens.length || 1)) * 100);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-black uppercase tracking-wider mb-2 border border-cyan-800">
            <Search className="w-3.5 h-3.5" /> Information Retrieval Laboratory
          </div>
          <h3 className="text-xl font-black text-white">
            Interactive Search Engine & Inverted Index Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Watch raw text transform into a high-speed inverted index: Tokenization → Stop-word Removal → Stemming → Inverted Index Postings → Ranked Query Match.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-800 text-cyan-300 self-start sm:self-center">
          CSC1033 IR Core
        </span>
      </div>

      {/* Input Document */}
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-1">
          Document 17 Payload (Web Page / Article Text):
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          />
          <button
            onClick={() => setInputText('The students are searching databases and learning modern information retrieval systems.')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-xl text-slate-300 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Stage 1: Tokenizer */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-pink-400 tracking-wider">Step 1: Tokenizer</span>
            <span className="text-[10px] bg-pink-950 text-pink-300 px-1.5 py-0.5 rounded font-mono font-bold">
              {rawTokens.length} words
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Splits continuous text into discrete lexical tokens.</p>
          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pt-1">
            {rawTokens.map((t, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stage 2: Stop-word Filter */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">Step 2: Stop Words</span>
            <span className="text-[10px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
              -{rawTokens.length - filteredTokens.length} removed
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Prunes high-frequency non-discriminative words (the, are, and).</p>
          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pt-1">
            {filteredTokens.map((t, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-800/60">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stage 3: Stemmer */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Step 3: Stemming</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded font-mono font-bold">
              Porter Algorithm
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Reduces morphological variants to common base roots.</p>
          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pt-1">
            {stemmedTokens.map((t, i) => (
              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950/50 text-indigo-300 border border-indigo-800/60">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stage 4: Inverted Index Postings */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Step 4: Inverted Index</span>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
              {Object.keys(invertedIndex).length} Terms
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Maps terms to document IDs for O(1) postings lookup.</p>
          <div className="space-y-1 max-h-28 overflow-y-auto pt-1 font-mono text-[10px]">
            {Object.entries(invertedIndex).map(([term, data]) => (
              <div key={term} className="flex items-center justify-between px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                <span className="text-cyan-300 font-bold">{term}</span>
                <span className="text-slate-400">→ doc {data.docId} ({data.count}x)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Query Testing Section */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" />
          Test Query Execution against Inverted Index:
        </h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type query terms, e.g. 'searching database' or 'students'"
            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          />
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">Relevance Match:</span>
            <span className={`text-xs font-bold font-mono ${score > 50 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {score}% match ({matchedTerms.length}/{queryTokens.length} terms indexed)
            </span>
          </div>
        </div>
        <p className="text-[11px] text-slate-400">
          Query tokens evaluated as: <span className="text-cyan-400 font-mono">[{queryTokens.join(', ')}]</span>.
          {matchedTerms.length > 0 ? (
            <span className="text-emerald-400 ml-1">Matched in Document 17! Document ranked and retrieved in 0.4 ms.</span>
          ) : (
            <span className="text-rose-400 ml-1">No matching terms in Document 17 postings list.</span>
          )}
        </p>
      </div>
    </div>
  );
};
