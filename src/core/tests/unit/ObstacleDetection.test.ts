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

  it('stops on the last free cell when an obstacle blocks its retreat', () => {
    const planet = new Planet(5, 5, [new Coordinates(2, 1)]);
    const rover = new Rover(new Position(new Coordinates(2, 3), Direction.North), planet);

    rover.execute([Command.MoveBackward, Command.MoveBackward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 2), Direction.North));
  });

  it('is blocked by an obstacle sitting across a connected edge', () => {
    const planet = new Planet(5, 5, [new Coordinates(2, 0)]);
    const rover = new Rover(new Position(new Coordinates(2, 4), Direction.North), planet);

    rover.execute([Command.MoveForward]);

    expect(rover.position()).toEqual(new Position(new Coordinates(2, 4), Direction.North));
  });

  it('reports no obstacle when it completes the whole sequence', () => {
    const rover = new Rover(new Position(new Coordinates(0, 0), Direction.North), new Planet(5, 5));

    const report = rover.execute([Command.MoveForward, Command.MoveForward]);

    expect(report).toEqual(new MissionReport(new Position(new Coordinates(0, 2), Direction.North)));
  });
});
