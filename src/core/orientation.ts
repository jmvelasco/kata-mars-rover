export type Directions = 'N' | 'S' | 'E' | 'W';
export type Coordinates = {
  x: number;
  y: number;
};

export class Orientation {
  private static readonly directions: Directions[] = ['N', 'E', 'S', 'W'];

  constructor(private readonly direction: Directions) {}

  static create(direction: Directions) {
    return new Orientation(direction);
  }

  rotateLeft() {
    const newDirectionIndex = (this.directionIndex() + 3) % 4;
    return new Orientation(this.getDirection(newDirectionIndex));
  }

  rotateRight() {
    const newDirectionIndex = (this.directionIndex() + 1) % 4;
    return new Orientation(this.getDirection(newDirectionIndex));
  }

  getDisplacement(): Coordinates {
    return {
      E: { x: 1, y: 0 },
      W: { x: -1, y: 0 },
      N: { x: 0, y: 1 },
      S: { x: 0, y: -1 },
    }[this.direction];
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
