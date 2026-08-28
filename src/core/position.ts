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
    const { x, y } = this.orientation.getDisplacement();
    return new Position(this.x + x, this.y + y, this.orientation);
  }

  moveBackward() {
    const { x, y } = this.orientation.getDisplacement();
    return new Position(this.x - x, this.y - y, this.orientation);
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
