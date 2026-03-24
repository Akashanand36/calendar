// Namma Calendar 2026 — Design Tokens
export const COLORS = {
  // Brand
  saffron:      '#E8600A',
  saffronDark:  '#B84A05',
  saffronLight: 'rgba(232,96,10,0.12)',
  gold:         '#F5A623',
  goldDim:      'rgba(245,166,35,0.18)',

  // Premium
  premiumGold:  '#FFD166',
  premiumAmber: '#F0A500',

  // Backgrounds
  bg:           '#0D0D0D',
  surface:      '#1C1410',
  surface2:     '#261C15',
  surface3:     '#2E231A',

  // Text
  text:         '#F5EDD8',
  muted:        '#A08060',

  // Borders
  border:       'rgba(232,96,10,0.2)',
  borderSubtle: 'rgba(255,255,255,0.06)',

  // Semantic
  green:        '#4CAF7A',
  greenDim:     'rgba(76,175,122,0.15)',
  red:          '#E55A4E',
  redDim:       'rgba(229,90,78,0.15)',
  blue:         '#5B9BD5',
  blueDim:      'rgba(91,155,213,0.15)',
  purple:       '#9B59B6',
  purpleDim:    'rgba(155,89,182,0.15)',
} as const;

export type ColorKey = keyof typeof COLORS;
