import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { motion } from './motion';

export const theme = {
  colors,
  typography,
  spacing,
  motion,
  shadows: {
    universal: '0px 10px 40px rgba(0,0,0,0.06)',
  },
  borderRadius: {
    card: '18px',
    button: '14px',
    input: '12px',
    dialog: '22px',
  },
} as const;

export type Theme = typeof theme;
