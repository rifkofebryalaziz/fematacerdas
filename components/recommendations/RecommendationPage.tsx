'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Loader, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { PlaceCard } from './PlaceCard';
import { OSMPlace, fetchNearbyPlaces } from '@/lib/osmPlaces';
import { Settings } from '@/types';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/lib/theme';

interface RecommendationPageProps {
  onBack: () => void;
  settings: Settings;
}

export function RecommendationPage({ onBack, settings }: RecommendationPageProps) {
  const { isDark } = useTheme();
  const t = isDark ? colors.dark : colors.light;

  const { location, error, loading, getLocation } = useGeolocation();
  const [places, setPlaces] = useState<OSMPlace[]>([]);
  const [fetchingPlaces, setFetchingPlaces] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [requestingLocation, setRequestingLocation] = useState(false);

  useEffect(() => {
    if (location) {
      loadPlaces();
    }
  }, [location, settings]);

  const loadPlaces = async () => {
    if (!location) return;
    setFetchingPlaces(true);
    setFetchError(null);

    try {
      const results = await fetchNearbyPlaces(
        location.latitude,
        location.longitude,
        settings.searchRadius
      );

      // Filter by tipe
      let filtered = results;
      if (settings.recommendationType !== 'semua') {
        filtered = results.filter((p) => {
          if (settings.recommendationType === 'rs') return p.type === 'hospital';
          if (settings.recommendationType === 'klinik') return p.type === 'clinic';
          if (settings.recommendationType === 'optik') return p.type === 'optik';
          return true;
        });
      }

      // Sort
      if (settings.sortBy === 'terdekat') {
        filtered.sort((a, b) => a.distance - b.distance);
      } else {
        filtered.sort((a, b) => b.rating - a.rating);
      }

      setPlaces(filtered);
    } catch (err: any) {
      setFetchError(err.message || 'Gagal mengambil data. Coba lagi.');
    } finally {
      setFetchingPlaces(false);
    }
  };

  const handleRequestLocation = async () => {
    setRequestingLocation(true);
    await getLocation();
    setRequestingLocation(false);
  };

  const isLoading = loading || fetchingPlaces;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.bg, transition: 'background 0.4s ease', fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${t.border}`, padding: '0 24px', height: '61px', display: 'flex', alignItems: 'center', gap: '12px', background: t.card, transition: 'all 0.4s ease', flexShrink: 0 }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, boxShadow: `0 0 8px ${t.accentGlow}` }} />
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: t.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
          Rekomendasi Terdekat
        </h2>
        {location && (
          <button onClick={loadPlaces} disabled={fetchingPlaces}
            style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '9px', border: 'none', background: fetchingPlaces ? t.textSecondary : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontSize: '13px', fontWeight: 600, cursor: fetchingPlaces ? 'not-allowed' : 'pointer', transition: 'all 0.2s ease' }}>
            {fetchingPlaces ? <Loader size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : '↻'} Refresh
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          {/* State: belum ada lokasi */}
          {!location && !loading && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: `0 8px 32px ${t.accentGlow}` }}>
                <MapPin size={32} color="white" />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: t.textPrimary, margin: '0 0 10px', letterSpacing: '-0.4px' }}>
                Izinkan Akses Lokasi
              </h3>
              <p style={{ color: t.textSecondary, fontSize: '15px', margin: '0 0 28px', lineHeight: 1.7 }}>
                Untuk menemukan Rumah Sakit Mata, Klinik,<br />dan Optik terdekat dari lokasi Anda
              </p>
              <button onClick={handleRequestLocation} disabled={requestingLocation}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 24px', borderRadius: '12px', border: 'none', background: requestingLocation ? t.textSecondary : `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontSize: '15px', fontWeight: 600, cursor: requestingLocation ? 'not-allowed' : 'pointer', boxShadow: requestingLocation ? 'none' : `0 4px 20px ${t.accentGlow}`, transition: 'all 0.2s ease' }}>
                {requestingLocation ? (
                  <><Loader size={18} style={{ animation: 'spin 0.8s linear infinite' }} />Meminta Akses...</>
                ) : (
                  <><MapPin size={18} />Izinkan Lokasi</>
                )}
              </button>
            </div>
          )}

          {/* State: loading */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <Loader size={44} color={t.accent} style={{ animation: 'spin 0.8s linear infinite', margin: '0 auto 16px', display: 'block' }} />
              <p style={{ color: t.textSecondary, fontSize: '15px' }}>
                {loading ? 'Mengambil lokasi Anda...' : 'Mencari fasilitas kesehatan terdekat...'}
              </p>
            </div>
          )}

          {/* State: error lokasi */}
          {error && !isLoading && (
            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle size={20} color="#F87171" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#F87171', fontSize: '14px' }}>Gagal Mengakses Lokasi</p>
                <p style={{ margin: '0 0 10px', color: '#FCA5A5', fontSize: '13px', lineHeight: 1.5 }}>{error}</p>
                <button onClick={handleRequestLocation}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.accent, fontSize: '13px', fontWeight: 600, padding: 0 }}>
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* State: error fetch OSM */}
          {fetchError && !isLoading && (
            <div style={{ padding: '16px', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.25)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <AlertCircle size={20} color="#F87171" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#F87171', fontSize: '14px' }}>Gagal Mengambil Data</p>
                <p style={{ margin: '0 0 10px', color: '#FCA5A5', fontSize: '13px', lineHeight: 1.5 }}>{fetchError}</p>
                <button onClick={loadPlaces}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.accent, fontSize: '13px', fontWeight: 600, padding: 0 }}>
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {/* State: tidak ada hasil */}
          {location && !isLoading && !fetchError && places.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <p style={{ color: t.textSecondary, fontSize: '15px' }}>
                Tidak ada fasilitas kesehatan ditemukan dalam radius <strong style={{ color: t.textPrimary }}>{settings.searchRadius} km</strong>
              </p>
              <button onClick={loadPlaces}
                style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg, ${t.accent}, ${t.accentHover})`, color: '#fff', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                Coba Lagi
              </button>
            </div>
          )}

          {/* State: ada hasil */}
          {location && !isLoading && places.length > 0 && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.textPrimary, margin: '0 0 4px', letterSpacing: '-0.3px' }}>
                  Rekomendasi dalam {settings.searchRadius} km
                </h3>
                <p style={{ color: t.textSecondary, fontSize: '13px', margin: 0 }}>
                  Ditemukan <strong style={{ color: t.accent }}>{places.length}</strong> fasilitas kesehatan
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {places.map((place, index) => (
                  <PlaceCard key={place.id} place={place} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}