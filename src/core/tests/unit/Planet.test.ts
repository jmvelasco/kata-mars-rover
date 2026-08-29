import { Planet } from '../../domain/Planet';

describe('The Planet', () => {
  it('detects an obstacle at a given coordinate', () => {
    const planet = new Planet(10, 10, [{ x: 2, y: 2 }]);
    expect(planet.hasObstacleAt({ x: 2, y: 2 })).toBe(true);
    expect(planet.hasObstacleAt({ x: 3, y: 3 })).toBe(false);
  });
});
