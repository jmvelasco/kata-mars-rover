import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Planet } from '../../Planet';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Rover', () => {
  it('advances one cell north when moving forward facing north', () => {
    const rover = new Rover(new Position(new Coordinates(2, 2), Direction.North), new Planet(5, 5));

    rover.execute([Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 3), Direction.North));
  });

  it.each([
    { facing: 'east', start: Direction.East, ahead: new Coordinates(3, 2) },
    { facing: 'south', start: Direction.South, ahead: new Coordinates(2, 1) },
    { facing: 'west', start: Direction.West, ahead: new Coordinates(1, 2) },
  ])('advances one cell when moving forward facing $facing', ({ start, ahead }) => {
    const rover = new Rover(new Position(new Coordinates(2, 2), start), new Planet(5, 5));

    rover.execute([Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(ahead, start));
  });

  it('retreats one cell south when moving backward facing north', () => {
    const rover = new Rover(new Position(new Coordinates(2, 2), Direction.North), new Planet(5, 5));

    rover.execute([Command.MoveBackward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 1), Direction.North));
  });

  it.each([
    { facing: 'east', start: Direction.East, behind: new Coordinates(1, 2) },
    { facing: 'south', start: Direction.South, behind: new Coordinates(2, 3) },
    { facing: 'west', start: Direction.West, behind: new Coordinates(3, 2) },
  ])('retreats one cell when moving backward facing $facing', ({ start, behind }) => {
    const rover = new Rover(new Position(new Coordinates(2, 2), start), new Planet(5, 5));

    rover.execute([Command.MoveBackward]);

    expect(rover.position()).toEqual(new Position(behind, start));
  });
});
