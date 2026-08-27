import { Orientation } from './orientation';

export class Position {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly orientation: Orientation
  ) {}

  static create(x: number, y: number, orientation: Orientation) {
    return new Position(x, y, orientation);
  }

  rotateLeft() {
    return new Position(this.x, this.y, this.orientation.rotateLeft());
  }

  rotateRight() {
    return new Position(this.x, this.y, this.orientation.rotateRight());
  }

  moveForward() {
    return {
      N: () => new Position(this.x, this.y + 1, this.orientation),
      S: () => new Position(this.x, this.y - 1, this.orientation),
      E: () => new Position(this.x + 1, this.y, this.orientation),
      W: () => new Position(this.x - 1, this.y, this.orientation),
    }[this.orientation.value()]();
  }

  moveBackward() {
    return {
      N: () => new Position(this.x, this.y - 1, this.orientation),
      S: () => new Position(this.x, this.y + 1, this.orientation),
      E: () => new Position(this.x - 1, this.y, this.orientation),
      W: () => new Position(this.x + 1, this.y, this.orientation),
    }[this.orientation.value()]();
  }

  value() {
    return {
      x: this.x,
      y: this.y,
      orientation: this.orientation,
    };
  }

  display() {
    return `${this.x}:${this.y}:${this.orientation.value()}`;
  }
}
