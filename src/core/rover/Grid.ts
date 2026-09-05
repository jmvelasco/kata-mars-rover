import { Position } from './Position';

export class Grid {
  constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  nextPosition(current: Position, vector: Position): Position {
    void current;
    void vector;
    return new Position(0, 0);
  }
}
