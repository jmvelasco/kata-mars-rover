import { describe, it, expect } from '@jest/globals';
import { Command } from '../../Command';
import { Coordinates } from '../../Coordinates';
import { Direction } from '../../Direction';
import { MissionReport } from '../../MissionReport';
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

  it('reports the obstacle that blocked the sequence', () => {
    const planet = new Planet(5, 5, [new Coordinates(0, 2)]);
    const rover = new Rover(new Position(new Coordinates(0, 0), Direction.North), planet);

    const report = rover.execute([Command.MoveForward, Command.MoveForward, Command.MoveForward]);

    expect(report).toEqual(
      new MissionReport(new Position(new Coordinates(0, 1), Direction.North), new Coordinates(0, 2))
    );
  });

  it('discards the commands left in the sequence once it is blocked', () => {
    const planet = new Planet(5, 5, [new Coordinates(0, 2)]);
    const rover = new Rover(new Position(new Coordinates(0, 0), Direction.North), planet);

    rover.execute([
      Command.MoveForward,
      Command.MoveForward,
      Command.TurnRight,
      Command.MoveForward,
      Command.MoveForward,
    ]);

    expect(rover.position()).toEqual(new Position(new Coordinates(0, 1), Direction.North));
  });
});
