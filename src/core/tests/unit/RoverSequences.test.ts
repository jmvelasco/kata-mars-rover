import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Planet } from '../../Planet';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Rover', () => {
  it('stays where it is when the sequence is empty', () => {
    const rover = Rover.land(new Position(new Coordinates(1, 3), Direction.West), new Planet(5, 5));

    rover.execute([]);

    expect(rover.position()).toEqual(new Position(new Coordinates(1, 3), Direction.West));
  });

  it('executes the commands of a sequence in the order they were given', () => {
    const rover = Rover.land(new Position(new Coordinates(0, 0), Direction.North), new Planet(5, 5));

    rover.execute([
      Command.MoveForward,
      Command.MoveForward,
      Command.TurnRight,
      Command.MoveForward,
      Command.MoveForward,
    ]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.East));
  });

  it('continues the next sequence from where the previous one ended', () => {
    const rover = Rover.land(new Position(new Coordinates(0, 0), Direction.North), new Planet(5, 5));

    rover.execute([Command.MoveForward, Command.MoveForward]);
    rover.execute([Command.TurnRight, Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(1, 2), Direction.East));
  });
});
