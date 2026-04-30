'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const canSend = !!input.trim();

  return (
    <div style={{
      padding: '12px 0 24px',
      background: 'transparent',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end' }}>

          {/* Textarea */}
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 160) + 'px';
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Tulis pesan Anda..."
            rows={1}
            style={{
              width: '100%',
              boxSizing: 'border-box' as const,
              padding: '13px 52px 13px 20px',
              background: isDark ? '#132338' : '#FFFFFF',
              border: 'none',
              borderRadius: '14px',
              color: t.textPrimary,
              fontSize: '15px',
              outline: 'none',
              transition: 'background 0.2s ease',
              fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
              resize: 'none',
              overflow: 'hidden',
              lineHeight: '1.6',
              minHeight: '50px',
              maxHeight: '160px',
              display: 'block',
            }}
            onFocus={(e) => e.target.style.background = isDark ? '#172B42' : '#F0F7FF'}
            onBlur={(e) => e.target.style.background = isDark ? '#132338' : '#FFFFFF'}
          />

          {/* Send button */}
          <button type="button" onClick={handleSubmit} disabled={!canSend}
            style={{
              position: 'absolute', right: '10px', bottom: '8px',
              width: '36px', height: '36px', borderRadius: '10px',
              background: canSend ? `linear-gradient(135deg, ${t.accent}, ${t.accentHover})` : 'transparent',
              border: canSend ? 'none' : `1.5px solid ${t.border}`,
              cursor: canSend ? 'pointer' : 'not-allowed',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: canSend ? '#fff' : t.textSecondary,
              boxShadow: canSend ? `0 2px 10px ${t.accentGlow}` : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <style>{`textarea::placeholder { color: ${t.textSecondary}; opacity: 0.6; } textarea::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}