import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Rover', () => {
  it('stays where it is when the sequence is empty', () => {
    const rover = new Rover(new Position(new Coordinates(1, 3), Direction.West));

    rover.execute([]);

    expect(rover.position()).toEqual(new Position(new Coordinates(1, 3), Direction.West));
  });

  it('executes the commands of a sequence in the order they were given', () => {
    const rover = new Rover(new Position(new Coordinates(0, 0), Direction.North));

    rover.execute([
      Command.MoveForward,
      Command.MoveForward,
      Command.TurnRight,
      Command.MoveForward,
      Command.MoveForward,
    ]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.East));
  });
});
