import { South } from '../../South';
import { East } from '../../East';
import { West } from '../../West';
import { Position } from '../../Position';

describe('The South Direction', () => {
  it('turns left to East', () => {
    const south = new South();
    expect(south.turnLeft()).toBeInstanceOf(East);
  });

  it('turns right to West', () => {
    const south = new South();
    expect(south.turnRight()).toBeInstanceOf(West);
  });

  it('provides a forward vector of (0, -1)', () => {
    const south = new South();
    expect(south.forwardVector().equals(new Position(0, -1))).toBe(true);
  });
});
