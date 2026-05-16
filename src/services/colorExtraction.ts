import { Vibrant } from 'node-vibrant/node';
import sharp from 'sharp';
import fs from 'fs/promises';
import { ColorSwatch, PaletteResult } from '../types';
import { rgbToHsl } from '../utils/colorUtils';

export async function extractPalette(filePath: string): Promise<PaletteResult> {
  try {
    const metadata = await sharp(filePath).metadata();
    const palette = await Vibrant.from(filePath).getPalette();

    const swatches: ColorSwatch[] = Object.entries(palette)
      .filter(([, swatch]) => swatch !== null)
      .map(([name, swatch]) => {
        const [r, g, b] = swatch!.rgb;
        return {
          hex: swatch!.hex,
          rgb: { r: Math.round(r), g: Math.round(g), b: Math.round(b) },
          hsl: rgbToHsl(Math.round(r), Math.round(g), Math.round(b)),
          population: swatch!.population,
          name,
        };
      })
      .sort((a, b) => b.population - a.population);

    if (swatches.length === 0) throw new Error('Aucune couleur extraite de cette image.');

    return {
      dominant: swatches[0],
      swatches,
      imageInfo: {
        width: metadata.width ?? 0,
        height: metadata.height ?? 0,
        format: metadata.format ?? 'unknown',
      },
    };
  } finally {
    await fs.unlink(filePath).catch(() => undefined);
  }
}
