const { Point, Polygon, createRegularPolygon } = require('./geometry');
const { TessellationPattern, createEscherLikeShape } = require('./tessellation');

class PatternGenerator {
  constructor() {
    this.symmetryGroups = ['p1', 'p2', 'pm', 'p3', 'p4', 'p6'];
    this.baseShapes = ['triangle', 'square', 'hexagon', 'pentagon', 'octagon'];
    this.deformationTypes = ['wave', 'spike', 'curve'];
  }

  generateRandomPattern() {
    const patterns = ['square', 'hexagon', 'triangle'];
    const patternType = this.randomChoice(patterns);
    
    switch (patternType) {
      case 'square':
        return this.createSquarePattern();
      case 'hexagon':
        return this.createHexagonPattern();
      case 'triangle':
        return this.createTrianglePattern();
      default:
        return this.createSquarePattern();
    }
  }

  createSquarePattern() {
    const size = 60;
    const square = new Polygon([
      new Point(0, 0),
      new Point(size, 0),
      new Point(size, size),
      new Point(0, size)
    ]);
    return new TessellationPattern(square, 'p1');
  }

  createHexagonPattern() {
    const radius = 30;
    const hexagon = createRegularPolygon(6, radius, new Point(0, 0));
    return new TessellationPattern(hexagon, 'p6');
  }

  createTrianglePattern() {
    const size = 60;
    const height = size * Math.sqrt(3) / 2;
    const triangle = new Polygon([
      new Point(0, 0),
      new Point(size, 0),
      new Point(size/2, height)
    ]);
    return new TessellationPattern(triangle, 'p3');
  }

  createBaseShape(type) {
    const size = 50;
    
    switch (type) {
      case 'triangle':
        return createRegularPolygon(3, size);
        
      case 'square':
        return new Polygon([
          new Point(-size/2, -size/2),
          new Point(size/2, -size/2),
          new Point(size/2, size/2),
          new Point(-size/2, size/2)
        ]);
        
      case 'hexagon':
        return createRegularPolygon(6, size);
        
      case 'pentagon':
        return createRegularPolygon(5, size);
        
      case 'octagon':
        return createRegularPolygon(8, size);
        
      default:
        return createRegularPolygon(4, size);
    }
  }

  generateRandomDeformations(count, edgeCount) {
    const deformations = [];
    const usedEdges = new Set();
    
    for (let i = 0; i < count && usedEdges.size < edgeCount; i++) {
      let edgeIndex;
      do {
        edgeIndex = Math.floor(Math.random() * edgeCount);
      } while (usedEdges.has(edgeIndex));
      
      usedEdges.add(edgeIndex);
      
      const type = this.randomChoice(this.deformationTypes);
      const deformation = this.createDeformation(type, edgeIndex);
      deformations.push(deformation);
    }
    
    return deformations;
  }

  createDeformation(type, edgeIndex) {
    switch (type) {
      case 'wave':
        return {
          type: 'wave',
          params: {
            amplitude: 5 + Math.random() * 15,
            frequency: 1 + Math.random() * 3,
            edgeIndex: edgeIndex
          }
        };
        
      case 'spike':
        return {
          type: 'spike',
          params: {
            height: 10 + Math.random() * 20,
            position: 0.3 + Math.random() * 0.4,
            edgeIndex: edgeIndex
          }
        };
        
      case 'curve':
        return {
          type: 'curve',
          params: {
            controlPoint: new Point(Math.random() * 20 - 10, Math.random() * 20 - 10),
            edgeIndex: edgeIndex
          }
        };
        
      default:
        return {
          type: 'wave',
          params: {
            amplitude: 10,
            frequency: 2,
            edgeIndex: edgeIndex
          }
        };
    }
  }

  generateColorScheme() {
    const schemes = [
      {
        name: 'monochrome',
        colors: this.generateMonochromeColors()
      },
      {
        name: 'complementary',
        colors: this.generateComplementaryColors()
      },
      {
        name: 'analogous',
        colors: this.generateAnalogousColors()
      },
      {
        name: 'triadic',
        colors: this.generateTriadicColors()
      }
    ];
    
    return this.randomChoice(schemes);
  }

  generateMonochromeColors() {
    const hue = Math.random() * 360;
    return [
      this.hslToHex(hue, 70, 20),
      this.hslToHex(hue, 60, 40),
      this.hslToHex(hue, 50, 60),
      this.hslToHex(hue, 40, 80)
    ];
  }

  generateComplementaryColors() {
    const hue1 = Math.random() * 360;
    const hue2 = (hue1 + 180) % 360;
    return [
      this.hslToHex(hue1, 70, 50),
      this.hslToHex(hue1, 50, 70),
      this.hslToHex(hue2, 70, 50),
      this.hslToHex(hue2, 50, 70)
    ];
  }

  generateAnalogousColors() {
    const baseHue = Math.random() * 360;
    return [
      this.hslToHex(baseHue, 70, 50),
      this.hslToHex((baseHue + 30) % 360, 70, 50),
      this.hslToHex((baseHue + 60) % 360, 70, 50),
      this.hslToHex((baseHue + 90) % 360, 70, 50)
    ];
  }

  generateTriadicColors() {
    const hue1 = Math.random() * 360;
    const hue2 = (hue1 + 120) % 360;
    const hue3 = (hue1 + 240) % 360;
    return [
      this.hslToHex(hue1, 70, 50),
      this.hslToHex(hue2, 70, 50),
      this.hslToHex(hue3, 70, 50)
    ];
  }

  hslToHex(h, s, l) {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
}

module.exports = PatternGenerator;