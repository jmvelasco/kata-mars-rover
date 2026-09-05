import { describe, it, expect } from '@jest/globals';
import { Direction } from '../../core/direction';

// TODO List:
// - [x] Turning right from N yields E
// - [ ] Turn right cycles through all four directions
// - [ ] Turn left from N yields W
// - [ ] Turn left cycles through all four directions
// - [ ] Direction provides movement delta

describe('The Direction', () => {
  it('faces east after turning right from north', () => {
    const direction = Direction.north();

    const turned = direction.turnRight();

    expect(turned.equals(Direction.east())).toBe(true);
  });
});
