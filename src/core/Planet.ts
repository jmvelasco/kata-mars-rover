import { Coordinates } from './Coordinates';

export class Planet {
  constructor(
    private readonly width: number,
    private readonly height: number
  ) {}

  resolve(coordinates: Coordinates): Coordinates {
    return coordinates.wrappedWithin(this.width, this.height);
  }
}
