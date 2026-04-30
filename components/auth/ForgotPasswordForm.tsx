'use client';

import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onResetPassword: (email: string) => Promise<void>;
}

export function ForgotPasswordForm({ onBack, onResetPassword }: ForgotPasswordFormProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async () => {
    if (!email) {
      showToast('Masukkan email kamu terlebih dahulu!', 'error');
      return;
    }
    setIsLoading(true);
    try {
      await onResetPassword(email);
      setEmailSent(true);
    } catch (err: any) {
      showToast(`❌ ${err.message || 'Gagal mengirim email reset. Coba lagi.'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const containerStyle = {
    minHeight: '100vh',
    background: t.bgGradient,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: '16px',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    transition: 'background 0.4s ease',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  const cardStyle = {
    background: t.card,
    borderRadius: '24px',
    padding: '48px 40px',
    width: '100%',
    maxWidth: '440px',
    border: `1px solid ${t.border}`,
    boxShadow: t.cardShadow,
    transition: 'all 0.4s ease',
    position: 'relative' as const,
  };

  if (emailSent) {
    return (
      <div style={containerStyle}>
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={cardStyle}>
          <button type="button" onClick={onBack}
            style={{ background: 'none', border: `1.5px solid ${t.border}`, borderRadius: '10px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, marginBottom: '32px', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
          >
            <ArrowLeft size={18} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #10B981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 20px rgba(16,185,129,0.3)' }}>
              <CheckCircle size={34} color="white" />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: t.textPrimary, margin: '0 0 10px', letterSpacing: '-0.5px' }}>
              Cek email kamu!
            </h1>
            <p style={{ color: t.textSecondary, fontSize: '15px', lineHeight: 1.6, margin: '0 0 28px' }}>
              Kami telah mengirim link reset password ke<br />
              <strong style={{ color: t.textPrimary }}>{email}</strong>
            </p>
            <button type="button" onClick={onBack}
              style={{ width: '100%', padding: '14px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 20px ${t.accentGlow}`, transition: 'all 0.2s ease' }}>
              Kembali ke halaman masuk
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '320px', height: '320px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-100px', left: '-60px', width: '280px', height: '280px', borderRadius: '50%', background: `radial-gradient(circle, ${t.accentGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 9999, padding: '14px 24px', borderRadius: '12px',
          background: toast.type === 'success' ? '#10b981' : '#ef4444',
          color: '#fff', fontSize: '14px', fontWeight: 500,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          animation: 'slideDown 0.3s ease',
          maxWidth: '90vw', textAlign: 'center',
        }}>
          {toast.message}
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '20px', position: 'relative' }}>
            <button type="button" onClick={onBack}
              style={{ position: 'absolute', left: 0, background: 'none', border: `1.5px solid ${t.border}`, borderRadius: '10px', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
            >
              <ArrowLeft size={18} />
            </button>

            <div style={{ width: '68px', height: '68px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 4px 20px ${t.accentGlow}` }}>
              <Mail size={30} color="white" />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 700, color: t.textPrimary, margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Lupa Password?
            </h1>
            <p style={{ color: t.textSecondary, fontSize: '15px', margin: 0, lineHeight: 1.6 }}>
              Tenang, kami akan kirim instruksi reset ke email kamu.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: t.textSecondary, marginBottom: '8px', letterSpacing: '0.3px', textTransform: 'uppercase' as const }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: t.textSecondary, pointerEvents: 'none' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <input
                id="reset-email"
                name="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="nama@email.com"
                style={{ width: '100%', boxSizing: 'border-box' as const, padding: '13px 14px 13px 42px', background: t.inputBg, border: `1.5px solid ${t.border}`, borderRadius: '12px', color: t.textPrimary, fontSize: '15px', outline: 'none', transition: 'border-color 0.2s ease' }}
                onFocus={(e) => e.target.style.borderColor = t.accent}
                onBlur={(e) => e.target.style.borderColor = t.border}
              />
            </div>
          </div>

          <button type="button" onClick={handleSubmit} disabled={isLoading}
            style={{ width: '100%', padding: '14px', background: isLoading ? t.textSecondary : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: isLoading ? 'none' : `0 4px 20px ${t.accentGlow}`, transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {isLoading ? (
              <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ animation: 'spin 0.8s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>Mengirim...</>
            ) : 'Kirim Link Reset'}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideDown { from { opacity: 0; transform: translateX(-50%) translateY(-10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        input::placeholder { color: ${t.textSecondary}; opacity: 0.7; }
      `}</style>
    </div>
  );
}