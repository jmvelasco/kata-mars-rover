import { Direction } from './Direction';
import { Position } from './Position';
import { East } from './East';
import { West } from './West';

export class South implements Direction {
  turnLeft(): Direction {
    return new East();
  }
  turnRight(): Direction {
    return new West();
  }
  forwardVector(): Position {
    return new Position(0, -1);
  }
}
