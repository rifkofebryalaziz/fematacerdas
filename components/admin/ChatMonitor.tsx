'use client';

import React, { useState } from 'react';
import { Search, Download, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

type ChatFlag = 'normal' | 'berbahaya' | 'tidak-terjawab';

interface ChatItem {
  id: string;
  user: string;
  userColor: string;
  preview: string;
  flag: ChatFlag;
  time: string;
  msgCount: number;
  rating?: string;
}

const MOCK_CHATS: ChatItem[] = [
  { id: '1', user: 'Dewi Kusuma', userColor: '#10B981', preview: 'Mata saya tiba-tiba gelap sebelah kiri, apakah normal?', flag: 'berbahaya', time: '3 jam lalu', msgCount: 12 },
  { id: '2', user: 'Ahmad Rifai', userColor: '#0EA5E9', preview: 'Apa efek samping operasi LASIK untuk miopi tinggi di atas -10?', flag: 'tidak-terjawab', time: '1 jam lalu', msgCount: 8 },
  { id: '3', user: 'Siti Rahayu', userColor: '#8B5CF6', preview: 'Bagaimana cara merawat mata setelah operasi katarak?', flag: 'normal', time: '2 hari lalu', msgCount: 24, rating: '👍 Membantu' },
  { id: '4', user: 'Budi Santoso', userColor: '#F59E0B', preview: 'Apa gejala awal glaukoma yang perlu diwaspadai?', flag: 'normal', time: '3 hari lalu', msgCount: 6, rating: '👍 Membantu' },
  { id: '5', user: 'Hendra Wijaya', userColor: '#F43F5E', preview: 'Apakah tekanan mata tinggi selalu berarti glaukoma?', flag: 'tidak-terjawab', time: '5 jam lalu', msgCount: 4 },
];

const flagBadge = (flag: ChatFlag) => {
  const map = {
    normal: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', label: '✓ Normal' },
    berbahaya: { bg: 'rgba(244,63,94,0.1)', color: '#F43F5E', label: '⚠ Berbahaya' },
    'tidak-terjawab': { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: '❓ Tidak Terjawab' },
  };
  const s = map[flag];
  return <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
};

export function ChatMonitor() {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [search, setSearch] = useState('');
  const [filterFlag, setFilterFlag] = useState('semua');

  const filtered = MOCK_CHATS.filter(c => {
    const matchSearch = c.user.toLowerCase().includes(search.toLowerCase()) || c.preview.toLowerCase().includes(search.toLowerCase());
    const matchFlag = filterFlag === 'semua' || c.flag === filterFlag;
    return matchSearch && matchFlag;
  });

  const berbahayaCount = MOCK_CHATS.filter(c => c.flag === 'berbahaya').length;
  const tidakTerjawabCount = MOCK_CHATS.filter(c => c.flag === 'tidak-terjawab').length;

  return (
    <div>
      {/* Alert */}
      {berbahayaCount > 0 && (
        <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '14px', padding: '14px 18px', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <AlertTriangle size={18} color="#F43F5E" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#F43F5E' }}>{berbahayaCount} chat ditandai berpotensi berbahaya</div>
            <div style={{ fontSize: '12px', color: t.textSecondary }}>Mengandung pertanyaan yang membutuhkan perhatian medis segera</div>
          </div>
          <button style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.08)', color: '#F43F5E', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            Tinjau Sekarang
          </button>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Chat', value: String(MOCK_CHATS.length), color: t.accent },
          { label: '⚠ Berbahaya', value: String(berbahayaCount), color: '#F43F5E' },
          { label: '❓ Tidak Terjawab', value: String(tidakTerjawabCount), color: '#F59E0B' },
        ].map((s) => (
          <div key={s.label} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '16px 20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: t.textSecondary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '8px' }}>{s.label}</div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: s.color, letterSpacing: '-1px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '10px', padding: '9px 14px' }}>
          <Search size={14} color={t.textSecondary} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari percakapan..."
            style={{ background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: '13px', flex: 1, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} />
        </div>
        <select value={filterFlag} onChange={(e) => setFilterFlag(e.target.value)}
          style={{ background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '9px', padding: '9px 12px', color: t.textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          <option value="semua">Semua Chat</option>
          <option value="berbahaya">⚠ Berbahaya</option>
          <option value="tidak-terjawab">❓ Tidak Terjawab</option>
          <option value="normal">✓ Normal</option>
        </select>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 16px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 2px 10px ${t.accentGlow}`, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
          <Download size={14} /> Export PDF
        </button>
      </div>

      {/* Chat List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filtered.map((chat) => (
          <div key={chat.id}
            style={{ background: t.card, border: `1px solid ${chat.flag === 'berbahaya' ? 'rgba(244,63,94,0.2)' : t.border}`, borderRadius: '14px', padding: '16px', display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = chat.flag === 'berbahaya' ? 'rgba(244,63,94,0.4)' : t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = chat.flag === 'berbahaya' ? 'rgba(244,63,94,0.2)' : t.border; }}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: `linear-gradient(135deg, ${chat.userColor}, ${chat.userColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>{chat.user[0]}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '13.5px', fontWeight: 600, color: t.textPrimary }}>{chat.user}</span>
                {flagBadge(chat.flag)}
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: t.textSecondary }}>{chat.time}</span>
              </div>
              <div style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                "{chat.preview}"
              </div>
              <div style={{ fontSize: '11px', color: t.textSecondary, opacity: 0.7 }}>
                {chat.msgCount} pesan
                {chat.rating && ` · Rating: ${chat.rating}`}
                {chat.flag === 'tidak-terjawab' && ' · RAG tidak menemukan referensi yang relevan'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}