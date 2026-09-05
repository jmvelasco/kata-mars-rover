import { Direction } from './Direction';
import { Position } from './Position';
import { West } from './West';
import { East } from './East';

export class North implements Direction {
  turnLeft(): Direction {
    return new West();
  }

  turnRight(): Direction {
    return new East();
  }

  forwardVector(): Position {
    return new Position(0, 1);
  }
}
