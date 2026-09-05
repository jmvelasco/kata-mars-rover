import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Planet } from '../../Planet';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Rover', () => {
  it('reports the position it was placed at', () => {
    const rover = Rover.land(new Position(new Coordinates(0, 0), Direction.North), new Planet(5, 5));

    const position = rover.position();

    expect(position).toEqual(new Position(new Coordinates(0, 0), Direction.North));
  });

  it('faces west after turning left from north', () => {
    const rover = Rover.land(new Position(new Coordinates(2, 2), Direction.North), new Planet(5, 5));

    rover.execute([Command.TurnLeft]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.West));
  });

  it.each([
    { from: 'west', to: 'south', start: Direction.West, expected: Direction.South },
    { from: 'south', to: 'east', start: Direction.South, expected: Direction.East },
    { from: 'east', to: 'north', start: Direction.East, expected: Direction.North },
  ])('faces $to after turning left from $from', ({ start, expected }) => {
    const rover = Rover.land(new Position(new Coordinates(2, 2), start), new Planet(5, 5));

    rover.execute([Command.TurnLeft]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), expected));
  });

  it('faces east after turning right from north', () => {
    const rover = Rover.land(new Position(new Coordinates(2, 2), Direction.North), new Planet(5, 5));

    rover.execute([Command.TurnRight]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.East));
  });

  it('faces north again after four right turns', () => {
    const rover = Rover.land(new Position(new Coordinates(2, 2), Direction.North), new Planet(5, 5));

    rover.execute([Command.TurnRight, Command.TurnRight, Command.TurnRight, Command.TurnRight]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.North));
  });
});
