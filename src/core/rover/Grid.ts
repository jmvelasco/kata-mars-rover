import { Position } from './Position';

export class Grid {
  constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  nextPosition(current: Position, vector: Position): Position {
    const rawX = current.x + vector.x;
    const rawY = current.y + vector.y;

    const wrappedX = ((rawX % this.width) + this.width) % this.width;
    const wrappedY = ((rawY % this.height) + this.height) % this.height;

    return new Position(wrappedX, wrappedY);
  }
}
