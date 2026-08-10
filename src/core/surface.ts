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
