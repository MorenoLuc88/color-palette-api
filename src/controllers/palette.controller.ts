import { Request, Response } from 'express';
import { extractPalette } from '../services/colorExtraction';
import { computeHarmonies } from '../utils/colorUtils';

export async function postPalette(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400).json({ error: 'No image file provided.' });
    return;
  }

  try {
    const result = await extractPalette(req.file.path);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Palette extraction failed.';
    res.status(500).json({ error: message });
  }
}

export function getHarmonies(req: Request, res: Response): void {
  const hex = String(req.params['hex']);
  const hexPattern = /^[0-9A-Fa-f]{6}$/;

  if (!hexPattern.test(hex)) {
    res.status(400).json({ error: 'Invalid hex color. Provide a 6-character hex code without #.' });
    return;
  }

  try {
    const result = computeHarmonies(`#${hex}`);
    res.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Harmony computation failed.';
    res.status(500).json({ error: message });
  }
}
