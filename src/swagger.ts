const swatchColor = {
  type: 'object',
  properties: {
    hex: { type: 'string', example: '#575c30' },
    rgb: {
      type: 'object',
      properties: {
        r: { type: 'integer', example: 87 },
        g: { type: 'integer', example: 92 },
        b: { type: 'integer', example: 48 },
      },
    },
    hsl: {
      type: 'object',
      properties: {
        h: { type: 'integer', example: 67 },
        s: { type: 'integer', example: 31 },
        l: { type: 'integer', example: 27 },
      },
    },
    population: { type: 'integer', example: 1874 },
    name: { type: 'string', example: 'Cactus' },
  },
};

const harmonyColor = {
  type: 'object',
  properties: {
    hex: { type: 'string', example: '#3a7bd5' },
    rgb: {
      type: 'object',
      properties: {
        r: { type: 'integer', example: 58 },
        g: { type: 'integer', example: 123 },
        b: { type: 'integer', example: 213 },
      },
    },
    hsl: {
      type: 'object',
      properties: {
        h: { type: 'integer', example: 214 },
        s: { type: 'integer', example: 64 },
        l: { type: 'integer', example: 53 },
      },
    },
  },
};

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Color Palette API',
    version: '1.0.0',
    description:
      'Extrait les palettes de couleurs dominantes depuis des images et calcule des harmonies chromatiques.',
  },
  servers: [{ url: 'http://localhost:3000' }],
  paths: {
    '/health': {
      get: {
        tags: ['Statut'],
        summary: "Vérification de l'état du serveur",
        responses: {
          '200': {
            description: 'Serveur opérationnel',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    timestamp: { type: 'string', format: 'date-time', example: '2026-05-17T10:00:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/palette': {
      post: {
        tags: ['Palette'],
        summary: "Extraire la palette de couleurs d'une image",
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['image'],
                properties: {
                  image: {
                    type: 'string',
                    format: 'binary',
                    description: 'Image (JPEG, PNG, WebP, GIF, TIFF — max 5 Mo)',
                  },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Palette extraite avec succès',
            content: {
              'application/json': {
                example: {
                  dominant: {
                    hex: '#575c30',
                    rgb: { r: 87, g: 92, b: 48 },
                    hsl: { h: 67, s: 31, l: 27 },
                    population: 1874,
                    name: 'Cactus',
                  },
                  swatches: [
                    {
                      hex: '#575c30',
                      rgb: { r: 87, g: 92, b: 48 },
                      hsl: { h: 67, s: 31, l: 27 },
                      population: 1874,
                      name: 'Cactus',
                    },
                    {
                      hex: '#d6ba1a',
                      rgb: { r: 214, g: 186, b: 26 },
                      hsl: { h: 51, s: 78, l: 47 },
                      population: 1534,
                      name: 'Sunflower',
                    },
                    {
                      hex: '#a56c4f',
                      rgb: { r: 165, g: 108, b: 79 },
                      hsl: { h: 20, s: 35, l: 48 },
                      population: 824,
                      name: 'Pale Brown',
                    },
                    {
                      hex: '#cec2b2',
                      rgb: { r: 206, g: 194, b: 178 },
                      hsl: { h: 34, s: 22, l: 75 },
                      population: 662,
                      name: 'Grain',
                    },
                  ],
                  imageInfo: {
                    width: 832,
                    height: 970,
                    format: 'jpeg',
                  },
                },
                schema: {
                  type: 'object',
                  properties: {
                    dominant: swatchColor,
                    swatches: { type: 'array', items: swatchColor },
                    imageInfo: {
                      type: 'object',
                      properties: {
                        width: { type: 'integer', example: 832 },
                        height: { type: 'integer', example: 970 },
                        format: { type: 'string', example: 'jpeg' },
                      },
                    },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Aucun fichier fourni ou type non supporté',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { error: { type: 'string' } } },
              },
            },
          },
          '500': {
            description: "Erreur lors de l'extraction",
            content: {
              'application/json': {
                schema: { type: 'object', properties: { error: { type: 'string' } } },
              },
            },
          },
        },
      },
    },
    '/api/harmonies/{hex}': {
      get: {
        tags: ['Harmonies'],
        summary: "Calculer les harmonies chromatiques d'une couleur",
        parameters: [
          {
            name: 'hex',
            in: 'path',
            required: true,
            description: 'Code couleur hexadécimal de 6 caractères (sans #)',
            schema: { type: 'string', pattern: '^[0-9A-Fa-f]{6}$', example: '575c30' },
          },
        ],
        responses: {
          '200': {
            description: 'Harmonies calculées avec succès',
            content: {
              'application/json': {
                example: {
                  base: {
                    hex: '#575c30',
                    rgb: { r: 87, g: 92, b: 48 },
                    hsl: { h: 67, s: 31, l: 27 },
                  },
                  complementary: [
                    { hex: '#30557c', rgb: { r: 48, g: 85, b: 124 }, hsl: { h: 247, s: 31, l: 27 } },
                  ],
                  triadic: [
                    { hex: '#30577c', rgb: { r: 48, g: 55, b: 124 }, hsl: { h: 307, s: 31, l: 27 } },
                    { hex: '#7c5730', rgb: { r: 124, g: 87, b: 48 }, hsl: { h: 27, s: 31, l: 27 } },
                  ],
                  analogous: [
                    { hex: '#30573e', rgb: { r: 48, g: 87, b: 62 }, hsl: { h: 37, s: 31, l: 27 } },
                    { hex: '#4a5730', rgb: { r: 74, g: 87, b: 48 }, hsl: { h: 97, s: 31, l: 27 } },
                  ],
                  splitComplementary: [
                    { hex: '#305c57', rgb: { r: 48, g: 92, b: 87 }, hsl: { h: 217, s: 31, l: 27 } },
                    { hex: '#30455c', rgb: { r: 48, g: 69, b: 92 }, hsl: { h: 277, s: 31, l: 27 } },
                  ],
                  tetradic: [
                    { hex: '#4a305c', rgb: { r: 74, g: 48, b: 92 }, hsl: { h: 337, s: 31, l: 27 } },
                    { hex: '#30557c', rgb: { r: 48, g: 85, b: 124 }, hsl: { h: 247, s: 31, l: 27 } },
                    { hex: '#5c4a30', rgb: { r: 92, g: 74, b: 48 }, hsl: { h: 157, s: 31, l: 27 } },
                  ],
                },
                schema: {
                  type: 'object',
                  properties: {
                    base: harmonyColor,
                    complementary: { type: 'array', items: harmonyColor },
                    triadic: { type: 'array', items: harmonyColor },
                    analogous: { type: 'array', items: harmonyColor },
                    splitComplementary: { type: 'array', items: harmonyColor },
                    tetradic: { type: 'array', items: harmonyColor },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Code hexadécimal invalide',
            content: {
              'application/json': {
                schema: { type: 'object', properties: { error: { type: 'string' } } },
              },
            },
          },
        },
      },
    },
  },
};
