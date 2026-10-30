'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error';
}

export function Toast({ message, type = 'success' }: ToastProps) {
  if (!message) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-white font-medium text-xs shadow-lg animate-in fade-in slide-in-from-bottom-3 duration-200 ${
        type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
      }`}
    >
      {type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
}
