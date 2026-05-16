# Color Palette API

REST API built with Node.js, Express and TypeScript that extracts dominant color palettes from uploaded images and computes color harmonies from any hex color.

## Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Image processing**: sharp
- **Color extraction**: node-vibrant
- **File upload**: multer

## Installation

```bash
git clone https://github.com/moreno-luc88/color-palette-api.git
cd color-palette-api
npm install
```

## Usage

```bash
# Development (hot reload)
npm run dev

# Production build
npm run build
npm start
```

The server starts on `http://localhost:3000` by default. Override with the `PORT` environment variable.

---

## Endpoints

### `GET /health`

Health check.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2026-05-16T12:00:00.000Z"
}
```

---

### `POST /api/palette`

Upload an image and extract its dominant color palette.

**Request**
- Content-Type: `multipart/form-data`
- Field: `image` — image file (JPEG, PNG, WebP, GIF, TIFF)
- Max size: **5 MB**

**Example (curl)**
```bash
curl -X POST http://localhost:3000/api/palette \
  -F "image=@/path/to/photo.jpg"
```

**Response**
```json
{
  "dominant": {
    "hex": "#3a7bd5",
    "rgb": { "r": 58, "g": 123, "b": 213 },
    "hsl": { "h": 214, "s": 64, "l": 53 },
    "population": 4821,
    "name": "Vibrant"
  },
  "swatches": [
    {
      "hex": "#3a7bd5",
      "rgb": { "r": 58, "g": 123, "b": 213 },
      "hsl": { "h": 214, "s": 64, "l": 53 },
      "population": 4821,
      "name": "Vibrant"
    },
    {
      "hex": "#1a2a4a",
      "rgb": { "r": 26, "g": 42, "b": 74 },
      "hsl": { "h": 218, "s": 48, "l": 20 },
      "population": 3102,
      "name": "DarkVibrant"
    }
  ],
  "imageInfo": {
    "width": 1920,
    "height": 1080,
    "format": "jpeg"
  }
}
```

---

### `GET /api/harmonies/:hex`

Compute color harmony schemes from a base hex color.

**Parameters**
| Name | Type   | Description                              |
|------|--------|------------------------------------------|
| hex  | string | 6-character hex color code (without `#`) |

**Example**
```bash
curl http://localhost:3000/api/harmonies/3a7bd5
```

**Response**
```json
{
  "base": {
    "hex": "#3a7bd5",
    "rgb": { "r": 58, "g": 123, "b": 213 },
    "hsl": { "h": 214, "s": 64, "l": 53 }
  },
  "complementary": [
    { "hex": "#d5843a", "rgb": { "r": 213, "g": 132, "b": 58 }, "hsl": { "h": 34, "s": 64, "l": 53 } }
  ],
  "triadic": [
    { "hex": "#d53a7b", "rgb": { "r": 213, "g": 58, "b": 123 }, "hsl": { "h": 334, "s": 64, "l": 53 } },
    { "hex": "#7bd53a", "rgb": { "r": 123, "g": 213, "b": 58 }, "hsl": { "h": 94, "s": 64, "l": 53 } }
  ],
  "analogous": [
    { "hex": "#3aa5d5", "rgb": { "r": 58, "g": 165, "b": 213 }, "hsl": { "h": 184, "s": 64, "l": 53 } },
    { "hex": "#3a51d5", "rgb": { "r": 58, "g": 81, "b": 213 }, "hsl": { "h": 244, "s": 64, "l": 53 } }
  ],
  "splitComplementary": [
    { "hex": "#d5a33a", "rgb": { "r": 213, "g": 163, "b": 58 }, "hsl": { "h": 4, "s": 64, "l": 53 } },
    { "hex": "#d5623a", "rgb": { "r": 213, "g": 98, "b": 58 }, "hsl": { "h": 64, "s": 64, "l": 53 } }
  ],
  "tetradic": [
    { "hex": "#7b3ad5", "rgb": { "r": 123, "g": 58, "b": 213 }, "hsl": { "h": 304, "s": 64, "l": 53 } },
    { "hex": "#d5843a", "rgb": { "r": 213, "g": 132, "b": 58 }, "hsl": { "h": 34, "s": 64, "l": 53 } },
    { "hex": "#84d53a", "rgb": { "r": 132, "g": 213, "b": 58 }, "hsl": { "h": 124, "s": 64, "l": 53 } }
  ]
}
```

---

## Project Structure

```
src/
├── routes/          # Express route definitions
├── controllers/     # Request handlers
├── services/        # Color extraction logic (sharp + node-vibrant)
├── middlewares/     # Multer upload configuration
├── utils/           # Color math (hex/rgb/hsl conversions, harmony algorithms)
└── types/           # TypeScript interfaces
uploads/             # Temporary upload directory (auto-cleaned after processing)
```

## License

ISC
