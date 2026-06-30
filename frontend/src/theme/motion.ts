export const motion = {
  duration: '200ms', // 200–300ms
  transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  hoverScale: 'scale(1.02)',
  animations: {
    fade: 'animate-fade-in',
    scale: 'animate-scale-in',
    slide: 'animate-slide-in',
  },
} as const;

export type Motion = typeof motion;
