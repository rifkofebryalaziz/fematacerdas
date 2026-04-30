export interface OSMPlace {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'optik';
  rating: number;
  address: string;
  lat: number;
  lng: number;
  distance: number;
}

// Query Overpass API untuk cari fasilitas kesehatan mata terdekat
export async function fetchNearbyPlaces(
  lat: number,
  lng: number,
  radiusKm: number
): Promise<OSMPlace[]> {
  const radiusMeters = radiusKm * 1000;

  // Query mencari rumah sakit, klinik, dan optik
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      way["amenity"="hospital"](around:${radiusMeters},${lat},${lng});
      node["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      way["amenity"="clinic"](around:${radiusMeters},${lat},${lng});
      node["healthcare"="optometrist"](around:${radiusMeters},${lat},${lng});
      way["healthcare"="optometrist"](around:${radiusMeters},${lat},${lng});
      node["shop"="optician"](around:${radiusMeters},${lat},${lng});
      way["shop"="optician"](around:${radiusMeters},${lat},${lng});
    );
    out center;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) {
    throw new Error('Gagal mengambil data dari OpenStreetMap');
  }

  const data = await response.json();

  const places: OSMPlace[] = data.elements
    .filter((el: any) => el.tags?.name) // hanya yang punya nama
    .map((el: any) => {
      const elLat = el.lat ?? el.center?.lat;
      const elLng = el.lon ?? el.center?.lon;
      const tags = el.tags || {};

      // Tentukan tipe
      let type: OSMPlace['type'] = 'clinic';
      if (tags.amenity === 'hospital') type = 'hospital';
      else if (tags.shop === 'optician' || tags.healthcare === 'optometrist') type = 'optik';

      // Buat alamat dari tag OSM
      const address = [
        tags['addr:street'],
        tags['addr:housenumber'],
        tags['addr:city'],
      ].filter(Boolean).join(', ') || tags['addr:full'] || 'Alamat tidak tersedia';

      const distance = calculateDistance(lat, lng, elLat, elLng);

      return {
        id: String(el.id),
        name: tags.name,
        type,
        rating: 0, // OSM tidak punya rating
        address,
        lat: elLat,
        lng: elLng,
        distance,
      };
    })
    .filter((p: OSMPlace) => p.lat && p.lng);

  return places;
}

// Hitung jarak dalam km (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}