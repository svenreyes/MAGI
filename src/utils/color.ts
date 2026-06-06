import type { AgentVisualStyle, ColorPalette } from '@/types';

/**
 * Curated palettes per visual style. Used as a deterministic stand-in for
 * AI-generated visual identities until the OpenAI image pipeline is wired up.
 */
export const STYLE_PALETTES: Record<AgentVisualStyle, ColorPalette[]> = {
  cyberpunk: [
    { primary: '#FF2E97', secondary: '#00E5FF', background: '#140021', text: '#FFFFFF' },
    { primary: '#7B2FF7', secondary: '#F5D300', background: '#0B0B17', text: '#FFFFFF' },
  ],
  minimalist: [
    { primary: '#111111', secondary: '#8A8A8A', background: '#FAFAFA', text: '#111111' },
    { primary: '#2B2B2B', secondary: '#C9C9C9', background: '#FFFFFF', text: '#1A1A1A' },
  ],
  painterly: [
    { primary: '#C2410C', secondary: '#F59E0B', background: '#FFF7ED', text: '#3B2410' },
    { primary: '#9D174D', secondary: '#F472B6', background: '#FFF1F5', text: '#3A0A1F' },
  ],
  celestial: [
    { primary: '#6D5DF6', secondary: '#22D3EE', background: '#0A0E2A', text: '#EAF0FF' },
    { primary: '#A78BFA', secondary: '#F0ABFC', background: '#10122B', text: '#F4F0FF' },
  ],
  gothic: [
    { primary: '#9B1C2E', secondary: '#6B7280', background: '#0C0C0E', text: '#EDEDED' },
    { primary: '#5B21B6', secondary: '#374151', background: '#111014', text: '#E5E5E5' },
  ],
  futuristic: [
    { primary: '#06B6D4', secondary: '#3B82F6', background: '#06141B', text: '#E6FBFF' },
    { primary: '#10B981', secondary: '#84CC16', background: '#04130E', text: '#E7FFF4' },
  ],
};

/** Pick a palette for a style deterministically based on an index seed. */
export function paletteForStyle(style: AgentVisualStyle, seed = 0): ColorPalette {
  const options = STYLE_PALETTES[style];
  return options[Math.abs(seed) % options.length];
}

/** Returns black or white depending on which contrasts better with `hex`. */
export function readableTextColor(hex: string): '#000000' | '#FFFFFF' {
  const normalized = hex.replace('#', '');
  if (normalized.length < 6) return '#000000';
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  // Perceived luminance (ITU-R BT.601).
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? '#000000' : '#FFFFFF';
}
