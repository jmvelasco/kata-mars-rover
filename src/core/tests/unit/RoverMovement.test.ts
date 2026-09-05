import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Rover', () => {
  it('advances one cell north when moving forward facing north', () => {
    const rover = new Rover(new Position(new Coordinates(2, 2), Direction.North));

    rover.execute([Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 3), Direction.North));
  });
});
