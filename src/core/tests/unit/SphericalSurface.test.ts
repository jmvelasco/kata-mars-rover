import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Planet } from '../../Planet';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Planet', () => {
  it('leaves a coordinate inside the grid as it is', () => {
    const planet = new Planet(5, 3);

    const resolved = planet.resolve(new Coordinates(4, 2));

    expect(resolved).toEqual(new Coordinates(4, 2));
  });
});

describe('The Rover', () => {
  it('reappears on the south edge after crossing the north one', () => {
    const rover = new Rover(new Position(new Coordinates(2, 4), Direction.North), new Planet(5, 5));

    rover.execute([Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 0), Direction.North));
  });
});
