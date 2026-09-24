'use client';

import React, { useState } from 'react';
import { Image as ImageIcon, CheckCircle2, Shield, Info, Sparkles } from 'lucide-react';

interface MetadataField {
  id: string;
  name: string;
  value: string;
  category: 'Descriptive' | 'Administrative' | 'Technical' | 'Structural';
  standard: string;
}

const ALL_ATTRIBUTES: MetadataField[] = [
  { id: '1', name: 'Title', value: 'Sunset over Tyne Bridge', category: 'Descriptive', standard: 'Dublin Core (dc:title)' },
  { id: '2', name: 'Creator / Photographer', value: 'Elena Rostova', category: 'Descriptive', standard: 'Dublin Core (dc:creator)' },
  { id: '3', name: 'Capture Date', value: '2026-09-24 18:42:15 GMT', category: 'Administrative', standard: 'EXIF DateTimeOriginal' },
  { id: '4', name: 'GPS Coordinates', value: '54.9687° N, 1.6062° W (Newcastle)', category: 'Technical', standard: 'EXIF GPSInfo' },
  { id: '5', name: 'File Format & MimeType', value: 'image/jpeg (JFIF 1.02)', category: 'Technical', standard: 'Dublin Core (dc:format)' },
  { id: '6', name: 'Copyright & License', value: 'Creative Commons Attribution 4.0 (CC BY)', category: 'Administrative', standard: 'Dublin Core (dc:rights)' },
  { id: '7', name: 'Color Space & ISO', value: 'sRGB, ISO 400, f/2.8, 1/500s', category: 'Technical', standard: 'EXIF Technical Metadata' },
  { id: '8', name: 'Resolution Dimensions', value: '4032 × 3024 pixels (12.2 Megapixels)', category: 'Structural', standard: 'TIFF / EXIF ImageWidth' },
];

export const MetadataLab: React.FC = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>(['1', '2', '3']);
  const [activeTab, setActiveTab] = useState<'all' | 'Descriptive' | 'Technical' | 'Administrative'>('all');

  const toggleField = (id: string) => {
    if (selectedFields.includes(id)) {
      setSelectedFields(selectedFields.filter((f) => f !== id));
    } else {
      setSelectedFields([...selectedFields, id]);
    }
  };

  const filteredAttributes = activeTab === 'all'
    ? ALL_ATTRIBUTES
    : ALL_ATTRIBUTES.filter((a) => a.category === activeTab);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-400 text-xs font-black uppercase tracking-wider mb-2 border border-amber-800">
            <Info className="w-3.5 h-3.5" /> Data Architecture &amp; Governance
          </div>
          <h3 className="text-xl font-black text-white">
            Metadata Laboratory: Data Describing Other Data
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            A digital photograph is raw binary payload data (RGB pixel matrices). Discover how Dublin Core, EXIF, and schema.org metadata turn unsearchable raw data into governed digital assets.
          </p>
        </div>
        <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-800 text-amber-300 self-start sm:self-center">
          Dublin Core &amp; EXIF Standard
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: The Raw Data Payload (The Photograph) */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                Raw Data Payload (Binary Pixels):
              </span>
              <span className="text-[10px] bg-slate-900 text-slate-400 font-mono px-2 py-0.5 rounded border border-slate-800">
                18.4 MB Payload
              </span>
            </div>

            {/* Stylized Visual Image Card */}
            <div className="relative rounded-xl overflow-hidden aspect-video bg-gradient-to-tr from-indigo-900 via-purple-900 to-amber-700 flex flex-col items-center justify-center border border-white/10 shadow-inner p-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-2 text-white shadow-lg">
                <ImageIcon className="w-8 h-8 opacity-90" />
              </div>
              <p className="text-xs font-black text-white tracking-wide">
                TYNE_BRIDGE_SUNSET_RAW.JPG
              </p>
              <p className="text-[10px] text-amber-200 mt-1">
                4,032 × 3,024 24-bit TrueColor Matrix
              </p>
            </div>
          </div>

          {/* Conceptual Insight Callout */}
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs leading-relaxed space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-300">
              <Sparkles className="w-3.5 h-3.5" /> Core Pedagogy Rule:
            </span>
            <p className="text-[11px]">
              The photograph itself is <strong>Data</strong>. These structured descriptions (author, coordinates, license) are <strong>Metadata</strong> — data describing other data. Without metadata, no search engine or catalog could ever find or index this photograph!
            </p>
          </div>
        </div>

        {/* Right: Attached Metadata Attributes */}
        <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-300">
              Attached Metadata Schema ({selectedFields.length}/{ALL_ATTRIBUTES.length} Active):
            </span>
            {/* Category Filter */}
            <div className="flex gap-1">
              {(['all', 'Descriptive', 'Technical', 'Administrative'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded font-bold transition-all ${
                    activeTab === cat
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {filteredAttributes.map((attr) => {
              const isSelected = selectedFields.includes(attr.id);
              return (
                <div
                  key={attr.id}
                  onClick={() => toggleField(attr.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/70 shadow-sm'
                      : 'bg-slate-950 border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-200">{attr.name}</span>
                    <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-slate-800 text-amber-400">
                      {attr.standard}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-cyan-300 mt-1 truncate">{attr.value}</p>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Search Engine Indexability:</span>
            <span className="font-bold text-emerald-400">
              {Math.round((selectedFields.length / ALL_ATTRIBUTES.length) * 100)}% Complete
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
