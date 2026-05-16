const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const nearestColor = require('nearest-color');

const data = JSON.parse(
  readFileSync(resolve(__dirname, '../node_modules/color-name-list/dist/colornames.bestof.json'), 'utf-8')
);
const map = data.reduce((acc, { name, hex }) => ({ ...acc, [name]: hex }), {});
const find = nearestColor.from(map);

// Pré-calcul : toutes les couleurs quantifiées par pas de 8 (32768 entrées)
const step = 8;
const index = {};
for (let r = 0; r < 256; r += step) {
  for (let g = 0; g < 256; g += step) {
    for (let b = 0; b < 256; b += step) {
      const hex = '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
      const match = find(hex);
      if (match) index[hex] = match.name;
    }
  }
}

writeFileSync(resolve(__dirname, '../src/color-index.json'), JSON.stringify(index));
console.log(`Index généré : ${Object.keys(index).length} entrées → src/color-index.json`);
