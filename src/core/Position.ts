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
    const cellAhead: Record<Direction, () => Coordinates> = {
      [Direction.North]: () => this.coordinates.movedNorth(),
      [Direction.East]: () => this.coordinates.movedEast(),
      [Direction.South]: () => this.coordinates.movedSouth(),
      [Direction.West]: () => this.coordinates.movedWest(),
    };

    return new Position(cellAhead[this.direction](), this.direction);
  }

  movedBackward(): Position {
    const cellBehind: Record<Direction, () => Coordinates> = {
      [Direction.North]: () => this.coordinates.movedSouth(),
      [Direction.East]: () => this.coordinates.movedWest(),
      [Direction.South]: () => this.coordinates.movedNorth(),
      [Direction.West]: () => this.coordinates.movedEast(),
    };

    return new Position(cellBehind[this.direction](), this.direction);
  }
}
