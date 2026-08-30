export interface Direction {
  turnLeft(): Direction;
  turnRight(): Direction;
}

export class West implements Direction {
  turnLeft(): Direction {
    return this;
  }
  turnRight(): Direction {
    return this;
  }
}

export class East implements Direction {
  turnLeft(): Direction {
    return this;
  }
  turnRight(): Direction {
    return this;
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
