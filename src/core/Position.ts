import { Coordinates } from './Coordinates';
import { Direction } from './Direction';

export class Position {
  constructor(
    public readonly coordinates: Coordinates,
    public readonly direction: Direction
  ) {}

  turnedLeft(): Position {
    return new Position(this.coordinates, this.direction.turnedLeft());
  }

  turnedRight(): Position {
    return new Position(this.coordinates, this.direction.turnedRight());
  }

  cellAhead(): Coordinates {
    return this.direction.ahead(this.coordinates);
  }

  cellBehind(): Coordinates {
    return this.direction.behind(this.coordinates);
  }

  movedTo(coordinates: Coordinates): Position {
    return new Position(coordinates, this.direction);
  }
}
