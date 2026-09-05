import { describe, it, expect } from '@jest/globals';
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
});
