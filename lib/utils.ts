export function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

export function getPlaceIcon(type: string): string {
  switch (type) {
    case 'hospital':
      return '🏥';
    case 'clinic':
      return '👁';
    case 'optik':
      return '👓';
    default:
      return '📍';
  }
}