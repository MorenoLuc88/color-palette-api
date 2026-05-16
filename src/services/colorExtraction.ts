import Vibrant from 'node-vibrant';
import sharp from 'sharp';
import fs from 'fs/promises';
import { ColorSwatch, PaletteResult } from '../types';
import { rgbToHsl } from '../utils/colorUtils';

export async function extractPalette(filePath: string): Promise<PaletteResult> {
  const metadata = await sharp(filePath).metadata();
  const palette = await Vibrant.from(filePath).getPalette();

  const swatches: ColorSwatch[] = Object.entries(palette)
    .filter(([, swatch]) => swatch !== null)
    .map(([name, swatch]) => {
      const [r, g, b] = swatch!.getRgb();
      return {
        hex: swatch!.getHex(),
        rgb: { r: Math.round(r), g: Math.round(g), b: Math.round(b) },
        hsl: rgbToHsl(Math.round(r), Math.round(g), Math.round(b)),
        population: swatch!.getPopulation(),
        name,
      };
    })
    .sort((a, b) => b.population - a.population);

  const dominant = swatches[0];

  await fs.unlink(filePath).catch(() => undefined);

  return {
    dominant,
    swatches,
    imageInfo: {
      width: metadata.width ?? 0,
      height: metadata.height ?? 0,
      format: metadata.format ?? 'unknown',
    },
  };
}
