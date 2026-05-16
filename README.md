# Color Palette API

API REST construite avec Node.js, Express et TypeScript qui extrait les palettes de couleurs dominantes d'images uploadées et calcule des harmonies chromatiques à partir de n'importe quelle couleur hexadécimale.

## Stack

- **Runtime** : Node.js + TypeScript
- **Framework** : Express
- **Traitement d'image** : sharp
- **Extraction de couleurs** : node-vibrant
- **Upload de fichiers** : multer

## Installation

```bash
git clone https://github.com/moreno-luc88/color-palette-api.git
cd color-palette-api
npm install
```

## Utilisation

```bash
# Développement (rechargement automatique)
npm run dev

# Build de production
npm run build
npm start
```

Le serveur démarre sur `http://localhost:3000` par défaut. Modifiable via la variable d'environnement `PORT`.

### Variables d'environnement

| Variable      | Défaut | Description                                      |
|---------------|--------|--------------------------------------------------|
| `PORT`        | `3000` | Port d'écoute du serveur                         |
| `CORS_ORIGIN` | `*`    | Origine(s) autorisées pour les requêtes CORS     |

---

## Endpoints

### `GET /health`

Vérification de l'état du serveur.

**Réponse**
```json
{
  "status": "ok",
  "timestamp": "2026-05-16T12:00:00.000Z"
}
```

---

### `POST /api/palette`

Uploade une image et extrait sa palette de couleurs dominantes.

**Requête**
- Content-Type : `multipart/form-data`
- Champ : `image` — fichier image (JPEG, PNG, WebP, GIF, TIFF)
- Taille max : **5 Mo**

**Exemple (curl)**
```bash
curl -X POST http://localhost:3000/api/palette \
  -F "image=@/chemin/vers/photo.jpg"
```

**Réponse**
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

Calcule les harmonies chromatiques à partir d'une couleur hexadécimale de base.

**Paramètres**
| Nom | Type   | Description                                   |
|-----|--------|-----------------------------------------------|
| hex | string | Code couleur hexadécimal de 6 caractères (sans `#`) |

**Exemple**
```bash
curl http://localhost:3000/api/harmonies/3a7bd5
```

**Réponse**
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

## Structure du projet

```
src/
├── routes/          # Définition des routes Express
├── controllers/     # Gestionnaires de requêtes
├── services/        # Logique d'extraction de couleurs (sharp + node-vibrant)
├── middlewares/     # Configuration de l'upload Multer
├── utils/           # Calculs couleur (conversions hex/rgb/hsl, algorithmes d'harmonie)
└── types/           # Interfaces TypeScript
uploads/             # Répertoire temporaire d'upload (nettoyé automatiquement après traitement)
```

## Licence

ISC
