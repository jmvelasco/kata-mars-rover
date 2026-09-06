import { Coordinate } from './coordinate';

export class MarsMap {
  constructor(
    private readonly width: number,
    private readonly height: number,
    private readonly obstacles: Coordinate[] = []
  ) {}

  wrap(coordinate: Coordinate): Coordinate {
    const wrappedX = ((coordinate.x % this.width) + this.width) % this.width;
    const wrappedY = ((coordinate.y % this.height) + this.height) % this.height;
    return Coordinate.of(wrappedX, wrappedY);
  }

  hasObstacle(coordinate: Coordinate): boolean {
    return this.obstacles.some((obstacle) => obstacle.equals(coordinate));
  }
}
