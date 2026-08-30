export interface Direction {
  turnLeft(): Direction;
}

export class West implements Direction {
  turnLeft(): Direction {
    return this;
  }
}

export class North implements Direction {
  turnLeft(): Direction {
    return null as unknown as Direction;
  }
}
