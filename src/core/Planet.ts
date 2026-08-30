import { Coordinate } from './Coordinate';

export class Planet {
  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly obstacles: Coordinate[]
  ) {}

  hasObstacleAt(coordinate: Coordinate): boolean {
    return this.obstacles.some((obstacle) => obstacle.x === coordinate.x && obstacle.y === coordinate.y);
  }

  isWithinBounds(coordinate: Coordinate): boolean {
    return coordinate.x >= 0 && coordinate.x < this.width && coordinate.y >= 0 && coordinate.y < this.height;
  }

  wrap(coordinate: Coordinate): Coordinate {
    let { x, y } = coordinate;

    if (y >= this.height) y = 0;
    else if (y < 0) y = this.height - 1;

    if (x >= this.width) x = 0;
    else if (x < 0) x = this.width - 1;

    return { x, y };
  }
}
