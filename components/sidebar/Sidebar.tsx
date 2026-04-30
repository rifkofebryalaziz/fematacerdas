'use client';

import React, { useState, useRef } from 'react';
import { Plus, ChevronLeft, MapPin } from 'lucide-react';
import { ChatHistory } from './ChatHistory';
import { ProfileMenu } from './ProfileMenu';
import { Chat, User } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onStarChat: (id: string) => void;
  onToggle: () => void;
  user: User;
  onOpenProfile: () => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  onOpenRecommendations: () => void;
}

export function Sidebar({ chats, activeChat, onNewChat, onSelectChat, onDeleteChat, onStarChat, onToggle, user, onOpenProfile, onOpenSettings, onLogout, onOpenRecommendations }: SidebarProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileButtonRef = useRef<HTMLButtonElement>(null);

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const getMenuPosition = () => {
    if (!profileButtonRef.current) return {};
    const rect = profileButtonRef.current.getBoundingClientRect();
    return {
      bottom: window.innerHeight - rect.top + 8,
      left: rect.left,
    };
  };

  return (
    <div style={{ width: '260px', background: isDark ? '#080F1E' : '#F8FAFC', borderRight: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: 'all 0.4s ease' }}>

      {/* HEADER */}
      <div style={{ borderBottom: `1px solid ${t.border}`, padding: '0 20px', height: '61px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <h1 style={{ fontSize: '16px', fontWeight: 700, color: t.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
          MataCerdas
        </h1>
        <button onClick={onToggle}
          style={{ background: 'none', border: `1.5px solid ${t.border}`, borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* ACTION BUTTONS */}
      <div style={{ padding: '14px 14px 8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button onClick={onNewChat}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 2px 10px ${t.accentGlow}`, transition: 'all 0.2s ease', fontFamily: 'inherit' }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          <Plus size={16} /> Chat Baru
        </button>

        <button onClick={onOpenRecommendations}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '10px', border: `1.5px solid ${t.border}`, background: 'transparent', color: t.textSecondary, fontSize: '14px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
        >
          <MapPin size={16} /> Rekomendasi
        </button>
      </div>

      {/* CHAT HISTORY */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        <ChatHistory chats={chats} activeChat={activeChat} onSelectChat={onSelectChat} onDeleteChat={onDeleteChat} onStarChat={onStarChat} />
      </div>

      {/* PROFILE */}
      <div style={{ padding: '10px 14px', borderTop: `1px solid ${t.border}`, flexShrink: 0 }}>
        <button
          ref={profileButtonRef}
          onClick={handleProfileClick}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '10px', border: 'none', background: showProfileMenu ? isDark ? 'rgba(14,165,233,0.06)' : 'rgba(37,99,235,0.04)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'inherit' }}
          onMouseEnter={(e) => e.currentTarget.style.background = isDark ? 'rgba(14,165,233,0.06)' : 'rgba(37,99,235,0.04)'}
          onMouseLeave={(e) => { if (!showProfileMenu) e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', boxShadow: `0 2px 8px ${t.accentGlow}` }}>
            {user.avatar
              ? <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{user.name.charAt(0).toUpperCase()}</span>
            }
          </div>
          <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: t.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</p>
            <p style={{ margin: 0, fontSize: '11px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</p>
          </div>
        </button>

        {showProfileMenu && (
          <ProfileMenu
            user={user}
            isOpen={showProfileMenu}
            onClose={() => setShowProfileMenu(false)}
            onOpenProfile={onOpenProfile}
            onOpenSettings={onOpenSettings}
            onLogout={onLogout}
            menuPosition={getMenuPosition()}
          />
        )}
      </div>
    </div>
  );
}