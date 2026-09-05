import { Coordinates } from './Coordinates';
import { Direction } from './Direction';

export class Position {
  constructor(
    private readonly coordinates: Coordinates,
    private readonly direction: Direction
  ) {}

  cell(): Coordinates {
    return this.coordinates;
  }

  cellAhead(): Coordinates {
    return this.direction.ahead(this.coordinates);
  }

  cellBehind(): Coordinates {
    return this.direction.behind(this.coordinates);
  }

  turnedLeft(): Position {
    return new Position(this.coordinates, this.direction.turnedLeft());
  }

  turnedRight(): Position {
    return new Position(this.coordinates, this.direction.turnedRight());
  }

  movedTo(coordinates: Coordinates): Position {
    return new Position(coordinates, this.direction);
  }
}
