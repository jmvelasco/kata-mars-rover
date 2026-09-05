import { Rover } from '../../Rover';
import { Position } from '../../Position';
import { North } from '../../North';
import { East } from '../../East';
import { West } from '../../West';
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

  it('turns left', () => {
    const grid = new Grid(10, 10);
    const position = new Position(2, 2);
    const direction = new North();
    const rover = new Rover(position, direction, grid);

    rover.execute('L');

    expect(rover.getDirection()).toBeInstanceOf(West);
  });

  it('turns right', () => {
    const grid = new Grid(10, 10);
    const position = new Position(2, 2);
    const direction = new North();
    const rover = new Rover(position, direction, grid);

    rover.execute('R');

    expect(rover.getDirection()).toBeInstanceOf(East);
  });

  it('moves forward', () => {
    const grid = new Grid(10, 10);
    const position = new Position(2, 2);
    const direction = new North();
    const rover = new Rover(position, direction, grid);

    rover.execute('F');

    expect(rover.getPosition().equals(new Position(2, 3))).toBe(true);
  });

  it('moves backward', () => {
    const grid = new Grid(10, 10);
    const position = new Position(2, 2);
    const direction = new North();
    const rover = new Rover(position, direction, grid);

    const result = rover.execute('B');

    expect(rover.getPosition().equals(new Position(2, 1))).toBe(true);
    expect(result).toBe('2:1:N');
  });

  it('stops at obstacle and reports it', () => {
    const grid = new Grid(10, 10, [new Position(2, 4)]);
    const position = new Position(2, 2);
    const direction = new North();
    const rover = new Rover(position, direction, grid);

    const result = rover.execute('FFF');

    expect(rover.getPosition().equals(new Position(2, 3))).toBe(true);
    expect(result).toBe('O:2:3:N');
  });
});
