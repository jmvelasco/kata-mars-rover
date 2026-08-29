import { Planet } from './Planet';

export type Coordinate = { x: number; y: number };

export type NavigationResult = {
  success: boolean;
  coordinate: Coordinate;
  reason?: 'OBSTACLE';
};

export class Navigator {
  constructor(private readonly planet: Planet) {}

  calculateNextPosition(currentCoordinate: Coordinate, direction: string, movementType: string): NavigationResult {
    let { x, y } = currentCoordinate;
    const step = movementType === 'M' ? 1 : -1;

    if (direction === 'N') y += step;
    else if (direction === 'S') y -= step;
    else if (direction === 'E') x += step;
    else if (direction === 'W') x -= step;

    if (y >= this.planet.height) y = 0;
    else if (y < 0) y = this.planet.height - 1;

    if (x >= this.planet.width) x = 0;
    else if (x < 0) x = this.planet.width - 1;

    if (this.planet.hasObstacleAt({ x, y })) {
      return { success: false, coordinate: currentCoordinate, reason: 'OBSTACLE' };
    }

    return { success: true, coordinate: { x, y } };
  }
}
