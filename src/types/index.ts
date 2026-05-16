export interface ColorSwatch {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  population: number;
  name: string;
}

export interface PaletteResult {
  dominant: ColorSwatch;
  swatches: ColorSwatch[];
  imageInfo: {
    width: number;
    height: number;
    format: string;
  };
}

export interface HarmonyColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface HarmonyResult {
  base: HarmonyColor;
  complementary: HarmonyColor[];
  triadic: HarmonyColor[];
  analogous: HarmonyColor[];
  splitComplementary: HarmonyColor[];
  tetradic: HarmonyColor[];
}
