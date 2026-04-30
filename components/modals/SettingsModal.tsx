'use client';

import React, { useState } from 'react';
import { X, Brain, MapPin, Lock, Download, Trash2 } from 'lucide-react';
import { Settings } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}

export function SettingsModal({ isOpen, onClose, settings, onUpdateSettings }: SettingsModalProps) {
  const { isDark, setTheme } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const [formData, setFormData] = useState<Settings>(settings);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => { onUpdateSettings(formData); onClose(); };
  const handleDeleteAllChats = () => { alert('Semua riwayat chat dihapus!'); setShowDeleteConfirm(false); };
  const handleExportChat = () => { alert('Export chat ke PDF (implementasi di backend)'); };

  if (!isOpen) return null;

  // Reusable styles
  const sectionTitle = (icon: React.ReactNode, label: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', paddingBottom: '12px', borderBottom: `1px solid ${t.border}` }}>
      <div style={{ color: t.accent }}>{icon}</div>
      <h4 style={{ fontSize: '13px', fontWeight: 700, color: t.textSecondary, margin: 0, letterSpacing: '0.8px', textTransform: 'uppercase' as const }}>{label}</h4>
    </div>
  );

  const rowStyle = {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 16px', borderRadius: '12px',
    background: isDark ? 'rgba(14,165,233,0.03)' : 'rgba(37,99,235,0.02)',
    border: `1px solid ${t.border}`,
    marginBottom: '8px',
  };

  const selectStyle = {
    padding: '8px 12px',
    background: t.inputBg,
    border: `1.5px solid ${t.border}`,
    borderRadius: '8px',
    color: t.textPrimary,
    fontSize: '13px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
  };

  const toggleBtn = (active: boolean, onClick: () => void, labelOn = 'ON', labelOff = 'OFF') => (
    <button onClick={onClick}
      style={{
        padding: '7px 16px', borderRadius: '8px', border: 'none',
        fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s ease',
        background: active ? `linear-gradient(135deg, ${t.accent}, ${t.accentHover})` : t.inputBg,
        color: active ? '#fff' : t.textSecondary,
        boxShadow: active ? `0 2px 8px ${t.accentGlow}` : 'none',
        outline: active ? 'none' : `1px solid ${t.border}`,
      }}
    >
      {active ? labelOn : labelOff}
    </button>
  );

  const rowLabel = (title: string, desc: string) => (
    <div style={{ flex: 1 }}>
      <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '14px', color: t.textPrimary }}>{title}</p>
      <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary, lineHeight: 1.5 }}>{desc}</p>
    </div>
  );

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: t.cardShadow, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 28px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: t.card }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>Pengaturan</h3>
          <button onClick={onClose}
            style={{ background: 'none', border: `1.5px solid ${t.border}`, borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* ── TAMPILAN ── */}
          <div>
            {sectionTitle(<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>, 'Tampilan')}
            {/* ThemeToggle inline */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '12px', background: isDark ? 'rgba(14,165,233,0.03)' : 'rgba(37,99,235,0.02)', border: `1px solid ${t.border}` }}>
              <div>
                <p style={{ margin: '0 0 2px', fontWeight: 600, fontSize: '14px', color: t.textPrimary }}>Tampilan</p>
                <p style={{ margin: 0, fontSize: '12px', color: t.textSecondary }}>{isDark ? 'Mode Gelap aktif' : 'Mode Terang aktif'}</p>
              </div>
              <div style={{ display: 'flex', background: isDark ? '#0A1628' : '#F0F7FF', borderRadius: '10px', padding: '4px', gap: '4px', border: `1px solid ${t.border}` }}>
                <button onClick={() => setTheme('light')}
                  style={{ padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px', background: !isDark ? t.accent : 'transparent', color: !isDark ? '#fff' : t.textSecondary, boxShadow: !isDark ? `0 2px 8px ${t.accentGlow}` : 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  Terang
                </button>
                <button onClick={() => setTheme('dark')}
                  style={{ padding: '7px 14px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px', background: isDark ? t.accent : 'transparent', color: isDark ? '#fff' : t.textSecondary, boxShadow: isDark ? `0 2px 8px ${t.accentGlow}` : 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  Gelap
                </button>
              </div>
            </div>
          </div>

          {/* ── AI & CHAT ── */}
          <div>
            {sectionTitle(<Brain size={18} />, 'AI & Chat')}

            <div style={rowStyle}>
              {rowLabel('Mode Jawaban', 'Pilih tingkat detail respons AI')}
              <select value={formData.aiResponse} onChange={(e) => setFormData({ ...formData, aiResponse: e.target.value as 'ringkas' | 'detail' })} style={selectStyle}
                onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
                <option value="ringkas">Ringkas</option>
                <option value="detail">Detail</option>
              </select>
            </div>

            <div style={rowStyle}>
              {rowLabel('Nada Bahasa', 'Atur gaya komunikasi AI')}
              <select value={formData.tone} onChange={(e) => setFormData({ ...formData, tone: e.target.value as 'formal' | 'santai' })} style={selectStyle}
                onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
                <option value="formal">Formal</option>
                <option value="santai">Santai</option>
              </select>
            </div>

            <div style={rowStyle}>
              {rowLabel('Disclaimer Medis', 'Wajib aktif untuk keamanan medis')}
              <div style={{ padding: '7px 16px', borderRadius: '8px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontWeight: 600, fontSize: '13px' }}>ON</div>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: '10px', background: isDark ? 'rgba(14,165,233,0.06)' : 'rgba(37,99,235,0.05)', border: `1px solid ${isDark ? 'rgba(14,165,233,0.2)' : 'rgba(37,99,235,0.15)'}`, marginBottom: '8px' }}>
              <p style={{ margin: 0, fontSize: '12px', color: t.accent }}>⚠️ Disclaimer medis tidak dapat dinonaktifkan untuk keamanan pengguna</p>
            </div>

            <div style={rowStyle}>
              {rowLabel('Tampilkan Sumber (RAG)', 'Tampilkan referensi dari database')}
              {toggleBtn(formData.showSource, () => setFormData({ ...formData, showSource: !formData.showSource }))}
            </div>

            <div style={rowStyle}>
              {rowLabel('Riwayat Chat', 'Simpan atau hapus otomatis')}
              {toggleBtn(formData.saveHistory, () => setFormData({ ...formData, saveHistory: !formData.saveHistory }), 'Simpan', 'Hapus')}
            </div>
          </div>

          {/* ── LOKASI ── */}
          <div>
            {sectionTitle(<MapPin size={18} />, 'Lokasi & Rekomendasi')}

            <div style={rowStyle}>
              {rowLabel('Izin Lokasi', 'Untuk mencari RS/Optik terdekat')}
              {toggleBtn(formData.locationPermission, () => setFormData({ ...formData, locationPermission: !formData.locationPermission }))}
            </div>

            <div style={rowStyle}>
              {rowLabel('Radius Pencarian', 'Jarak maksimal pencarian')}
              <select value={formData.searchRadius} onChange={(e) => setFormData({ ...formData, searchRadius: parseInt(e.target.value) as 3 | 5 | 10 })} style={selectStyle}
                onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
                <option value={3}>3 km</option>
                <option value={5}>5 km</option>
                <option value={10}>10 km</option>
              </select>
            </div>

            <div style={rowStyle}>
              {rowLabel('Jenis Rekomendasi', 'Filter tipe tempat yang dicari')}
              <select value={formData.recommendationType} onChange={(e) => setFormData({ ...formData, recommendationType: e.target.value as any })} style={selectStyle}
                onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
                <option value="semua">Semua</option>
                <option value="rs">RS Mata</option>
                <option value="klinik">Klinik</option>
                <option value="optik">Optik</option>
              </select>
            </div>

            <div style={rowStyle}>
              {rowLabel('Urutan', 'Urutkan berdasarkan kriteria')}
              <select value={formData.sortBy} onChange={(e) => setFormData({ ...formData, sortBy: e.target.value as 'terdekat' | 'rating' })} style={selectStyle}
                onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
                <option value="terdekat">Terdekat</option>
                <option value="rating">Rating Tertinggi</option>
              </select>
            </div>
          </div>

          {/* ── PRIVASI ── */}
          <div>
            {sectionTitle(<Lock size={18} />, 'Privasi & Keamanan')}

            <div style={{ ...rowStyle, flexDirection: 'column', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                {rowLabel('Hapus Riwayat Chat', 'Hapus semua percakapan secara permanen')}
                <button onClick={() => setShowDeleteConfirm(true)}
                  style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0, marginLeft: '12px' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#DC2626'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#EF4444'}
                >
                  <Trash2 size={14} /> Hapus Semua
                </button>
              </div>
              {showDeleteConfirm && (
                <div style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: '#F87171' }}>⚠️ Yakin ingin menghapus semua riwayat chat? Tindakan ini tidak dapat dibatalkan!</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleDeleteAllChats} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: 'none', background: '#EF4444', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Ya, Hapus</button>
                    <button onClick={() => setShowDeleteConfirm(false)} style={{ flex: 1, padding: '8px', borderRadius: '8px', border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Batal</button>
                  </div>
                </div>
              )}
            </div>

            <div style={rowStyle}>
              {rowLabel('Auto-delete Chat', 'Hapus chat otomatis setelah periode tertentu')}
              <select value={formData.autoDeleteDays || ''} onChange={(e) => setFormData({ ...formData, autoDeleteDays: e.target.value ? (parseInt(e.target.value) as 7 | 30) : null })} style={selectStyle}
                onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
                <option value="">Tidak aktif</option>
                <option value={7}>7 hari</option>
                <option value={30}>30 hari</option>
              </select>
            </div>

            <div style={rowStyle}>
              {rowLabel('Export Chat', 'Download riwayat percakapan sebagai PDF')}
              <button onClick={handleExportChat}
                style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 14px', borderRadius: '8px', background: 'transparent', border: `1.5px solid ${t.border}`, color: t.textSecondary, fontWeight: 500, fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
              >
                <Download size={14} /> Export PDF
              </button>
            </div>
          </div>

          {/* Tips */}
          <div style={{ padding: '14px 16px', borderRadius: '12px', background: isDark ? 'rgba(14,165,233,0.06)' : 'rgba(37,99,235,0.05)', border: `1px solid ${isDark ? 'rgba(14,165,233,0.2)' : 'rgba(37,99,235,0.15)'}` }}>
            <p style={{ margin: 0, fontSize: '13px', color: t.accent, lineHeight: 1.6 }}>
              💡 <strong>Tips:</strong> Aktifkan "Tampilkan Sumber (RAG)" untuk melihat referensi medis yang digunakan AI dalam menjawab pertanyaan Anda.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 28px', borderTop: `1px solid ${t.border}`, background: t.card, display: 'flex', gap: '12px' }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '13px', borderRadius: '12px', border: `1.5px solid ${t.border}`, background: 'transparent', color: t.textSecondary, fontWeight: 600, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
          >
            Batal
          </button>
          <button onClick={handleSave}
            style={{ flex: 1, padding: '13px', borderRadius: '12px', border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: `0 4px 16px ${t.accentGlow}`, transition: 'all 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}