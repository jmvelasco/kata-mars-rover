export class Coordinates {
  constructor(
    private readonly x: number,
    private readonly y: number
  ) {}

  movedBy(deltaX: number, deltaY: number): Coordinates {
    return new Coordinates(this.x + deltaX, this.y + deltaY);
  }

  wrappedWithin(width: number, height: number): Coordinates {
    const wrapped = (value: number, length: number): number => ((value % length) + length) % length;

    return new Coordinates(wrapped(this.x, width), wrapped(this.y, height));
  }
}
