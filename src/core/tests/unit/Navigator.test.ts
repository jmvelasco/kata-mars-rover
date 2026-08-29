import { describe, it, expect } from 'bun:test';
import { Navigator } from '../../domain/Navigator';
import { Planet } from '../../domain/Planet';

describe('The Navigator', () => {
  it('calculates the next position forward facing North', () => {
    const planet = new Planet(10, 10, []);
    const navigator = new Navigator(planet);

    const result = navigator.calculateNextPosition({ x: 0, y: 0 }, 'N', 'M');

    expect(result).toEqual({ success: true, coordinate: { x: 0, y: 1 } });
  });

  it('calculates the next position backward facing North', () => {
    const planet = new Planet(10, 10, []);
    const navigator = new Navigator(planet);

    const result = navigator.calculateNextPosition({ x: 0, y: 1 }, 'N', 'B');

    expect(result).toEqual({ success: true, coordinate: { x: 0, y: 0 } });
  });

  it('calculates the next position forward facing East', () => {
    const planet = new Planet(10, 10, []);
    const navigator = new Navigator(planet);

    const result = navigator.calculateNextPosition({ x: 0, y: 0 }, 'E', 'M');

    expect(result).toEqual({ success: true, coordinate: { x: 1, y: 0 } });
  });

  it('wraps around the North edge (Y > max) to Y = 0', () => {
    const planet = new Planet(10, 10, []);
    const navigator = new Navigator(planet);

    const result = navigator.calculateNextPosition({ x: 0, y: 9 }, 'N', 'M');

    expect(result).toEqual({ success: true, coordinate: { x: 0, y: 0 } });
  });

  it('wraps around the South edge (Y < 0) to Y = max (9)', () => {
    const planet = new Planet(10, 10, []);
    const navigator = new Navigator(planet);

    const result = navigator.calculateNextPosition({ x: 0, y: 0 }, 'S', 'M');

    expect(result).toEqual({ success: true, coordinate: { x: 0, y: 9 } });
  });

  it('wraps around the East edge (X > max) to X = 0', () => {
    const planet = new Planet(10, 10, []);
    const navigator = new Navigator(planet);

    const result = navigator.calculateNextPosition({ x: 9, y: 0 }, 'E', 'M');

    expect(result).toEqual({ success: true, coordinate: { x: 0, y: 0 } });
  });

  it('wraps around the West edge (X < 0) to X = max (9)', () => {
    const planet = new Planet(10, 10, []);
    const navigator = new Navigator(planet);

    const result = navigator.calculateNextPosition({ x: 0, y: 0 }, 'W', 'M');

    expect(result).toEqual({ success: true, coordinate: { x: 9, y: 0 } });
  });
});
