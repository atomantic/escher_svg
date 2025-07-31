#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const EscherSVG = require('../src/index');

const args = process.argv.slice(2);

function printHelp() {
  console.log(`
escher-svg - Generate random Escher-like tessellation SVGs

Usage:
  escher-svg [options]

Options:
  -o, --output <file>     Output file name (default: tessellation.svg)
  -w, --width <pixels>    Canvas width (default: 800)
  -h, --height <pixels>   Canvas height (default: 600)
  -t, --tile <size>       Base tile size (default: 60)
  -p, --pattern <type>    Pattern type: random, square, hexagon, triangle (default: random)
  -s, --seed <number>     Random seed for reproducible patterns
  --help                  Show this help message

Examples:
  escher-svg
  escher-svg -o mypattern.svg -w 1200 -h 800
  escher-svg --pattern hexagon --tile 40
`);
}

function parseArgs(args) {
  const options = {
    output: 'tessellation.svg',
    width: 800,
    height: 600,
    tileSize: 60,
    pattern: 'random'
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-o':
      case '--output':
        options.output = args[++i];
        break;
      case '-w':
      case '--width':
        options.width = parseInt(args[++i]);
        break;
      case '-h':
      case '--height':
        options.height = parseInt(args[++i]);
        break;
      case '-t':
      case '--tile':
        options.tileSize = parseInt(args[++i]);
        break;
      case '-p':
      case '--pattern':
        options.pattern = args[++i];
        break;
      case '-s':
      case '--seed':
        const seed = parseInt(args[++i]);
        Math.seedrandom = require('seedrandom');
        Math.seedrandom(seed);
        break;
      case '--help':
        printHelp();
        process.exit(0);
      default:
        console.error(`Unknown option: ${args[i]}`);
        printHelp();
        process.exit(1);
    }
  }

  return options;
}

function main() {
  const options = parseArgs(args);
  
  const escher = new EscherSVG({
    width: options.width,
    height: options.height,
    tileSize: options.tileSize
  });

  let svg;
  switch (options.pattern) {
    case 'square':
      svg = escher.generateSquare();
      break;
    case 'hexagon':
      svg = escher.generateHexagonal();
      break;
    case 'triangle':
      svg = escher.generateTriangular();
      break;
    case 'random':
    default:
      svg = escher.generate();
      break;
  }

  const outputPath = path.resolve(process.cwd(), options.output);
  fs.writeFileSync(outputPath, svg);
  console.log(`✓ Generated ${options.pattern} tessellation pattern`);
  console.log(`✓ Saved to ${outputPath}`);
}

if (require.main === module) {
  main();
}