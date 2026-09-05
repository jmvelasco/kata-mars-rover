import { Coordinates } from './Coordinates';

export class Direction {
  static readonly North = new Direction(0, 1);
  static readonly East = new Direction(1, 0);
  static readonly South = new Direction(0, -1);
  static readonly West = new Direction(-1, 0);

  private static readonly clockwiseRing = [Direction.North, Direction.East, Direction.South, Direction.West];

  private constructor(
    private readonly stepX: number,
    private readonly stepY: number
  ) {}

  turnedLeft(): Direction {
    return this.rotatedBy(-1);
  }

  turnedRight(): Direction {
    return this.rotatedBy(1);
  }

  ahead(coordinates: Coordinates): Coordinates {
    return coordinates.movedBy(this.stepX, this.stepY);
  }

  behind(coordinates: Coordinates): Coordinates {
    return coordinates.movedBy(-this.stepX, -this.stepY);
  }

  private rotatedBy(quarterTurns: number): Direction {
    const ring = Direction.clockwiseRing;
    const quarterTurnsInRing = (ring.indexOf(this) + quarterTurns + ring.length) % ring.length;

    return ring[quarterTurnsInRing];
  }
}
