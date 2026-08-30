import { Planet } from '../core/Planet';

describe('The Planet', () => {
  it('detects an obstacle at a given coordinate', () => {
    const planet = new Planet(10, 10, [{ x: 2, y: 2 }]);
    expect(planet.hasObstacleAt({ x: 2, y: 2 })).toBe(true);
    expect(planet.hasObstacleAt({ x: 3, y: 3 })).toBe(false);
  });

  it('wraps around the North edge (Y > max) to Y = 0', () => {
    const planet = new Planet(10, 10, []);
    expect(planet.wrap({ x: 0, y: 10 })).toEqual({ x: 0, y: 0 });
  });

  it('wraps around the South edge (Y < 0) to Y = max', () => {
    const planet = new Planet(10, 10, []);
    expect(planet.wrap({ x: 0, y: -1 })).toEqual({ x: 0, y: 9 });
  });

  it('wraps around the East edge (X > max) to X = 0', () => {
    const planet = new Planet(10, 10, []);
    expect(planet.wrap({ x: 10, y: 0 })).toEqual({ x: 0, y: 0 });
  });

  it('wraps around the West edge (X < 0) to X = max', () => {
    const planet = new Planet(10, 10, []);
    expect(planet.wrap({ x: -1, y: 0 })).toEqual({ x: 9, y: 0 });
  });
});
