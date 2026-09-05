import { Command } from './Command';
import { Coordinates } from './Coordinates';
import { Planet } from './Planet';
import { Position } from './Position';

export class Rover {
  private currentPosition: Position;

  constructor(
    landingPosition: Position,
    private readonly planet: Planet
  ) {
    this.currentPosition = landingPosition.movedTo(planet.resolve(landingPosition.cell()));
  }

  position(): Position {
    return this.currentPosition;
  }

  execute(commands: Command[]): void {
    commands.forEach((command) => {
      this.currentPosition = this.positionAfterExecuting(command, this.currentPosition);
    });
  }

  private positionAfterExecuting(command: Command, position: Position): Position {
    const outcomeOf: Record<Command, (from: Position) => Position> = {
      [Command.TurnLeft]: (from) => from.turnedLeft(),
      [Command.TurnRight]: (from) => from.turnedRight(),
      [Command.MoveForward]: (from) => this.positionAfterMovingTo(from.cellAhead(), from),
      [Command.MoveBackward]: (from) => this.positionAfterMovingTo(from.cellBehind(), from),
    };

    return outcomeOf[command](position);
  }

  private positionAfterMovingTo(target: Coordinates, from: Position): Position {
    const landing = this.planet.resolve(target);

    if (this.planet.hasObstacleAt(landing)) {
      return from;
    }

    return from.movedTo(landing);
  }
}
