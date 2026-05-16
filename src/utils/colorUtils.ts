import { readFileSync } from 'fs';
import { resolve } from 'path';
import { HarmonyColor, HarmonyResult } from '../types';

const colorIndex: Record<string, string> = JSON.parse(
  readFileSync(resolve(process.cwd(), 'src/color-index.json'), 'utf-8')
);

export function getColorName(hex: string): string {
  const c = hex.replace('#', '').toLowerCase();
  const snap = (v: string) => Math.min(248, Math.round(parseInt(v, 16) / 8) * 8);
  const r = snap(c.slice(0, 2));
  const g = snap(c.slice(2, 4));
  const b = snap(c.slice(4, 6));
  const key = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
  return colorIndex[key] ?? hex;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'))
      .join('')
  );
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn:
        h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6;
        break;
      case gn:
        h = ((bn - rn) / d + 2) / 6;
        break;
      case bn:
        h = ((rn - gn) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const hn = h / 360;
  const sn = s / 100;
  const ln = l / 100;

  if (sn === 0) {
    const v = Math.round(ln * 255);
    return { r: v, g: v, b: v };
  }

  const hue2rgb = (p: number, q: number, t: number): number => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };

  const q = ln < 0.5 ? ln * (1 + sn) : ln + sn - ln * sn;
  const p = 2 * ln - q;

  return {
    r: Math.round(hue2rgb(p, q, hn + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, hn) * 255),
    b: Math.round(hue2rgb(p, q, hn - 1 / 3) * 255),
  };
}


function buildHarmonyColor(h: number, s: number, l: number): HarmonyColor {
  const normalH = ((h % 360) + 360) % 360;
  const rgb = hslToRgb(normalH, s, l);
  return {
    hex: rgbToHex(rgb.r, rgb.g, rgb.b),
    rgb,
    hsl: { h: normalH, s, l },
  };
}

export function computeHarmonies(hex: string): HarmonyResult {
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const { h, s, l } = hsl;

  const base: HarmonyColor = {
    hex: hex.startsWith('#') ? hex : `#${hex}`,
    rgb,
    hsl,
  };

  return {
    base,
    complementary: [buildHarmonyColor(h + 180, s, l)],
    triadic: [buildHarmonyColor(h + 120, s, l), buildHarmonyColor(h + 240, s, l)],
    analogous: [buildHarmonyColor(h - 30, s, l), buildHarmonyColor(h + 30, s, l)],
    splitComplementary: [buildHarmonyColor(h + 150, s, l), buildHarmonyColor(h + 210, s, l)],
    tetradic: [
      buildHarmonyColor(h + 90, s, l),
      buildHarmonyColor(h + 180, s, l),
      buildHarmonyColor(h + 270, s, l),
    ],
  };
}
