import { Planet } from './Planet';

export type Coordinate = { x: number; y: number };

export type NavigationResult =
  | { success: true; coordinate: Coordinate }
  | { success: false; reason: 'OBSTACLE'; obstacleCoordinate: Coordinate };

export class Navigator {
  constructor(private readonly planet: Planet) {}

  calculateNextPosition(currentCoordinate: Coordinate, direction: string, movementType: string): NavigationResult {
    let { x, y } = currentCoordinate;
    const step = movementType === 'M' ? 1 : -1;

    if (direction === 'N') y += step;
    else if (direction === 'S') y -= step;
    else if (direction === 'E') x += step;
    else if (direction === 'W') x -= step;

    return { success: true, coordinate: { x, y } };
  }
}
