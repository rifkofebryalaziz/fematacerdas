'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Link, Loader, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
import { createClient } from '@/lib/supabase';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatTitle: string;
  chatId: string | null;
}

export function ShareModal({ isOpen, onClose, chatTitle, chatId }: ShareModalProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!isOpen) {
      setShareUrl(null);
      setCopied(false);
      setIsGenerating(false);
      setError(null);
    }
  }, [isOpen]);

  const generateShareLink = async () => {
    if (!chatId || isGenerating) return;
    setIsGenerating(true);
    setError(null);

    try {
      // ✅ Gunakan Supabase client — bukan raw fetch
      const supabase = createClient();

      // Cek apakah sudah ada share_id
      const { data: existing, error: fetchError } = await supabase
        .from('chats')
        .select('share_id')
        .eq('id', chatId)
        .single();

      if (fetchError) throw fetchError;

      let shareId = existing?.share_id;

      if (!shareId) {
        shareId = Math.random().toString(36).substr(2, 12);
      }

      // Update is_public dan share_id
      const { error: updateError } = await supabase
        .from('chats')
        .update({ is_public: true, share_id: shareId })
        .eq('id', chatId);

      if (updateError) throw updateError;

      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);

      // Langsung copy ke clipboard
      await copyToClipboard(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

    } catch (err) {
      console.error('Error generating share link:', err);
      setError('Gagal membuat link. Coba lagi.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: t.cardShadow, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 10px ${t.accentGlow}` }}>
              <Link size={16} color="white" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
              Bagikan Chat
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: `1.5px solid ${t.border}`, borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Deskripsi */}
        <p style={{ color: t.textSecondary, fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
          Bagikan percakapan <strong style={{ color: t.textPrimary }}>"{chatTitle}"</strong> dengan orang lain.
        </p>

        {/* Error */}
        {error && (
          <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 12px' }}>{error}</p>
        )}

        {/* URL Box */}
        {shareUrl && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', background: t.inputBg, border: `1.5px solid ${t.border}`, marginBottom: '16px' }}>
            <Link size={14} color={t.textSecondary} style={{ flexShrink: 0 }} />
            <p style={{ flex: 1, margin: 0, fontSize: '13px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {shareUrl}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {shareUrl && (
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ flex: 1, padding: '13px', borderRadius: '12px', border: `1.5px solid ${t.border}`, background: 'transparent', color: t.textPrimary, fontWeight: 600, fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textPrimary; }}
            >
              <ExternalLink size={14} />
              Buka
            </a>
          )}

          <button
            onClick={generateShareLink}
            disabled={isGenerating}
            style={{ flex: shareUrl ? 2 : 1, padding: '13px', borderRadius: '12px', border: 'none', background: copied ? 'linear-gradient(135deg, #10B981, #059669)' : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontWeight: 600, fontSize: '14px', cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: copied ? '0 4px 16px rgba(16,185,129,0.3)' : `0 4px 16px ${t.accentGlow}`, transition: 'all 0.3s ease' }}
          >
            {isGenerating ? (
              <><Loader size={17} style={{ animation: 'spin 0.8s linear infinite' }} /> Membuat...</>
            ) : copied ? (
              <><Check size={17} /> Berhasil Disalin!</>
            ) : shareUrl ? (
              <><Copy size={17} /> Salin Ulang</>
            ) : (
              <><Copy size={17} /> Salin Link</>
            )}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}