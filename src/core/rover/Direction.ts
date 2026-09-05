import { Position } from './Position';

export interface Direction {
  turnLeft(): Direction;
  turnRight(): Direction;
  forwardVector(): Position;
}
