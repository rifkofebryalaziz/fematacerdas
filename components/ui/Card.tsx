'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  return (
    <div
      style={{
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: '16px',
        padding: '16px',
        transition: 'all 0.4s ease',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        ...style,
      }}
    >
      {children}
    </div>
  );
}