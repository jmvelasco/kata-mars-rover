import { describe, expect, test } from '@jest/globals';
import { Orientation } from '../core/orientation';

describe('Orientation', () => {
  test('is correctly updated when rotate to the left', () => {
    expect(Orientation.create('N').rotateLeft().equals(Orientation.create('W'))).toBe(true);
    expect(Orientation.create('S').rotateLeft().equals(Orientation.create('E'))).toBe(true);
    expect(Orientation.create('E').rotateLeft().equals(Orientation.create('N'))).toBe(true);
    expect(Orientation.create('W').rotateLeft().equals(Orientation.create('S'))).toBe(true);
  });

  test('is correctly updated when rotate to the right', () => {
    expect(Orientation.create('N').rotateRight().equals(Orientation.create('E'))).toBe(true);
    expect(Orientation.create('S').rotateRight().equals(Orientation.create('W'))).toBe(true);
    expect(Orientation.create('E').rotateRight().equals(Orientation.create('S'))).toBe(true);
    expect(Orientation.create('W').rotateRight().equals(Orientation.create('N'))).toBe(true);
  });

  test('should get the displacement to the next position depending on the orientation', () => {
    expect(Orientation.create('N').getDisplacement()).toEqual({ x: 0, y: 1 });
    expect(Orientation.create('S').getDisplacement()).toEqual({ x: 0, y: -1 });
    expect(Orientation.create('E').getDisplacement()).toEqual({ x: 1, y: 0 });
    expect(Orientation.create('W').getDisplacement()).toEqual({ x: -1, y: 0 });
  });
});
