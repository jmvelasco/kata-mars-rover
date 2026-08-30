import { Coordinate } from './Coordinate';

export interface Direction {
  readonly value: string;
  turnLeft(): Direction;
  turnRight(): Direction;
  moveForward(current: Coordinate): Coordinate;
  moveBackward(current: Coordinate): Coordinate;
}

export class West implements Direction {
  public readonly value = 'W';
  turnLeft(): Direction {
    return new South();
  }
  turnRight(): Direction {
    return new North();
  }
  moveForward(current: Coordinate): Coordinate {
    return { x: current.x - 1, y: current.y };
  }
  moveBackward(current: Coordinate): Coordinate {
    return { x: current.x + 1, y: current.y };
  }
}

export class East implements Direction {
  public readonly value = 'E';
  turnLeft(): Direction {
    return new North();
  }
  turnRight(): Direction {
    return new South();
  }
  moveForward(current: Coordinate): Coordinate {
    return { x: current.x + 1, y: current.y };
  }
  moveBackward(current: Coordinate): Coordinate {
    return { x: current.x - 1, y: current.y };
  }
}

export class South implements Direction {
  public readonly value = 'S';
  turnLeft(): Direction {
    return new East();
  }
  turnRight(): Direction {
    return new West();
  }
  moveForward(current: Coordinate): Coordinate {
    return { x: current.x, y: current.y - 1 };
  }
  moveBackward(current: Coordinate): Coordinate {
    return { x: current.x, y: current.y + 1 };
  }
}

export class North implements Direction {
  public readonly value = 'N';
  turnLeft(): Direction {
    return new West();
  }
  turnRight(): Direction {
    return new East();
  }
  moveForward(current: Coordinate): Coordinate {
    return { x: current.x, y: current.y + 1 };
  }
  moveBackward(current: Coordinate): Coordinate {
    return { x: current.x, y: current.y - 1 };
  }
}

const directionMap: Record<string, () => Direction> = {
  N: () => new North(),
  S: () => new South(),
  E: () => new East(),
  W: () => new West(),
};

export const createDirection = (value: string): Direction => {
  const creator = directionMap[value];
  if (!creator) throw new Error(`Invalid direction: ${value}`);
  return creator();
};
