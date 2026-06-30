export const colors = {
  primary: '#4F6F52',      // Forest Green
  secondary: '#F5F1E8',    // Warm Sand
  accent: '#C17767',       // Terracotta
  success: '#5E8C61',
  warning: '#D8A24A',
  error: '#D9534F',
  background: '#FCFBF8',
  textPrimary: '#2F3A33',
  mutedText: '#6B7280',
  border: '#EAE4D5',
  card: '#FCFBF8',
} as const;

export type Colors = typeof colors;
