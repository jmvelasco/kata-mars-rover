import { Command } from './Command';
import { Planet } from './Planet';
import { Position } from './Position';

export class Rover {
  private currentPosition: Position;

  constructor(
    landingPosition: Position,
    private readonly planet: Planet
  ) {
    this.currentPosition = landingPosition;
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
      [Command.MoveForward]: (from) => from.movedTo(this.planet.resolve(from.cellAhead())),
      [Command.MoveBackward]: (from) => from.movedTo(this.planet.resolve(from.cellBehind())),
    };

    return outcomeOf[command](position);
  }
}
