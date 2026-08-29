import { Planet } from './Planet';

export type Coordinate = { x: number; y: number };

export type NavigationResult =
  | { success: true; coordinate: Coordinate }
  | { success: false; reason: 'OBSTACLE'; obstacleCoordinate: Coordinate };

export class Navigator {
  constructor(private readonly planet: Planet) {}

  calculateNextPosition(currentCoordinate: Coordinate, direction: string, movementType: string): NavigationResult {
    return { success: true, coordinate: { x: 0, y: 1 } };
  }
}
