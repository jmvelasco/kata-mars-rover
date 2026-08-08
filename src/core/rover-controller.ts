type cardinalPoint = 'N' | 'S' | 'E' | 'W';
type commands = 'L' | 'R' | 'F' | 'B';
const maxX = 10;
const maxY = 10;

export class RoverController {
  constructor(
    private posX: number,
    private posY: number,
    private orientation: cardinalPoint
  ) {}

  static initialize(posX: number, posY: number, orientation: cardinalPoint) {
    return new RoverController(posX, posY, orientation);
  }

  public command(command: string) {
    const movements = command.split('') as commands[];
    for (const movement of movements) {
      if (this.isRotationCommand(movement)) {
        this.orientation = this.rotate(movement);
      }
      if (this.isOrientedToEast() || this.isOrientedToWest()) {
        this.posX = this.move(movement) ?? this.posX;
      }
      if (this.isOrientedToNorth() || this.isOrientedToSouth()) {
        this.posY = this.move(movement) ?? this.posY;
      }
    }
    return new RoverController(this.posX, this.posY, this.orientation);
  }

  private isRotationCommand(command: string) {
    return command === 'R' || command === 'L';
  }

  private rotate = (command: commands) => {
    const cardinalPoint: cardinalPoint[] = ['N', 'E', 'S', 'W'];
    const currentOrientationIdx = cardinalPoint.indexOf(this.orientation);
    if (command === 'L') {
      if (currentOrientationIdx === 0) return cardinalPoint[3];
      return cardinalPoint[currentOrientationIdx - 1];
    }
    if (command === 'R') {
      if (currentOrientationIdx === 3) return cardinalPoint[0];
      return cardinalPoint[currentOrientationIdx + 1];
    }
    return this.orientation;
  };

  private move(operation: commands) {
    if (this.moveForward(operation)) {
      if (this.isOrientedToEast()) {
        return this.isEastEdge() ? 0 : this.posX + 1;
      }
      if (this.isOrientedToWest()) {
        return this.isWestEdge() ? maxX - 1 : this.posX - 1;
      }
      if (this.isOrientedToNorth()) {
        return this.isNorthEdge() ? 0 : this.posY + 1;
      }
      if (this.isOrientedToSouth()) {
        return this.isSouthEdge() ? maxY - 1 : this.posY - 1;
      }
    }

    if (this.moveBackward(operation)) {
      if (this.isOrientedToEast()) {
        return this.isWestEdge() ? maxX - 1 : this.posX - 1;
      }
      if (this.isOrientedToWest()) {
        return this.isEastEdge() ? 0 : this.posX + 1;
      }
      if (this.isOrientedToNorth()) {
        return this.isSouthEdge() ? maxY - 1 : this.posY - 1;
      }
      if (this.isOrientedToSouth()) {
        return this.isNorthEdge() ? 0 : this.posY + 1;
      }
    }

    return undefined;
  }

  private moveForward(operation: commands) {
    return operation === 'F';
  }

  private moveBackward(operation: commands) {
    return operation === 'B';
  }

  private isNorthEdge = () => this.orientation === 'N' && this.posY === maxY;
  private isOrientedToNorth = () => this.orientation === 'N';
  private isSouthEdge = () => this.orientation === 'S' && this.posY === 0;
  private isOrientedToSouth = () => this.orientation === 'S';
  private isEastEdge = () => this.orientation === 'E' && this.posX === maxX;
  private isOrientedToEast = () => this.orientation === 'E';
  private isWestEdge = () => this.orientation === 'W' && this.posX === 0;
  private isOrientedToWest = () => this.orientation === 'W';

  public position() {
    return `${this.posX}:${this.posY}:${this.orientation}`;
  }
}
