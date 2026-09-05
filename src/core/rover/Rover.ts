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

  execute(commands: string): string {
    for (const command of commands) {
      if (command === 'L') {
        this.direction = this.direction.turnLeft();
      } else if (command === 'R') {
        this.direction = this.direction.turnRight();
      } else if (command === 'F') {
        const next = this.grid.nextPosition(this.position, this.direction.forwardVector());
        if (this.grid.hasObstacle(next)) {
          return `O:${this.position.x}:${this.position.y}:${this.direction.constructor.name.charAt(0)}`;
        }
        this.position = next;
      } else if (command === 'B') {
        const forward = this.direction.forwardVector();
        const backward = new Position(-forward.x, -forward.y);
        const next = this.grid.nextPosition(this.position, backward);
        if (this.grid.hasObstacle(next)) {
          return `O:${this.position.x}:${this.position.y}:${this.direction.constructor.name.charAt(0)}`;
        }
        this.position = next;
      }
    }
    return `${this.position.x}:${this.position.y}:${this.direction.constructor.name.charAt(0)}`;
  }
}
