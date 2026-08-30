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
    let nextCoordinate =
      movementType === 'M' ? direction.moveForward(currentCoordinate) : direction.moveBackward(currentCoordinate);
    let { x, y } = nextCoordinate;

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
