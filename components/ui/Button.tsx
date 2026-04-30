'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ children, variant = 'primary', size = 'md', style, ...props }: ButtonProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const base: React.CSSProperties = {
    borderRadius: '10px',
    fontWeight: 600,
    border: 'none',
    cursor: props.disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: props.disabled ? 0.5 : 1,
  };

  const variants: Record<string, React.CSSProperties> = {
    primary: {
      background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`,
      color: '#fff',
      boxShadow: `0 2px 10px ${t.accentGlow}`,
    },
    secondary: {
      background: t.inputBg,
      color: t.textPrimary,
      outline: `1.5px solid ${t.border}`,
    },
    ghost: {
      background: 'transparent',
      color: t.textSecondary,
      outline: `1.5px solid ${t.border}`,
    },
  };

  const sizes: Record<string, React.CSSProperties> = {
    sm: { padding: '6px 12px', fontSize: '13px' },
    md: { padding: '10px 16px', fontSize: '14px' },
    lg: { padding: '13px 24px', fontSize: '15px' },
  };

  return (
    <button
      style={{ ...base, ...variants[variant], ...sizes[size], ...style }}
      onMouseEnter={(e) => {
        if (props.disabled) return;
        if (variant === 'primary') e.currentTarget.style.opacity = '0.9';
        if (variant === 'secondary' || variant === 'ghost') {
          e.currentTarget.style.borderColor = t.accent;
          e.currentTarget.style.color = t.accent;
        }
      }}
      onMouseLeave={(e) => {
        if (props.disabled) return;
        if (variant === 'primary') e.currentTarget.style.opacity = '1';
        if (variant === 'secondary') {
          e.currentTarget.style.borderColor = t.border;
          e.currentTarget.style.color = t.textPrimary;
        }
        if (variant === 'ghost') {
          e.currentTarget.style.borderColor = t.border;
          e.currentTarget.style.color = t.textSecondary;
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}