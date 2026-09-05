const directions = ['N', 'E', 'S', 'W'] as const;
const deltas = [
  { dx: 0, dy: 1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: -1 },
  { dx: -1, dy: 0 },
];

export class Direction {
  private constructor(private readonly index: number) {}

  static north(): Direction {
    return new Direction(0);
  }

  static east(): Direction {
    return new Direction(1);
  }

  static south(): Direction {
    return new Direction(2);
  }

  static west(): Direction {
    return new Direction(3);
  }

  turnRight(): Direction {
    return new Direction((this.index + 1) % directions.length);
  }

  turnLeft(): Direction {
    return new Direction((this.index - 1 + directions.length) % directions.length);
  }

  delta(): { dx: number; dy: number } {
    return deltas[this.index];
  }

  equals(other: Direction): boolean {
    return this.index === other.index;
  }
}
