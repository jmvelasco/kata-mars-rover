import { Command } from './Command';
import { Position } from './Position';

const positionAfterExecuting = (command: Command, position: Position): Position => {
  const outcomeOf: Record<Command, (from: Position) => Position> = {
    [Command.TurnLeft]: (from) => from.turnedLeft(),
    [Command.TurnRight]: (from) => from.turnedRight(),
    [Command.MoveForward]: (from) => from.movedForward(),
    [Command.MoveBackward]: (from) => from.movedBackward(),
  };

  return outcomeOf[command](position);
};

export class Rover {
  private currentPosition: Position;

  constructor(landingPosition: Position) {
    this.currentPosition = landingPosition;
  }

  position(): Position {
    return this.currentPosition;
  }

  execute(commands: Command[]): void {
    commands.forEach((command) => {
      this.currentPosition = positionAfterExecuting(command, this.currentPosition);
    });
  }
}
