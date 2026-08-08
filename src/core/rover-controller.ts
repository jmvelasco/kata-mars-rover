import { Orientation } from './orientation';
import { Position, Surface } from './surface';

type commands = 'L' | 'R' | 'F' | 'B';

export class RoverController {
  constructor(
    private position: Position,
    private readonly surface: Surface
  ) {}

  static initialize(position: Position, surface: Surface) {
    return new RoverController(position, surface);
  }

  public command(command: string) {
    const movements = command.split('') as commands[];
    for (const movement of movements) {
      if (this.isRotationCommand(movement)) {
        const newOrientation = this.rotate(movement);
        this.position = Position.create(this.position.value().x, this.position.value().y, newOrientation);
      }
      if (
        this.position.value().orientation.equals(Orientation.East()) ||
        this.position.value().orientation.equals(Orientation.West())
      ) {
        const newPosX = this.move(movement) ?? this.position.value().x;
        this.position = Position.create(newPosX, this.position.value().y, this.position.value().orientation);
      }
      if (
        this.position.value().orientation.equals(Orientation.North()) ||
        this.position.value().orientation.equals(Orientation.South())
      ) {
        const newPosY = this.move(movement) ?? this.position.value().y;
        this.position = Position.create(this.position.value().x, newPosY, this.position.value().orientation);
      }
    }
    return new RoverController(this.position, this.surface);
  }

  private isRotationCommand(command: string) {
    return command === 'R' || command === 'L';
  }

  private rotate = (command: commands) => {
    return command === 'L'
      ? this.position.value().orientation.rotateLeft()
      : this.position.value().orientation.rotateRight();
  };

  private move(operation: commands) {
    if (this.moveForward(operation)) {
      if (this.position.value().orientation.equals(Orientation.East())) {
        return this.position.wrapSurface(this.surface) ? 0 : this.position.value().x + 1;
      }
      if (this.position.value().orientation.equals(Orientation.West())) {
        return this.position.wrapSurface(this.surface)
          ? this.surface.dimension().columns - 1
          : this.position.value().x - 1;
      }
      if (this.position.value().orientation.equals(Orientation.North())) {
        return this.position.wrapSurface(this.surface) ? 0 : this.position.value().y + 1;
      }
      if (this.position.value().orientation.equals(Orientation.South())) {
        return this.position.wrapSurface(this.surface)
          ? this.surface.dimension().rows - 1
          : this.position.value().y - 1;
      }
    }

    if (this.moveBackward(operation)) {
      if (this.position.value().orientation.equals(Orientation.East())) {
        return this.position.wrapSurface(this.surface)
          ? this.surface.dimension().columns - 1
          : this.position.value().x - 1;
      }
      if (this.position.value().orientation.equals(Orientation.West())) {
        return this.position.wrapSurface(this.surface) ? 0 : this.position.value().x + 1;
      }
      if (this.position.value().orientation.equals(Orientation.North())) {
        return this.position.wrapSurface(this.surface)
          ? this.surface.dimension().rows - 1
          : this.position.value().y - 1;
      }
      if (this.position.value().orientation.equals(Orientation.South())) {
        return this.position.wrapSurface(this.surface) ? 0 : this.position.value().y + 1;
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

  public displayPosition() {
    return `${this.position.value().x}:${this.position.value().y}:${this.position.value().orientation.value()}`;
  }
}
