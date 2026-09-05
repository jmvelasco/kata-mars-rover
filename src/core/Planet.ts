import { Coordinates } from './Coordinates';

export class Planet {
  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly obstacles: Coordinates[] = []
  ) {}

  resolve(coordinates: Coordinates): Coordinates {
    return coordinates.wrappedWithin(this.width, this.height);
  }

  hasObstacleAt(coordinates: Coordinates): boolean {
    return this.obstacles.some((obstacle) => obstacle.equals(coordinates));
  }
}
