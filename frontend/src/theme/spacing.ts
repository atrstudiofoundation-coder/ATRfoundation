export const spacing = {
  unit: 4, // 4px spacing system
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px', // Component gap
  xl: '20px',
  xxl: '24px', // Cards padding
  xxxl: '32px',
  section: '40px', // Section gap
  gap: '16px', // Component gap
  cardPadding: '24px', // Cards padding
} as const;

export type Spacing = typeof spacing;
