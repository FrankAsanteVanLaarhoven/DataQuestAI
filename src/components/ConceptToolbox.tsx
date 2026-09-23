'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { ConceptType } from '@/lib/types';
import {
  GripVertical,
  Layers,
  Key,
  Link2,
  Database,
  Search,
  ShieldCheck,
  LineChart,
  GitBranch,
  FileCode,
  HardDrive,
  Cpu,
  Table,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ToolboxItem {
  type: ConceptType;
  label: string;
  category: 'core' | 'keys' | 'engine' | 'operations';
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}

const toolboxItems: ToolboxItem[] = [
  { type: 'entity', label: 'Entity', category: 'core', icon: Layers, accentColor: 'text-violet-500 dark:text-violet-400 group-hover:text-violet-600' },
  { type: 'attribute', label: 'Attribute', category: 'core', icon: FileCode, accentColor: 'text-blue-500 dark:text-blue-400 group-hover:text-blue-600' },
  { type: 'relationship', label: 'Relationship', category: 'core', icon: GitBranch, accentColor: 'text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600' },
  { type: 'primaryKey', label: 'Primary Key', category: 'keys', icon: Key, accentColor: 'text-amber-500 dark:text-amber-400 group-hover:text-amber-600' },
  { type: 'foreignKey', label: 'Foreign Key', category: 'keys', icon: Link2, accentColor: 'text-orange-500 dark:text-orange-400 group-hover:text-orange-600' },
  { type: 'sql', label: 'SQL Engine', category: 'engine', icon: Database, accentColor: 'text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600' },
  { type: 'nosql', label: 'NoSQL Store', category: 'engine', icon: Table, accentColor: 'text-teal-500 dark:text-teal-400 group-hover:text-teal-600' },
  { type: 'storage', label: 'Storage Block', category: 'operations', icon: HardDrive, accentColor: 'text-cyan-500 dark:text-cyan-400 group-hover:text-cyan-600' },
  { type: 'retrieval', label: 'Retrieval Query', category: 'operations', icon: Cpu, accentColor: 'text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600' },
  { type: 'search', label: 'Search Index', category: 'operations', icon: Search, accentColor: 'text-sky-500 dark:text-sky-400 group-hover:text-sky-600' },
  { type: 'ethics', label: 'Ethics & GDPR', category: 'core', icon: ShieldCheck, accentColor: 'text-rose-500 dark:text-rose-400 group-hover:text-rose-600' },
  { type: 'kpi', label: 'KPI Metric', category: 'operations', icon: LineChart, accentColor: 'text-purple-500 dark:text-purple-400 group-hover:text-purple-600' },
  { type: 'crud', label: 'CRUD Service', category: 'operations', icon: CheckCircle2, accentColor: 'text-fuchsia-500 dark:text-fuchsia-400 group-hover:text-fuchsia-600' },
  { type: 'graphs', label: 'Graph Topology', category: 'engine', icon: GitBranch, accentColor: 'text-emerald-500 dark:text-emerald-400 group-hover:text-emerald-600' },
  { type: 'dashboard', label: 'Telemetry Dash', category: 'operations', icon: LineChart, accentColor: 'text-violet-500 dark:text-violet-400 group-hover:text-violet-600' },
];

export const ConceptToolbox: React.FC = () => {
  const { addNodeToCanvas, language } = useAppStore();
  const t = translations[language] || translations.en;

  const handleDragStart = (e: React.DragEvent, item: ToolboxItem) => {
    e.dataTransfer.setData('application/dataquest-concept', item.type);
    e.dataTransfer.setData('application/dataquest-label', item.label);
  };

  return (
    <div className="bg-white/80 dark:bg-[#111420]/80 backdrop-blur-2xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-0.5">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-violet-500/10 dark:bg-violet-400/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {t.toolboxTitle}
            </h3>
            <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
              {t.toolboxSubtitle}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.06] text-[10px] font-medium text-zinc-600 dark:text-zinc-300">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
          15 Architecture Primitives
        </div>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-5 xl:grid-cols-5 gap-2">
        {toolboxItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              onClick={() => addNodeToCanvas(item.type, item.label)}
              className="group relative flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-zinc-50/80 dark:bg-white/[0.03] hover:bg-white dark:hover:bg-white/[0.07] border border-black/[0.06] dark:border-white/[0.07] hover:border-violet-500/40 dark:hover:border-violet-400/40 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all duration-150 shadow-2xs hover:shadow-xs active:scale-[0.98] cursor-grab active:cursor-grabbing text-left"
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <Icon className={`w-3.5 h-3.5 shrink-0 transition-colors ${item.accentColor}`} />
                <span className="truncate text-[11px] tracking-tight">{item.label}</span>
              </div>
              <GripVertical className="w-3 h-3 text-zinc-400 dark:text-zinc-600 opacity-30 group-hover:opacity-100 shrink-0 transition-opacity" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
