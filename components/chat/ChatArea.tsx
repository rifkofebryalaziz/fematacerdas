'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface ChatAreaProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  chatTitle: string;
  onShare: () => void;
  isLoadingMessages?: boolean;
}

export function ChatArea({ messages, onSendMessage, chatTitle, onShare, isLoadingMessages = false }: ChatAreaProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: t.bg,
      transition: 'background 0.4s ease',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${t.border}`,
        padding: '0 24px',
        height: '61px',
        display: 'flex',
        flexShrink: 0,
        alignItems: 'center',
        justifyContent: 'space-between',
        background: t.card,
        transition: 'all 0.4s ease',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`,
            boxShadow: `0 0 8px ${t.accentGlow}`,
          }} />
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: t.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
            {chatTitle || 'Chat Baru'}
          </h2>
        </div>

        <button onClick={onShare}
          style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '10px', border: `1.5px solid ${t.border}`, background: 'transparent', color: t.textSecondary, cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s ease', fontFamily: 'inherit' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; e.currentTarget.style.background = isDark ? 'rgba(14,165,233,0.08)' : 'rgba(37,99,235,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.background = 'transparent'; }}
        >
          <Share2 size={15} />
          <span>Bagikan</span>
        </button>
      </div>

      {/* Messages */}
      <MessageList messages={messages} isLoadingMessages={isLoadingMessages} />

      {/* Input */}
      <MessageInput onSendMessage={onSendMessage} />
    </div>
  );
}