export interface Direction {
  turnLeft(): Direction;
  turnRight(): Direction;
}

export class West implements Direction {
  turnLeft(): Direction {
    return null as unknown as Direction;
  }
  turnRight(): Direction {
    return null as unknown as Direction;
  }
}

export class East implements Direction {
  turnLeft(): Direction {
    return null as unknown as Direction;
  }
  turnRight(): Direction {
    return null as unknown as Direction;
  }
}

export class South implements Direction {
  turnLeft(): Direction {
    return null as unknown as Direction;
  }
  turnRight(): Direction {
    return null as unknown as Direction;
  }
}

export class North implements Direction {
  turnLeft(): Direction {
    return new West();
  }
  turnRight(): Direction {
    return new East();
  }
}
