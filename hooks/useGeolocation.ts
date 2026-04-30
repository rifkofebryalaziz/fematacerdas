'use client';

import { useState, useEffect } from 'react';
import { getCurrentLocation, Coordinates } from '@/lib/geolocation';

export function useGeolocation() {
  const [location, setLocation] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const coords = await getCurrentLocation();
      setLocation(coords);
    } catch (err) {
      setError('Tidak dapat mengakses lokasi Anda');
    } finally {
      setLoading(false);
    }
  };

  return { location, error, loading, getLocation };
}