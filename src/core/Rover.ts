import { Command } from './Command';
import { Coordinates } from './Coordinates';
import { Direction } from './Direction';
import { Position } from './Position';

export class Rover {
  constructor(public readonly landingPosition: Position) {}

  position(): Position {
    return new Position(new Coordinates(0, 0), Direction.North);
  }

  execute(commands: Command[]): void {
    commands.forEach(() => {});
  }
}
