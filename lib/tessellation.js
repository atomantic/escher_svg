const { Point, Polygon, createRegularPolygon } = require('./geometry');

class TessellationPattern {
  constructor(baseShape, symmetryGroup = 'p1') {
    this.baseShape = baseShape;
    this.symmetryGroup = symmetryGroup;
    this.tiles = [];
  }

  generateTiles(width, height, tileSize) {
    this.tiles = [];
    
    // For proper tessellation, we need to handle different patterns differently
    if (this.symmetryGroup === 'p6') {
      this.generateHexagonalTiles(width, height);
    } else if (this.symmetryGroup === 'p3') {
      this.generateTriangularTiles(width, height);
    } else {
      this.generateRegularTiles(width, height);
    }
    
    return this.tiles;
  }

  generateRegularTiles(width, height) {
    const bounds = this.baseShape.getBounds();
    const tileWidth = bounds.maxX - bounds.minX;
    const tileHeight = bounds.maxY - bounds.minY;
    
    const cols = Math.ceil(width / tileWidth) + 2;
    const rows = Math.ceil(height / tileHeight) + 2;
    
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const tiles = this.applySymmetryGroup(col, row, tileWidth, tileHeight);
        this.tiles.push(...tiles);
      }
    }
  }

  generateHexagonalTiles(width, height) {
    const bounds = this.baseShape.getBounds();
    const hexRadius = (bounds.maxX - bounds.minX) / 2;
    const hexWidth = hexRadius * 2;
    const hexHeight = hexRadius * Math.sqrt(3);
    
    const cols = Math.ceil(width / (hexWidth * 0.75)) + 2;
    const rows = Math.ceil(height / hexHeight) + 2;
    
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const offsetX = col * hexWidth * 0.75;
        const offsetY = row * hexHeight + (col % 2) * hexHeight * 0.5;
        this.tiles.push(this.baseShape.translate(offsetX, offsetY));
      }
    }
  }

  generateTriangularTiles(width, height) {
    const bounds = this.baseShape.getBounds();
    const triWidth = bounds.maxX - bounds.minX;
    const triHeight = bounds.maxY - bounds.minY;
    
    const cols = Math.ceil(width / triWidth) + 2;
    const rows = Math.ceil(height / triHeight) + 2;
    
    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const offsetX = col * triWidth;
        const offsetY = row * triHeight;
        
        // Upward triangle
        this.tiles.push(this.baseShape.translate(offsetX, offsetY));
        
        // Downward triangle (flipped)
        const flippedTri = this.baseShape.rotate(Math.PI, this.baseShape.getCenter());
        this.tiles.push(flippedTri.translate(offsetX + triWidth/2, offsetY + triHeight/3));
      }
    }
  }

  applySymmetryGroup(col, row, tileWidth, tileHeight) {
    const tiles = [];
    const baseX = col * tileWidth;
    const baseY = row * tileHeight;
    
    switch (this.symmetryGroup) {
      case 'p1':
        tiles.push(this.baseShape.translate(baseX, baseY));
        break;
        
      case 'p2':
        tiles.push(this.baseShape.translate(baseX, baseY));
        const center = new Point(baseX + tileWidth/2, baseY + tileHeight/2);
        tiles.push(this.baseShape.rotate(Math.PI, center).translate(baseX, baseY));
        break;
        
      case 'pm':
        tiles.push(this.baseShape.translate(baseX, baseY));
        const mirrorLine = { a: 1, b: 0, c: -(baseX + tileWidth/2) };
        tiles.push(this.baseShape.reflect(mirrorLine).translate(baseX, baseY));
        break;
        
      case 'p4':
        const p4Center = new Point(baseX + tileWidth/2, baseY + tileHeight/2);
        for (let i = 0; i < 4; i++) {
          tiles.push(this.baseShape.rotate(i * Math.PI/2, p4Center).translate(baseX, baseY));
        }
        break;
        
      case 'p3':
        const p3Center = new Point(baseX + tileWidth/2, baseY + tileHeight/2);
        for (let i = 0; i < 3; i++) {
          tiles.push(this.baseShape.rotate(i * 2*Math.PI/3, p3Center).translate(baseX, baseY));
        }
        break;
        
      case 'p6':
        const p6Center = new Point(baseX + tileWidth/2, baseY + tileHeight/2);
        for (let i = 0; i < 6; i++) {
          tiles.push(this.baseShape.rotate(i * Math.PI/3, p6Center).translate(baseX, baseY));
        }
        break;
        
      default:
        tiles.push(this.baseShape.translate(baseX, baseY));
    }
    
    return tiles;
  }
}

