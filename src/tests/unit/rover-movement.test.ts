import { describe, it, expect } from '@jest/globals';
import { Rover } from '../../core/rover';
import { Coordinate } from '../../core/coordinate';
import { Direction } from '../../core/direction';
import { MarsMap } from '../../core/marsMap';

// TODO List:
// - [ ] Rover created at position with direction
// - [ ] Rover turns right
// - [ ] Rover turns left
// - [ ] Rover moves forward facing N
// - [ ] Rover moves forward facing E
// - [ ] Rover moves forward facing S and W
// - [ ] Rover moves backward
// - [ ] Rover executes command sequence
// - [ ] Rover maintains state across executions

describe('The Rover', () => {
  const defaultMap = new MarsMap(10, 10);

  it('exposes its initial position and direction', () => {
    const rover = new Rover(Coordinate.of(0, 0), Direction.north(), defaultMap);

    expect(rover.coordinate.equals(Coordinate.of(0, 0))).toBe(true);
    expect(rover.direction.equals(Direction.north())).toBe(true);
  });
});
