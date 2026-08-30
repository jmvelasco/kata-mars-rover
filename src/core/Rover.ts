import { Navigator } from './Navigator';
import { Direction } from './Direction';
import { Coordinate } from './Coordinate';

export class Rover {
  private readonly commands: Record<string, () => boolean> = {
    L: () => {
      this.direction = this.direction.turnLeft();
      return true;
    },
    R: () => {
      this.direction = this.direction.turnRight();
      return true;
    },
    M: () => this.move('M'),
    B: () => this.move('B'),
  };

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
    const action = this.commands[command];
    return action ? action() : true;
  }

  private move(movementType: string): boolean {
    const result = this.navigator.calculateNextPosition(this.coordinate, this.direction, movementType);
    if (result.success) {
      this.coordinate = result.coordinate;
      return true;
    }
    return false;
  }
}
