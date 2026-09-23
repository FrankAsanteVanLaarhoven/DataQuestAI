'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { translations } from '@/lib/i18n';
import { CrudOperation } from '@/lib/types';
import {
  Plus,
  Play,
  FileCode,
  Sparkles,
  Database,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  X,
  Code,
} from 'lucide-react';

export const CrudBuilder: React.FC = () => {
  const { crudOperations, executeCrud, addCustomCrud, language } = useAppStore();
  const t = translations[language] || translations.en;
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'C' | 'R' | 'U' | 'D'>('C');
  const [customTitle, setCustomTitle] = useState('');
  const [customTable, setCustomTable] = useState('Customers');
  const [customSql, setCustomSql] = useState('');
  const [activeExecutedId, setActiveExecutedId] = useState<string | null>(null);

  const handleOpenAdd = (type: 'C' | 'R' | 'U' | 'D') => {
    setModalType(type);
    setCustomTitle('');
    if (type === 'C') {
      setCustomSql("INSERT INTO Orders VALUES ('#1046', 'C001', '2026-09-23', 65.00, 'Processing')");
    } else if (type === 'R') {
      setCustomSql("SELECT * FROM Products WHERE Stock < 10");
    } else if (type === 'U') {
      setCustomSql("UPDATE Customers SET Email = 'new_email@domain.com' WHERE CustomerID = 'C001'");
    } else {
      setCustomSql("DELETE FROM Cart WHERE CartID = 'CR01'");
    }
    setModalOpen(true);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle) return;
    addCustomCrud({
      type: modalType,
      title: customTitle,
      description: `Custom ${modalType} query on ${customTable}`,
      table: customTable,
      sql: customSql,
    });
    setModalOpen(false);
  };

  const runOperation = (op: CrudOperation) => {
    executeCrud(op);
    setActiveExecutedId(op.id);
    setTimeout(() => setActiveExecutedId(null), 1200);
  };

  const columns: Array<{ type: 'C' | 'R' | 'U' | 'D'; label: string; icon: any; color: string; badgeBg: string }> = [
    { type: 'C', label: t.createCol || 'Create (C)', icon: Plus, color: 'text-emerald-600 dark:text-emerald-400', badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
    { type: 'R', label: t.readCol || 'Read (R)', icon: Search, color: 'text-blue-600 dark:text-blue-400', badgeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
    { type: 'U', label: t.updateCol || 'Update (U)', icon: Edit3, color: 'text-amber-600 dark:text-amber-400', badgeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
    { type: 'D', label: t.deleteCol || 'Delete (D)', icon: Trash2, color: 'text-rose-600 dark:text-rose-400', badgeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-slate-800 dark:text-slate-100">{t.crudTitle}</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t.crudSubtitle}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
          Live Transaction Engine
        </span>
      </div>

      {/* 4 CRUD Columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => {
          const ops = crudOperations.filter((o) => o.type === col.type);
          const Icon = col.icon;

          return (
            <div
              key={col.type}
              className={`rounded-xl border p-2.5 flex flex-col gap-2 ${col.badgeBg}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <Icon className={`w-3.5 h-3.5 ${col.color}`} />
                  <span className={`text-xs font-extrabold ${col.color}`}>{col.label}</span>
                </div>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {ops.length}
                </span>
              </div>

              {/* Operations list */}
              <div className="space-y-1.5 flex-1">
                {ops.map((op) => {
                  const isRunning = activeExecutedId === op.id;
                  return (
                    <div
                      key={op.id}
                      className="group bg-white dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-2 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <p className="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate">
                            {op.title}
                          </p>
                        </div>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 truncate font-mono">
                          {op.sql}
                        </p>
                      </div>

                      {/* Execute Button */}
                      <button
                        onClick={() => runOperation(op)}
                        title="Execute operation on live database"
                        className={`p-1.5 rounded-lg border text-xs font-bold transition-all shrink-0 ${
                          isRunning
                            ? 'bg-emerald-500 text-white scale-110 shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-700 hover:bg-pink-500 hover:text-white border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isRunning ? <CheckCircle className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add Operation Button */}
              <button
                onClick={() => handleOpenAdd(col.type)}
                className="w-full py-1.5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 hover:border-pink-400 text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 text-[11px] font-bold transition-colors flex items-center justify-center gap-1 bg-white/50 dark:bg-slate-800/40"
              >
                <Plus className="w-3 h-3" />
                {t.addOp || 'Add operation'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add Custom CRUD Operation Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveCustom}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Code className="w-4 h-4 text-pink-500" />
                New {modalType === 'C' ? 'Create' : modalType === 'R' ? 'Read' : modalType === 'U' ? 'Update' : 'Delete'} Operation
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Operation Title</label>
              <input
                type="text"
                required
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="e.g. Bulk discount on older stock"
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Target Table</label>
              <select
                value={customTable}
                onChange={(e) => setCustomTable(e.target.value)}
                className="w-full mt-1 px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden"
              >
                <option value="Customers">Customers</option>
                <option value="Orders">Orders</option>
                <option value="Products">Products</option>
                <option value="Cart">Cart</option>
                <option value="Reviews">Reviews</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">SQL Statement</label>
              <textarea
                rows={3}
                required
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                className="w-full mt-1 p-2.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-950 text-pink-300 outline-hidden focus:border-pink-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-pink-500 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-pink-600"
              >
                Save Operation (+15 XP)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
