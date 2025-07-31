const { TessellationPattern, createSquareTessellation } = require('../lib/tessellation');
const { Polygon, Point } = require('../lib/geometry');

describe('TessellationPattern', () => {
  test('creates pattern with base shape', () => {
    const square = new Polygon([
      new Point(0, 0),
      new Point(1, 0),
      new Point(1, 1),
      new Point(0, 1)
    ]);
    const pattern = new TessellationPattern(square);
    expect(pattern.baseShape).toBe(square);
    expect(pattern.symmetryGroup).toBe('p1');
  });

  test('generates tiles for given area', () => {
    const square = new Polygon([
      new Point(0, 0),
      new Point(10, 0),
      new Point(10, 10),
      new Point(0, 10)
    ]);
    const pattern = new TessellationPattern(square);
    pattern.generateTiles(100, 100, 10);
    expect(pattern.tiles.length).toBeGreaterThan(0);
  });
});

describe('Pattern creation functions', () => {
  test('creates square tessellation', () => {
    const pattern = createSquareTessellation(20);
    expect(pattern).toBeInstanceOf(TessellationPattern);
    expect(pattern.baseShape.points).toHaveLength(4);
  });
});