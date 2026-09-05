import { Command } from './Command';
import { Position } from './Position';

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
      if (command === Command.MoveBackward) {
        this.currentPosition = this.currentPosition.movedBackward();
        return;
      }

      if (command === Command.MoveForward) {
        this.currentPosition = this.currentPosition.movedForward();
        return;
      }

      if (command === Command.TurnRight) {
        this.currentPosition = this.currentPosition.turnedRight();
        return;
      }

      this.currentPosition = this.currentPosition.turnedLeft();
    });
  }
}
