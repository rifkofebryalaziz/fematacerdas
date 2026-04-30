'use client';

import React from 'react';
import { MapPin, ExternalLink, Building2, Stethoscope, Eye } from 'lucide-react';
import { OSMPlace } from '@/lib/osmPlaces';
import { formatDistance } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface PlaceCardProps {
  place: OSMPlace;
  index?: number;
}

const TYPE_CONFIG = {
  hospital: {
    label: 'Rumah Sakit',
    icon: Building2,
    color: '#3b82f6',
    bgLight: 'rgba(59,130,246,0.08)',
    bgDark: 'rgba(59,130,246,0.12)',
    borderLight: 'rgba(59,130,246,0.2)',
    borderDark: 'rgba(59,130,246,0.25)',
  },
  clinic: {
    label: 'Klinik',
    icon: Stethoscope,
    color: '#10b981',
    bgLight: 'rgba(16,185,129,0.08)',
    bgDark: 'rgba(16,185,129,0.12)',
    borderLight: 'rgba(16,185,129,0.2)',
    borderDark: 'rgba(16,185,129,0.25)',
  },
  optik: {
    label: 'Optik',
    icon: Eye,
    color: '#8b5cf6',
    bgLight: 'rgba(139,92,246,0.08)',
    bgDark: 'rgba(139,92,246,0.12)',
    borderLight: 'rgba(139,92,246,0.2)',
    borderDark: 'rgba(139,92,246,0.25)',
  },
};

export function PlaceCard({ place, index = 0 }: PlaceCardProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;
  const config = TYPE_CONFIG[place.type] ?? TYPE_CONFIG.clinic;
  const Icon = config.icon;

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.lat},${place.lng}`;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank');
  };

  return (
    <div
      style={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)'}`,
        borderRadius: '20px',
        padding: '20px',
        transition: 'all 0.25s ease',
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        animationDelay: `${index * 0.05}s`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = isDark
          ? `0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px ${config.color}40`
          : `0 12px 40px rgba(0,0,0,0.1), 0 0 0 1px ${config.color}30`;
        e.currentTarget.style.borderColor = `${config.color}50`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
      }}
    >
      {/* Accent line kiri */}
      <div style={{
        position: 'absolute', left: 0, top: '20%', bottom: '20%',
        width: '3px', borderRadius: '0 3px 3px 0',
        background: `linear-gradient(180deg, ${config.color}, ${config.color}66)`,
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingLeft: '8px' }}>

        {/* Icon container */}
        <div style={{
          width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
          background: isDark ? config.bgDark : config.bgLight,
          border: `1.5px solid ${isDark ? config.borderDark : config.borderLight}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={22} color={config.color} strokeWidth={1.8} />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Top row: nama + badge */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
            <h3 style={{
              fontSize: '15px', fontWeight: 700, color: t.textPrimary,
              margin: 0, letterSpacing: '-0.2px', lineHeight: 1.3,
              overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {place.name}
            </h3>
            {/* Badge tipe */}
            <span style={{
              flexShrink: 0, fontSize: '11px', fontWeight: 600,
              padding: '3px 10px', borderRadius: '20px',
              background: isDark ? config.bgDark : config.bgLight,
              color: config.color,
              border: `1px solid ${isDark ? config.borderDark : config.borderLight}`,
              letterSpacing: '0.2px',
            }}>
              {config.label}
            </span>
          </div>

          {/* Jarak */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '8px',
              background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MapPin size={12} color={t.accent} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: t.accent }}>
              {formatDistance(place.distance)}
            </span>
            <span style={{ fontSize: '13px', color: t.textSecondary }}>dari lokasi Anda</span>
          </div>

          {/* Alamat */}
          {place.address && place.address !== 'Alamat tidak tersedia' && (
            <p style={{
              fontSize: '12.5px', color: t.textSecondary, margin: '0 0 14px',
              lineHeight: 1.6, overflow: 'hidden', textOverflow: 'ellipsis',
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {place.address}
            </p>
          )}

          {place.address === 'Alamat tidak tersedia' && (
            <p style={{ fontSize: '12.5px', color: t.textSecondary, margin: '0 0 14px', fontStyle: 'italic', opacity: 0.6 }}>
              Alamat tidak tersedia
            </p>
          )}

          {/* Button */}
          <button
            onClick={handleOpenMaps}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '7px',
              padding: '9px 18px', borderRadius: '10px', border: 'none',
              background: `linear-gradient(135deg, ${config.color}, ${config.color}cc)`,
              color: '#fff', fontSize: '13px', fontWeight: 600,
              cursor: 'pointer', letterSpacing: '0.1px',
              boxShadow: `0 4px 14px ${config.color}40`,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = `0 6px 20px ${config.color}50`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 4px 14px ${config.color}40`;
            }}
          >
            <ExternalLink size={13} />
            Petunjuk Arah
          </button>
        </div>
      </div>
    </div>
  );
}