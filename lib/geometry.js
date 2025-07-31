class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  translate(dx, dy) {
    return new Point(this.x + dx, this.y + dy);
  }

  rotate(angle, center = new Point(0, 0)) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const x = this.x - center.x;
    const y = this.y - center.y;
    return new Point(
      x * cos - y * sin + center.x,
      x * sin + y * cos + center.y
    );
  }

  reflect(line) {
    const { a, b, c } = line;
    const denominator = a * a + b * b;
    const x = this.x - 2 * a * (a * this.x + b * this.y + c) / denominator;
    const y = this.y - 2 * b * (a * this.x + b * this.y + c) / denominator;
    return new Point(x, y);
  }

  distance(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }
}

class Polygon {
  constructor(points) {
    this.points = points;
  }

  translate(dx, dy) {
    return new Polygon(this.points.map(p => p.translate(dx, dy)));
  }

  rotate(angle, center) {
    return new Polygon(this.points.map(p => p.rotate(angle, center)));
  }

  reflect(line) {
    return new Polygon(this.points.map(p => p.reflect(line)));
  }

  getBounds() {
    const xs = this.points.map(p => p.x);
    const ys = this.points.map(p => p.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }

  getCenter() {
    const sumX = this.points.reduce((sum, p) => sum + p.x, 0);
    const sumY = this.points.reduce((sum, p) => sum + p.y, 0);
    return new Point(sumX / this.points.length, sumY / this.points.length);
  }

  toSVGPath() {
    if (this.points.length === 0) return '';
    const start = this.points[0];
    let path = `M ${start.x} ${start.y}`;
    for (let i = 1; i < this.points.length; i++) {
      path += ` L ${this.points[i].x} ${this.points[i].y}`;
    }
    path += ' Z';
    return path;
  }
}

class Line {
  constructor(a, b, c) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  static fromTwoPoints(p1, p2) {
    const a = p2.y - p1.y;
    const b = p1.x - p2.x;
    const c = -(a * p1.x + b * p1.y);
    return new Line(a, b, c);
  }

  static fromAngleAndPoint(angle, point) {
    const a = Math.sin(angle);
    const b = -Math.cos(angle);
    const c = -(a * point.x + b * point.y);
    return new Line(a, b, c);
  }
}

function createRegularPolygon(n, radius, center = new Point(0, 0)) {
  const points = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    points.push(new Point(
      center.x + radius * Math.cos(angle),
      center.y + radius * Math.sin(angle)
    ));
  }
  return new Polygon(points);
}

module.exports = {
  Point,
  Polygon,
  Line,
  createRegularPolygon
};