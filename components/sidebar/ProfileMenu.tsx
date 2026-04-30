'use client';

import React, { useRef, useEffect } from 'react';
import { Settings, User, LogOut } from 'lucide-react';
import { User as UserType } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface ProfileMenuProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  menuPosition?: { bottom?: number; left?: number };
}

export function ProfileMenu({ user, isOpen, onClose, onOpenProfile, onOpenSettings, onLogout, menuPosition }: ProfileMenuProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 0);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: <Settings size={15} />,
      label: 'Pengaturan',
      onClick: () => { onOpenSettings(); onClose(); },
      danger: false,
    },
    {
      icon: <User size={15} />,
      label: 'Profil',
      onClick: () => { onOpenProfile(); onClose(); },
      danger: false,
    },
    {
      icon: <LogOut size={15} />,
      label: 'Keluar',
      onClick: () => { onLogout(); onClose(); },
      danger: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        bottom: menuPosition?.bottom ?? 80,
        left: menuPosition?.left ?? 16,
        width: '220px',
        background: t.card,
        border: `1px solid ${t.border}`,
        borderRadius: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        overflow: 'hidden',
        zIndex: 9999,
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      }}
    >
      {/* User info */}
      <div style={{ padding: '12px 16px', borderBottom: `1px solid ${t.border}` }}>
        <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.name}
        </p>
        <p style={{ margin: 0, fontSize: '11px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user.email}
        </p>
      </div>

      {/* Menu items */}
      {menuItems.map((item) => (
        <button
          key={item.label}
          type="button"
          onClick={item.onClick}
          style={{
            width: '100%',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            color: item.danger ? '#EF4444' : t.textPrimary,
            transition: 'all 0.15s ease',
            textAlign: 'left' as const,
            fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = item.danger
            ? 'rgba(239,68,68,0.06)'
            : isDark ? 'rgba(14,165,233,0.06)' : 'rgba(37,99,235,0.04)'
          }
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}