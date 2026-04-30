'use client';

import React, { useRef, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { Message } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface MessageListProps {
  messages: Message[];
  isLoadingMessages?: boolean;
}

export function MessageList({ messages, isLoadingMessages = false }: MessageListProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      background: t.bg,
      transition: 'background 0.4s ease',
    }}>
      {/* Loading state — cegah welcome screen muncul saat fetch messages */}
      {isLoadingMessages ? (
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Loader size={28} color={t.accent} style={{ animation: 'spin 0.8s linear infinite' }} />
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : messages.length === 0 ? (
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '420px' }}>
            <h2 style={{
              fontSize: '24px', fontWeight: 700,
              color: t.textPrimary, margin: '0 0 10px',
              letterSpacing: '-0.5px', lineHeight: 1.2,
            }}>
              Selamat Datang di MataCerdas
            </h2>
            <p style={{
              color: t.textSecondary, fontSize: '15px',
              lineHeight: 1.7, margin: '0 0 6px',
            }}>
              Tanyakan apa saja tentang kesehatan mata Anda.
            </p>
            <p style={{ color: t.textSecondary, fontSize: '15px', lineHeight: 1.7, margin: 0 }}>
              Saya siap membantu dengan informasi dan saran yang tepat.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginTop: '28px' }}>
              {['Apa itu mata minus?', 'Cara menjaga kesehatan mata', 'Gejala katarak', 'Tips mengurangi mata lelah'].map((suggestion) => (
                <span key={suggestion} style={{
                  padding: '8px 14px', borderRadius: '20px',
                  border: `1px solid ${t.border}`,
                  color: t.textSecondary, fontSize: '13px',
                  background: t.card, cursor: 'default',
                  transition: 'all 0.2s ease',
                }}>
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {messages.map((message, index) => (
            <MessageItem key={index} message={message} />
          ))}
          <div ref={messagesEndRef} style={{ height: '24px' }} />
        </div>
      )}
    </div>
  );
}