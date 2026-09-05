import { Direction } from './Direction';
import { Position } from './Position';
import { North } from './North';
import { South } from './South';

export class East implements Direction {
  turnLeft(): Direction {
    return new North();
  }
  turnRight(): Direction {
    return new South();
  }
  forwardVector(): Position {
    return new Position(1, 0);
  }
}
