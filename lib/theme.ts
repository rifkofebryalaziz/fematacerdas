export const colors = {
  dark: {
    bg: '#0A1628',
    card: '#0F2044',
    accent: '#0EA5E9',
    accentHover: '#06B6D4',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    border: '#1E3A5F',
    inputBg: '#0A1628',
    cardShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(14,165,233,0.08)',
    accentGlow: 'rgba(14,165,233,0.15)',
    bgGradient: 'radial-gradient(ellipse at 20% 50%, #0D2137 0%, #0A1628 60%), radial-gradient(ellipse at 80% 20%, #061829 0%, #0A1628 50%)',
  },
  light: {
    bg: '#F0F7FF',
    card: '#FFFFFF',
    accent: '#2563EB',
    accentHover: '#1D4ED8',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    border: '#CBD5E1',
    inputBg: '#F8FAFC',
    cardShadow: '0 25px 60px rgba(37,99,235,0.08), 0 0 0 1px rgba(203,213,225,0.8)',
    accentGlow: 'rgba(37,99,235,0.1)',
    bgGradient: 'radial-gradient(ellipse at 20% 50%, #dbeafe 0%, #F0F7FF 60%), radial-gradient(ellipse at 80% 20%, #e0f2fe 0%, #F0F7FF 50%)',
  },
};

export type ThemeColors = typeof colors.dark;