import { Navigator } from './Navigator';
import { Direction } from './Direction';

export class Rover {
  constructor(
    private x: number,
    private y: number,
    private direction: Direction,
    private readonly navigator: Navigator
  ) {}

  execute(commands: string): string {
    let obstacleHit = false;
    for (const command of commands) {
      if (!this.processCommand(command)) {
        obstacleHit = true;
        break;
      }
    }
    const prefix = obstacleHit ? 'O:' : '';
    return `${prefix}${this.x}:${this.y}:${this.direction.value}`;
  }

  private processCommand(command: string): boolean {
    if (command === 'L') this.rotateLeft();
    else if (command === 'R') this.rotateRight();
    else if (command === 'M' || command === 'B') return this.move(command);

    return true;
  }

  private move(movementType: string): boolean {
    const result = this.navigator.calculateNextPosition({ x: this.x, y: this.y }, this.direction, movementType);
    if (result.success) {
      this.x = result.coordinate.x;
      this.y = result.coordinate.y;
      return true;
    }
    return false;
  }

  private rotateLeft(): void {
    this.direction = this.direction.turnLeft();
  }

  private rotateRight(): void {
    this.direction = this.direction.turnRight();
  }
}
