import { describe, it, expect } from '@jest/globals';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { Planet } from '../../Planet';
import { Position } from '../../Position';
import { Rover } from '../../Rover';

describe('The Rover', () => {
  it('refuses to land on a cell occupied by an obstacle', () => {
    const planet = new Planet(5, 5, [new Coordinates(1, 1)]);

    const landing = () => Rover.land(new Position(new Coordinates(1, 1), Direction.North), planet);

    expect(landing).toThrow('Cannot land on a cell occupied by an obstacle');
  });
});
