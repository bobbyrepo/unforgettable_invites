'use client';

import React from 'react';
import { Search } from 'lucide-react';

export type CategoryFilter = 'all' | 'vedic' | 'palace' | 'south' | 'modern';

interface CatalogFiltersProps {
  selectedCategory: CategoryFilter;
  searchQuery: string;
  onSelectCategory: (category: CategoryFilter) => void;
  onSearchChange: (query: string) => void;
}

const CATEGORIES: { id: CategoryFilter; label: string }[] = [
  { id: 'all', label: 'All Themes (8)' },
  { id: 'vedic', label: 'Vedic Mandir' },
  { id: 'palace', label: 'Palace & Heritage' },
  { id: 'south', label: 'South Temple' },
  { id: 'modern', label: 'Modern Luxury' },
];

export function CatalogFilters({
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchChange,
}: CatalogFiltersProps) {
  return (
    <section className="mb-10 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  isSelected ? 'shadow-xs' : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--primary-action)' : 'var(--bg-card)',
                  color: isSelected ? 'var(--primary-action-text)' : 'var(--text-dark)',
                  border: isSelected ? 'none' : '1px solid var(--border-light)'
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search templates or styles..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-xs border outline-none transition shadow-2xs"
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-light)',
              color: 'var(--text-dark)'
            }}
          />
        </div>
      </div>
    </section>
  );
}
