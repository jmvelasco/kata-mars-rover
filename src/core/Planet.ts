import { Coordinates } from './Coordinates';

export class Planet {
  constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  resolve(coordinates: Coordinates): Coordinates {
    return coordinates.movedBy(1, 1);
  }
}
