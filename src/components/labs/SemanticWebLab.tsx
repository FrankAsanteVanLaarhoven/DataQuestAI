'use client';

import React, { useState } from 'react';
import { Network, CheckCircle2, RotateCcw, Link2, Sparkles, HelpCircle } from 'lucide-react';

interface RdfTriple {
  subject: string;
  predicate: string;
  object: string;
}

const AVAILABLE_ENTITIES = [
  'Frank',
  'Newcastle University',
  'Newcastle upon Tyne',
  'United Kingdom',
  'Computer Science',
  'Database Systems',
];

const AVAILABLE_PREDICATES = [
  'studiesAt',
  'locatedIn',
  'country',
  'specializesIn',
  'teachesModule',
];

const EXPECTED_TRIPLES = [
  { subject: 'Frank', predicate: 'studiesAt', object: 'Newcastle University' },
  { subject: 'Newcastle University', predicate: 'locatedIn', object: 'Newcastle upon Tyne' },
  { subject: 'Newcastle upon Tyne', predicate: 'country', object: 'United Kingdom' },
  { subject: 'Frank', predicate: 'specializesIn', object: 'Computer Science' },
];

export const SemanticWebLab: React.FC = () => {
  const [triples, setTriples] = useState<RdfTriple[]>([
    { subject: 'Frank', predicate: 'studiesAt', object: 'Newcastle University' },
  ]);
  const [selectedSubj, setSelectedSubj] = useState(AVAILABLE_ENTITIES[1]);
  const [selectedPred, setSelectedPred] = useState(AVAILABLE_PREDICATES[1]);
  const [selectedObj, setSelectedObj] = useState(AVAILABLE_ENTITIES[2]);
  const [verified, setVerified] = useState(false);

  const addTriple = () => {
    if (selectedSubj === selectedObj) return;
    const exists = triples.some(
      (t) => t.subject === selectedSubj && t.predicate === selectedPred && t.object === selectedObj
    );
    if (!exists) {
      setTriples([...triples, { subject: selectedSubj, predicate: selectedPred, object: selectedObj }]);
    }
  };

  const removeTriple = (index: number) => {
    setTriples(triples.filter((_, i) => i !== index));
    setVerified(false);
  };

  const checkGraph = () => {
    // Check if at least 3 expected linked data paths exist
    const correctCount = triples.filter((t) =>
      EXPECTED_TRIPLES.some(
        (exp) => exp.subject === t.subject && exp.predicate === t.predicate && exp.object === t.object
      )
    ).length;
    setVerified(correctCount >= 3);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-black uppercase tracking-wider mb-2 border border-emerald-800">
            <Network className="w-3.5 h-3.5" /> Semantic Web &amp; Knowledge Graph Lab
          </div>
          <h3 className="text-xl font-black text-white">
            Linked Data &amp; RDF Triples: (Subject → Predicate → Object)
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Construct semantic knowledge graphs where every relationship is explicitly typed with universal identifiers (URIs) rather than siloed relational tables.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-800 text-emerald-300 self-start sm:self-center">
          W3C RDF / SPARQL Core
        </span>
      </div>

      {/* Triple Constructor Controls */}
      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-400" />
          Add Semantic Triple Assertion:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          {/* Subject */}
          <div>
            <label className="text-[10px] uppercase font-bold text-pink-400 block mb-1">Subject (URI)</label>
            <select
              value={selectedSubj}
              onChange={(e) => setSelectedSubj(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
            >
              {AVAILABLE_ENTITIES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {/* Predicate */}
          <div>
            <label className="text-[10px] uppercase font-bold text-amber-400 block mb-1">Predicate (Relation)</label>
            <select
              value={selectedPred}
              onChange={(e) => setSelectedPred(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none"
            >
              {AVAILABLE_PREDICATES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Object */}
          <div>
            <label className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">Object (Entity/Value)</label>
            <select
              value={selectedObj}
              onChange={(e) => setSelectedObj(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-white focus:outline-none"
            >
              {AVAILABLE_ENTITIES.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {/* Add Button */}
          <div className="flex items-end">
            <button
              onClick={addTriple}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              + Assert Triple
            </button>
          </div>
        </div>
      </div>

      {/* Visual RDF Knowledge Graph */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">
            Current Knowledge Graph Triples ({triples.length}):
          </span>
          <button
            onClick={checkGraph}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all"
          >
            Verify Semantic Chain
          </button>
        </div>

        <div className="space-y-2">
          {triples.map((t, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-200"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-bold border border-pink-800/60">
                  {t.subject}
                </span>
                <span className="text-amber-400 font-bold">─── [{t.predicate}] ───▶</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/60">
                  {t.object}
                </span>
              </div>
              <button
                onClick={() => removeTriple(idx)}
                className="text-slate-500 hover:text-rose-400 text-xs px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {verified && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 text-xs space-y-1">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Valid Linked Data Path Established!
            </div>
            <p className="text-[11px] text-emerald-200">
              Through transitivity, an automated SPARQL reasoner can infer: <em>Frank studies in the United Kingdom</em> without storing that fact directly!
            </p>
          </div>
        )}
      </div>

      {/* Concept Breakdown Footer */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs space-y-2">
        <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          The Power of the Semantic Web:
        </h4>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          In standard databases, relationships exist only inside proprietary schemas. In the <strong>Semantic Web (Linked Data)</strong>, every entity and predicate is identified by an international URI (Uniform Resource Identifier). This allows independent datasets worldwide to be queried together seamlessly via SPARQL without central coordination.
        </p>
      </div>
    </div>
  );
};
