const { Point, Polygon, Line, createRegularPolygon } = require('../lib/geometry');

describe('Point', () => {
  test('creates a point with x and y coordinates', () => {
    const point = new Point(10, 20);
    expect(point.x).toBe(10);
    expect(point.y).toBe(20);
  });

  test('translates a point', () => {
    const point = new Point(10, 20);
    const translated = point.translate(5, -10);
    expect(translated.x).toBe(15);
    expect(translated.y).toBe(10);
  });

  test('rotates a point around origin', () => {
    const point = new Point(1, 0);
    const rotated = point.rotate(Math.PI / 2);
    expect(rotated.x).toBeCloseTo(0);
    expect(rotated.y).toBeCloseTo(1);
  });

  test('calculates distance between points', () => {
    const p1 = new Point(0, 0);
    const p2 = new Point(3, 4);
    expect(p1.distance(p2)).toBe(5);
  });
});

describe('Polygon', () => {
  test('creates a polygon from points', () => {
    const points = [
      new Point(0, 0),
      new Point(1, 0),
      new Point(1, 1),
      new Point(0, 1)
    ];
    const polygon = new Polygon(points);
    expect(polygon.points).toEqual(points);
  });

  test('generates SVG path', () => {
    const square = new Polygon([
      new Point(0, 0),
      new Point(1, 0),
      new Point(1, 1),
      new Point(0, 1)
    ]);
    const path = square.toSVGPath();
    expect(path).toBe('M 0 0 L 1 0 L 1 1 L 0 1 Z');
  });

  test('calculates bounds', () => {
    const polygon = new Polygon([
      new Point(-1, -2),
      new Point(3, 1),
      new Point(0, 4)
    ]);
    const bounds = polygon.getBounds();
    expect(bounds.minX).toBe(-1);
    expect(bounds.maxX).toBe(3);
    expect(bounds.minY).toBe(-2);
    expect(bounds.maxY).toBe(4);
  });

  test('calculates center', () => {
    const square = new Polygon([
      new Point(0, 0),
      new Point(2, 0),
      new Point(2, 2),
      new Point(0, 2)
    ]);
    const center = square.getCenter();
    expect(center.x).toBe(1);
    expect(center.y).toBe(1);
  });
});

describe('createRegularPolygon', () => {
  test('creates equilateral triangle', () => {
    const triangle = createRegularPolygon(3, 1);
    expect(triangle.points).toHaveLength(3);
  });

  test('creates square', () => {
    const square = createRegularPolygon(4, 1);
    expect(square.points).toHaveLength(4);
  });

  test('creates hexagon', () => {
    const hexagon = createRegularPolygon(6, 1);
    expect(hexagon.points).toHaveLength(6);
  });
});