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
    void this.grid; // Suppress TS6138 until used
    return this.position;
  }

  getDirection(): Direction {
    return this.direction;
  }

  execute(commands: string): void {
    void commands;
  }
}
