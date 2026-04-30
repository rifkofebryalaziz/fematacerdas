'use client';

import React, { useState } from 'react';
import { User, Copy, Check, ThumbsUp, ThumbsDown, FileText, Loader } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { copyToClipboard } from '@/lib/utils';
import { Message } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface MessageItemProps {
  message: Message;
  onRating?: (messageId: string, rating: 'up' | 'down') => void;
}

export function MessageItem({ message, onRating }: MessageItemProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await copyToClipboard(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRating = (value: 'up' | 'down') => {
    if (rating !== null) return;
    setRating(value);
    onRating?.(message.id, value);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        gap: '10px',
        padding: '12px 24px',
        alignItems: 'flex-start',
      }}
      className="group"
    >
      {/* Avatar */}
      <div style={{
        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isUser
          ? isDark ? '#1E3A5F' : '#E2E8F0'
          : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`,
        boxShadow: isUser ? 'none' : `0 2px 10px ${t.accentGlow}`,
      }}>
        {isUser ? (
          <User size={18} color={t.textSecondary} />
        ) : (
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>M</span>
        )}
      </div>

      {/* Bubble + content */}
      <div style={{
        maxWidth: '72%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>
        {/* Name label */}
        <span style={{
          fontSize: '12px', fontWeight: 600,
          color: isUser ? t.textSecondary : t.accent,
          marginBottom: '4px', letterSpacing: '0.2px',
        }}>
          {isUser ? 'Kamu' : 'MataCerdas'}
        </span>

        {/* Bubble */}
        <div style={{
          padding: '10px 14px',
          borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
          background: isUser
            ? isDark ? '#1E3A5F' : '#2563EB'
            : isDark ? 'rgba(14,165,233,0.08)' : 'rgba(37,99,235,0.06)',
          border: isUser ? 'none' : `1px solid ${t.border}`,
          color: isUser ? '#fff' : t.textPrimary,
          fontSize: '15px',
          lineHeight: 1.7,
          wordBreak: 'break-word',
        }}>
          {/* Loading state */}
          {message.isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: t.textSecondary }}>
              <Loader size={16} style={{ animation: 'spin 0.8s linear infinite' }} />
              <span style={{ fontSize: '14px' }}>MataCerdas sedang berpikir...</span>
            </div>
          ) : isUser ? (
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
          ) : (
            <ReactMarkdown
              components={{
                p: ({ children }) => <p style={{ margin: '0 0 8px', lineHeight: 1.7 }}>{children}</p>,
                strong: ({ children }) => <strong style={{ fontWeight: 700, color: isUser ? '#fff' : t.textPrimary }}>{children}</strong>,
                ul: ({ children }) => <ul style={{ margin: '6px 0', paddingLeft: '20px', listStyleType: 'disc' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ margin: '6px 0', paddingLeft: '20px', listStyleType: 'decimal' }}>{children}</ol>,
                li: ({ children }) => <li style={{ marginBottom: '4px', lineHeight: 1.6, display: 'list-item' }}>{children}</li>,
                h1: ({ children }) => <h1 style={{ fontSize: '17px', fontWeight: 700, margin: '8px 0 4px', color: t.textPrimary }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '8px 0 4px', color: t.textPrimary }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '6px 0 4px', color: t.textPrimary }}>{children}</h3>,
                code: ({ children }) => <code style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace' }}>{children}</code>,
                blockquote: ({ children }) => <blockquote style={{ borderLeft: `3px solid ${t.accent}`, paddingLeft: '12px', margin: '8px 0', opacity: 0.8 }}>{children}</blockquote>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Sumber Dokumen */}
        {!isUser && !message.isLoading && message.sources && message.sources.length > 0 && (
          <div style={{
            marginTop: '8px',
            padding: '8px 12px',
            borderRadius: '10px',
            background: isDark ? 'rgba(14,165,233,0.06)' : 'rgba(37,99,235,0.04)',
            border: `1px solid ${isDark ? 'rgba(14,165,233,0.15)' : 'rgba(37,99,235,0.12)'}`,
            width: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <FileText size={13} color={t.accent} />
              <span style={{ fontSize: '11px', fontWeight: 600, color: t.accent, letterSpacing: '0.3px', textTransform: 'uppercase' }}>
                Sumber Dokumen
              </span>
            </div>
            {message.sources.map((source, i) => (
              <div key={i} style={{
                fontSize: '12px', color: t.textSecondary,
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '2px 0',
              }}>
                <span style={{
                  width: '18px', height: '18px', borderRadius: '5px',
                  background: isDark ? 'rgba(14,165,233,0.15)' : 'rgba(37,99,235,0.1)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '10px', fontWeight: 700, color: t.accent, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <span style={{ color: t.textPrimary, fontWeight: 500 }}>
                  {source.filename.replace(/\+/g, ' ')}
                </span>
                <span style={{ color: t.accent, fontWeight: 600 }}>
                  {source.pages}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Copy button */}
        {!message.isLoading && (
          <button
            onClick={handleCopy}
            title="Salin"
            style={{
              marginTop: '4px', background: 'none',
              border: `1px solid ${t.border}`, borderRadius: '7px',
              padding: '3px 8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '5px',
              color: copied ? '#10B981' : t.textSecondary,
              fontSize: '11px', fontWeight: 500, transition: 'all 0.2s ease', opacity: 0,
            }}
            className="group-hover:opacity-100"
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = copied ? '#10B981' : t.textSecondary; }}
          >
            {copied ? <><Check size={12} /> Disalin</> : <><Copy size={12} /> Salin</>}
          </button>
        )}

        {/* Rating */}
        {!isUser && !message.isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
            {rating === null && (
              <span style={{ fontSize: '12px', color: t.textSecondary, opacity: 0.7 }}>
                Apakah jawaban ini membantu?
              </span>
            )}
            {rating === 'up' && (
              <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 500 }}>
                ✓ Terima kasih atas penilaian Anda!
              </span>
            )}
            {rating === 'down' && (
              <span style={{ fontSize: '12px', color: '#F87171', fontWeight: 500 }}>
                ✓ Terima kasih, kami akan terus meningkatkan kualitas jawaban.
              </span>
            )}

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleRating('up')}
                disabled={rating !== null}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '8px', border: 'none',
                  cursor: rating !== null ? 'default' : 'pointer',
                  fontSize: '12px', fontWeight: 500, transition: 'all 0.2s ease',
                  background: rating === 'up' ? 'rgba(16,185,129,0.12)' : rating === 'down' ? 'transparent' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  color: rating === 'up' ? '#10B981' : t.textSecondary,
                  opacity: rating === 'down' ? 0.3 : 1,
                  outline: rating === 'up' ? '1px solid rgba(16,185,129,0.3)' : `1px solid ${t.border}`,
                }}
                onMouseEnter={(e) => { if (rating === null) { e.currentTarget.style.background = 'rgba(16,185,129,0.1)'; e.currentTarget.style.color = '#10B981'; e.currentTarget.style.outline = '1px solid rgba(16,185,129,0.4)'; } }}
                onMouseLeave={(e) => { if (rating === null) { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.outline = `1px solid ${t.border}`; } }}
              >
                <ThumbsUp size={13} fill={rating === 'up' ? '#10B981' : 'none'} />
                Membantu
              </button>

              <button
                onClick={() => handleRating('down')}
                disabled={rating !== null}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '4px 10px', borderRadius: '8px', border: 'none',
                  cursor: rating !== null ? 'default' : 'pointer',
                  fontSize: '12px', fontWeight: 500, transition: 'all 0.2s ease',
                  background: rating === 'down' ? 'rgba(248,113,113,0.12)' : rating === 'up' ? 'transparent' : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                  color: rating === 'down' ? '#F87171' : t.textSecondary,
                  opacity: rating === 'up' ? 0.3 : 1,
                  outline: rating === 'down' ? '1px solid rgba(248,113,113,0.3)' : `1px solid ${t.border}`,
                }}
                onMouseEnter={(e) => { if (rating === null) { e.currentTarget.style.background = 'rgba(248,113,113,0.1)'; e.currentTarget.style.color = '#F87171'; e.currentTarget.style.outline = '1px solid rgba(248,113,113,0.4)'; } }}
                onMouseLeave={(e) => { if (rating === null) { e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.outline = `1px solid ${t.border}`; } }}
              >
                <ThumbsDown size={13} fill={rating === 'down' ? '#F87171' : 'none'} />
                Kurang
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}