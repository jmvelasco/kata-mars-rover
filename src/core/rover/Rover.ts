import { Position } from './Position';
import { Direction } from './Direction';
import { Grid } from './Grid';

export class Rover {
  constructor(
    private position: Position,
    private direction: Direction,
    private readonly grid: Grid
  ) {}

  getPosition(): Position {
    return this.position;
  }

  getDirection(): Direction {
    return this.direction;
  }

  execute(commands: string): void {
    commands.split('').forEach((command) => {
      if (command === 'L') {
        this.direction = this.direction.turnLeft();
      }
      if (command === 'R') {
        this.direction = this.direction.turnRight();
      }
      if (command === 'F') {
        this.position = this.grid.nextPosition(this.position, this.direction.forwardVector());
      }
      if (command === 'B') {
        const forward = this.direction.forwardVector();
        const backward = new Position(-forward.x, -forward.y);
        this.position = this.grid.nextPosition(this.position, backward);
      }
    });
  }
}
