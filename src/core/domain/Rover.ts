import { Navigator } from './Navigator';

export class Rover {
  constructor(
    private x: number,
    private y: number,
    private direction: string,
    private readonly navigator: Navigator
  ) {}

  execute(commands: string): string {
    commands.split('').forEach(command => this.processCommand(command));
    return `${this.x}:${this.y}:${this.direction}`;
  }

  private processCommand(command: string): void {
    if (command === 'L') this.rotateLeft();
    if (command === 'R') this.rotateRight();
    if (command === 'M') this.moveForward();
  }

  private moveForward(): void {
    const result = this.navigator.calculateNextPosition(
      { x: this.x, y: this.y },
      this.direction,
      'M'
    );
    if (result.success) {
      this.x = result.coordinate.x;
      this.y = result.coordinate.y;
    }
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
