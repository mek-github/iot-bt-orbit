// Design System - Color Palette, Typography, and Spacing Constants

export const Colors = {
  light: {
    background: '#FFFFFF',
    primaryText: '#000000',
    secondaryText: '#666666',
    placeholder: '#E0E0E0',
    skeletonDark: '#D3D3D3',
    accent: '#4DC4C4',
    accentLight: '#5DD5D5',
    navBar: '#F0F0F0',
    navBarAlt: '#E8E8E8',
  },
  dark: {
    background: '#0A0F1C',
    backgroundAlt: '#0D1425',
    card: '#1A2332',
    cardAlt: '#1E2738',
    primaryText: '#FFFFFF',
    secondaryText: '#B0B8C6',
    accent: '#4DC4C4',
    glow: '#4DC4C4',
    navBar: '#1A1A1A',
    profileBlue: '#3A5A7A',
    profileBlueDark: '#4A6A8A',
    listCard: '#253244',
  },
};

export const Typography = {
  appTitle: {
    fontWeight: '700' as const,
    fontSize: 16,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  headline: {
    fontWeight: '700' as const,
    fontSize: 22,
    lineHeight: 28.6,
  },
  headlineLarge: {
    fontWeight: '700' as const,
    fontSize: 24,
    lineHeight: 31.2,
  },
  body: {
    fontWeight: '400' as const,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontWeight: '500' as const,
    fontSize: 15,
    lineHeight: 22.5,
  },
  small: {
    fontWeight: '400' as const,
    fontSize: 13,
    lineHeight: 19.5,
  },
  caption: {
    fontWeight: '400' as const,
    fontSize: 12,
    lineHeight: 18,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  screenPadding: 20,
  cardPadding: 18,
};

export const BorderRadius = {
  small: 12,
  medium: 16,
  large: 20,
  pill: 28,
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};
