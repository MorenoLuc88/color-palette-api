# Color Palette API

API REST construite avec Node.js, Express et TypeScript qui extrait les palettes de couleurs dominantes d'images uploadées, identifie chaque couleur par son nom (via une base de 4 928 couleurs nommées) et calcule des harmonies chromatiques à partir de n'importe quelle couleur hexadécimale.

## Stack

- **Runtime** : Node.js + TypeScript
- **Framework** : Express
- **Traitement d'image** : sharp
- **Extraction de couleurs** : node-vibrant
- **Nommage des couleurs** : color-name-list + index pré-calculé
- **Upload de fichiers** : multer
- **Documentation** : Swagger UI (`/docs`)

## Installation

```bash
git clone https://github.com/MorenoLuc88/color-palette-api.git
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

# Régénérer l'index de nommage des couleurs (si besoin)
npm run build:color-index
```

Le serveur démarre sur `http://localhost:3000` par défaut.  
La documentation Swagger est disponible sur `http://localhost:3000/docs`.

### Variables d'environnement

| Variable      | Défaut | Description                                  |
|---------------|--------|----------------------------------------------|
| `PORT`        | `3000` | Port d'écoute du serveur                     |
| `CORS_ORIGIN` | `*`    | Origine(s) autorisées pour les requêtes CORS |

---

## Endpoints

### `GET /health`

Vérification de l'état du serveur.

**Réponse**
```json
{
  "status": "ok",
  "timestamp": "2026-05-17T10:00:00.000Z"
}
```

---

### `POST /api/palette`

Uploade une image et extrait sa palette de couleurs dominantes. Chaque couleur est accompagnée de son nom en anglais (ex. `"Sunflower"`, `"Cactus"`, `"Creamy Peach"`).

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
    "hex": "#575c30",
    "rgb": { "r": 87, "g": 92, "b": 48 },
    "hsl": { "h": 67, "s": 31, "l": 27 },
    "population": 1874,
    "name": "Cactus"
  },
  "swatches": [
    {
      "hex": "#575c30",
      "rgb": { "r": 87, "g": 92, "b": 48 },
      "hsl": { "h": 67, "s": 31, "l": 27 },
      "population": 1874,
      "name": "Cactus"
    },
    {
      "hex": "#d6ba1a",
      "rgb": { "r": 214, "g": 186, "b": 26 },
      "hsl": { "h": 51, "s": 78, "l": 47 },
      "population": 1534,
      "name": "Sunflower"
    },
    {
      "hex": "#a56c4f",
      "rgb": { "r": 165, "g": 108, "b": 79 },
      "hsl": { "h": 20, "s": 35, "l": 48 },
      "population": 824,
      "name": "Pale Brown"
    },
    {
      "hex": "#cec2b2",
      "rgb": { "r": 206, "g": 194, "b": 178 },
      "hsl": { "h": 34, "s": 22, "l": 75 },
      "population": 662,
      "name": "Grain"
    }
  ],
  "imageInfo": {
    "width": 832,
    "height": 970,
    "format": "jpeg"
  }
}
```

---

### `GET /api/harmonies/:hex`

Calcule les harmonies chromatiques à partir d'une couleur hexadécimale de base.

**Paramètres**
| Nom | Type   | Description                                         |
|-----|--------|-----------------------------------------------------|
| hex | string | Code couleur hexadécimal de 6 caractères (sans `#`) |

**Exemple**
```bash
curl http://localhost:3000/api/harmonies/575c30
```

**Réponse**
```json
{
  "base": {
    "hex": "#575c30",
    "rgb": { "r": 87, "g": 92, "b": 48 },
    "hsl": { "h": 67, "s": 31, "l": 27 }
  },
  "complementary": [
    { "hex": "#30557c", "rgb": { "r": 48, "g": 85, "b": 124 }, "hsl": { "h": 247, "s": 31, "l": 27 } }
  ],
  "triadic": [
    { "hex": "#30577c", "rgb": { "r": 48, "g": 55, "b": 124 }, "hsl": { "h": 307, "s": 31, "l": 27 } },
    { "hex": "#7c5730", "rgb": { "r": 124, "g": 87, "b": 48 }, "hsl": { "h": 27, "s": 31, "l": 27 } }
  ],
  "analogous": [
    { "hex": "#30573e", "rgb": { "r": 48, "g": 87, "b": 62 }, "hsl": { "h": 37, "s": 31, "l": 27 } },
    { "hex": "#4a5730", "rgb": { "r": 74, "g": 87, "b": 48 }, "hsl": { "h": 97, "s": 31, "l": 27 } }
  ],
  "splitComplementary": [
    { "hex": "#305c57", "rgb": { "r": 48, "g": 92, "b": 87 }, "hsl": { "h": 217, "s": 31, "l": 27 } },
    { "hex": "#30455c", "rgb": { "r": 48, "g": 69, "b": 92 }, "hsl": { "h": 277, "s": 31, "l": 27 } }
  ],
  "tetradic": [
    { "hex": "#4a305c", "rgb": { "r": 74, "g": 48, "b": 92 }, "hsl": { "h": 337, "s": 31, "l": 27 } },
    { "hex": "#30557c", "rgb": { "r": 48, "g": 85, "b": 124 }, "hsl": { "h": 247, "s": 31, "l": 27 } },
    { "hex": "#5c4a30", "rgb": { "r": 92, "g": 74, "b": 48 }, "hsl": { "h": 157, "s": 31, "l": 27 } }
  ]
}
```

---

## Structure du projet

```
src/
├── routes/           # Définition des routes Express
├── controllers/      # Gestionnaires de requêtes
├── services/         # Logique d'extraction de couleurs (sharp + node-vibrant)
├── middlewares/      # Configuration de l'upload Multer
├── utils/            # Calculs couleur (conversions hex/rgb/hsl, harmonies, nommage)
├── types/            # Interfaces TypeScript
├── swagger.ts        # Spécification OpenAPI
└── color-index.json  # Index pré-calculé de 32 768 noms de couleurs (généré par scripts/buildColorIndex.js)
scripts/
└── buildColorIndex.js  # Génère src/color-index.json depuis color-name-list
uploads/              # Répertoire temporaire d'upload (nettoyé automatiquement après traitement)
```

## Licence

ISC
