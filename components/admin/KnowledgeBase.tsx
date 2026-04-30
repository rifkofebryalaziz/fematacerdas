'use client';

import React, { useState, useRef } from 'react';
import { Upload, Search, FileText, Trash2, Eye, RefreshCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

type DocStatus = 'aktif' | 'proses' | 'gagal';

interface Doc {
  id: string;
  title: string;
  category: string;
  pages: number;
  size: string;
  uploadDate: string;
  status: DocStatus;
  chunks: number;
  referred: number;
  progress?: number;
  previewText?: string;
}

const MOCK_DOCS: Doc[] = [
  { id: '1', title: 'Panduan Klinis Glaukoma 2024', category: 'Panduan Klinis', pages: 48, size: '3.2 MB', uploadDate: '12 Jan 2025', status: 'aktif', chunks: 192, referred: 1284, previewText: 'BAB 1 — Pendahuluan\n\nGlaukoma merupakan penyebab kebutaan kedua terbanyak di dunia setelah katarak. Penyakit ini ditandai dengan kerusakan progresif pada saraf optik yang sering dikaitkan dengan peningkatan tekanan intraokular (TIO)...\n\nBAB 2 — Epidemiologi\n\nPrevalensi glaukoma di Indonesia diperkirakan mencapai 2-3% dari populasi dewasa di atas usia 40 tahun.' },
  { id: '2', title: 'Jurnal Retinopati Diabetik', category: 'Jurnal Medis', pages: 24, size: '1.8 MB', uploadDate: '5 Jan 2025', status: 'aktif', chunks: 96, referred: 987, previewText: 'Abstrak\n\nRetinopati diabetik merupakan komplikasi mikrovaskular diabetes melitus yang menjadi penyebab utama kebutaan pada populasi usia produktif. Penelitian ini bertujuan untuk mengevaluasi efektivitas...' },
  { id: '3', title: 'Standar Pemeriksaan Visus', category: 'Jurnal Medis', pages: 32, size: '2.1 MB', uploadDate: 'Baru diupload', status: 'proses', chunks: 0, referred: 0, progress: 65 },
  { id: '4', title: 'Laporan Scan Fundus.pdf', category: '-', pages: 0, size: '4.5 MB', uploadDate: '20 Jan 2025', status: 'gagal', chunks: 0, referred: 0 },
];

const statusBadge = (status: DocStatus) => {
  const map = {
    aktif: { bg: 'rgba(16,185,129,0.1)', color: '#10B981', label: '● Aktif' },
    proses: { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', label: '⏳ Proses' },
    gagal: { bg: 'rgba(244,63,94,0.1)', color: '#F43F5E', label: '✕ Gagal' },
  };
  const s = map[status];
  return <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: s.bg, color: s.color }}>{s.label}</span>;
};

