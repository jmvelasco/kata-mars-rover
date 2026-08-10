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
});
