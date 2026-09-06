import { Coordinate } from './coordinate';
import { Direction } from './direction';
import { MarsMap } from './marsMap';

export class Rover {
  private currentCoordinate: Coordinate;
  private currentDirection: Direction;
  // @ts-expect-error map will be used when movement is implemented
  private readonly map: MarsMap;

  constructor(coordinate: Coordinate, direction: Direction, map: MarsMap) {
    this.currentCoordinate = coordinate;
    this.currentDirection = direction;
    this.map = map;
  }

  get coordinate(): Coordinate {
    return this.currentCoordinate;
  }

  get direction(): Direction {
    return this.currentDirection;
  }
}
