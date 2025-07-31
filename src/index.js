const SVGRenderer = require('../lib/svg-renderer');
const PatternGenerator = require('../lib/pattern-generator');
const { 
  TessellationPattern,
  createSquareTessellation,
  createHexagonalTessellation,
  createTriangularTessellation
} = require('../lib/tessellation');

class EscherSVG {
  constructor(options = {}) {
    this.width = options.width || 800;
    this.height = options.height || 600;
    this.tileSize = options.tileSize || 60;
    this.renderer = new SVGRenderer(this.width, this.height);
    this.generator = new PatternGenerator();
  }

  generate(options = {}) {
    this.renderer.clear();
    
    const pattern = options.pattern || this.generator.generateRandomPattern();
    const colorScheme = options.colorScheme || this.generator.generateColorScheme();
    
    pattern.generateTiles(this.width, this.height, this.tileSize);
    
    const tiles = pattern.tiles;
    const colors = colorScheme.colors;
    
    tiles.forEach((tile, index) => {
      const color = colors[index % colors.length];
      this.renderer.addPolygon(tile, {
        fill: color,
        stroke: '#000',
        strokeWidth: 0.5,
        opacity: 0.9
      });
    });
    
    return this.renderer.toSVG();
  }

  generateSquare(options = {}) {
    const pattern = createSquareTessellation(this.tileSize);
    return this.generate({ ...options, pattern });
  }

  generateHexagonal(options = {}) {
    const pattern = createHexagonalTessellation(this.tileSize / 2);
    return this.generate({ ...options, pattern });
  }

  generateTriangular(options = {}) {
    const pattern = createTriangularTessellation(this.tileSize);
    return this.generate({ ...options, pattern });
  }

  setDimensions(width, height) {
    this.width = width;
    this.height = height;
    this.renderer = new SVGRenderer(width, height);
  }

  setTileSize(size) {
    this.tileSize = size;
  }

  generateWithCustomShape(shape, symmetryGroup = 'p1', options = {}) {
    const pattern = new TessellationPattern(shape, symmetryGroup);
    return this.generate({ ...options, pattern });
  }

  static create(options) {
    return new EscherSVG(options);
  }
}

module.exports = EscherSVG;