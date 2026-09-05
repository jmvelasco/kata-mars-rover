import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Planet } from '../../Planet';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Rover', () => {
  it('stops on the last free cell when an obstacle blocks its advance', () => {
    const planet = new Planet(5, 5, [new Coordinates(0, 2)]);
    const rover = new Rover(new Position(new Coordinates(0, 0), Direction.North), planet);

    rover.execute([Command.MoveForward, Command.MoveForward, Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(0, 1), Direction.North));
  });
});
