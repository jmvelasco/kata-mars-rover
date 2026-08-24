import { Surface } from './surface';
import { Position } from './position';

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
      this.updatePosition(this.executeCommand(movement)());
    }
  }

  private executeCommand(movement: commands) {
    return {
      L: () => this.position.rotateLeft(),
      R: () => this.position.rotateRight(),
      F: () => this.position.moveForward(),
      B: () => this.position.moveBackward(),
    }[movement];
  }

  updatePosition(position: Position) {
    const { x, y, orientation } = position.value();
    const { E, W, S, N } = this.surface.shouldWrapTheSurface({ x, y });
    if (E) {
      this.position = new Position(0, y, orientation);
    } else if (W) {
      this.position = new Position(this.surface.dimension().columns - 1, y, orientation);
    } else if (N) {
      this.position = new Position(x, 0, orientation);
    } else if (S) {
      this.position = new Position(x, this.surface.dimension().rows - 1, orientation);
    } else {
      this.position = position;
    }
  }

  public displayPosition() {
    return this.position.display();
  }
}