function createSquareTessellation(size) {
  const square = new Polygon([
    new Point(0, 0),
    new Point(size, 0),
    new Point(size, size),
    new Point(0, size)
  ]);
  return new TessellationPattern(square, 'p1');
}

function createHexagonalTessellation(radius) {
  // Create hexagon centered at origin for proper tessellation
  const hexagon = createRegularPolygon(6, radius, new Point(radius, radius * Math.sqrt(3)/2));
  return new TessellationPattern(hexagon, 'p6');
}

function createTriangularTessellation(size) {
  // Create equilateral triangle that tessellates properly
  const height = size * Math.sqrt(3) / 2;
  const triangle = new Polygon([
    new Point(0, 0),
    new Point(size, 0),
    new Point(size/2, height)
  ]);
  return new TessellationPattern(triangle, 'p3');
}

function createEscherLikeShape(baseShape, deformations = []) {
  let shape = baseShape;
  
  deformations.forEach(deform => {
    const { type, params } = deform;
    switch (type) {
      case 'wave':
        shape = applyWaveDeformation(shape, params);
        break;
      case 'spike':
        shape = applySpikeDeformation(shape, params);
        break;
      case 'curve':
        shape = applyCurveDeformation(shape, params);
        break;
    }
  });
  
  return shape;
}

function applyWaveDeformation(polygon, { amplitude = 10, frequency = 2, edgeIndex = 0 }) {
  const points = [...polygon.points];
  const edge1 = edgeIndex % points.length;
  const edge2 = (edgeIndex + 1) % points.length;
  
  const newPoints = [];
  const segments = 20;
  
  for (let i = 0; i < points.length; i++) {
    if (i === edge1) {
      const start = points[edge1];
      const end = points[edge2];
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const baseX = start.x + (end.x - start.x) * t;
        const baseY = start.y + (end.y - start.y) * t;
        
        const perpX = -(end.y - start.y) / Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        const perpY = (end.x - start.x) / Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
        
        const offset = amplitude * Math.sin(frequency * Math.PI * t);
        newPoints.push(new Point(baseX + perpX * offset, baseY + perpY * offset));
      }
    } else if (i !== edge2) {
      newPoints.push(points[i]);
    }
  }
  
  return new Polygon(newPoints);
}

function applySpikeDeformation(polygon, { height = 20, position = 0.5, edgeIndex = 0 }) {
  const points = [...polygon.points];
  const edge1 = edgeIndex % points.length;
  const edge2 = (edgeIndex + 1) % points.length;
  
  const newPoints = [];
  
  for (let i = 0; i < points.length; i++) {
    newPoints.push(points[i]);
    
    if (i === edge1) {
      const start = points[edge1];
      const end = points[edge2];
      
      const midX = start.x + (end.x - start.x) * position;
      const midY = start.y + (end.y - start.y) * position;
      
      const perpX = -(end.y - start.y) / Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      const perpY = (end.x - start.x) / Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
      
      newPoints.push(new Point(midX + perpX * height, midY + perpY * height));
    }
  }
  
  return new Polygon(newPoints);
}

function applyCurveDeformation(polygon, { controlPoint, edgeIndex = 0 }) {
  return polygon;
}

module.exports = {
  TessellationPattern,
  createSquareTessellation,
  createHexagonalTessellation,
  createTriangularTessellation,
  createEscherLikeShape
};