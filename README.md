# escher_svg

> This is just a quick, nieve test of claude code using the following prompts:
> - create a README.md for this repo that describes escher_svg as a JavaSript utility that will make a SVG of a random Escher like tessellation
> - Plan the project
> - execute the plan
> - initialize a git repo, set origin to git@github.com:atomantic/escher_svg.git and commit/push to main
> - there is empty space between the shapes

A JavaScript utility that generates SVG images of random Escher-like tessellations.

## Overview

escher_svg creates mathematically-inspired tessellation patterns reminiscent of M.C. Escher's famous works. Each generated SVG features unique, interlocking shapes that tile seamlessly across the canvas using wallpaper group symmetries and shape deformations.

## Features

- **Random Pattern Generation**: Creates unique Escher-like tessellations with organic shape deformations
- **Multiple Base Shapes**: Supports triangles, squares, hexagons, pentagons, and octagons
- **Symmetry Groups**: Implements wallpaper group transformations (p1, p2, pm, p3, p4, p6)
- **Color Schemes**: Generates harmonious color palettes (monochrome, complementary, analogous, triadic)
- **Shape Deformations**: Applies wave, spike, and curve transformations for organic Escher-like effects
- **CLI Interface**: Easy command-line tool for quick pattern generation
- **Scalable Output**: Clean SVG format for infinite scalability

## Installation

```bash
npm install escher_svg
```

## Usage

### Programmatic API

```javascript
const EscherSVG = require('escher_svg');

// Create generator instance
const escher = new EscherSVG({
  width: 800,
  height: 600,
  tileSize: 60
});

// Generate random Escher-like pattern
const svg = escher.generate();

// Generate specific patterns
const squareSVG = escher.generateSquare();
const hexSVG = escher.generateHexagonal();
const triangleSVG = escher.generateTriangular();

// Save to file
const fs = require('fs');
fs.writeFileSync('pattern.svg', svg);
```

### Command Line Interface

```bash
# Generate random pattern
escher-svg

# Specify output file and dimensions
escher-svg -o mypattern.svg -w 1200 -h 800

# Generate specific pattern type
escher-svg --pattern hexagon --tile 40

# See all options
escher-svg --help
```

### CLI Options

- `-o, --output <file>`: Output filename (default: tessellation.svg)
- `-w, --width <pixels>`: Canvas width (default: 800)
- `-h, --height <pixels>`: Canvas height (default: 600)  
- `-t, --tile <size>`: Base tile size (default: 60)
- `-p, --pattern <type>`: Pattern type: random, square, hexagon, triangle (default: random)
- `-s, --seed <number>`: Random seed for reproducible patterns

## Examples

Run the example generator to see various pattern types:

```bash
npm run example
```

This generates several example SVGs in the `examples/` directory showing different pattern types and color schemes.

## Architecture

- **Geometry Engine**: Point, Polygon, and Line classes with transformation methods
- **Tessellation System**: Pattern generation with wallpaper group symmetries
- **SVG Renderer**: Clean SVG output with styling and gradients
- **Pattern Generator**: Random shape creation with organic deformations
- **CLI Tool**: Command-line interface for easy usage

## Pattern Types

- **p1**: Simple translation (basic tiling)
- **p2**: 180° rotational symmetry
- **pm**: Mirror reflection
- **p3**: 120° rotational symmetry (triangular)
- **p4**: 90° rotational symmetry (square)
- **p6**: 60° rotational symmetry (hexagonal)

## Shape Deformations

- **Wave**: Sinusoidal edge deformation with adjustable amplitude and frequency
- **Spike**: Pointed protrusions from polygon edges
- **Curve**: Bezier curve deformations (planned)

## Testing

```bash
npm test
```

## License

MIT
