import { Coordinates } from './Coordinates';
import { Direction } from './Direction';

export class Position {
  constructor(
    public readonly coordinates: Coordinates,
    public readonly direction: Direction
  ) {}

  turnedLeft(): Position {
    return new Position(this.coordinates, Direction.West);
  }
}
