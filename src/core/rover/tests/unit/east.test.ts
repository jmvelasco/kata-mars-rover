import { East } from '../../East';
import { North } from '../../North';
import { South } from '../../South';
import { Position } from '../../Position';

describe('The East Direction', () => {
  it('turns left to North', () => {
    const east = new East();
    expect(east.turnLeft()).toBeInstanceOf(North);
  });

  it('turns right to South', () => {
    const east = new East();
    expect(east.turnRight()).toBeInstanceOf(South);
  });

  it('provides a forward vector of (1, 0)', () => {
    const east = new East();
    expect(east.forwardVector().equals(new Position(1, 0))).toBe(true);
  });
});
