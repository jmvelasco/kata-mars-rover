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
      const obstacleHit = this.processCommand(command);
      if (obstacleHit) {
        return this.formatStatus(true);
      }
    }
    return this.formatStatus(false);
  }

  private processCommand(command: string): boolean {
    if (command === 'L') {
      this.direction = this.direction.turnLeft();
      return false;
    }
    if (command === 'R') {
      this.direction = this.direction.turnRight();
      return false;
    }
    if (command === 'F') {
      return this.tryMove(this.direction.forwardVector());
    }
    if (command === 'B') {
      const forward = this.direction.forwardVector();
      return this.tryMove(new Position(-forward.x, -forward.y));
    }
    return false;
  }

  private tryMove(vector: Position): boolean {
    const next = this.grid.nextPosition(this.position, vector);
    if (this.grid.hasObstacle(next)) {
      return true;
    }
    this.position = next;
    return false;
  }

  private formatStatus(isObstacle: boolean): string {
    const prefix = isObstacle ? 'O:' : '';
    return `${prefix}${this.position.x}:${this.position.y}:${this.direction.constructor.name.charAt(0)}`;
  }
}
