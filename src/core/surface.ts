type Coordinate = {
  x: number;
  y: number;
};

export class Surface {
  constructor(
    private readonly rows: number,
    private readonly columns: number
  ) {}

  shouldWrapTheSurface(coordinate: Coordinate): {
    E: boolean;
    W: boolean;
    S: boolean;
    N: boolean;
  } {
    return {
      E: coordinate.x >= this.columns,
      W: coordinate.x < 0,
      S: coordinate.y < 0,
      N: coordinate.y >= this.rows,
    };
  }

  dimension() {
    return {
      rows: this.rows,
      columns: this.columns,
    };
  }
}
