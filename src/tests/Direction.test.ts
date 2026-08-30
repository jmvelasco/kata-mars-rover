import { North, West } from '../core/Direction';

describe('The North Direction', () => {
  it('turns left to West', () => {
    const north = new North();

    const nextDirection = north.turnLeft();

    expect(nextDirection).toBeInstanceOf(West);
  });
});
