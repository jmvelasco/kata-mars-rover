import { Navigator } from './Navigator';
import { Direction } from './Direction';
import { Coordinate } from './Coordinate';

export type CommandResult = {
  success: boolean;
  reason?: 'OBSTACLE' | 'INVALID_COMMAND';
};

export type Command = 'L' | 'R' | 'M' | 'B';

export class Rover {
  private readonly commands: Record<Command, () => CommandResult> = {
    L: () => this.rotate('L'),
    R: () => this.rotate('R'),
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

  private isCommand(command: string): command is Command {
    return command === 'L' || command === 'R' || command === 'M' || command === 'B';
  }

  private processCommand(command: string): CommandResult {
    if (!this.isCommand(command)) {
      return { success: false, reason: 'INVALID_COMMAND' };
    }
    return this.commands[command]();
  }

  private move(movementType: 'M' | 'B'): CommandResult {
    const result = this.navigator.calculateNextPosition(this.coordinate, this.direction, movementType);
    if (result.success) {
      this.coordinate = result.coordinate;
      return { success: true };
    }
    return { success: false, reason: result.reason };
  }

  private rotate(turnType: 'L' | 'R'): CommandResult {
    this.direction = turnType === 'L' ? this.direction.turnLeft() : this.direction.turnRight();
    return { success: true };
  }
}
