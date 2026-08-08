import { Orientation } from './orientation';

export class Surface {
  constructor(
    private readonly rows: number,
    private readonly columns: number
  ) {}

  dimension() {
    return {
      rows: this.rows,
      columns: this.columns,
    };
  }
}

export class Position {
  constructor(
    private readonly x: number,
    private readonly y: number,
    private readonly orientation: Orientation
  ) {}

  static create(x: number, y: number, orientation: Orientation) {
    return new Position(x, y, orientation);
  }

  wrapSurface(surface: Surface) {
    const { rows, columns } = surface.dimension();
    return (
      (this.orientation.equals(Orientation.North()) && this.y === rows - 1) ||
      (this.orientation.equals(Orientation.South()) && this.y === 0) ||
      (this.orientation.equals(Orientation.East()) && this.x === columns - 1) ||
      (this.orientation.equals(Orientation.West()) && this.x === 0)
    );
  }

  value() {
    return {
      x: this.x,
      y: this.y,
      orientation: this.orientation,
    };
  }
}
