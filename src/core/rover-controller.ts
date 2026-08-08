import { Orientation } from './orientation';

type commands = 'L' | 'R' | 'F' | 'B';
const maxX = 10;
const maxY = 10;

export class RoverController {
  constructor(
    private posX: number,
    private posY: number,
    private orientation: Orientation
  ) {}

  static initialize(posX: number, posY: number, orientation: Orientation) {
    return new RoverController(posX, posY, orientation);
  }

  public command(command: string) {
    const movements = command.split('') as commands[];
    for (const movement of movements) {
      if (this.isRotationCommand(movement)) {
        this.orientation = this.rotate(movement);
      }
      if (this.orientation.equals(Orientation.East()) || this.orientation.equals(Orientation.West())) {
        this.posX = this.move(movement) ?? this.posX;
      }
      if (this.orientation.equals(Orientation.North()) || this.orientation.equals(Orientation.South())) {
        this.posY = this.move(movement) ?? this.posY;
      }
    }
    return new RoverController(this.posX, this.posY, this.orientation);
  }

  private isRotationCommand(command: string) {
    return command === 'R' || command === 'L';
  }

  private rotate = (command: commands) => {
    return command === 'L' ? this.orientation.rotateLeft() : this.orientation.rotateRight();
  };

  private move(operation: commands) {
    if (this.moveForward(operation)) {
      if (this.orientation.equals(Orientation.East())) {
        return this.isEastEdge() ? 0 : this.posX + 1;
      }
      if (this.orientation.equals(Orientation.West())) {
        return this.isWestEdge() ? maxX - 1 : this.posX - 1;
      }
      if (this.orientation.equals(Orientation.North())) {
        return this.isNorthEdge() ? 0 : this.posY + 1;
      }
      if (this.orientation.equals(Orientation.South())) {
        return this.isSouthEdge() ? maxY - 1 : this.posY - 1;
      }
    }

    if (this.moveBackward(operation)) {
      if (this.orientation.equals(Orientation.East())) {
        return this.isWestEdge() ? maxX - 1 : this.posX - 1;
      }
      if (this.orientation.equals(Orientation.West())) {
        return this.isEastEdge() ? 0 : this.posX + 1;
      }
      if (this.orientation.equals(Orientation.North())) {
        return this.isSouthEdge() ? maxY - 1 : this.posY - 1;
      }
      if (this.orientation.equals(Orientation.South())) {
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

  private isNorthEdge = () => this.orientation.equals(Orientation.North()) && this.posY === maxY;
  private isSouthEdge = () => this.orientation.equals(Orientation.South()) && this.posY === 0;
  private isEastEdge = () => this.orientation.equals(Orientation.East()) && this.posX === maxX;
  private isWestEdge = () => this.orientation.equals(Orientation.West()) && this.posX === 0;

  public position() {
    return `${this.posX}:${this.posY}:${this.orientation.value()}`;
  }
}
