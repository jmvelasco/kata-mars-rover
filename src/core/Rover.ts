import { Navigator } from './Navigator';
import { Direction } from './Direction';
import { Coordinate } from './Coordinate';

export type CommandResult = {
  success: boolean;
  reason?: 'OBSTACLE' | 'INVALID_COMMAND';
};

export class Rover {
  private readonly commands: Record<string, () => CommandResult> = {
    L: () => {
      this.direction = this.direction.turnLeft();
      return { success: true };
    },
    R: () => {
      this.direction = this.direction.turnRight();
      return { success: true };
    },
    M: () => this.move('M'),
    B: () => this.move('B'),
  };

  constructor(
    private coordinate: Coordinate,
    private direction: Direction,
    private readonly navigator: Navigator
  ) {
    if (!this.navigator.isValidCoordinate(this.coordinate)) {
      throw new Error('Position out of bounds');
    }
  }

  execute(commands: string): string {
    let prefix = '';
    for (const command of commands) {
      const result = this.processCommand(command);
      if (!result.success) {
        prefix = `${result.reason}:`;
        break;
      }
    }
    return `${prefix}${this.coordinate.x}:${this.coordinate.y}:${this.direction.value}`;
  }

  private processCommand(command: string): CommandResult {
    const action = this.commands[command];
    return action ? action() : { success: false, reason: 'INVALID_COMMAND' };
  }

  private move(movementType: string): CommandResult {
    const result = this.navigator.calculateNextPosition(this.coordinate, this.direction, movementType);
    if (result.success) {
      this.coordinate = result.coordinate;
      return { success: true };
    }
    return { success: false, reason: result.reason };
  }
}
