import { Coordinates } from './Coordinates';
import { Position } from './Position';

export class MissionReport {
  constructor(
    public readonly position: Position,
    public readonly obstacle?: Coordinates
  ) {}
}
