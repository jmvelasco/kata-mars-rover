export class Coordinates {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  movedBy(deltaX: number, deltaY: number): Coordinates {
    return new Coordinates(this.x + deltaX, this.y + deltaY);
  }
}
