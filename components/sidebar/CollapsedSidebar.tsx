'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, ChevronRight, Settings, User as UserIcon, LogOut, MapPin } from 'lucide-react';
import { User } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface CollapsedSidebarProps {
  onToggle: () => void;
  onNewChat: () => void;
  user: User;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenRecommendations: () => void;
}

export function CollapsedSidebar({ onToggle, onNewChat, user, onOpenProfile, onOpenSettings, onLogout, onOpenRecommendations }: CollapsedSidebarProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const iconBtn = (onClick: () => void, icon: React.ReactNode, title: string, accent = false) => (
    <button type="button" onClick={onClick} title={title}
      style={{ width: '40px', height: '40px', borderRadius: '10px', border: accent ? 'none' : `1.5px solid ${t.border}`, background: accent ? `linear-gradient(135deg, ${t.accent}, ${t.accentHover})` : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: accent ? '#fff' : t.textSecondary, transition: 'all 0.2s ease', boxShadow: accent ? `0 2px 10px ${t.accentGlow}` : 'none' }}
      onMouseEnter={(e) => { if (!accent) { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; } }}
      onMouseLeave={(e) => { if (!accent) { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; } }}
    >
      {icon}
    </button>
  );

  return (
    <div style={{ width: '64px', background: isDark ? '#080F1E' : '#F8FAFC', borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', height: '100vh', alignItems: 'center', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: 'all 0.4s ease' }}>

      {/* HEADER */}
      <div style={{ width: '100%', borderBottom: `1px solid ${t.border}`, height: '61px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {iconBtn(onToggle, <ChevronRight size={16} />, 'Buka Sidebar')}
      </div>

      {/* BUTTONS */}
      <div style={{ padding: '14px 0 8px', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
        {iconBtn(onNewChat, <Plus size={16} />, 'Chat Baru', true)}
        {iconBtn(onOpenRecommendations, <MapPin size={16} />, 'Rekomendasi Terdekat')}
      </div>

      <div style={{ flex: 1 }} />

      {/* PROFILE */}
      <div style={{ padding: '12px 0', position: 'relative', display: 'flex', justifyContent: 'center', borderTop: `1px solid ${t.border}`, width: '100%' }} ref={profileRef}>
        <button type="button" onClick={() => setShowProfileMenu(!showProfileMenu)} title={user.name}
          style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', overflow: 'hidden', boxShadow: `0 2px 8px ${t.accentGlow}` }}
        >
          {user.avatar ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{user.name.charAt(0).toUpperCase()}</span>}
        </button>

        {showProfileMenu && (
          <div style={{ position: 'absolute', bottom: '100%', left: '12px', marginBottom: '8px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '14px', boxShadow: t.cardShadow, overflow: 'hidden', width: '200px', zIndex: 50 }}>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${t.border}` }}>
              <p style={{ margin: '0 0 2px', fontSize: '13px', fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
              <p style={{ margin: 0, fontSize: '11px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
            </div>
            {[
              { icon: <Settings size={15} />, label: 'Pengaturan', onClick: () => { onOpenSettings(); setShowProfileMenu(false); }, danger: false },
              { icon: <UserIcon size={15} />, label: 'Profil', onClick: () => { onOpenProfile(); setShowProfileMenu(false); }, danger: false },
              { icon: <LogOut size={15} />, label: 'Keluar', onClick: onLogout, danger: true },
            ].map((item) => (
              <button key={item.label} type="button" onClick={item.onClick}
                style={{ width: '100%', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: item.danger ? '#EF4444' : t.textPrimary, transition: 'all 0.15s ease', textAlign: 'left' as const }}
                onMouseEnter={(e) => e.currentTarget.style.background = isDark ? 'rgba(14,165,233,0.06)' : 'rgba(37,99,235,0.04)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                {item.icon}{item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}