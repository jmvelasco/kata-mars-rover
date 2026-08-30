import { Navigator } from './Navigator';
import { Direction } from './Direction';
import { Coordinate } from './Coordinate';

export class Rover {
  constructor(
    private coordinate: Coordinate,
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
    return `${prefix}${this.coordinate.x}:${this.coordinate.y}:${this.direction.value}`;
  }

  private processCommand(command: string): boolean {
    if (command === 'L') this.rotateLeft();
    else if (command === 'R') this.rotateRight();
    else if (command === 'M' || command === 'B') return this.move(command);

    return true;
  }

  private move(movementType: string): boolean {
    const result = this.navigator.calculateNextPosition(this.coordinate, this.direction, movementType);
    if (result.success) {
      this.coordinate = result.coordinate;
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
