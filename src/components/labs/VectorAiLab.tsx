'use client';

import React, { useState } from 'react';
import { Sparkles, Database, Brain, AlertOctagon, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

interface VectorDocument {
  id: number;
  text: string;
  vector: number[]; // 3D toy embedding
  similarity: number;
}

export const VectorAiLab: React.FC = () => {
  const [question, setQuestion] = useState('How does Newcastle University handle library book loans?');
  const [isBrokenRetrieval, setIsBrokenRetrieval] = useState(false);
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7);

  // Documents in Vector Database
  const documents: VectorDocument[] = [
    {
      id: 1,
      text: 'Newcastle University Library allows students to borrow up to 30 books for 4 weeks with automatic renewal unless recalled.',
      vector: [0.88, 0.91, 0.12],
      similarity: 0.94,
    },
    {
      id: 2,
      text: 'Campus cafeteria serving times are 08:00 to 17:00 with lunch specials served between 12:00 and 14:00.',
      vector: [0.12, 0.15, 0.92],
      similarity: 0.22,
    },
    {
      id: 3,
      text: 'University sports center gym membership costs £15 per month for enrolled undergraduates.',
      vector: [0.08, 0.25, 0.88],
      similarity: 0.18,
    },
  ];

  // Retrieved document based on mode
  const retrievedDoc = isBrokenRetrieval ? documents[1] : documents[0];

  const generatedAnswer = isBrokenRetrieval
    ? 'According to the retrieved context, books are served between 12:00 and 14:00 with daily lunch specials in the campus cafeteria. (HALLUCINATION / DATA RETRIEVAL FAILURE)'
    : 'Newcastle University students can borrow up to 30 books for a standard period of 4 weeks, with automatic renewal active unless another borrower recalls the item.';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950 text-purple-400 text-xs font-black uppercase tracking-wider mb-2 border border-purple-800">
            <Sparkles className="w-3.5 h-3.5" /> Vector Databases &amp; LLM Retrieval
          </div>
          <h3 className="text-xl font-black text-white">
            Retrieval-Augmented Generation (RAG) &amp; Vector Embeddings
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Large Language Models (LLMs) have knowledge cutoff boundaries and hallucination tendencies. Learn how Vector Databases ground AI answers using high-dimensional cosine similarity embeddings.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsBrokenRetrieval(!isBrokenRetrieval)}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
              isBrokenRetrieval
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            {isBrokenRetrieval ? 'Retrieval Corrupted (Break Mode)' : 'Normal RAG Retrieval'}
          </button>
        </div>
      </div>

      {/* RAG Pipeline Flowchart */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-center text-xs font-mono">
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-pink-400 block mb-1">1. User Query</span>
          <p className="text-slate-300 text-[11px] truncate">{question}</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-purple-400 block mb-1">2. Embedding Model</span>
          <p className="text-slate-300 text-[11px]">[0.86, 0.89, 0.15] vector</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-purple-800">
          <span className="text-[10px] text-cyan-400 block mb-1">3. Vector DB k-NN</span>
          <p className="text-slate-300 text-[11px]">Cosine similarity scan</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <span className="text-[10px] text-amber-400 block mb-1">4. Context Window</span>
          <p className="text-slate-300 text-[11px]">Doc #{retrievedDoc.id} injected</p>
        </div>
        <div className="p-3 bg-slate-950 rounded-xl border border-emerald-800">
          <span className="text-[10px] text-emerald-400 block mb-1">5. LLM Synthesis</span>
          <p className="text-slate-300 text-[11px]">Grounded Output</p>
        </div>
      </div>

      {/* Interactive Retrieval Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Retrieved Context Chunk */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-purple-400" />
              Retrieved Vector DB Chunk (Document #{retrievedDoc.id}):
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              isBrokenRetrieval ? 'bg-rose-950 text-rose-300' : 'bg-emerald-950 text-emerald-300'
            }`}>
              Similarity: {isBrokenRetrieval ? '0.22 (LOW)' : '0.94 (HIGH)'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border font-mono text-xs leading-relaxed ${
            isBrokenRetrieval
              ? 'bg-rose-950/30 border-rose-800/60 text-rose-200'
              : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}>
            &quot;{retrievedDoc.text}&quot;
          </div>

          <p className="text-[11px] text-slate-400">
            {isBrokenRetrieval
              ? '⚠️ Data engineering error: Low-similarity document was passed to LLM context.'
              : '✓ Valid semantic match: Cosine distance is within the 0.70 threshold.'}
          </p>
        </div>

        {/* Right: LLM Output */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-cyan-400" />
              Large Language Model (LLM) Output:
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
              isBrokenRetrieval ? 'bg-rose-900 text-white' : 'bg-cyan-950 text-cyan-300'
            }`}>
              {isBrokenRetrieval ? 'HALLUCINATION' : 'FACTUAL'}
            </span>
          </div>

          <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
            isBrokenRetrieval
              ? 'bg-rose-950/40 border-rose-700/80 text-rose-100 font-bold'
              : 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100'
          }`}>
            {generatedAnswer}
          </div>

          {/* Lesson */}
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-[11px] text-purple-200 leading-relaxed">
            <strong>Key Pedagogy Takeaway:</strong> When an AI application hallucinates or answers incorrectly, the flaw is often not the language model itself — it is a <strong>data retrieval &amp; indexing failure</strong> in the underlying vector database.
          </div>
        </div>
      </div>
    </div>
  );
};