export function KnowledgeBase() {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('semua');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filtered = MOCK_DOCS.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'semua' || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const inputStyle = { background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '9px', padding: '8px 12px', color: t.textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", transition: 'border-color 0.2s' };

  return (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>

      {/* Left */}
      <div style={{ flex: 1 }}>
        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{ border: `2px dashed ${t.border}`, borderRadius: '16px', padding: '36px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', marginBottom: '20px' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = isDark ? 'rgba(14,165,233,0.04)' : 'rgba(37,99,235,0.03)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.background = 'transparent'; }}
        >
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: `0 4px 16px ${t.accentGlow}` }}>
            <Upload size={24} color="white" />
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: t.textPrimary, marginBottom: '6px' }}>Upload Dokumen Baru</div>
          <div style={{ fontSize: '13px', color: t.textSecondary, marginBottom: '14px' }}>PDF jurnal medis, panduan klinis, buku referensi</div>
          <button style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 2px 10px ${t.accentGlow}` }}>
            <FileText size={14} /> Pilih File PDF
          </button>
          <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: 'none' }} />
          <div style={{ fontSize: '11px', color: t.textSecondary, marginTop: '10px', opacity: 0.6 }}>Maks. 50MB · Hanya format PDF</div>
        </div>

        {/* Search + Filter */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '10px', padding: '9px 14px', transition: 'border-color 0.2s' }}
            onFocus={() => {}} >
            <Search size={14} color={t.textSecondary} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari dokumen..." style={{ background: 'none', border: 'none', outline: 'none', color: t.textPrimary, fontSize: '13px', flex: 1, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={inputStyle}>
            <option value="semua">Semua Status</option>
            <option value="aktif">Aktif</option>
            <option value="proses">Proses</option>
            <option value="gagal">Gagal</option>
          </select>
        </div>

        {/* Doc List */}
        {filtered.map((doc) => (
          <div key={doc.id}
            onClick={() => setSelectedDoc(doc)}
            style={{ background: t.card, border: `1px solid ${selectedDoc?.id === doc.id ? t.accent : t.border}`, borderRadius: '14px', padding: '16px', marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { if (selectedDoc?.id !== doc.id) e.currentTarget.style.borderColor = 'rgba(14,165,233,0.3)'; }}
            onMouseLeave={(e) => { if (selectedDoc?.id !== doc.id) e.currentTarget.style.borderColor = t.border; }}
          >
            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: isDark ? 'rgba(14,165,233,0.08)' : 'rgba(37,99,235,0.06)', border: `1px solid ${isDark ? 'rgba(14,165,233,0.15)' : 'rgba(37,99,235,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>
              {doc.status === 'gagal' ? '⚠️' : '📄'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: t.textPrimary }}>{doc.title}</span>
                {statusBadge(doc.status)}
              </div>
              <div style={{ fontSize: '12px', color: t.textSecondary, marginBottom: '4px' }}>
                {doc.category} · {doc.pages > 0 ? `${doc.pages} halaman · ` : ''}{doc.size} · {doc.uploadDate}
              </div>
              {doc.status === 'aktif' && (
                <div style={{ fontSize: '12px', color: t.textSecondary, opacity: 0.7 }}>
                  Dirujuk {doc.referred} kali · {doc.chunks} chunks
                </div>
              )}
              {doc.status === 'proses' && (
                <>
                  <div style={{ height: '4px', borderRadius: '2px', background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden', marginTop: '6px' }}>
                    <div style={{ height: '100%', width: `${doc.progress}%`, background: `linear-gradient(90deg, ${t.accent}, ${t.accentHover})`, borderRadius: '2px' }} />
                  </div>
                  <div style={{ fontSize: '11px', color: t.textSecondary, marginTop: '4px' }}>Memproses embedding... {doc.progress}%</div>
                </>
              )}
              {doc.status === 'gagal' && (
                <div style={{ fontSize: '12px', color: '#F43F5E' }}>⚠ File berbasis gambar, OCR gagal membaca teks</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
              {doc.status === 'aktif' && (
                <button onClick={(e) => { e.stopPropagation(); setSelectedDoc(doc); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', border: `1px solid ${t.border}`, background: 'transparent', color: t.textSecondary, fontSize: '11px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
                >
                  <Eye size={12} /> Preview
                </button>
              )}
              {doc.status === 'gagal' && (
                <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(14,165,233,0.2)', background: 'rgba(14,165,233,0.08)', color: t.accent, fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  <RefreshCw size={12} /> Retry OCR
                </button>
              )}
              <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '8px', border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.08)', color: '#F43F5E', fontSize: '11px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                <Trash2 size={12} /> Hapus
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Right: Preview Panel */}
      <div style={{ width: '300px', flexShrink: 0, position: 'sticky', top: '0' }}>
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: t.textPrimary, marginBottom: '16px' }}>📋 Preview Dokumen</div>
          {!selectedDoc ? (
            <div style={{ fontSize: '13px', color: t.textSecondary, textAlign: 'center', padding: '30px 0', opacity: 0.6 }}>
              Klik dokumen untuk melihat preview hasil parsing
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: t.textPrimary }}>{selectedDoc.title}</div>
                <div style={{ fontSize: '11px', color: t.textSecondary, marginTop: '2px' }}>Hasil ekstraksi teks</div>
              </div>
              <div style={{ background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '10px', padding: '14px', fontSize: '12px', color: t.textSecondary, lineHeight: 1.8, maxHeight: '200px', overflowY: 'auto', marginBottom: '14px', whiteSpace: 'pre-wrap' }}>
                {selectedDoc.previewText || 'Tidak ada preview tersedia.'}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { v: String(selectedDoc.pages), l: 'Halaman' },
                  { v: String(selectedDoc.chunks), l: 'Chunks' },
                  { v: selectedDoc.status === 'aktif' ? '✓' : '✕', l: 'Terverif.' },
                ].map((s) => (
                  <div key={s.l} style={{ padding: '10px', background: isDark ? 'rgba(14,165,233,0.04)' : 'rgba(37,99,235,0.03)', borderRadius: '8px', border: `1px solid ${t.border}`, textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: s.l === 'Terverif.' ? (selectedDoc.status === 'aktif' ? '#10B981' : '#F43F5E') : t.textPrimary }}>{s.v}</div>
                    <div style={{ fontSize: '10px', color: t.textSecondary }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}