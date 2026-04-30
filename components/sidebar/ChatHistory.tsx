'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Star, Trash2, MoreVertical } from 'lucide-react';
import { Chat } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface ChatHistoryItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  onStar: (id: string) => void;
}

function ChatHistoryItem({ chat, isActive, onClick, onDelete, onStar }: ChatHistoryItemProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      style={{
        position: 'relative',
        padding: '8px 10px',
        borderRadius: '10px',
        cursor: 'pointer',
        background: isActive ? isDark ? 'rgba(14,165,233,0.1)' : 'rgba(37,99,235,0.08)' : 'transparent',
        transition: 'all 0.2s ease',
        marginBottom: '2px',
      }}
      onClick={onClick}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
        <span style={{
          fontSize: '13px', color: isActive ? t.accent : t.textPrimary,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          flex: 1, fontWeight: isActive ? 600 : 400,
        }}>
          {chat.starred && <Star size={11} style={{ marginRight: '5px', color: '#FBBF24', fill: '#FBBF24', display: 'inline' }} />}
          {chat.title}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', borderRadius: '5px', color: t.textSecondary, display: 'flex', alignItems: 'center', opacity: 0.6, flexShrink: 0 }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
          <MoreVertical size={14} />
        </button>
      </div>

      {showDropdown && (
        <div
          ref={dropdownRef}
          style={{
            position: 'absolute', right: '8px', top: '100%', marginTop: '4px',
            background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 50, width: '160px', overflow: 'hidden',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            style={{ width: '100%', padding: '9px 14px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: chat.starred ? '#FBBF24' : t.textPrimary, display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s' }}
            onClick={() => { onStar(chat.id); setShowDropdown(false); }}
            onMouseEnter={(e) => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Star size={14} fill={chat.starred ? '#FBBF24' : 'none'} color={chat.starred ? '#FBBF24' : t.textSecondary} />
            {chat.starred ? 'Hapus Bintang' : 'Beri Bintang'}
          </button>
          <button
            style={{ width: '100%', padding: '9px 14px', textAlign: 'left', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.15s' }}
            onClick={() => { onDelete(chat.id); setShowDropdown(false); }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={14} />
            Hapus Chat
          </button>
        </div>
      )}
    </div>
  );
}

interface ChatHistoryProps {
  chats: Chat[];
  activeChat: string | null;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onStarChat: (id: string) => void;
}

export function ChatHistory({ chats, activeChat, onSelectChat, onDeleteChat, onStarChat }: ChatHistoryProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const starredChats = chats.filter((c) => c.starred);
  const recentChats = chats.filter((c) => !c.starred);

  const sectionLabel = (label: string) => (
    <p style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, letterSpacing: '0.5px', textTransform: 'uppercase', padding: '8px 10px 4px', margin: 0, opacity: 0.7 }}>
      {label}
    </p>
  );

  return (
    <>
      {starredChats.length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          {sectionLabel('Berbintang')}
          {starredChats.map((chat) => (
            <ChatHistoryItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => onSelectChat(chat.id)}
              onDelete={onDeleteChat}
              onStar={onStarChat}
            />
          ))}
        </div>
      )}

      {recentChats.length > 0 && (
        <div>
          {sectionLabel('Terbaru')}
          {recentChats.map((chat) => (
            <ChatHistoryItem
              key={chat.id}
              chat={chat}
              isActive={activeChat === chat.id}
              onClick={() => onSelectChat(chat.id)}
              onDelete={onDeleteChat}
              onStar={onStarChat}
            />
          ))}
        </div>
      )}

      {chats.length === 0 && (
        <p style={{ fontSize: '13px', color: t.textSecondary, textAlign: 'center', padding: '24px 16px', opacity: 0.6 }}>
          Belum ada riwayat chat
        </p>
      )}
    </>
  );
}