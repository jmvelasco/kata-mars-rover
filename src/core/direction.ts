const directions = ['N', 'E', 'S', 'W'] as const;

export class Direction {
  private constructor(private readonly index: number) {}

  static north(): Direction {
    return new Direction(0);
  }

  static east(): Direction {
    return new Direction(1);
  }

  turnRight(): Direction {
    return new Direction((this.index + 1) % directions.length);
  }

  equals(other: Direction): boolean {
    return this.index === other.index;
  }
}
