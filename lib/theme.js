export const THEME = {
  // Primary brand (landing uses purple as main)
  primary:        'purple-600',
  primaryHover:   'purple-700',
  primaryRing:    'purple-500',

  // Neutrals (from landing scan)
  text:           'slate-900',
  textMuted:      'slate-600',
  mid:            'slate-500',
  border:         'slate-200',
  surface:        'white',
  surfaceAlt:     'slate-50',

  // Subtle accent surfaces seen on landing
  subtle1:        'indigo-50',
  subtle2:        'cyan-50',
};

export const BRAND = {
  // Primary CTA
  btnPrimary: `bg-\${THEME.primary} hover:bg-\${THEME.primaryHover} text-white`,
  // Links / emphasis
  link:       `text-\${THEME.primary} hover:underline`,
  // Focus states
  ring:       `focus:ring-\${THEME.primaryRing}`,
  // Neutrals (apply across inputs/labels)
  text:       `text-\${THEME.text}`,
  textMuted:  `text-\${THEME.textMuted}`,
  border:     `border-\${THEME.border}`,
  // Surfaces
  surface:    `bg-\${THEME.surface}`,
  surfaceAlt: `bg-\${THEME.surfaceAlt}`,
  // Subtle cards / callouts
  subtle1:    `bg-\${THEME.subtle1}`,
  subtle2:    `bg-\${THEME.subtle2}`,
};
