'use client';

import React, { useRef } from 'react';
import { useSectionMotion } from './useStageMotion';

interface MotionSectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  sectionName?: string;
}

export function MotionSectionWrapper({
  children,
  className,
  sectionName,
}: MotionSectionWrapperProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  useSectionMotion(rootRef);

  return (
    <div
      ref={rootRef}
      className={className}
      data-motion="pending"
      data-section-name={sectionName}
    >
      {children}
    </div>
  );
}
