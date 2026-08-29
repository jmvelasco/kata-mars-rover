import { Planet } from './Planet';

export type Coordinate = { x: number; y: number };

export type NavigationResult =
  | { success: true; coordinate: Coordinate }
  | { success: false; reason: 'OBSTACLE'; obstacleCoordinate: Coordinate };

export class Navigator {
  constructor(private readonly planet: Planet) {}

  calculateNextPosition(currentCoordinate: Coordinate, direction: string, movementType: string): NavigationResult {
    let y = currentCoordinate.y;
    if (movementType === 'M') {
      y += 1;
    } else if (movementType === 'B') {
      y -= 1;
    }
    return { success: true, coordinate: { x: currentCoordinate.x, y } };
  }
}
