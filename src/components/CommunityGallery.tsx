'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Users,
  Share2,
  ThumbsUp,
  GitFork,
  Tag,
  PlusCircle,
  Sparkles,
  BookOpen,
  Filter,
  CheckCircle,
  X,
  FileText,
} from 'lucide-react';

export const CommunityGallery: React.FC = () => {
  const {
    communityDesigns,
    fetchCommunityDesigns,
    publishCustomDesign,
    upvoteDesign,
    forkDesign,
    setActiveTab,
  } = useAppStore();

  React.useEffect(() => {
    fetchCommunityDesigns();
  }, [fetchCommunityDesigns]);

  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('E-Commerce');
  const [description, setDescription] = useState('');
  const [reasoning, setReasoning] = useState('');
  const [tagsStr, setTagsStr] = useState('PostgreSQL, 3NF, Microservices');
  const [expandedReasoningId, setExpandedReasoningId] = useState<string | null>(null);

  const domains = ['All', 'E-Commerce / Retail', 'Healthcare / HIPAA', 'Social Media / Graphs', 'FinTech / Banking'];

  const filteredDesigns =
    selectedDomain === 'All'
      ? communityDesigns
      : communityDesigns.filter((d) => d.domain.toLowerCase().includes(selectedDomain.toLowerCase()));

  const handlePublishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !reasoning) return;

    publishCustomDesign({
      title,
      domain,
      description,
      reasoning,
      tags: tagsStr.split(',').map((t) => t.trim()),
    });

    setTitle('');
    setDescription('');
    setReasoning('');
    setIsPublishModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-2 sm:p-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-2">
            <Users className="w-3.5 h-3.5" /> Community Enterprise Showcase
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Architectural Designs & Justifications
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-pink-100 max-w-xl">
            Explore schemas designed by CS students and enterprise architects. Learn their architectural reasoning, fork templates into your canvas, or publish your own unique designs!
          </p>
        </div>

        <button
          onClick={() => setIsPublishModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-pink-600 hover:bg-pink-50 font-black text-xs shadow-lg transition-all self-start sm:self-auto shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Publish My Canvas Design (+100 XP)
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedDomain === dom
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-pink-300'
            }`}
          >
            {dom}
          </button>
        ))}
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDesigns.map((design) => {
          const isReasoningOpen = expandedReasoningId === design.id;

          return (
            <div
              key={design.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Author & Domain */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                      {design.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{design.author}</h4>
                      <p className="text-[10px] text-pink-600 font-semibold">{design.authorRole}</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    {design.domain}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-2 mb-1">
                  {design.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  {design.description}
                </p>

                {/* Architectural Reasoning Dropdown */}
                <div className="mb-3">
                  <button
                    onClick={() => setExpandedReasoningId(isReasoningOpen ? null : design.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    {isReasoningOpen ? 'Hide Architectural Reasoning' : 'View Architectural Reasoning & Tradeoffs'}
                  </button>

                  {isReasoningOpen && (
                    <div className="mt-2 p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900 rounded-xl text-xs text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
                      <div className="font-bold text-indigo-700 dark:text-indigo-300 mb-1 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        Design Rationale:
                      </div>
                      {design.reasoning}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {design.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => upvoteDesign(design.id)}
                    className="flex items-center gap-1 text-slate-500 hover:text-pink-600 font-bold"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{design.upvotes}</span>
                  </button>
                  <span className="flex items-center gap-1 text-slate-400">
                    <GitFork className="w-3.5 h-3.5" />
                    <span>{design.forks}</span>
                  </span>
                </div>

                <button
                  onClick={() => forkDesign(design.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs shadow-xs"
                >
                  <GitFork className="w-3.5 h-3.5" />
                  Fork into Canvas
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Publish Design Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <form
            onSubmit={handlePublishSubmit}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-pink-500" />
                Publish Current Canvas Architecture
              </h3>
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Architecture Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Distributed Ride-Sharing Schema with Driver Geospatial Index"
                className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Domain / Industry</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden"
              >
                <option value="E-Commerce / Retail">E-Commerce / Retail</option>
                <option value="Healthcare / HIPAA">Healthcare / HIPAA</option>
                <option value="Social Media / Graphs">Social Media / Graphs</option>
                <option value="FinTech / Banking">FinTech / Banking</option>
                <option value="Gaming & Leaderboards">Gaming & Leaderboards</option>
                <option value="IoT & Time-Series">IoT & Time-Series</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Short Summary</label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this architecture accomplishes..."
                className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Architectural Reasoning & Tradeoffs (Required for Enterprise Peer Review)
              </label>
              <textarea
                rows={4}
                required
                value={reasoning}
                onChange={(e) => setReasoning(e.target.value)}
                placeholder="Explain why you chose this relational model. What normal form is it in? How did you handle joins, indexes, or high write-throughput?"
                className="w-full mt-1 p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Tags (comma separated)</label>
              <input
                type="text"
                value={tagsStr}
                onChange={(e) => setTagsStr(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 outline-hidden focus:border-pink-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs rounded-xl shadow-md hover:opacity-95"
              >
                Publish to Community (+100 XP)
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
