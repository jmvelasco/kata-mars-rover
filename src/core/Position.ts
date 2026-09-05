import { Coordinates } from './Coordinates';
import { Direction } from './Direction';

export class Position {
  constructor(
    public readonly coordinates: Coordinates,
    public readonly direction: Direction
  ) {}

  turnedLeft(): Position {
    const leftOf: Record<Direction, Direction> = {
      [Direction.North]: Direction.West,
      [Direction.West]: Direction.South,
      [Direction.South]: Direction.East,
      [Direction.East]: Direction.North,
    };

    return new Position(this.coordinates, leftOf[this.direction]);
  }

  turnedRight(): Position {
    const rightOf: Record<Direction, Direction> = {
      [Direction.North]: Direction.East,
      [Direction.East]: Direction.South,
      [Direction.South]: Direction.West,
      [Direction.West]: Direction.North,
    };

    return new Position(this.coordinates, rightOf[this.direction]);
  }

  movedForward(): Position {
    return new Position(this.coordinates.movedNorth(), this.direction);
  }
}
