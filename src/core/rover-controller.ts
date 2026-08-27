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
      const nextPosition = this.executeCommand(movement)();
      this.position = this.surface.normalizedPosition(nextPosition);
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

  public displayPosition() {
    return this.position.display();
  }
}
