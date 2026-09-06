import { describe, it, expect } from '@jest/globals';
import { MarsMap } from '../../core/marsMap';
import { Coordinate } from '../../core/coordinate';

// TODO List:
// - [x] Wraps coordinate that exceeds northern boundary
// - [x] Wraps all four boundaries including negative values
// - [x] Detects obstacles

describe('The MarsMap', () => {
  it('wraps a coordinate that exceeds the northern boundary', () => {
    const map = new MarsMap(5, 5);

    const wrapped = map.wrap(Coordinate.of(0, 5));

    expect(wrapped.equals(Coordinate.of(0, 0))).toBe(true);
  });

  it('wraps coordinates for all four boundaries', () => {
    const map = new MarsMap(5, 5);

    expect(map.wrap(Coordinate.of(5, 0)).equals(Coordinate.of(0, 0))).toBe(true);
    expect(map.wrap(Coordinate.of(0, -1)).equals(Coordinate.of(0, 4))).toBe(true);
    expect(map.wrap(Coordinate.of(-1, 0)).equals(Coordinate.of(4, 0))).toBe(true);
  });

  it('detects an obstacle at a given coordinate', () => {
    const obstacle = Coordinate.of(2, 3);
    const map = new MarsMap(5, 5, [obstacle]);

    expect(map.hasObstacle(Coordinate.of(2, 3))).toBe(true);
    expect(map.hasObstacle(Coordinate.of(0, 0))).toBe(false);
  });
});
