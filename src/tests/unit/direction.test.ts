import { describe, it, expect } from '@jest/globals';
import { Direction } from '../../core/direction';

// TODO List:
// - [x] Turning right from N yields E
// - [x] Turn right cycles through all four directions
// - [x] Turn left from N yields W
// - [x] Turn left cycles through all four directions
// - [ ] Direction provides movement delta

describe('The Direction', () => {
  it('faces east after turning right from north', () => {
    const direction = Direction.north();

    const turned = direction.turnRight();

    expect(turned.equals(Direction.east())).toBe(true);
  });

  it('cycles through all directions when turning right', () => {
    const east = Direction.east();
    const south = Direction.south();
    const west = Direction.west();

    expect(east.turnRight().equals(south)).toBe(true);
    expect(south.turnRight().equals(west)).toBe(true);
    expect(west.turnRight().equals(Direction.north())).toBe(true);
  });

  it('faces west after turning left from north', () => {
    const direction = Direction.north();

    const turned = direction.turnLeft();

    expect(turned.equals(Direction.west())).toBe(true);
  });

  it('cycles through all directions when turning left', () => {
    const west = Direction.west();
    const south = Direction.south();
    const east = Direction.east();

    expect(west.turnLeft().equals(south)).toBe(true);
    expect(south.turnLeft().equals(east)).toBe(true);
    expect(east.turnLeft().equals(Direction.north())).toBe(true);
  });

  it('provides movement delta for each cardinal direction', () => {
    expect(Direction.north().delta()).toEqual({ dx: 0, dy: 1 });
    expect(Direction.east().delta()).toEqual({ dx: 1, dy: 0 });
    expect(Direction.south().delta()).toEqual({ dx: 0, dy: -1 });
    expect(Direction.west().delta()).toEqual({ dx: -1, dy: 0 });
  });
});
