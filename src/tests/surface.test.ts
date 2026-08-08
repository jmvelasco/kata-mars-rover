import { Position, Surface } from '../core/surface';
import { Orientation } from '../core/orientation';

describe('The Mars Surface', () => {
  test('manage the wrap around the surface', () => {
    const rows = 10;
    const cols = 13;
    const mars = new Surface(rows, cols);

    const wrapNorthSurface = new Position(0, rows - 1, Orientation.North());
    expect(wrapNorthSurface.wrapSurface(mars)).toBe(true);

    const wrapSouthSurface = new Position(0, 0, Orientation.South());
    expect(wrapSouthSurface.wrapSurface(mars)).toBe(true);

    const wrapEastSurface = new Position(cols - 1, 0, Orientation.East());
    expect(wrapEastSurface.wrapSurface(mars)).toBe(true);

    const wrapWestSurface = new Position(0, 0, Orientation.West());
    expect(wrapWestSurface.wrapSurface(mars)).toBe(true);
  });
});
