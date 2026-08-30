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
}
