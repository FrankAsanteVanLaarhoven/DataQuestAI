'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { ConceptType } from '@/lib/types';
import {
  GripVertical,
  Lightbulb,
  Boxes,
  Key,
  Link2,
  Database,
  Search,
  ShieldCheck,
  LineChart,
  GitBranch,
  Layers,
  FileCode,
  HardDrive,
  Download,
} from 'lucide-react';

interface ToolboxItem {
  type: ConceptType;
  label: string;
  category: 'core' | 'keys' | 'engine' | 'operations';
  color: string;
}

const toolboxItems: ToolboxItem[] = [
  { type: 'entity', label: 'Entity', category: 'core', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800' },
  { type: 'attribute', label: 'Attribute', category: 'core', color: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800' },
  { type: 'relationship', label: 'Relationship', category: 'core', color: 'bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800' },
  { type: 'primaryKey', label: 'Primary Key', category: 'keys', color: 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' },
  { type: 'foreignKey', label: 'Foreign Key', category: 'keys', color: 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800' },
  { type: 'sql', label: 'SQL', category: 'engine', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  { type: 'nosql', label: 'NoSQL', category: 'engine', color: 'bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800' },
  { type: 'storage', label: 'Storage', category: 'operations', color: 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-950/40 dark:text-cyan-300 dark:border-cyan-800' },
  { type: 'retrieval', label: 'Retrieval', category: 'operations', color: 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800' },
  { type: 'search', label: 'Search', category: 'operations', color: 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800' },
  { type: 'ethics', label: 'Ethics', category: 'core', color: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800' },
  { type: 'kpi', label: 'KPI', category: 'operations', color: 'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800' },
  { type: 'crud', label: 'CRUD', category: 'operations', color: 'bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-950/40 dark:text-fuchsia-300 dark:border-fuchsia-800' },
  { type: 'graphs', label: 'Graphs', category: 'engine', color: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800' },
  { type: 'dashboard', label: 'Dashboard', category: 'operations', color: 'bg-pink-50 hover:bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-950/40 dark:text-pink-300 dark:border-pink-800' },
];

export const ConceptToolbox: React.FC = () => {
  const { addNodeToCanvas, language } = useAppStore();
  const t = translations[language] || translations.en;

  const handleDragStart = (e: React.DragEvent, item: ToolboxItem) => {
    e.dataTransfer.setData('application/dataquest-concept', item.type);
    e.dataTransfer.setData('application/dataquest-label', item.label);
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-3.5 shadow-xs">
      <div className="flex items-center justify-between mb-2 px-0.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-600">
            <Lightbulb className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{t.toolboxTitle}</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t.toolboxSubtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-pink-600 bg-pink-50 dark:bg-pink-950/60 px-2 py-0.5 rounded-full border border-pink-200/60">
          15 Tools
        </span>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-5 xl:grid-cols-8 gap-2">
        {toolboxItems.map((item) => (
          <button
            key={item.label}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            onClick={() => addNodeToCanvas(item.type, item.label)}
            className={`group flex items-center justify-between gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-2xs hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing ${item.color}`}
          >
            <div className="flex items-center gap-1.5 truncate">
              <GripVertical className="w-3 h-3 opacity-40 group-hover:opacity-100 shrink-0" />
              <span className="truncate text-[11px]">{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
