import { Grid } from '../../Grid';
import { Position } from '../../Position';

describe('The Grid', () => {
  it('wraps around the top edge when moving North', () => {
    const grid = new Grid(10, 10);
    const startPosition = new Position(5, 9);
    const movementVector = new Position(0, 1);

    const nextPosition = grid.nextPosition(startPosition, movementVector);

    expect(nextPosition.equals(new Position(5, 0))).toBe(true);
  });
});
