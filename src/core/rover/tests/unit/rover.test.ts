import { Rover } from '../../Rover';
import { Position } from '../../Position';
import { North } from '../../North';
import { Grid } from '../../Grid';

describe('The Rover', () => {
  it('is initialized with a position, direction, and grid', () => {
    const grid = new Grid(10, 10);
    const position = new Position(2, 2);
    const direction = new North();
    const rover = new Rover(position, direction, grid);

    expect(rover.getPosition().equals(new Position(2, 2))).toBe(true);
    expect(rover.getDirection()).toBeInstanceOf(North);
  });
});
