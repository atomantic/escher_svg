class SVGRenderer {
  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
    this.elements = [];
    this.defs = [];
    this.styles = {
      fill: '#333',
      stroke: '#000',
      strokeWidth: 1,
      opacity: 1
    };
  }

  setStyle(styles) {
    this.styles = { ...this.styles, ...styles };
  }

  addPolygon(polygon, styles = {}) {
    const pathData = polygon.toSVGPath();
    const elementStyles = { ...this.styles, ...styles };
    
    const element = {
      type: 'path',
      attributes: {
        d: pathData,
        fill: elementStyles.fill,
        stroke: elementStyles.stroke,
        'stroke-width': elementStyles.strokeWidth,
        opacity: elementStyles.opacity
      }
    };
    
    this.elements.push(element);
  }

  addPattern(id, tiles, tileWidth, tileHeight) {
    const pattern = {
      type: 'pattern',
      id: id,
      attributes: {
        x: 0,
        y: 0,
        width: tileWidth,
        height: tileHeight,
        patternUnits: 'userSpaceOnUse'
      },
      children: tiles.map(tile => ({
        type: 'path',
        attributes: {
          d: tile.toSVGPath(),
          fill: this.styles.fill,
          stroke: this.styles.stroke,
          'stroke-width': this.styles.strokeWidth
        }
      }))
    };
    
    this.defs.push(pattern);
  }

  addGradient(id, type = 'linear', colors = []) {
    const gradient = {
      type: type === 'linear' ? 'linearGradient' : 'radialGradient',
      id: id,
      children: colors.map((color, index) => ({
        type: 'stop',
        attributes: {
          offset: `${(index / (colors.length - 1)) * 100}%`,
          'stop-color': color.color,
          'stop-opacity': color.opacity || 1
        }
      }))
    };
    
    this.defs.push(gradient);
  }

  renderTessellation(pattern, styles = {}) {
    const tiles = pattern.tiles;
    tiles.forEach(tile => {
      this.addPolygon(tile, styles);
    });
  }

  clear() {
    this.elements = [];
    this.defs = [];
  }

  toSVG() {
    let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    svg += `<svg width="${this.width}" height="${this.height}" viewBox="0 0 ${this.width} ${this.height}" xmlns="http://www.w3.org/2000/svg">\n`;
    
    if (this.defs.length > 0) {
      svg += '  <defs>\n';
      this.defs.forEach(def => {
        svg += this.renderElement(def, 2);
      });
      svg += '  </defs>\n';
    }
    
    this.elements.forEach(element => {
      svg += this.renderElement(element, 1);
    });
    
    svg += '</svg>';
    return svg;
  }

  renderElement(element, indent = 0) {
    const spaces = '  '.repeat(indent);
    let result = `${spaces}<${element.type}`;
    
    if (element.id) {
      result += ` id="${element.id}"`;
    }
    
    if (element.attributes) {
      Object.entries(element.attributes).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          result += ` ${key}="${value}"`;
        }
      });
    }
    
    if (element.children && element.children.length > 0) {
      result += '>\n';
      element.children.forEach(child => {
        result += this.renderElement(child, indent + 1);
      });
      result += `${spaces}</${element.type}>\n`;
    } else {
      result += '/>\n';
    }
    
    return result;
  }

  addClipPath(id, polygon) {
    const clipPath = {
      type: 'clipPath',
      id: id,
      children: [{
        type: 'path',
        attributes: {
          d: polygon.toSVGPath()
        }
      }]
    };
    
    this.defs.push(clipPath);
  }

  addGroup(elements, attributes = {}) {
    const group = {
      type: 'g',
      attributes: attributes,
      children: elements
    };
    
    this.elements.push(group);
  }
}

module.exports = SVGRenderer;