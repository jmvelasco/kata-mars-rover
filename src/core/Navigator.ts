import { Planet } from './Planet';
import { Coordinate } from './Coordinate';
import { Direction } from './Direction';

export type NavigationResult = {
  success: boolean;
  coordinate: Coordinate;
  reason?: 'OBSTACLE';
};

export class Navigator {
  constructor(private readonly planet: Planet) {}

  calculateNextPosition(currentCoordinate: Coordinate, direction: Direction, movementType: string): NavigationResult {
    const theoreticalCoordinate =
      movementType === 'M' ? direction.moveForward(currentCoordinate) : direction.moveBackward(currentCoordinate);
    const { x, y } = this.planet.wrap(theoreticalCoordinate);

    if (this.planet.hasObstacleAt({ x, y })) {
      return { success: false, coordinate: currentCoordinate, reason: 'OBSTACLE' };
    }

    return { success: true, coordinate: { x, y } };
  }
}
