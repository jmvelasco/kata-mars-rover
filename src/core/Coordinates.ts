export class Coordinates {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  movedNorth(): Coordinates {
    return new Coordinates(this.x, this.y + 1);
  }
}
