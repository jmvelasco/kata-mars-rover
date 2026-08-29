import { Navigator } from './Navigator';

export class Rover {
  constructor(
    private x: number,
    private y: number,
    private direction: string,
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
    return `${prefix}${this.x}:${this.y}:${this.direction}`;
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
    if (this.direction === 'N') this.direction = 'W';
    else if (this.direction === 'W') this.direction = 'S';
    else if (this.direction === 'S') this.direction = 'E';
    else if (this.direction === 'E') this.direction = 'N';
  }

  private rotateRight(): void {
    if (this.direction === 'N') this.direction = 'E';
    else if (this.direction === 'E') this.direction = 'S';
    else if (this.direction === 'S') this.direction = 'W';
    else if (this.direction === 'W') this.direction = 'N';
  }
}
