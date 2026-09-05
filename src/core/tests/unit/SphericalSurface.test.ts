import { describe, it, expect } from '@jest/globals';
import { Coordinates } from '../../Coordinates';
import { Planet } from '../../Planet';

describe('The Planet', () => {
  it('leaves a coordinate inside the grid as it is', () => {
    const planet = new Planet(5, 3);

    const resolved = planet.resolve(new Coordinates(4, 2));

    expect(resolved).toEqual(new Coordinates(4, 2));
  });
});
