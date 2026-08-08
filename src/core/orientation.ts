type directions = 'N' | 'S' | 'E' | 'W';

export class Orientation {
  private static readonly directions: directions[] = ['N', 'E', 'S', 'W'];

  constructor(private readonly direction: directions) {}

  static North() {
    return new Orientation('N');
  }

  static South() {
    return new Orientation('S');
  }

  static East() {
    return new Orientation('E');
  }

  static West() {
    return new Orientation('W');
  }

  rotateLeft() {
    const newDirectionIndex = (this.directionIndex() + 3) % 4;
    return new Orientation(this.getDirection(newDirectionIndex));
  }

  rotateRight() {
    const newDirectionIndex = (this.directionIndex() + 1) % 4;
    return new Orientation(this.getDirection(newDirectionIndex));
  }

  equals(other: Orientation): boolean {
    return other.direction === this.direction;
  }

  value() {
    return this.direction;
  }

  private getDirection(index: number) {
    return Orientation.directions[index];
  }

  private directionIndex() {
    return Orientation.directions.indexOf(this.direction);
  }
}
