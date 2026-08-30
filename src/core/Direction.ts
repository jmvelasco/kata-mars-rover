export interface Direction {
  readonly value: string;
  turnLeft(): Direction;
  turnRight(): Direction;
}

export class West implements Direction {
  public readonly value = 'W';
  turnLeft(): Direction {
    return new South();
  }
  turnRight(): Direction {
    return new North();
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
}

export class South implements Direction {
  public readonly value = 'S';
  turnLeft(): Direction {
    return new East();
  }
  turnRight(): Direction {
    return new West();
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
}
