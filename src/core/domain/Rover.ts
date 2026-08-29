export class Rover {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private direction: string
  ) {}

  execute(commands: string): string {
    if (commands === 'L') {
      this.direction = 'W';
    }
    return `${this.x}:${this.y}:${this.direction}`;
  }
}
