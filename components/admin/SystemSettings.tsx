'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  return (
    <div onClick={() => onChange(!value)} style={{ width: '42px', height: '23px', borderRadius: '12px', background: value ? `linear-gradient(135deg, ${t.accent}, ${t.accentHover})` : isDark ? '#1E3A5F' : '#CBD5E1', cursor: 'pointer', position: 'relative', transition: 'all 0.2s ease', flexShrink: 0, border: `1px solid ${value ? t.accent : t.border}` }}>
      <div style={{ position: 'absolute', width: '17px', height: '17px', background: 'white', borderRadius: '50%', top: '2px', left: value ? '21px' : '2px', transition: 'left 0.2s ease', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
    </div>
  );
}

function SettingRow({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 18px', borderRadius: '12px', background: isDark ? 'rgba(14,165,233,0.02)' : 'rgba(37,99,235,0.02)', border: `1px solid ${t.border}`, marginBottom: '10px', gap: '16px', transition: 'all 0.2s' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(14,165,233,0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = t.border}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '13.5px', fontWeight: 600, color: t.textPrimary, marginBottom: '2px' }}>{title}</div>
        <div style={{ fontSize: '12px', color: t.textSecondary }}>{desc}</div>
      </div>
      {children}
    </div>
  );
}

export function SystemSettings() {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const [llmModel, setLlmModel] = useState('gpt-4o');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-large');
  const [temperature, setTemperature] = useState('0.3');
  const [systemPrompt, setSystemPrompt] = useState('Kamu adalah asisten kesehatan mata bernama MataCerdas. Jawab pertanyaan berdasarkan dokumen medis yang tersedia. Selalu tambahkan disclaimer bahwa informasi ini bukan pengganti diagnosis dokter.');
  const [disclaimer, setDisclaimer] = useState('⚠ Informasi ini bersifat edukatif dan bukan pengganti diagnosis atau saran medis profesional. Konsultasikan selalu dengan dokter mata.');
  const [maxFileSize, setMaxFileSize] = useState('50');
  const [autoOcr, setAutoOcr] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [disclaimerRequired, setDisclaimerRequired] = useState(true);
  const [logging, setLogging] = useState(true);

  const inputStyle: React.CSSProperties = { background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '9px', padding: '9px 14px', color: t.textPrimary, fontSize: '13.5px', outline: 'none', transition: 'border-color 0.2s', width: '100%', fontFamily: "'DM Sans', 'Segoe UI', sans-serif'" };
  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: 'pointer' };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: '10px', fontWeight: 600, color: t.textSecondary, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '7px' };

  const CardSection = ({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) => (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '16px', padding: '20px' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: t.textPrimary, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{emoji}</span> {title}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

      {/* Model AI */}
      <CardSection title="Model AI" emoji="🤖">
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Model LLM</label>
          <select value={llmModel} onChange={(e) => setLlmModel(e.target.value)} style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
            <option value="gpt-4o">GPT-4o (OpenAI)</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
          </select>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Model Embedding</label>
          <select value={embeddingModel} onChange={(e) => setEmbeddingModel(e.target.value)} style={selectStyle}
            onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border}>
            <option value="text-embedding-3-large">text-embedding-3-large</option>
            <option value="text-embedding-3-small">text-embedding-3-small</option>
            <option value="text-embedding-ada-002">text-embedding-ada-002</option>
          </select>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Temperature (0.0 – 1.0)</label>
          <input type="number" value={temperature} onChange={(e) => setTemperature(e.target.value)} min="0" max="1" step="0.1" style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border} />
        </div>
        <button style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: `0 2px 10px ${t.accentGlow}`, fontFamily: 'inherit' }}>
          Simpan Konfigurasi
        </button>
      </CardSection>

      {/* Prompt Sistem */}
      <CardSection title="Prompt Sistem AI" emoji="📝">
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>System Prompt</label>
          <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '110px', lineHeight: '1.6' } as React.CSSProperties}
            onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border} />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Disclaimer Medis</label>
          <textarea value={disclaimer} onChange={(e) => setDisclaimer(e.target.value)}
            style={{ ...inputStyle, resize: 'vertical', minHeight: '70px', lineHeight: '1.6' } as React.CSSProperties}
            onFocus={(e) => e.target.style.borderColor = t.accent} onBlur={(e) => e.target.style.borderColor = t.border} />
        </div>
        <button style={{ width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', boxShadow: `0 2px 10px ${t.accentGlow}`, fontFamily: 'inherit' }}>
          Simpan Prompt
        </button>
      </CardSection>

      {/* Upload Settings */}
      <CardSection title="Pengaturan Upload" emoji="📎">
        <SettingRow title="Batas Ukuran File" desc="Maksimal ukuran per file PDF">
          <select value={maxFileSize} onChange={(e) => setMaxFileSize(e.target.value)}
            style={{ background: isDark ? '#0A1628' : '#F0F7FF', border: `1px solid ${t.border}`, borderRadius: '8px', padding: '7px 10px', color: t.textPrimary, fontSize: '13px', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            <option value="10">10 MB</option>
            <option value="50">50 MB</option>
            <option value="100">100 MB</option>
          </select>
        </SettingRow>
        <SettingRow title="Format yang Diizinkan" desc="Hanya PDF yang diperbolehkan">
          <span style={{ fontSize: '12px', fontWeight: 600, color: t.accent }}>PDF Only</span>
        </SettingRow>
        <SettingRow title="Auto OCR untuk PDF Scan" desc="Proses otomatis PDF berbasis gambar">
          <Toggle value={autoOcr} onChange={setAutoOcr} />
        </SettingRow>
      </CardSection>

      {/* Sistem & Maintenance */}
      <CardSection title="Sistem & Maintenance" emoji="⚙️">
        <SettingRow title="Maintenance Mode" desc="Nonaktifkan akses user sementara">
          <Toggle value={maintenanceMode} onChange={setMaintenanceMode} />
        </SettingRow>
        <SettingRow title="Disclaimer Medis Wajib" desc="Tampilkan di setiap jawaban AI">
          <Toggle value={disclaimerRequired} onChange={setDisclaimerRequired} />
        </SettingRow>
        <SettingRow title="Logging Percakapan" desc="Simpan semua chat untuk audit">
          <Toggle value={logging} onChange={setLogging} />
        </SettingRow>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: `1px solid ${t.border}`, background: 'transparent', color: t.textSecondary, fontSize: '13px', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
          >Bersihkan Cache</button>
          <button style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(244,63,94,0.2)', background: 'rgba(244,63,94,0.08)', color: '#F43F5E', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            Reset Sistem
          </button>
        </div>
      </CardSection>
    </div>
  );
}