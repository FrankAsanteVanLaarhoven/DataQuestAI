'use client';

import React, { useState } from 'react';
import { Filter, Layers, ShoppingBag, RotateCcw, Sparkles } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  brand: 'Apple' | 'Samsung' | 'Google';
  price: number;
  color: 'Black' | 'White' | 'Blue';
  storage: '128GB' | '256GB' | '512GB';
}

const INVENTORY: ProductItem[] = [
  { id: '1', name: 'Galaxy S25 Ultra', brand: 'Samsung', price: 950, color: 'Black', storage: '256GB' },
  { id: '2', name: 'Galaxy S25 Base', brand: 'Samsung', price: 650, color: 'White', storage: '128GB' },
  { id: '3', name: 'Galaxy A55', brand: 'Samsung', price: 380, color: 'Blue', storage: '128GB' },
  { id: '4', name: 'Galaxy Z Fold 6', brand: 'Samsung', price: 1400, color: 'Black', storage: '512GB' },
  { id: '5', name: 'iPhone 16 Pro Max', brand: 'Apple', price: 1199, color: 'Black', storage: '256GB' },
  { id: '6', name: 'iPhone 16 Pro', brand: 'Apple', price: 999, color: 'White', storage: '128GB' },
  { id: '7', name: 'iPhone 16 Base', brand: 'Apple', price: 799, color: 'Blue', storage: '128GB' },
  { id: '8', name: 'iPhone SE 3', brand: 'Apple', price: 429, color: 'White', storage: '128GB' },
  { id: '9', name: 'Pixel 9 Pro XL', brand: 'Google', price: 1099, color: 'Black', storage: '256GB' },
  { id: '10', name: 'Pixel 9', brand: 'Google', price: 699, color: 'White', storage: '128GB' },
  { id: '11', name: 'Pixel 8a', brand: 'Google', price: 449, color: 'Blue', storage: '128GB' },
];

export const FacetedSearchLab: React.FC = () => {
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['Samsung']);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('500-1000');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>(['256GB']);

  const toggleBrand = (b: string) => {
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );
  };

  const toggleColor = (c: string) => {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  };

  const toggleStorage = (s: string) => {
    setSelectedStorage((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedPriceRange('all');
    setSelectedColors([]);
    setSelectedStorage([]);
  };

  // Filter matching items
  const filtered = INVENTORY.filter((item) => {
    if (selectedBrands.length > 0 && !selectedBrands.includes(item.brand)) return false;
    if (selectedColors.length > 0 && !selectedColors.includes(item.color)) return false;
    if (selectedStorage.length > 0 && !selectedStorage.includes(item.storage)) return false;

    if (selectedPriceRange === '0-500' && item.price > 500) return false;
    if (selectedPriceRange === '500-1000' && (item.price < 500 || item.price > 1000)) return false;
    if (selectedPriceRange === '1000+' && item.price <= 1000) return false;

    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-white space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950 text-blue-400 text-xs font-black uppercase tracking-wider mb-2 border border-blue-800">
            <Filter className="w-3.5 h-3.5" /> Information Architecture &amp; Taxonomy
          </div>
          <h3 className="text-xl font-black text-white">
            Faceted Classification &amp; Multi-Attribute Navigation
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            In hierarchical taxonomy, items belong to one fixed tree. In <strong>Faceted Search</strong>, objects are classified across multiple orthogonal dimensions simultaneously.
          </p>
        </div>
        <button
          onClick={resetFilters}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Clear Facets
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Faceted Navigation Side Panel */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Orthogonal Facets
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Dynamic counts</span>
          </div>

          {/* Facet 1: Brand */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Brand</label>
            {['Apple', 'Samsung', 'Google'].map((brand) => {
              const count = INVENTORY.filter((i) => i.brand === brand).length;
              return (
                <label key={brand} className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer py-0.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="rounded accent-blue-500"
                    />
                    <span>{brand}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">({count})</span>
                </label>
              );
            })}
          </div>

          {/* Facet 2: Price Range */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Price Range</label>
            {[
              { id: 'all', label: 'All Prices' },
              { id: '0-500', label: '£0 – £500' },
              { id: '500-1000', label: '£500 – £1,000' },
              { id: '1000+', label: '£1,000+' },
            ].map((p) => (
              <label key={p.id} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5">
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === p.id}
                  onChange={() => setSelectedPriceRange(p.id)}
                  className="accent-blue-500"
                />
                <span>{p.label}</span>
              </label>
            ))}
          </div>

          {/* Facet 3: Storage */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Storage Capacity</label>
            {['128GB', '256GB', '512GB'].map((storage) => (
              <label key={storage} className="flex items-center justify-between text-xs text-slate-300 hover:text-white cursor-pointer py-0.5">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStorage.includes(storage)}
                    onChange={() => toggleStorage(storage)}
                    className="rounded accent-blue-500"
                  />
                  <span>{storage}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Facet 4: Color */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Color Finish</label>
            {['Black', 'White', 'Blue'].map((color) => (
              <label key={color} className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer py-0.5">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => toggleColor(color)}
                  className="rounded accent-blue-500"
                />
                <span>{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Right: Dynamic Filtered Population */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-300">
              Matching Inventory: <span className="text-blue-400 font-mono text-sm">{filtered.length} products</span> (of {INVENTORY.length} total)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Pruned: {INVENTORY.length - filtered.length} records excluded
            </span>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/60 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-2">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-800/60">
                        {item.brand}
                      </span>
                      <span className="font-mono text-slate-400">{item.storage}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                    <p className="text-[11px] text-slate-400">Finish: {item.color}</p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-base font-black text-emerald-400">£{item.price}</span>
                    <span className="text-[10px] text-slate-500 font-mono">In Stock</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800">
              <ShoppingBag className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-xs text-slate-400">No products match all selected facet filters.</p>
              <button onClick={resetFilters} className="mt-2 text-xs text-blue-400 font-bold hover:underline">
                Reset filters to view all products
              </button>
            </div>
          )}

          {/* Faceted Classification Insight */}
          <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-900/60 text-blue-200 text-xs space-y-1">
            <span className="font-bold text-blue-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> S.R. Ranganathan Colon Classification Principle:
            </span>
            <p className="text-[11px] leading-relaxed">
              Notice how selecting multiple facets dynamically restricts the search space without requiring a fixed hierarchy. Each facet is an orthogonal index dimension that intersects with others in sub-millisecond bitmapped queries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
