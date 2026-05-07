import { styleVariants } from '@vanilla-extract/css';

import { vars } from './tokens.css';

export const typography = styleVariants({
  f40EB: { fontSize: '2.5rem', lineHeight: '3.25rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f40B:  { fontSize: '2.5rem', lineHeight: '3.25rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f40R:  { fontSize: '2.5rem', lineHeight: '3.25rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f32EB: { fontSize: '2rem', lineHeight: '2.625rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f32B:  { fontSize: '2rem', lineHeight: '2.625rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f32R:  { fontSize: '2rem', lineHeight: '2.625rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f24EB: { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f24B:  { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f24R:  { fontSize: '1.5rem', lineHeight: '2rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f20EB: { fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f20B:  { fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f20R:  { fontSize: '1.25rem', lineHeight: '1.75rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f18EB: { fontSize: '1.125rem', lineHeight: '1.625rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f18B:  { fontSize: '1.125rem', lineHeight: '1.625rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f18R:  { fontSize: '1.125rem', lineHeight: '1.625rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f16EB: { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f16B:  { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f16R:  { fontSize: '1rem', lineHeight: '1.5rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f14EB: { fontSize: '0.875rem', lineHeight: '1.375rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f14B:  { fontSize: '0.875rem', lineHeight: '1.375rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f14R:  { fontSize: '0.875rem', lineHeight: '1.375rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f12EB: { fontSize: '0.75rem', lineHeight: '1.125rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f12B:  { fontSize: '0.75rem', lineHeight: '1.125rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f12R:  { fontSize: '0.75rem', lineHeight: '1.125rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },

  f8EB: { fontSize: '0.5rem', lineHeight: '0.75rem', fontWeight: vars.font.weight.extraBold, letterSpacing: '0.05em' },
  f8B:  { fontSize: '0.5rem', lineHeight: '0.75rem', fontWeight: vars.font.weight.bold, letterSpacing: '0.05em' },
  f8R:  { fontSize: '0.5rem', lineHeight: '0.75rem', fontWeight: vars.font.weight.regular, letterSpacing: '0.05em' },
});
