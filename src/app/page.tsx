'use client';

import React, { useState } from 'react';
import { MASTER_TEMPLATES } from '@/config/templates';
import { useTheme } from '@/hooks/useTheme';
import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { CatalogHero } from '@/components/catalog/CatalogHero';
import { CatalogFilters, CategoryFilter } from '@/components/catalog/CatalogFilters';
import { CatalogGrid } from '@/components/catalog/CatalogGrid';

export default function CatalogPage() {
  const { theme, toggleTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = MASTER_TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === 'all' || tmpl.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      tmpl.name.toLowerCase().includes(q) ||
      tmpl.tag.toLowerCase().includes(q) ||
      tmpl.description.toLowerCase().includes(q) ||
      tmpl.specs.some((s) => s.val.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-dark)' }}>
      <CatalogHeader theme={theme} onToggleTheme={toggleTheme} />

      <main className="max-w-7xl mx-auto px-6 pb-20">
        <CatalogHero />

        <CatalogFilters
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onSelectCategory={setSelectedCategory}
          onSearchChange={setSearchQuery}
        />

        <CatalogGrid templates={filteredTemplates} />
      </main>
    </div>
  );
}
