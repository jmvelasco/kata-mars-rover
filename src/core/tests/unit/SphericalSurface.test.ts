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

  it('wraps each axis around its own length', () => {
    const planet = new Planet(5, 3);

    const resolved = planet.resolve(new Coordinates(5, 3));

    expect(resolved).toEqual(new Coordinates(0, 0));
  });
});

describe('The Rover', () => {
  it('reappears on the south edge after crossing the north one', () => {
    const rover = Rover.land(new Position(new Coordinates(2, 4), Direction.North), new Planet(5, 5));

    rover.execute([Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 0), Direction.North));
  });

  it.each([
    { edge: 'east', from: new Coordinates(4, 2), facing: Direction.East, reappearsAt: new Coordinates(0, 2) },
    { edge: 'south', from: new Coordinates(2, 0), facing: Direction.South, reappearsAt: new Coordinates(2, 4) },
    { edge: 'west', from: new Coordinates(0, 2), facing: Direction.West, reappearsAt: new Coordinates(4, 2) },
  ])('reappears on the opposite edge after crossing the $edge one', ({ from, facing, reappearsAt }) => {
    const rover = Rover.land(new Position(from, facing), new Planet(5, 5));

    rover.execute([Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(reappearsAt, facing));
  });

  it('reappears on the opposite edge when it crosses one moving backward', () => {
    const rover = Rover.land(new Position(new Coordinates(2, 0), Direction.North), new Planet(5, 5));

    rover.execute([Command.MoveBackward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 4), Direction.North));
  });

  it.each([
    { beyond: 'the east edge', placedAt: new Coordinates(12, 3), reportedAt: new Coordinates(2, 3) },
    { beyond: 'the west edge', placedAt: new Coordinates(-1, 0), reportedAt: new Coordinates(4, 0) },
  ])('reports a normalised position when it is placed beyond $beyond', ({ placedAt, reportedAt }) => {
    const rover = Rover.land(new Position(placedAt, Direction.North), new Planet(5, 5));

    const position = rover.position();

    expect(position).toEqual(new Position(reportedAt, Direction.North));
  });
});
