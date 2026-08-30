import { North, West, East } from '../core/Direction';

describe('The North Direction', () => {
  it('turns left to West', () => {
    const north = new North();

    const nextDirection = north.turnLeft();

    expect(nextDirection).toBeInstanceOf(West);
  });

  it('turns right to East', () => {
    const north = new North();

    const nextDirection = north.turnRight();

    expect(nextDirection).toBeInstanceOf(East);
  });
});
