'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';
import { ThemeProvider } from '@/context/ThemeContext';

function ResetPasswordForm() {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const supabase = createClient();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!password || !confirmPassword) {
      setError('Isi semua kolom terlebih dahulu.');
      return;
    }
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password tidak cocok.');
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setIsDone(true);
    }
  };

  if (isDone) {
    return (
      <div style={{ minHeight: '100vh', background: t.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
        <div style={{ background: t.card, borderRadius: '24px', padding: '48px 40px', width: '100%', maxWidth: '440px', border: `1px solid ${t.border}`, boxShadow: t.cardShadow, textAlign: 'center' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: t.textPrimary, margin: '0 0 10px' }}>Password Berhasil Diubah!</h1>
          <p style={{ color: t.textSecondary, fontSize: '15px', marginBottom: '28px', lineHeight: 1.6 }}>
            Password kamu sudah diperbarui. Silakan login dengan password baru.
          </p>
          <a href="/" style={{ display: 'block', width: '100%', padding: '14px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 20px ${t.accentGlow}`, textDecoration: 'none', textAlign: 'center' }}>
            Kembali ke Halaman Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: t.bgGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', fontFamily: "'DM Sans', 'Segoe UI', sans-serif", position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ background: t.card, borderRadius: '24px', padding: '48px 40px', width: '100%', maxWidth: '440px', border: `1px solid ${t.border}`, boxShadow: t.cardShadow, position: 'relative' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: `0 4px 20px ${t.accentGlow}` }}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: t.textPrimary, margin: '0 0 8px', letterSpacing: '-0.5px' }}>Buat Password Baru</h1>
          <p style={{ color: t.textSecondary, fontSize: '15px', margin: 0 }}>Masukkan password baru untuk akunmu</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#F43F5E' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Password Baru */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: t.textSecondary, marginBottom: '8px', letterSpacing: '0.3px', textTransform: 'uppercase' as const }}>
              Password Baru
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: t.textSecondary, pointerEvents: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimal 8 karakter"
                style={{ width: '100%', boxSizing: 'border-box' as const, padding: '13px 44px 13px 42px', background: t.inputBg, border: `1.5px solid ${t.border}`, borderRadius: '12px', color: t.textPrimary, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s ease', fontFamily: 'inherit' }}
                onFocus={(e) => e.target.style.borderColor = t.accent}
                onBlur={(e) => e.target.style.borderColor = t.border}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textSecondary, padding: 0, display: 'flex' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword
                    ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
                    : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: t.textSecondary, marginBottom: '8px', letterSpacing: '0.3px', textTransform: 'uppercase' as const }}>
              Konfirmasi Password
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: t.textSecondary, pointerEvents: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); }}
                placeholder="Ulangi password baru"
                style={{ width: '100%', boxSizing: 'border-box' as const, padding: '13px 14px 13px 42px', background: t.inputBg, border: `1.5px solid ${t.border}`, borderRadius: '12px', color: t.textPrimary, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s ease', fontFamily: 'inherit' }}
                onFocus={(e) => e.target.style.borderColor = t.accent}
                onBlur={(e) => e.target.style.borderColor = t.border}
              />
            </div>
          </div>

          {/* Submit */}
          <button type="button" onClick={handleSubmit} disabled={isLoading}
            style={{ width: '100%', padding: '14px', background: isLoading ? t.textSecondary : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '4px', boxShadow: isLoading ? 'none' : `0 4px 20px ${t.accentGlow}`, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontFamily: 'inherit' }}>
            {isLoading
              ? <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Menyimpan...</>
              : 'Simpan Password Baru'
            }
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: ${t.textSecondary}; opacity: 0.7; }
      `}</style>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <ThemeProvider>
      <ResetPasswordForm />
    </ThemeProvider>
  );
}