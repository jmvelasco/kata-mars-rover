export class Coordinates {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  movedNorth(): Coordinates {
    return new Coordinates(this.x, this.y + 1);
  }

  movedEast(): Coordinates {
    return new Coordinates(this.x + 1, this.y);
  }

  movedSouth(): Coordinates {
    return new Coordinates(this.x, this.y - 1);
  }

  movedWest(): Coordinates {
    return new Coordinates(this.x - 1, this.y);
  }
}
