import { describe, it, expect } from '@jest/globals';
import { Coordinate } from '../../core/coordinate';

// TODO List:
// - [ ] Coordinate stores x, y with equality
// - [ ] Coordinate adds delta and returns new Coordinate

describe('The Coordinate', () => {
  it('is equal to another coordinate with the same x and y', () => {
    const a = Coordinate.of(3, 5);
    const b = Coordinate.of(3, 5);

    expect(a.equals(b)).toBe(true);
  });

  it('is not equal to a coordinate with different x or y', () => {
    const coordinate = Coordinate.of(3, 5);

    expect(coordinate.equals(Coordinate.of(1, 5))).toBe(false);
    expect(coordinate.equals(Coordinate.of(3, 1))).toBe(false);
  });
});
