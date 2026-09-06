import { describe, it, expect } from '@jest/globals';
import { MarsMap } from '../../core/marsMap';
import { Coordinate } from '../../core/coordinate';

// TODO List:
// - [ ] Wraps coordinate that exceeds northern boundary
// - [ ] Wraps all four boundaries including negative values
// - [ ] Detects obstacles

describe('The MarsMap', () => {
  it('wraps a coordinate that exceeds the northern boundary', () => {
    const map = new MarsMap(5, 5);

    const wrapped = map.wrap(Coordinate.of(0, 5));

    expect(wrapped.equals(Coordinate.of(0, 0))).toBe(true);
  });
});
