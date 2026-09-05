import { Coordinates } from './Coordinates';

export class Planet {
  constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  resolve(coordinates: Coordinates): Coordinates {
    return new Coordinates(coordinates.x % this.width, coordinates.y % this.height);
  }
}
