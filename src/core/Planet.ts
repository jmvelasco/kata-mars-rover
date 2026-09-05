import { Coordinates } from './Coordinates';

const wrapped = (value: number, length: number): number => ((value % length) + length) % length;

export class Planet {
  constructor(
    public readonly width: number,
    public readonly height: number
  ) {}

  resolve(coordinates: Coordinates): Coordinates {
    return new Coordinates(wrapped(coordinates.x, this.width), wrapped(coordinates.y, this.height));
  }
}
