import { Direction } from './Direction';
import { Position } from './Position';

export class South implements Direction {
  turnLeft(): Direction {
    return this;
  }
  turnRight(): Direction {
    return this;
  }
  forwardVector(): Position {
    return new Position(0, 0);
  }
}
