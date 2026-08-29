export class Rover {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly direction: string
  ) {}

  execute(commands: string): string {
    return '';
  }
}
