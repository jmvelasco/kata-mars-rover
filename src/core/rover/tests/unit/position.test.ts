import { Position } from '../../Position';

describe('The Position', () => {
  it('considers two positions with same coordinates as equal', () => {
    const position1 = new Position(1, 2);
    const position2 = new Position(1, 2);

    expect(position1.equals(position2)).toBe(true);
  });

  it('considers two positions with different coordinates as not equal', () => {
    const position1 = new Position(1, 2);
    const position2 = new Position(2, 3);

    expect(position1.equals(position2)).toBe(false);
  });
});
