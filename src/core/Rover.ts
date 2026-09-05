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
    commands.forEach(() => {
      this.currentPosition = this.currentPosition.turnedLeft();
    });
  }
}
