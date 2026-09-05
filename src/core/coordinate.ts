export class Coordinate {
  private constructor(
    readonly x: number,
    readonly y: number
  ) {}

  static of(x: number, y: number): Coordinate {
    return new Coordinate(x, y);
  }

  equals(other: Coordinate): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
