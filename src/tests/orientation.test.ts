import { Orientation } from '../core/orientation';

describe('Orientation', () => {
  test('rotate correctly when is initialised to the north', () => {
    const northOrientation = Orientation.North();
    expect(northOrientation.rotateLeft().equals(Orientation.West())).toBe(true);
    expect(northOrientation.rotateRight().equals(Orientation.East())).toBe(true);
  });

  test('rotate correctly when is initialised to the south', () => {
    const southOrientation = Orientation.South();
    expect(southOrientation.rotateLeft().equals(Orientation.East())).toBe(true);
    expect(southOrientation.rotateRight().equals(Orientation.West())).toBe(true);
  });

  test('rotate correctly when is initialised to the east', () => {
    const eastOrientation = Orientation.East();
    expect(eastOrientation.rotateLeft().equals(Orientation.North())).toBe(true);
    expect(eastOrientation.rotateRight().equals(Orientation.South())).toBe(true);
  });

  test('rotate correctly when is initialised to the west', () => {
    const westOrientation = Orientation.West();
    expect(westOrientation.rotateLeft().equals(Orientation.South())).toBe(true);
    expect(westOrientation.rotateRight().equals(Orientation.North())).toBe(true);
  });
});
