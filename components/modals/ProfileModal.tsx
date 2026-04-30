'use client';

import React, { useState, useRef } from 'react';
import { X, MapPin, MessageSquare, Camera, User as UserIcon } from 'lucide-react';
import { User } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateProfile: (user: Partial<User>) => void;
}

export function ProfileModal({ isOpen, onClose, user, onUpdateProfile }: ProfileModalProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const [formData, setFormData] = useState({
    name: user.name || '',
    age: user.age || '',
    location: user.location || '',
    consultationPurpose: user.consultationPurpose || '',
    avatar: user.avatar || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    onUpdateProfile(formData);
    onClose();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { alert('Ukuran file maksimal 5MB'); return; }
      if (!file.type.startsWith('image/')) { alert('Pilih file gambar'); return; }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, avatar: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  const inputStyle = {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '11px 14px',
    background: t.inputBg,
    border: `1.5px solid ${t.border}`,
    borderRadius: '10px',
    color: t.textPrimary,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
  };

  const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    fontSize: '12px',
    fontWeight: 600,
    color: t.textSecondary,
    marginBottom: '8px',
    letterSpacing: '0.3px',
    textTransform: 'uppercase' as const,
  };

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '24px', padding: '32px', width: '100%', maxWidth: '440px', maxHeight: '90vh', overflowY: 'auto', boxShadow: t.cardShadow, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: t.textPrimary, margin: 0, letterSpacing: '-0.4px' }}>
            Profil Saya
          </h3>
          <button type="button" onClick={onClose}
            style={{ background: 'none', border: `1.5px solid ${t.border}`, borderRadius: '8px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: `0 4px 20px ${t.accentGlow}` }}>
                {formData.avatar ? (
                  <img src={formData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#fff', fontSize: '36px', fontWeight: 700 }}>
                    {formData.name.charAt(0).toUpperCase() || '?'}
                  </span>
                )}
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()}
                style={{ position: 'absolute', bottom: '2px', right: '2px', width: '30px', height: '30px', borderRadius: '50%', background: t.card, border: `2px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: t.textSecondary, transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.color = t.textSecondary; }}
              >
                <Camera size={13} />
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
            </div>
            <p style={{ color: t.textSecondary, fontSize: '13px', margin: 0 }}>{user.email}</p>
          </div>

          {/* Nama */}
          <div>
            <label style={labelStyle}><UserIcon size={13} /> Nama / Username</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={inputStyle} placeholder="Nama lengkap"
              onFocus={(e) => e.target.style.borderColor = t.accent}
              onBlur={(e) => e.target.style.borderColor = t.border}
            />
          </div>

          {/* Usia */}
          <div>
            <label style={labelStyle}>Usia</label>
            <input type="number" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              style={inputStyle} placeholder="Contoh: 25"
              onFocus={(e) => e.target.style.borderColor = t.accent}
              onBlur={(e) => e.target.style.borderColor = t.border}
            />
          </div>

          {/* Lokasi */}
          <div>
            <label style={labelStyle}><MapPin size={13} /> Lokasi</label>
            <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              style={inputStyle} placeholder="Jakarta, Indonesia"
              onFocus={(e) => e.target.style.borderColor = t.accent}
              onBlur={(e) => e.target.style.borderColor = t.border}
            />
          </div>

          {/* Tujuan Konsultasi */}
          <div>
            <label style={labelStyle}><MessageSquare size={13} /> Tujuan Konsultasi Mata</label>
            <textarea value={formData.consultationPurpose} onChange={(e) => setFormData({ ...formData, consultationPurpose: e.target.value })}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 } as React.CSSProperties}
              rows={3} placeholder="Contoh: Mata sering berair, penglihatan kabur..."
              onFocus={(e) => e.target.style.borderColor = t.accent}
              onBlur={(e) => e.target.style.borderColor = t.border}
            />
          </div>

          {/* Simpan */}
          <button type="button" onClick={handleSave}
            style={{ width: '100%', padding: '13px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 20px ${t.accentGlow}`, transition: 'all 0.2s ease', marginTop: '4px' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            Simpan Perubahan
          </button>
        </div>
      </div>

      <style>{`
        input::placeholder, textarea::placeholder { color: ${t.textSecondary}; opacity: 0.6; }
        input[type=number]::-webkit-inner-spin-button { opacity: 0.4; }
      `}</style>
    </div>
  );
}