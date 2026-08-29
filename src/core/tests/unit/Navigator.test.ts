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
});
