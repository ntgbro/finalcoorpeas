export type ColorPalette = {
  primary: string;
  primaryDark: string;
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  success: string;
  error: string;
};

export type TypographyScale = {
  display: number;
  title: number;
  subtitle: number;
  body: number;
  caption: number;
};

export type SpacingScale = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
};

export type RadiusScale = {
  sm: number;
  md: number;
  lg: number;
  pill: number;
};

export type Elevation = {
  card: number;
  modal: number;
};

export type Timing = {
  fast: number;
  normal: number;
  slow: number;
};

export type Theme = {
  colors: ColorPalette;
  typography: TypographyScale;
  spacing: SpacingScale;
  radius: RadiusScale;
  elevation: Elevation;
  timing: Timing;
  hitSlop: { top: number; bottom: number; left: number; right: number };
};

export const theme: Theme = {
  colors: {
    primary: '#2E5BBA',
    primaryDark: '#234892',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#0f172a',
    textMuted: '#475569',
    border: '#e2e8f0',
    success: '#16a34a',
    error: '#FF4444',
  },
  typography: {
    display: 44,
    title: 28,
    subtitle: 18,
    body: 16,
    caption: 12,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    pill: 999,
  },
  elevation: {
    card: 2,
    modal: 6,
  },
  timing: {
    fast: 180,
    normal: 250,
    slow: 400,
  },
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
};

export function createShadow(opacity = 0.06, height = 4, radius = 12) {
  return {
    shadowColor: '#000',
    shadowOpacity: opacity,
    shadowOffset: { width: 0, height },
    shadowRadius: radius,
    elevation: theme.elevation.card,
  };
}


