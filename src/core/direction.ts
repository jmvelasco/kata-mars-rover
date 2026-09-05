export class Direction {
  static north(): Direction {
    return new Direction();
  }

  static east(): Direction {
    return new Direction();
  }

  turnRight(): Direction {
    return new Direction();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  equals(_other: Direction): boolean {
    return false;
  }
}
