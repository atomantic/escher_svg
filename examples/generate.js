const fs = require('fs');
const path = require('path');
const EscherSVG = require('../src/index');

console.log('Generating example Escher-like tessellation patterns...\n');

const examples = [
  {
    name: 'random-pattern',
    description: 'Random Escher-like pattern',
    generate: (escher) => escher.generate()
  },
  {
    name: 'square-tessellation',
    description: 'Square-based tessellation',
    generate: (escher) => escher.generateSquare()
  },
  {
    name: 'hexagonal-tessellation',
    description: 'Hexagonal tessellation',
    generate: (escher) => escher.generateHexagonal()
  },
  {
    name: 'triangular-tessellation',
    description: 'Triangular tessellation',
    generate: (escher) => escher.generateTriangular()
  }
];

const escher = new EscherSVG({
  width: 800,
  height: 600,
  tileSize: 60
});

examples.forEach(example => {
  console.log(`Generating ${example.description}...`);
  
  const svg = example.generate(escher);
  const outputPath = path.join(__dirname, `${example.name}.svg`);
  
  fs.writeFileSync(outputPath, svg);
  console.log(`✓ Saved to ${outputPath}`);
});

console.log('\nGenerating patterns with different color schemes...');

const colorExamples = [
  { name: 'monochrome', width: 600, height: 600 },
  { name: 'complementary', width: 600, height: 600 },
  { name: 'analogous', width: 600, height: 600 },
  { name: 'triadic', width: 600, height: 600 }
];

colorExamples.forEach((example, index) => {
  const colorEscher = new EscherSVG({
    width: example.width,
    height: example.height,
    tileSize: 50
  });
  
  const svg = colorEscher.generate();
  const outputPath = path.join(__dirname, `color-${example.name}.svg`);
  
  fs.writeFileSync(outputPath, svg);
  console.log(`✓ Generated ${example.name} color scheme pattern`);
});

console.log('\nAll examples generated successfully!');