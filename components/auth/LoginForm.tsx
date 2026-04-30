'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  onSwitchToRegister: () => void;
  onGoogleLogin: () => void;
  onForgotPassword: () => void;
}

export function LoginForm({ onLogin, onSwitchToRegister, onGoogleLogin, onForgotPassword }: LoginFormProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      showToast('Email dan password wajib diisi!', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await onLogin(email, password);
      // Redirect otomatis ditangani oleh useAuth (isAuthenticated = true)
    } catch (err: any) {
      showToast(`❌ ${err.message || 'Login gagal, periksa email dan password kamu.'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: t.bgGradient,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '16px',
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      transition: 'background 0.4s ease',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '14px 24px', borderRadius: '12px',
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff', fontSize: '14px', fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          animation: 'slideDown 0.3s ease',
          whiteSpace: 'nowrap',
          maxWidth: '90vw',
          textAlign: 'center',
        }}>
          {toast.message}
        </div>
      )}

      <div style={{
        background: t.card, borderRadius: '24px', padding: '48px 40px',
        width: '100%', maxWidth: '440px', border: `1px solid ${t.border}`,
        boxShadow: t.cardShadow, transition: 'all 0.4s ease', position: 'relative',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: t.textPrimary, margin: '0 0 6px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            Selamat datang kembali
          </h1>
          <p style={{ color: t.textSecondary, fontSize: '15px', margin: 0 }}>
            Masuk untuk melanjutkan ke MataCerdas
          </p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: t.textSecondary, marginBottom: '8px', letterSpacing: '0.3px', textTransform: 'uppercase' as const }}>Email</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: t.textSecondary }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={handleKeyDown} placeholder="nama@email.com"
                style={{ width: '100%', boxSizing: 'border-box' as const, padding: '13px 14px 13px 42px', background: t.inputBg, border: `1.5px solid ${t.border}`, borderRadius: '12px', color: t.textPrimary, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s ease' }}
                onFocus={(e) => e.target.style.borderColor = t.accent}
                onBlur={(e) => e.target.style.borderColor = t.border}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, color: t.textSecondary, letterSpacing: '0.3px', textTransform: 'uppercase' as const }}>Password</label>
              <button type="button" onClick={onForgotPassword} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.accent, fontSize: '13px', fontWeight: 500, padding: 0 }}>Lupa password?</button>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: t.textSecondary }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} placeholder="Minimal 8 karakter"
                style={{ width: '100%', boxSizing: 'border-box' as const, padding: '13px 44px 13px 42px', background: t.inputBg, border: `1.5px solid ${t.border}`, borderRadius: '12px', color: t.textPrimary, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s ease' }}
                onFocus={(e) => e.target.style.borderColor = t.accent}
                onBlur={(e) => e.target.style.borderColor = t.border}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: t.textSecondary, padding: 0, display: 'flex' }}>
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button type="button" onClick={handleSubmit} disabled={isLoading}
            style={{ width: '100%', padding: '14px', background: isLoading ? t.textSecondary : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '4px', boxShadow: isLoading ? 'none' : `0 4px 20px ${t.accentGlow}`, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', letterSpacing: '0.2px' }}>
            {isLoading ? (<><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Memproses...</>) : 'Masuk'}
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: t.border }} />
          <span style={{ color: t.textSecondary, fontSize: '13px', fontWeight: 500 }}>atau</span>
          <div style={{ flex: 1, height: '1px', background: t.border }} />
        </div>

        {/* Google */}
        <button type="button" onClick={onGoogleLogin}
          style={{ width: '100%', padding: '13px', background: isDark ? '#0A1628' : '#fff', color: t.textPrimary, border: `1.5px solid ${t.border}`, borderRadius: '12px', fontSize: '15px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { (e.currentTarget).style.borderColor = t.accent; (e.currentTarget).style.background = isDark ? '#0D1F3C' : '#F0F7FF'; }}
          onMouseLeave={(e) => { (e.currentTarget).style.borderColor = t.border; (e.currentTarget).style.background = isDark ? '#0A1628' : '#fff'; }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.8789 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"/>
            <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9465L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
            <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
            <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33717L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
          </svg>
          Lanjutkan dengan Google
        </button>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '24px', color: t.textSecondary, fontSize: '14px' }}>
          Belum punya akun?{' '}
          <button type="button" onClick={onSwitchToRegister} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.accent, fontWeight: 600, fontSize: '14px', padding: 0 }}>
            Daftar sekarang
          </button>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        input::placeholder { color: ${t.textSecondary}; opacity: 0.7; }
      `}</style>
    </div>
  );
}