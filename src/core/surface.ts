import { Position } from './position';

export class Surface {
  constructor(
    private readonly rows: number,
    private readonly columns: number
  ) {}

  normalizedPosition(position: Position) {
    const { x, y, orientation } = position.value();
    return new Position((x + this.columns) % this.columns, (y + this.rows) % this.rows, orientation);
  }

  isOutOfBounds(position: Position) {
    const { x, y } = position.value();
    return x >= this.columns || x < 0 || y >= this.rows || y < 0;
  }
}
