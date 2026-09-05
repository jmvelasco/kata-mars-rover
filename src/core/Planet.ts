import { Coordinates } from './Coordinates';

export class Planet {
  private readonly obstacles: Coordinates[];

  constructor(
    private readonly width: number,
    private readonly height: number,
    obstacles: Coordinates[] = []
  ) {
    this.obstacles = obstacles.map((obstacle) => obstacle.wrappedWithin(width, height));
  }

  resolve(coordinates: Coordinates): Coordinates {
    return coordinates.wrappedWithin(this.width, this.height);
  }

  hasObstacleAt(coordinates: Coordinates): boolean {
    const cell = this.resolve(coordinates);

    return this.obstacles.some((obstacle) => obstacle.equals(cell));
  }
}
