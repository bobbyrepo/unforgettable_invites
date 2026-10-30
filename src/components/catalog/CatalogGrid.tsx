'use client';

import React from 'react';
import { TemplateMetadata } from '@/config/templates';
import { CatalogCard } from './CatalogCard';

interface CatalogGridProps {
  templates: TemplateMetadata[];
}

export function CatalogGrid({ templates }: CatalogGridProps) {
  if (templates.length === 0) {
    return (
      <div className="p-16 text-center text-xs border rounded-2xl" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-light)', color: 'var(--text-muted)' }}>
        No templates found matching your search.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <CatalogCard key={template.id} template={template} />
      ))}
    </div>
  );
}
