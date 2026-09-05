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

  movedForward(): Position {
    return new Position(this.direction.ahead(this.coordinates), this.direction);
  }

  movedBackward(): Position {
    return new Position(this.direction.behind(this.coordinates), this.direction);
  }
}
