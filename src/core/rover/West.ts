import { Direction } from './Direction';
import { Position } from './Position';
import { South } from './South';
import { North } from './North';

export class West implements Direction {
  turnLeft(): Direction {
    return new South();
  }
  turnRight(): Direction {
    return new North();
  }
  forwardVector(): Position {
    return new Position(-1, 0);
  }
}
