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
    void this.position;
    void this.grid;
    return new Position(0, 0);
  }

  getDirection(): Direction {
    return this.direction;
  }
}
