import { North } from '../../North';
import { West } from '../../West';
import { East } from '../../East';
import { Position } from '../../Position';

describe('The North Direction', () => {
  it('turns left to West', () => {
    const north = new North();
    expect(north.turnLeft()).toBeInstanceOf(West);
  });

  it('turns right to East', () => {
    const north = new North();
    expect(north.turnRight()).toBeInstanceOf(East);
  });

  it('provides a forward vector of (0, 1)', () => {
    const north = new North();
    expect(north.forwardVector().equals(new Position(0, 1))).toBe(true);
  });
});
