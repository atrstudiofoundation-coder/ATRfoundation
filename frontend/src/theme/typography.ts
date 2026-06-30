export const typography = {
  fonts: {
    heading: 'Outfit, system-ui, sans-serif',
    body: 'Plus Jakarta Sans, system-ui, sans-serif',
  },
  sizes: {
    h1: '48px',
    h2: '36px',
    h3: '28px',
    h4: '22px',
    bodyLarge: '18px',
    body: '16px',
    caption: '14px',
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export type Typography = typeof typography;
