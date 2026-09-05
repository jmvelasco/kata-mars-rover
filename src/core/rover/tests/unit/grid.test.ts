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

  it('identifies an obstacle at a specific position', () => {
    const grid = new Grid(10, 10, [new Position(2, 2)]);
    expect(grid.hasObstacle(new Position(2, 2))).toBe(true);
  });

  it('does not identify an obstacle when the position is clear', () => {
    const grid = new Grid(10, 10, [new Position(2, 2)]);
    expect(grid.hasObstacle(new Position(3, 3))).toBe(false);
  });
});
