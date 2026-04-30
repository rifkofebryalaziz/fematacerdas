'use client';

import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { createClient } from '@/lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: { filename: string; pages: string }[];
}

interface Chat {
  id: string;
  title: string;
}

export default function SharePage({ params }: { params: Promise<{ shareId: string }> }) {
  const { shareId } = React.use(params);
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const loadSharedChat = async () => {
      try {
        const { data: chatData, error: chatError } = await supabase
          .from('chats')
          .select('*')
          .eq('share_id', shareId)
          .eq('is_public', true)
          .single();

        if (chatError || !chatData) {
          setNotFound(true);
          return;
        }

        setChat({ id: chatData.id, title: chatData.title });

        const { data: messagesData } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatData.id)
          .order('created_at', { ascending: true });

        setMessages((messagesData || []).map((m) => ({
          id: m.id,
          role: m.role,
          content: m.content,
          sources: m.sources || [],
        })));
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    loadSharedChat();
  }, [shareId]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1426', fontFamily: "'DM Sans', sans-serif" }}>
        <p style={{ color: '#94a3b8', fontSize: '15px' }}>Memuat percakapan...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0B1426', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#f1f5f9', fontSize: '24px', marginBottom: '12px' }}>Percakapan tidak ditemukan</h2>
          <p style={{ color: '#94a3b8', fontSize: '15px' }}>Link ini mungkin sudah tidak valid atau tidak tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0B1426', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>M</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#f1f5f9' }}>MataCerdas</p>
            <p style={{ margin: 0, fontSize: '11px', color: '#64748b' }}>Percakapan Publik</p>
          </div>
        </div>
        <a href="/" style={{ padding: '8px 16px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', color: '#fff', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
          Coba MataCerdas
        </a>
      </div>

      {/* Chat title */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '32px 24px 16px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px', letterSpacing: '-0.5px' }}>
          {chat?.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>
          {messages.length} pesan
        </p>
      </div>

      {/* Messages */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 48px' }}>
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div key={message.id} style={{ display: 'flex', flexDirection: isUser ? 'row-reverse' : 'row', gap: '10px', padding: '10px 0', alignItems: 'flex-start' }}>
              {/* Avatar */}
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: isUser ? '#1E3A5F' : 'linear-gradient(135deg, #0ea5e9, #2563eb)' }}>
                {isUser
                  ? <span style={{ color: '#94a3b8', fontSize: '14px' }}>👤</span>
                  : <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>M</span>
                }
              </div>

              <div style={{ maxWidth: '72%', display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: isUser ? '#64748b' : '#0ea5e9', marginBottom: '4px' }}>
                  {isUser ? 'Pengguna' : 'MataCerdas'}
                </span>

                <div style={{ padding: '10px 14px', borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: isUser ? '#1E3A5F' : 'rgba(14,165,233,0.08)', border: isUser ? 'none' : '1px solid rgba(255,255,255,0.08)', color: isUser ? '#fff' : '#e2e8f0', fontSize: '14px', lineHeight: 1.7, wordBreak: 'break-word' }}>
                  {isUser ? (
                    <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
                  ) : (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p style={{ margin: '0 0 8px', lineHeight: 1.7 }}>{children}</p>,
                        strong: ({ children }) => <strong style={{ fontWeight: 700, color: '#f1f5f9' }}>{children}</strong>,
                        ul: ({ children }) => <ul style={{ margin: '6px 0', paddingLeft: '20px' }}>{children}</ul>,
                        ol: ({ children }) => <ol style={{ margin: '6px 0', paddingLeft: '20px' }}>{children}</ol>,
                        li: ({ children }) => <li style={{ marginBottom: '4px', lineHeight: 1.6 }}>{children}</li>,
                        h1: ({ children }) => <h1 style={{ fontSize: '17px', fontWeight: 700, margin: '8px 0 4px', color: '#f1f5f9' }}>{children}</h1>,
                        h2: ({ children }) => <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '8px 0 4px', color: '#f1f5f9' }}>{children}</h2>,
                        h3: ({ children }) => <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '6px 0 4px', color: '#f1f5f9' }}>{children}</h3>,
                        code: ({ children }) => <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px', fontFamily: 'monospace' }}>{children}</code>,
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  )}
                </div>

                {/* Sumber */}
                {!isUser && message.sources && message.sources.length > 0 && (
                  <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '10px', background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)' }}>
                    <p style={{ margin: '0 0 6px', fontSize: '11px', fontWeight: 600, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.3px' }}>Sumber Dokumen</p>
                    {message.sources.map((source, i) => (
                      <div key={i} style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ color: '#0ea5e9', fontWeight: 600, flexShrink: 0 }}>{i + 1}.</span>
                        <span>{source.filename.replace(/\+/g, ' ')}</span>
                        <span style={{ color: '#0ea5e9', fontWeight: 600 }}>{source.pages}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}