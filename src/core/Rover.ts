import { Position } from './Position';

export class Rover {
  constructor(public readonly landingPosition: Position) {}

  position(): Position | null {
    return null;
  }
}
