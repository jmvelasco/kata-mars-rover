import { West } from '../../West';
import { South } from '../../South';
import { North } from '../../North';
import { Position } from '../../Position';

describe('The West Direction', () => {
  it('turns left to South', () => {
    const west = new West();
    expect(west.turnLeft()).toBeInstanceOf(South);
  });

  it('turns right to North', () => {
    const west = new West();
    expect(west.turnRight()).toBeInstanceOf(North);
  });

  it('provides a forward vector of (-1, 0)', () => {
    const west = new West();
    expect(west.forwardVector().equals(new Position(-1, 0))).toBe(true);
  });
});
