import { Direction } from './Direction';
import { Position } from './Position';

export class North implements Direction {
  turnLeft(): Direction {
    return new North();
  }

  turnRight(): Direction {
    return new North();
  }

  forwardVector(): Position {
    return new Position(0, 0);
  }
}
