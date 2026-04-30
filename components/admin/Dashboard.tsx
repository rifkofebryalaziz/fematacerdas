'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

function StatCard({ label, value, sub, icon, trendUp }: { label: string; value: string; sub: string; icon: string; trendUp?: boolean }) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  return (
    <div style={{
      background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px',
      padding: '20px', position: 'relative', overflow: 'hidden', transition: 'all 0.2s',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${t.accentGlow}`; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <div style={{ position: 'absolute', top: '18px', right: '18px', width: '38px', height: '38px', borderRadius: '10px', background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(37,99,235,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
        {icon}
      </div>
      <div style={{ fontSize: '10px', fontWeight: 600, color: t.textSecondary, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontSize: '32px', fontWeight: 800, color: t.textPrimary, letterSpacing: '-1px', lineHeight: 1, marginBottom: '8px' }}>{value}</div>
      <div style={{ fontSize: '12px', color: trendUp ? '#10B981' : t.textSecondary }}>{sub}</div>
    </div>
  );
}

function TopDocRow({ rank, title, category, count }: { rank: string; title: string; category: string; count: string }) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  return (
    <tr>
      <td style={{ padding: '13px 14px', fontSize: '13px', color: t.accent, fontWeight: 700, borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(37,99,235,0.05)'}` }}>{rank}</td>
      <td style={{ padding: '13px 14px', fontSize: '13px', color: t.textPrimary, fontWeight: 500, borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(37,99,235,0.05)'}` }}>{title}</td>
      <td style={{ padding: '13px 14px', borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(37,99,235,0.05)'}` }}>
        <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(14,165,233,0.1)', color: t.accent }}>{category}</span>
      </td>
      <td style={{ padding: '13px 14px', fontSize: '13px', color: t.textPrimary, fontWeight: 500, borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(37,99,235,0.05)'}` }}>{count}</td>
      <td style={{ padding: '13px 14px', borderBottom: `1px solid ${isDark ? 'rgba(14,165,233,0.05)' : 'rgba(37,99,235,0.05)'}` }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>● Aktif</span>
      </td>
    </tr>
  );
}

export function Dashboard() {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        <StatCard label="User Aktif Hari Ini" value="248" sub="↑ 12% dari kemarin" icon="👥" trendUp />
        <StatCard label="Total Chat Bulan Ini" value="4.2K" sub="↑ 8% dari bulan lalu" icon="💬" trendUp />
        <StatCard label="Rata-rata Rating AI" value="87%" sub="👍 1.840  👎 274" icon="⭐" trendUp />
        <StatCard label="Dokumen RAG Aktif" value="36" sub="2 sedang diproses" icon="📄" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
        {/* Usage Chart */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: t.textPrimary }}>Grafik Penggunaan Harian</div>
            <select style={{ background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '8px', padding: '5px 10px', color: t.textSecondary, fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
              <option>7 Hari Terakhir</option>
              <option>30 Hari</option>
            </select>
          </div>
          {/* Simple Bar Chart */}
          {[
            { day: 'Sen', chat: 180, user: 95 },
            { day: 'Sel', chat: 240, user: 140 },
            { day: 'Rab', chat: 195, user: 110 },
            { day: 'Kam', chat: 310, user: 180 },
            { day: 'Jum', chat: 280, user: 160 },
            { day: 'Sab', chat: 190, user: 105 },
            { day: 'Min', chat: 248, user: 135 },
          ].map((d) => (
            <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ width: '28px', fontSize: '11px', color: t.textSecondary, flexShrink: 0 }}>{d.day}</div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{ height: '8px', borderRadius: '4px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(d.chat / 310) * 100}%`, background: `linear-gradient(90deg, ${t.accent}, ${t.accentHover})`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(d.user / 310) * 100}%`, background: 'linear-gradient(90deg, #10B981, #34d399)', borderRadius: '3px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
              <div style={{ width: '28px', fontSize: '11px', color: t.textSecondary, textAlign: 'right', flexShrink: 0 }}>{d.chat}</div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: t.textSecondary }}>
              <div style={{ width: '10px', height: '3px', borderRadius: '2px', background: t.accent }} /> Chat
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: t.textSecondary }}>
              <div style={{ width: '10px', height: '3px', borderRadius: '2px', background: '#10B981' }} /> User Aktif
            </div>
          </div>
        </div>

        {/* Rating */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: t.textPrimary, marginBottom: '18px' }}>Rating Jawaban AI</div>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: 800, color: t.textPrimary, letterSpacing: '-2px', lineHeight: 1 }}>87<span style={{ fontSize: '22px', color: t.textSecondary }}>%</span></div>
            <div style={{ fontSize: '12px', color: t.textSecondary, marginTop: '4px' }}>Kepuasan User</div>
          </div>
          {[
            { label: '👍 Membantu', pct: 87, color: '#10B981' },
            { label: '👎 Kurang', pct: 13, color: '#F43F5E' },
          ].map((r) => (
            <div key={r.label} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ fontSize: '12px', color: t.textSecondary }}>{r.label}</span>
                <span style={{ fontSize: '12px', color: t.textSecondary }}>{r.pct}%</span>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${r.pct}%`, background: r.color, borderRadius: '3px', transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '16px' }}>
            {[{ v: '1.840', l: '👍 Total' }, { v: '274', l: '👎 Total' }].map((s) => (
              <div key={s.l} style={{ padding: '10px', background: isDark ? 'rgba(14,165,233,0.04)' : 'rgba(37,99,235,0.03)', borderRadius: '10px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: t.textPrimary }}>{s.v}</div>
                <div style={{ fontSize: '10px', color: t.textSecondary }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Documents Table */}
      <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: t.textPrimary }}>Dokumen RAG Paling Sering Dirujuk</div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9px', border: `1px solid ${t.border}`, background: 'transparent', color: t.textSecondary, fontSize: '12px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
          >
            Lihat Semua
          </button>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['#', 'Nama Dokumen', 'Kategori', 'Dirujuk', 'Status'].map((h) => (
                  <th key={h} style={{ fontSize: '10px', fontWeight: 600, color: t.textSecondary, letterSpacing: '1px', textTransform: 'uppercase', padding: '10px 14px', textAlign: 'left', borderBottom: `1px solid ${t.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <TopDocRow rank="01" title="Panduan Klinis Glaukoma 2024" category="Panduan Klinis" count="1.284 kali" />
              <TopDocRow rank="02" title="Jurnal Retinopati Diabetik" category="Jurnal Medis" count="987 kali" />
              <TopDocRow rank="03" title="Buku Anatomi Mata Lengkap" category="Buku Referensi" count="756 kali" />
              <TopDocRow rank="04" title="Penanganan Katarak Primer" category="Panduan Klinis" count="634 kali" />
              <TopDocRow rank="05" title="Standar Pemeriksaan Visus" category="Jurnal Medis" count="521 kali" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}