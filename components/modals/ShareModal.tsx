// 'use client';

// import React, { useState } from 'react';
// import { X, Copy, Check, Link, Loader, ExternalLink } from 'lucide-react';
// import { copyToClipboard } from '@/lib/utils';
// import { createClient } from '@/lib/supabase';
// import { useTheme } from '@/context/ThemeContext';
// import { colors } from '@/lib/theme';

// interface ShareModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   chatTitle: string;
//   chatId: string | null;
// }

// export function ShareModal({ isOpen, onClose, chatTitle, chatId }: ShareModalProps) {
//   const { isDark } = useTheme();
//   const t = isDark ? colors.dark : colors.light;
//   const [copied, setCopied] = useState(false);
//   const [shareUrl, setShareUrl] = useState<string | null>(null);
//   const [isGenerating, setIsGenerating] = useState(false);

//   // Reset saat modal ditutup
//   React.useEffect(() => {
//     if (!isOpen) {
//       setShareUrl(null);
//       setCopied(false);
//       setIsGenerating(false);
//     }
//   }, [isOpen]);

//   const generateShareLink = async () => {
//     if (!chatId || isGenerating) return;
//     setIsGenerating(true);

//     try {
//       // Gunakan fetch langsung ke Supabase REST API tanpa supabase client
//       // agar tidak trigger token refresh
//       const supabase = createClient();

//       const { data: existing } = await supabase
//         .from('chats')
//         .select('share_id')
//         .eq('id', chatId)
//         .single();

//       let shareId = existing?.share_id;

//       if (!shareId) {
//         shareId = Math.random().toString(36).substr(2, 12);
//         await supabase
//           .from('chats')
//           .update({ is_public: true, share_id: shareId })
//           .eq('id', chatId);
//       } else {
//         await supabase
//           .from('chats')
//           .update({ is_public: true })
//           .eq('id', chatId);
//       }

//       const url = `${window.location.origin}/share/${shareId}`;
//       setShareUrl(url);
//     } catch (err) {
//       console.error('Error generating share link:', err);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const handleCopyAndGenerate = async () => {
//     if (!shareUrl) {
//       // Generate dulu baru copy
//       await generateShareLink();
//     } else {
//       await copyToClipboard(shareUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   };

//   // Setelah generate selesai, langsung copy
//   React.useEffect(() => {
//     if (shareUrl && !copied) {
//       copyToClipboard(shareUrl);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 2000);
//     }
//   }, [shareUrl]);

//   if (!isOpen) return null;

//   return (
//     <div
//       style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' }}
//       onClick={onClose}
//     >
//       <div
//         style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '420px', boxShadow: t.cardShadow, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 10px ${t.accentGlow}` }}>
//               <Link size={16} color="white" />
//             </div>
//             <h3 style={{ fontSize: '18px', fontWeight: 700, color: t.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
//               Bagikan Chat
//             </h3>
//           </div>
//           <button onClick={onClose}
//             style={{ background: 'none', border: `1.5px solid ${t.border}`, borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s ease' }}
//             onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
//             onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
//           >
//             <X size={16} />
//           </button>
//         </div>

//         {/* Deskripsi */}
//         <p style={{ color: t.textSecondary, fontSize: '14px', margin: '0 0 20px', lineHeight: 1.6 }}>
//           Bagikan percakapan <strong style={{ color: t.textPrimary }}>"{chatTitle}"</strong> dengan orang lain.
//         </p>

//         {/* URL Box — hanya muncul setelah generate */}
//         {shareUrl && (
//           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '12px', background: t.inputBg, border: `1.5px solid ${t.border}`, marginBottom: '16px', minHeight: '48px' }}>
//             <Link size={14} color={t.textSecondary} style={{ flexShrink: 0 }} />
//             <p style={{ flex: 1, margin: 0, fontSize: '13px', color: t.textSecondary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
//               {shareUrl}
//             </p>
//           </div>
//         )}

//         {/* Buttons */}
//         <div style={{ display: 'flex', gap: '10px' }}>
//           {shareUrl && (
//             <a
//               href={shareUrl}
//               target="_blank"
//               rel="noopener noreferrer"
//               style={{ flex: 1, padding: '13px', borderRadius: '12px', border: `1.5px solid ${t.border}`, background: 'transparent', color: t.textPrimary, fontWeight: 600, fontSize: '14px', cursor: 'pointer', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease' }}
//               onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
//               onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textPrimary; }}
//             >
//               <ExternalLink size={14} />
//               Buka
//             </a>
//           )}

//           <button
//             onClick={handleCopyAndGenerate}
//             disabled={isGenerating}
//             style={{ flex: shareUrl ? 2 : 1, padding: '13px', borderRadius: '12px', border: 'none', background: copied ? 'linear-gradient(135deg, #10B981, #059669)' : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontWeight: 600, fontSize: '14px', cursor: isGenerating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: copied ? '0 4px 16px rgba(16,185,129,0.3)' : `0 4px 16px ${t.accentGlow}`, transition: 'all 0.3s ease' }}
//           >
//             {isGenerating ? (
//               <><Loader size={17} style={{ animation: 'spin 0.8s linear infinite' }} /> Membuat Link...</>
//             ) : copied ? (
//               <><Check size={17} /> Berhasil Disalin!</>
//             ) : (
//               <><Copy size={17} /> Salin Link</>
//             )}
//           </button>
//         </div>
//       </div>
//       <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
//     </div>
//   );
// }
'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Link, Loader, ExternalLink } from 'lucide-react';
import { copyToClipboard } from '@/lib/utils';
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

  React.useEffect(() => {
    if (!isOpen) {
      setShareUrl(null);
      setCopied(false);
      setIsGenerating(false);
    }
  }, [isOpen]);

  const generateShareLink = async () => {
    if (!chatId || isGenerating) return;
    setIsGenerating(true);

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      // Ambil session token dari localStorage
      const sessionKey = Object.keys(localStorage).find(k => k.includes('auth-token') || k.includes('sb-'));
      const sessionRaw = sessionKey ? localStorage.getItem(sessionKey) : null;
      const session = sessionRaw ? JSON.parse(sessionRaw) : null;
      const accessToken = session?.access_token || session?.[0]?.access_token || supabaseKey;

      // Cek share_id yang sudah ada
      const getRes = await fetch(
        `${supabaseUrl}/rest/v1/chats?select=share_id&id=eq.${chatId}`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const getData = await getRes.json();
      let shareId = getData?.[0]?.share_id;

      if (!shareId) {
        shareId = Math.random().toString(36).substr(2, 12);
      }

      // Update chat dengan share_id dan is_public
      await fetch(
        `${supabaseUrl}/rest/v1/chats?id=eq.${chatId}`,
        {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({ is_public: true, share_id: shareId }),
        }
      );

      const url = `${window.location.origin}/share/${shareId}`;
      setShareUrl(url);

      // Langsung copy
      await copyToClipboard(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

    } catch (err) {
      console.error('Error generating share link:', err);
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
          <button onClick={onClose}
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